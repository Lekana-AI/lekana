/**
 * Gemini Service for DB Export
 * Handles intelligent field-to-column mapping using LLM
 */
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

/**
 * Map incoming field names to existing database columns using Gemini
 * @param {string[]} incomingFields - Field names from OCR result
 * @param {string[]} existingColumns - Column names already in the database table
 * @returns {Promise<{mapping: Record<string, string|null>, tokensUsed: object}>}
 */
async function mapFieldsToColumns(incomingFields, existingColumns) {
  // Filter out internal columns (starting with _)
  const userColumns = existingColumns.filter((col) => !col.startsWith("_"));

  // If no existing columns, no mapping needed
  if (userColumns.length === 0) {
    console.log("[Gemini] No existing columns to map to, skipping");
    return {
      mapping: {},
      tokensUsed: null,
      skipped: true,
    };
  }

  // If incoming fields match existing columns exactly, no Gemini call needed
  const allMatch = incomingFields.every((field) =>
    userColumns.includes(field.toLowerCase()),
  );
  if (allMatch) {
    console.log(
      "[Gemini] All fields match existing columns, skipping LLM call",
    );
    const directMapping = {};
    incomingFields.forEach((f) => {
      directMapping[f] = f.toLowerCase();
    });
    return {
      mapping: directMapping,
      tokensUsed: null,
      skipped: true,
    };
  }

  const prompt = `You are a database schema expert. Map incoming field names to existing database columns.

EXISTING DATABASE COLUMNS:
${userColumns.map((c) => `- ${c}`).join("\n")}

INCOMING FIELD NAMES:
${incomingFields.map((f) => `- ${f}`).join("\n")}

RULES:
1. Match fields to columns based on semantic meaning (e.g., "inv_no" → "invoice_number")
2. If a field has no matching column, set its value to null
3. Each incoming field must map to at most ONE existing column
4. Be case-insensitive when matching
5. Return ONLY valid JSON

OUTPUT FORMAT:
{
  "mapping": {
    "incoming_field_1": "existing_column_or_null",
    "incoming_field_2": "existing_column_or_null"
  },
  "explanation": ["brief reason for each mapping"]
}`;

  console.log("[Gemini] Mapping fields to columns...");
  console.log(`  - Incoming: ${incomingFields.join(", ")}`);
  console.log(`  - Existing: ${userColumns.join(", ")}`);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract token usage
    const usageMetadata = response.usageMetadata;
    const tokensUsed = usageMetadata
      ? {
          promptTokens: usageMetadata.promptTokenCount || 0,
          completionTokens: usageMetadata.candidatesTokenCount || 0,
          totalTokens: usageMetadata.totalTokenCount || 0,
        }
      : null;

    if (tokensUsed) {
      console.log(
        `[Gemini] Token usage: ${tokensUsed.promptTokens} prompt + ${tokensUsed.completionTokens} completion = ${tokensUsed.totalTokens} total`,
      );
    }

    // Parse response
    const parsed = cleanAndParseJson(text);
    const mapping = parsed.mapping || {};

    console.log("[Gemini] Field mapping result:");
    for (const [field, column] of Object.entries(mapping)) {
      console.log(`  - ${field} → ${column || "(unmapped)"}`);
    }

    return {
      mapping,
      explanation: parsed.explanation || [],
      tokensUsed,
    };
  } catch (error) {
    console.error("[Gemini] Error mapping fields:", error.message);
    // On error, return empty mapping (will use original field names)
    return {
      mapping: {},
      tokensUsed: null,
      error: error.message,
    };
  }
}

/**
 * Apply field mapping to records
 * @param {Record<string, any>[]} records - Records to transform
 * @param {Record<string, string|null>} mapping - Field to column mapping
 * @returns {Record<string, any>[]} Transformed records
 */
function applyFieldMapping(records, mapping) {
  if (!mapping || Object.keys(mapping).length === 0) {
    return records;
  }

  return records.map((record) => {
    const mappedRecord = {};
    const extraData = {};

    for (const [field, value] of Object.entries(record)) {
      // Skip internal fields
      if (field.startsWith("_")) {
        mappedRecord[field] = value;
        continue;
      }

      const mappedColumn = mapping[field];

      if (mappedColumn) {
        // Field has a mapping - use the mapped column name
        mappedRecord[mappedColumn] = value;
      } else if (mappedColumn === null) {
        // Explicitly unmapped - store in extra data
        extraData[field] = value;
      } else {
        // No mapping exists for this field - keep original name
        mappedRecord[field] = value;
      }
    }

    // Store unmapped fields in _extra_data
    if (Object.keys(extraData).length > 0) {
      mappedRecord._extra_data = {
        ...(mappedRecord._extra_data || {}),
        ...extraData,
      };
    }

    return mappedRecord;
  });
}

/**
 * Clean and parse JSON from Gemini response
 * @param {string} text - Raw Gemini response
 * @returns {Object} Parsed JSON
 */
function cleanAndParseJson(text) {
  // Remove markdown code fences
  let cleaned = text
    .replace(/```json\n?/gi, "")
    .replace(/```\n?/gi, "")
    .trim();

  // Try to find JSON object
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("[Gemini] Failed to parse JSON:", error.message);
    return { mapping: {} };
  }
}

module.exports = {
  mapFieldsToColumns,
  applyFieldMapping,
};
