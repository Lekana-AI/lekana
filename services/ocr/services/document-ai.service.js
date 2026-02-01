/**
 * Document AI Service
 * Handles Google Document AI processing for OCR and Form Parsing
 */
const { DocumentProcessorServiceClient } =
  require("@google-cloud/documentai").v1;

// Configuration
const PROJECT_ID = process.env.DOCUMENT_AI_PROJECT_ID;
const LOCATION = process.env.DOCUMENT_AI_LOCATION || "us";
const FORM_PARSER_ID = process.env.DOCUMENT_AI_FORM_PARSER_ID;
const OCR_PROCESSOR_ID = process.env.DOCUMENT_AI_OCR_PROCESSOR_ID;

// Parse credentials from environment variable
let clientOptions = {};
if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    clientOptions = { credentials };
    console.log(
      "[DocumentAI] Using credentials from GOOGLE_SERVICE_ACCOUNT_JSON"
    );
  } catch (error) {
    console.error(
      "[DocumentAI] Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:",
      error.message
    );
    throw new Error(
      "Invalid GOOGLE_SERVICE_ACCOUNT_JSON format. Must be valid JSON."
    );
  }
} else {
  console.log(
    "[DocumentAI] GOOGLE_SERVICE_ACCOUNT_JSON not set, using default credentials"
  );
}

// Initialize Document AI client
const client = new DocumentProcessorServiceClient(clientOptions);

/**
 * Process document with Form Parser
 * Used when extractFields is provided - extracts key-value pairs
 * @param {Buffer} fileBuffer - Document file buffer
 * @param {string} mimeType - MIME type of the document
 * @returns {Object} Extracted form data with entities
 */
async function processForm(fileBuffer, mimeType) {
  if (!FORM_PARSER_ID) {
    throw new Error("DOCUMENT_AI_FORM_PARSER_ID is not configured");
  }

  const name = `projects/${PROJECT_ID}/locations/${LOCATION}/processors/${FORM_PARSER_ID}`;

  const request = {
    name,
    rawDocument: {
      content: fileBuffer.toString("base64"),
      mimeType,
    },
  };

  console.log("[DocumentAI] Processing with Form Parser...");
  const [result] = await client.processDocument(request);
  const { document } = result;

  // Extract entities (key-value pairs)
  const entities = {};
  if (document.entities) {
    for (const entity of document.entities) {
      const key = entity.type || "unknown";
      const value = entity.mentionText || entity.normalizedValue?.text || "";
      const confidence = entity.confidence || 0;

      entities[key] = {
        value,
        confidence,
      };
    }
  }

  // Extract form fields
  const formFields = [];
  if (document.pages) {
    for (const page of document.pages) {
      if (page.formFields) {
        for (const field of page.formFields) {
          formFields.push({
            fieldName:
              field.fieldName?.textAnchor?.content ||
              extractTextFromLayout(field.fieldName, document.text),
            fieldValue:
              field.fieldValue?.textAnchor?.content ||
              extractTextFromLayout(field.fieldValue, document.text),
            confidence: field.fieldName?.confidence || 0,
          });
        }
      }
    }
  }

  return {
    type: "FORM_PARSER",
    text: document.text,
    entities,
    formFields,
    pageCount: document.pages?.length || 0,
  };
}

/**
 * Process document with Enterprise OCR
 * Used when no extractFields - returns dense text
 * @param {Buffer} fileBuffer - Document file buffer
 * @param {string} mimeType - MIME type of the document
 * @returns {Object} Extracted text with layout info
 */
async function processOcr(fileBuffer, mimeType) {
  if (!OCR_PROCESSOR_ID) {
    throw new Error("DOCUMENT_AI_OCR_PROCESSOR_ID is not configured");
  }

  const name = `projects/${PROJECT_ID}/locations/${LOCATION}/processors/${OCR_PROCESSOR_ID}`;

  const request = {
    name,
    rawDocument: {
      content: fileBuffer.toString("base64"),
      mimeType,
    },
  };

  console.log("[DocumentAI] Processing with Enterprise OCR...");
  const [result] = await client.processDocument(request);
  const { document } = result;

  // Extract text blocks with structure
  const blocks = [];
  if (document.pages) {
    for (const page of document.pages) {
      if (page.blocks) {
        for (const block of page.blocks) {
          blocks.push({
            text: extractTextFromLayout(block.layout, document.text),
            confidence: block.layout?.confidence || 0,
          });
        }
      }
    }
  }

  return {
    type: "OCR_PROCESSOR",
    text: document.text,
    blocks,
    pageCount: document.pages?.length || 0,
  };
}

/**
 * Train a new processor version with labeled data
 * @param {string} processorId - Processor ID to uptrain
 * @param {string} versionName - Display name for new version
 * @param {string} trainDataUri - GCS URI for training data
 * @param {string} testDataUri - GCS URI for test data
 * @returns {Object} Long-running operation info
 */
async function trainProcessorVersion(
  processorId,
  versionName,
  trainDataUri,
  testDataUri
) {
  const parent = `projects/${PROJECT_ID}/locations/${LOCATION}/processors/${processorId}`;

  const request = {
    parent,
    processorVersion: {
      displayName: versionName,
    },
  };

  // Add input data if provided
  if (trainDataUri || testDataUri) {
    request.inputData = {};

    if (trainDataUri) {
      request.inputData.trainingDocuments = {
        gcsPrefix: { gcsUriPrefix: trainDataUri },
      };
    }

    if (testDataUri) {
      request.inputData.testDocuments = {
        gcsPrefix: { gcsUriPrefix: testDataUri },
      };
    }
  }

  console.log(`[DocumentAI] Starting training for processor ${processorId}...`);
  const [operation] = await client.trainProcessorVersion(request);

  return {
    operationId: operation.name,
    status: "TRAINING",
    message: "Training started. This may take several minutes to hours.",
  };
}

/**
 * Deploy a processor version to make it usable
 * @param {string} processorId - Processor ID
 * @param {string} versionId - Version ID to deploy
 * @returns {Object} Operation result
 */
async function deployProcessorVersion(processorId, versionId) {
  const name = `projects/${PROJECT_ID}/locations/${LOCATION}/processors/${processorId}/processorVersions/${versionId}`;

  console.log(`[DocumentAI] Deploying version ${versionId}...`);
  const [operation] = await client.deployProcessorVersion({ name });

  return {
    operationId: operation.name,
    status: "DEPLOYING",
    message: "Deployment started.",
  };
}

/**
 * List all versions of a processor
 * @param {string} processorId - Processor ID
 * @returns {Array} List of processor versions
 */
async function listProcessorVersions(processorId) {
  const parent = `projects/${PROJECT_ID}/locations/${LOCATION}/processors/${processorId}`;

  console.log(`[DocumentAI] Listing versions for processor ${processorId}...`);
  const [versions] = await client.listProcessorVersions({ parent });

  return versions.map((v) => ({
    id: v.name.split("/").pop(),
    displayName: v.displayName,
    state: v.state,
    createTime: v.createTime,
    latestEvaluation: v.latestEvaluation?.aggregateMetrics || null,
  }));
}

/**
 * Set default processor version
 * @param {string} processorId - Processor ID
 * @param {string} versionId - Version ID to set as default
 * @returns {Object} Updated processor info
 */
async function setDefaultVersion(processorId, versionId) {
  const name = `projects/${PROJECT_ID}/locations/${LOCATION}/processors/${processorId}`;
  const defaultProcessorVersion = `${name}/processorVersions/${versionId}`;

  console.log(`[DocumentAI] Setting default version to ${versionId}...`);
  const [operation] = await client.setDefaultProcessorVersion({
    processor: name,
    defaultProcessorVersion,
  });

  await operation.promise();

  return {
    status: "SUCCESS",
    message: `Default version set to ${versionId}`,
  };
}

/**
 * Check long-running operation status
 * @param {string} operationName - Full operation name
 * @returns {Object} Operation status
 */
async function checkOperationStatus(operationName) {
  const [operation] = await client.checkTrainProcessorVersionProgress(
    operationName
  );

  return {
    done: operation.done,
    error: operation.error || null,
    result: operation.result || null,
    metadata: operation.metadata || null,
  };
}

// Supported Mime Types for Document AI
const SUPPORTED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/webp",
  "image/bmp",
  "image/gif",
];

/**
 * Check if the provided mime type is supported by Document AI
 * @param {string} mimeType - The mime type to check
 * @returns {boolean}
 */
function isSupportedMimeType(mimeType) {
  return SUPPORTED_MIME_TYPES.includes(mimeType?.toLowerCase());
}

/**
 * Get the list of supported mime types
 * @returns {string[]}
 */
function getSupportedMimeTypes() {
  return SUPPORTED_MIME_TYPES;
}

/**
 * Helper: Extract text from layout using text anchors
 */
function extractTextFromLayout(layout, fullText) {
  if (!layout?.textAnchor?.textSegments) return "";

  let text = "";
  for (const segment of layout.textAnchor.textSegments) {
    const start = parseInt(segment.startIndex) || 0;
    const end = parseInt(segment.endIndex) || 0;
    text += fullText.substring(start, end);
  }
  return text.trim();
}

module.exports = {
  processForm,
  processOcr,
  trainProcessorVersion,
  deployProcessorVersion,
  listProcessorVersions,
  setDefaultVersion,
  checkOperationStatus,
  isSupportedMimeType,
  getSupportedMimeTypes,
};
