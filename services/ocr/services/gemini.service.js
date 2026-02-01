/**
 * Gemini Service
 * Handles LLM-based refinement of Document AI output
 * Uses Gemini 1.5 Flash for semantic correction and validation
 */
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-preview-09-2025",
});

// ============================================
// Prompt Templates
// ============================================

/**
 * Prompt for key-value pair extraction
 * Extracts ALL key-value pairs found in the document
 */
const KEY_VALUE_PROMPT = `You are a document analysis AI specialized in key-value pair extraction.
Extract ALL key-value pairs found in this document.

RULES:
1. Look for labeled fields (e.g., "Name:", "Date:", "Total:")
2. Extract table headers and their corresponding values
3. Include form field labels and their filled values
4. Format dates consistently as YYYY-MM-DD
5. Format numbers without currency symbols
6. Return ONLY valid JSON

OUTPUT FORMAT:
{
  "pairs": [
    {"key": "Invoice Number", "value": "INV-2024-001", "confidence": 0.98},
    {"key": "Date", "value": "2024-01-15", "confidence": 0.95}
  ],
  "documentType": "invoice|receipt|form|idCard|letter|other"
}`;

/**
 * Prompt for specific field extraction with OCR text context
 * @param {string} ocrText - OCR text from Document AI
 * @param {string[]} fields - Specific fields to extract
 * @param {Object} fieldPrompts - Custom validation rules per field
 */
function buildFieldExtractPrompt(ocrText, fields, fieldPrompts = {}) {
  let prompt = `You are a document analysis AI. Use both the provided OCR text AND the document image for maximum accuracy.

OCR TEXT (extracted via Document AI - this is highly accurate):
---
${ocrText}
---

FIELDS TO EXTRACT: ${fields.join(", ")}
`;

  // Add custom field validation rules if provided
  if (fieldPrompts && Object.keys(fieldPrompts).length > 0) {
    prompt += `
FIELD-SPECIFIC VALIDATION RULES:`;
    for (const [field, rule] of Object.entries(fieldPrompts)) {
      prompt += `
- ${field}: ${rule}`;
    }
  }

  prompt += `

INSTRUCTIONS:
1. Use the OCR text as a reliable source for exact values
2. Use the document image to understand context, layout, and relationships
3. Cross-reference both sources for best accuracy
4. Format dates as YYYY-MM-DD
5. Format numbers without currency symbols or commas
6. Return ONLY valid JSON

OUTPUT FORMAT:
{
  "documentType": "invoice|receipt|idCard|letter|form|other",
  "fields": {
    "fieldName": {
      "value": "extracted value",
      "confidence": 0.95,
      "corrected": false,
      "originalValue": "value from OCR"
    }
  },
  "corrections": ["list of any corrections made"]
}`;

  return prompt;
}

/**
 * Prompt for general text cleanup (no specific fields)
 * @param {string} ocrText - OCR text from Document AI
 */
function buildTextCleanupPrompt(ocrText) {
  return `You are a document analysis AI. Clean up and structure the OCR output.

OCR TEXT (extracted via Document AI):
---
${ocrText}
---

INSTRUCTIONS:
1. Fix any obvious OCR errors
2. Structure the content into logical sections
3. Preserve the original formatting where meaningful
4. Return ONLY valid JSON

OUTPUT FORMAT:
{
  "documentType": "invoice|receipt|idCard|letter|form|other",
  "text": "cleaned and corrected full text",
  "sections": [
    {
      "heading": "section heading if any",
      "content": "section content"
    }
  ],
  "corrections": ["list of corrections made"]
}`;
}

// ============================================
// Main Functions
// ============================================

/**
 * Refine extraction results using Gemini
 * @param {Object} options - Refinement options
 * @param {Buffer} options.fileBuffer - Original document buffer
 * @param {string} options.mimeType - Document MIME type
 * @param {Object} options.previousOcrData - Document AI output
 * @param {string} options.outputMode - Output mode: "key-value", "field-extract", or "auto"
 * @param {string[]} options.targetFields - Fields to extract (for field-extract mode)
 * @param {Object} options.customPrompts - Field-specific validation rules
 * @returns {Object} Refined extraction result
 */
async function refineExtraction({
  fileBuffer,
  mimeType,
  previousOcrData,
  outputMode = "auto",
  targetFields,
  customPrompts,
}) {
  // Convert file to inline data for Gemini
  const filePart = {
    inlineData: {
      data: fileBuffer.toString("base64"),
      mimeType,
    },
  };

  // Get the raw text from Document AI
  const ocrText = previousOcrData.text || "";

  // Determine the prompt based on outputMode
  let promptText;

  if (outputMode === "key-value") {
    // Mode 1: Extract all key-value pairs
    promptText = KEY_VALUE_PROMPT;
    console.log("[Gemini] Using key-value extraction mode");
  } else if (
    outputMode === "field-extract" ||
    (targetFields && targetFields.length > 0)
  ) {
    // Mode 2: Extract specific fields
    promptText = buildFieldExtractPrompt(
      ocrText,
      targetFields || [],
      customPrompts
    );
    console.log(
      `[Gemini] Using field extraction mode for: ${(targetFields || []).join(
        ", "
      )}`
    );
  } else {
    // Mode 3: General text cleanup (auto/default)
    promptText = buildTextCleanupPrompt(ocrText);
    console.log("[Gemini] Using text cleanup mode");
  }

  console.log("[Gemini] Sending document for refinement...");

  try {
    const result = await model.generateContent([promptText, filePart]);
    const response = await result.response;
    const text = response.text();

    // Extract token usage from response
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
        `[Gemini] Token usage: ${tokensUsed.promptTokens} prompt + ${tokensUsed.completionTokens} completion = ${tokensUsed.totalTokens} total`
      );
    }

    // Parse and clean the response
    const parsed = cleanAndParseJson(text);
    return {
      ...parsed,
      outputMode:
        outputMode === "auto"
          ? targetFields?.length
            ? "field-extract"
            : "text-cleanup"
          : outputMode,
      tokensUsed,
    };
  } catch (error) {
    console.error("[Gemini] Error during refinement:", error.message);

    // Return the original data if Gemini fails
    return {
      ...previousOcrData,
      geminiError: error.message,
      refinementSkipped: true,
      tokensUsed: null,
    };
  }
}

/**
 * Fetch file from URL and return as buffer
 * @param {string} url - File URL
 * @returns {Buffer} File buffer
 */
async function fetchFileBuffer(url) {
  console.log(`[Gemini] Fetching file from ${url}...`);
  const response = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: 30000,
  });
  return Buffer.from(response.data);
}

/**
 * Clean and parse JSON from Gemini response
 * Handles markdown code fences and common formatting issues
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
    console.error("[Gemini] Failed to parse JSON response:", error.message);
    return {
      rawText: text,
      parseError: error.message,
    };
  }
}

module.exports = {
  refineExtraction,
  fetchFileBuffer,
};
