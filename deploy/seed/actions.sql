-- Built-in action catalog for the workflow builder.
-- Idempotent: safe to run on every deploy. Re-running only refreshes each action's serviceUrl.
--
-- Usage:
--   psql "$DATABASE_URL" \
--     -v upload_url=http://upload:4001 -v classification_url=http://classification:4002 \
--     -v ocr_url=http://ocr:4004 -v db_export_url=http://db-export:4005 \
--     -v conditional_router_url=http://conditional-router:4010 \
--     -f deploy/seed/actions.sql
--
-- serviceUrl is the service's base URL; the runtime POSTs to <serviceUrl>/api/v1/process.

\set ON_ERROR_STOP on
BEGIN;

INSERT INTO "ActionCategory" (id, name, description) VALUES ('5d0d4ed6-0410-4b07-8251-57044507575d', 'Input & Pre-Processing', 'Initial data ingestion and preparation')
ON CONFLICT (name) DO NOTHING;

INSERT INTO "ActionCategory" (id, name, description) VALUES ('123ec4b3-8d96-48e9-8008-4fed68751d58', 'Utilities', 'Utility actions for data processing')
ON CONFLICT (name) DO NOTHING;

INSERT INTO "ActionCategory" (id, name, description) VALUES ('ffa3fb55-fc03-4767-9169-2e7a5e66decf', 'Storage & Integrations', 'Storage and external integrations')
ON CONFLICT (name) DO NOTHING;

INSERT INTO "Action" (id, name, description, "categoryId", "configSchema", "configMeta", "inputType", "outputType", icon, "serviceUrl", "isActive")
VALUES (
  'dc6d6470-8dc4-4a19-82a9-ce8ffa821fca',
  'Classification',
  'Classify documents using Lekana, and fallback with custom labels',
  (SELECT id FROM "ActionCategory" WHERE name = 'Input & Pre-Processing'),
  $json${
  "mode": "custom",
  "stepName": "Classification",
  "customLabels": [],
  "outputVariables": [
    "label",
    "confidence"
  ],
  "confidenceThreshold": 0.7
}$json$::jsonb,
  $json${
  "mode": {
    "type": "select",
    "label": "Classification Mode",
    "options": [
      {
        "label": "Custom Labels",
        "value": "custom"
      },
      {
        "label": "Auto-Categorize",
        "value": "auto"
      }
    ]
  },
  "stepName": {
    "type": "text",
    "label": "Step Name",
    "required": true
  },
  "customLabels": {
    "info": "Array of labels e.g. \"Invoice\", \"Receipt\", \"Contract\", \"ID Card\"",
    "type": "array",
    "label": "Custom Labels",
    "value": [
      ""
    ],
    "visibleWhen": {
      "mode": "custom"
    }
  },
  "outputVariables": {
    "info": "Fields available for downstream routing",
    "type": "hidden",
    "label": "Output Variables"
  },
  "outputFieldsSource": "customLabels",
  "confidenceThreshold": {
    "info": "Minimum confidence (0.0 - 1.0) before flagging for human review",
    "type": "number",
    "label": "Confidence Threshold"
  }
}$json$::jsonb,
  'file',
  'json',
  'ListChecks',
  :'classification_url',
  true
)
ON CONFLICT (name) DO UPDATE SET "serviceUrl" = EXCLUDED."serviceUrl";

INSERT INTO "Action" (id, name, description, "categoryId", "configSchema", "configMeta", "inputType", "outputType", icon, "serviceUrl", "isActive")
VALUES (
  'a1b2c3d4-5678-90ab-cdef-1234567890ab',
  'Conditional Router',
  'Route data based on field values with conditional operators',
  (SELECT id FROM "ActionCategory" WHERE name = 'Utilities'),
  $json${
  "operator": "equals",
  "stepName": "Conditional Router",
  "outputMode": "documents_only",
  "routeValue": "",
  "skipIfEmpty": true,
  "routeByField": "label"
}$json$::jsonb,
  $json${
  "operator": {
    "type": "select",
    "label": "Operator",
    "options": [
      {
        "label": "Equals",
        "value": "equals"
      },
      {
        "label": "Not Equals",
        "value": "not_equals"
      },
      {
        "label": "Contains",
        "value": "contains"
      },
      {
        "label": "Greater Than",
        "value": "greater_than"
      },
      {
        "label": "Less Than",
        "value": "less_than"
      }
    ]
  },
  "stepName": {
    "type": "text",
    "label": "Step Name",
    "required": true
  },
  "outputMode": {
    "info": "What data to send downstream",
    "type": "select",
    "label": "Output Format",
    "options": [
      {
        "label": "Documents Only (for OCR)",
        "value": "documents_only"
      },
      {
        "label": "Filtered Data (for DB Export)",
        "value": "filtered_data"
      },
      {
        "label": "Full Data (pass everything)",
        "value": "full_data"
      }
    ]
  },
  "routeValue": {
    "info": "Value to match (from upstream labels or custom)",
    "type": "dynamicSelectValues",
    "label": "Match Value",
    "allowCustom": true
  },
  "skipIfEmpty": {
    "type": "checkbox",
    "label": "Skip if no matches"
  },
  "routeByField": {
    "info": "Field to match against (from upstream node)",
    "type": "dynamicSelect",
    "label": "Route By Field",
    "sourceKey": "outputVariables"
  }
}$json$::jsonb,
  'json',
  'file',
  'GitBranch',
  :'conditional_router_url',
  true
)
ON CONFLICT (name) DO UPDATE SET "serviceUrl" = EXCLUDED."serviceUrl";

INSERT INTO "Action" (id, name, description, "categoryId", "configSchema", "configMeta", "inputType", "outputType", icon, "serviceUrl", "isActive")
VALUES (
  '8d80def8-1cd5-4b2e-a33b-39d48335e4e7',
  'Upload files',
  'Upload and ingest files to Lekana',
  (SELECT id FROM "ActionCategory" WHERE name = 'Input & Pre-Processing'),
  $json${
  "stepName": "Upload Files",
  "bulkUpload": false,
  "maxFileSizeMB": 20,
  "allowedFileTypes": [
    "pdf",
    "images"
  ]
}$json$::jsonb,
  $json${
  "stepName": {
    "type": "text",
    "label": "Step Name",
    "required": true
  },
  "bulkUpload": {
    "info": "Allows zip compressed files to be uploaded",
    "type": "checkbox",
    "label": "Allow Zip"
  },
  "maxFileSizeMB": {
    "type": "number",
    "label": "Max File Size (MB)",
    "value": 20
  },
  "allowedFileTypes": {
    "type": "checkbox-group",
    "label": "Allowed File Types",
    "options": [
      {
        "label": "PDF",
        "value": "pdf"
      },
      {
        "label": "Images",
        "value": "images"
      }
    ]
  }
}$json$::jsonb,
  'file',
  'file',
  'CloudUpload',
  :'upload_url',
  true
)
ON CONFLICT (name) DO UPDATE SET "serviceUrl" = EXCLUDED."serviceUrl";

INSERT INTO "Action" (id, name, description, "categoryId", "configSchema", "configMeta", "inputType", "outputType", icon, "serviceUrl", "isActive")
VALUES (
  'bd7e2a42-4498-4175-bdb4-a3b427f081dd',
  'Database Export',
  'Export workflow data to a Postgres SQL database',
  (SELECT id FROM "ActionCategory" WHERE name = 'Storage & Integrations'),
  $json${
  "mode": "auto",
  "stepName": "Database Export",
  "tableName": "",
  "onConflict": "skip",
  "databaseUrl": "",
  "fieldMapping": [],
  "includeMetadata": true,
  "flattenFieldsMode": true,
  "unmappedFieldStrategy": "store_as_json",
  "includeExtractionMetadata": true
}$json$::jsonb,
  $json${
  "mode": {
    "type": "select",
    "label": "Table Mode",
    "options": [
      {
        "label": "Auto Create",
        "value": "auto"
      },
      {
        "label": "Use Existing",
        "value": "existing"
      }
    ]
  },
  "stepName": {
    "type": "text",
    "label": "Step Name",
    "required": true
  },
  "tableName": {
    "type": "text",
    "label": "Table Name",
    "required": true
  },
  "onConflict": {
    "type": "select",
    "label": "On Conflict",
    "options": [
      {
        "label": "Skip",
        "value": "skip"
      },
      {
        "label": "Update",
        "value": "update"
      },
      {
        "label": "Error",
        "value": "error"
      }
    ]
  },
  "databaseUrl": {
    "info": "Only postgres databases are allowed. An account with limited access is recomended.",
    "type": "dbUrl",
    "label": "Postgres Database URL",
    "required": true,
    "placeholder": "postgresql://user:pass@host:5432/db",
    "testConnection": true
  },
  "fieldMapping": {
    "info": "Map extracted fields to database columns",
    "type": "keyValue",
    "label": "Field Mapping",
    "value": [
      ""
    ],
    "keyLabel": "OCR Field",
    "valueLabel": "Database Column",
    "useExtractedFields": true
  },
  "includeMetadata": {
    "type": "checkbox",
    "label": "Include Execution Metadata"
  },
  "flattenFieldsMode": {
    "info": "Extract .value from OCR field objects",
    "type": "checkbox",
    "label": "Flatten OCR Fields"
  },
  "unmappedFieldStrategy": {
    "type": "select",
    "label": "Unmapped Fields",
    "options": [
      {
        "label": "Store as JSON",
        "value": "store_as_json"
      },
      {
        "label": "Ignore",
        "value": "ignore"
      },
      {
        "label": "Error",
        "value": "error"
      }
    ]
  },
  "includeExtractionMetadata": {
    "info": "Store confidence and correction data",
    "type": "checkbox",
    "label": "Include Extraction Metadata"
  }
}$json$::jsonb,
  'json',
  'json',
  'Database',
  :'db_export_url',
  true
)
ON CONFLICT (name) DO UPDATE SET "serviceUrl" = EXCLUDED."serviceUrl";

INSERT INTO "Action" (id, name, description, "categoryId", "configSchema", "configMeta", "inputType", "outputType", icon, "serviceUrl", "isActive")
VALUES (
  '8db87730-9720-4b1c-bf0c-ef75ad70c322',
  'OCR',
  'Extract text and key-value pairs with refinement',
  (SELECT id FROM "ActionCategory" WHERE name = 'Input & Pre-Processing'),
  $json${
  "stepName": "OCR",
  "isRefined": false,
  "outputMode": "auto",
  "extractFields": [],
  "processorType": "auto",
  "outputVariables": [
    "extractFields"
  ]
}$json$::jsonb,
  $json${
  "stepName": {
    "type": "text",
    "label": "Step Name",
    "required": true
  },
  "isRefined": {
    "type": "checkbox",
    "label": "Include Raw Text Result"
  },
  "outputMode": {
    "type": "select",
    "label": "Output Mode",
    "options": [
      {
        "label": "Text Cleanup",
        "value": "auto"
      },
      {
        "label": "Key-Value Pairs",
        "value": "key-value"
      },
      {
        "label": "Field Extraction",
        "value": "field-extract"
      }
    ]
  },
  "extractFields": {
    "type": "keyValue",
    "label": "Fields to Extract",
    "value": [],
    "keyLabel": "Field Name",
    "required": true,
    "valueLabel": "Field Prompt",
    "visibleWhen": {
      "outputMode": "field-extract"
    }
  },
  "processorType": {
    "type": "select",
    "label": "Processor Type",
    "options": [
      {
        "label": "Auto",
        "value": "auto"
      },
      {
        "label": "Form Parser",
        "value": "FORM_PARSER"
      },
      {
        "label": "OCR Processor",
        "value": "OCR_PROCESSOR"
      }
    ]
  },
  "outputVariables": {
    "type": "hidden",
    "label": "Output Variables"
  },
  "outputFieldsSource": "extractFields"
}$json$::jsonb,
  'file',
  'json',
  'ScanText',
  :'ocr_url',
  true
)
ON CONFLICT (name) DO UPDATE SET "serviceUrl" = EXCLUDED."serviceUrl";

COMMIT;
