
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime
} = require('./runtime/wasm.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}





/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id'
};

exports.Prisma.WorkflowScalarFieldEnum = {
  id: 'id',
  name: 'name',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId',
  isPublished: 'isPublished',
  lastPublishedAt: 'lastPublishedAt',
  publishedAt: 'publishedAt',
  publishedWorkflowId: 'publishedWorkflowId',
  isDeleted: 'isDeleted'
};

exports.Prisma.WorkflowNodeScalarFieldEnum = {
  id: 'id',
  workflowId: 'workflowId',
  config: 'config',
  positionX: 'positionX',
  positionY: 'positionY',
  actionId: 'actionId',
  isDeleted: 'isDeleted'
};

exports.Prisma.WorkflowEdgeScalarFieldEnum = {
  id: 'id',
  workflowId: 'workflowId',
  sourceNodeId: 'sourceNodeId',
  targetNodeId: 'targetNodeId',
  isDeleted: 'isDeleted'
};

exports.Prisma.ActionCategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description'
};

exports.Prisma.ActionScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  categoryId: 'categoryId',
  configSchema: 'configSchema',
  configMeta: 'configMeta',
  inputType: 'inputType',
  outputType: 'outputType',
  icon: 'icon',
  serviceUrl: 'serviceUrl'
};

exports.Prisma.WorkflowFieldScalarFieldEnum = {
  id: 'id',
  workflowId: 'workflowId',
  sourceNodeId: 'sourceNodeId',
  fieldName: 'fieldName',
  fieldPath: 'fieldPath',
  fieldType: 'fieldType',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};


exports.Prisma.ModelName = {
  User: 'User',
  Workflow: 'Workflow',
  WorkflowNode: 'WorkflowNode',
  WorkflowEdge: 'WorkflowEdge',
  ActionCategory: 'ActionCategory',
  Action: 'Action',
  WorkflowField: 'WorkflowField'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "C:\\Users\\Lasandu\\Software Projects\\Express\\lekana-ai-workflow-builder\\generated\\prisma",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      }
    ],
    "previewFeatures": [
      "driverAdapters"
    ],
    "sourceFilePath": "C:\\Users\\Lasandu\\Software Projects\\Express\\lekana-ai-workflow-builder\\prisma\\schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null,
    "schemaEnvPath": "../../.env"
  },
  "relativePath": "../../prisma",
  "clientVersion": "5.22.0",
  "engineVersion": "605197351a3c8bdd595af2d2a9bc3025bca48ea2",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "generator client {\n  provider        = \"prisma-client-js\"\n  output          = \"../generated/prisma\"\n  previewFeatures = [\"driverAdapters\"]\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nmodel User {\n  id        String     @id @default(uuid())\n  workflows Workflow[]\n}\n\nmodel Workflow {\n  id                  String          @id @default(uuid())\n  name                String\n  createdAt           DateTime        @default(now())\n  updatedAt           DateTime        @updatedAt\n  userId              String\n  isPublished         Boolean         @default(false)\n  lastPublishedAt     DateTime?\n  publishedAt         DateTime?\n  publishedWorkflowId String?\n  isDeleted           Boolean         @default(false)\n  user                User            @relation(fields: [userId], references: [id], onDelete: Cascade)\n  edges               WorkflowEdge[]\n  fields              WorkflowField[]\n  nodes               WorkflowNode[]\n\n  @@index([userId])\n}\n\nmodel WorkflowNode {\n  id         String          @id @default(uuid())\n  workflowId String\n  config     Json\n  positionX  Float\n  positionY  Float\n  actionId   String\n  outgoing   WorkflowEdge[]  @relation(\"SourceEdges\")\n  incoming   WorkflowEdge[]  @relation(\"TargetEdges\")\n  fields     WorkflowField[]\n  action     Action          @relation(fields: [actionId], references: [id])\n  isDeleted  Boolean         @default(false)\n  workflow   Workflow        @relation(fields: [workflowId], references: [id], onDelete: Cascade)\n\n  @@index([workflowId])\n  @@index([actionId])\n}\n\nmodel WorkflowEdge {\n  id           String       @id @default(uuid())\n  workflowId   String\n  sourceNodeId String\n  targetNodeId String\n  sourceNode   WorkflowNode @relation(\"SourceEdges\", fields: [sourceNodeId], references: [id], onDelete: Cascade)\n  targetNode   WorkflowNode @relation(\"TargetEdges\", fields: [targetNodeId], references: [id], onDelete: Cascade)\n  isDeleted    Boolean      @default(false)\n  workflow     Workflow     @relation(fields: [workflowId], references: [id], onDelete: Cascade)\n\n  @@index([workflowId])\n}\n\nmodel ActionCategory {\n  id          String   @id @default(uuid())\n  name        String   @unique\n  description String?\n  actions     Action[]\n}\n\nmodel Action {\n  id            String         @id @default(uuid())\n  name          String         @unique\n  description   String?\n  categoryId    String\n  configSchema  Json\n  configMeta    Json?\n  inputType     String?\n  outputType    String\n  icon          String\n  serviceUrl    String?\n  category      ActionCategory @relation(fields: [categoryId], references: [id])\n  workflowNodes WorkflowNode[]\n\n  @@index([categoryId])\n}\n\nmodel WorkflowField {\n  id           String       @id @default(uuid())\n  workflowId   String\n  sourceNodeId String\n  fieldName    String\n  fieldPath    String\n  fieldType    String?\n  createdAt    DateTime     @default(now())\n  sourceNode   WorkflowNode @relation(fields: [sourceNodeId], references: [id], onDelete: Cascade)\n  workflow     Workflow     @relation(fields: [workflowId], references: [id], onDelete: Cascade)\n\n  @@unique([workflowId, sourceNodeId, fieldName])\n  @@index([workflowId])\n}\n",
  "inlineSchemaHash": "1537a3f22aa4496e40c101de17bdf11ce72adef394dcef7d4cca078f21a8bf23",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"workflows\",\"kind\":\"object\",\"type\":\"Workflow\",\"relationName\":\"UserToWorkflow\"}],\"dbName\":null},\"Workflow\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isPublished\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"lastPublishedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"publishedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"publishedWorkflowId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isDeleted\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserToWorkflow\"},{\"name\":\"edges\",\"kind\":\"object\",\"type\":\"WorkflowEdge\",\"relationName\":\"WorkflowToWorkflowEdge\"},{\"name\":\"fields\",\"kind\":\"object\",\"type\":\"WorkflowField\",\"relationName\":\"WorkflowToWorkflowField\"},{\"name\":\"nodes\",\"kind\":\"object\",\"type\":\"WorkflowNode\",\"relationName\":\"WorkflowToWorkflowNode\"}],\"dbName\":null},\"WorkflowNode\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"workflowId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"config\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"positionX\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"positionY\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"actionId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"outgoing\",\"kind\":\"object\",\"type\":\"WorkflowEdge\",\"relationName\":\"SourceEdges\"},{\"name\":\"incoming\",\"kind\":\"object\",\"type\":\"WorkflowEdge\",\"relationName\":\"TargetEdges\"},{\"name\":\"fields\",\"kind\":\"object\",\"type\":\"WorkflowField\",\"relationName\":\"WorkflowFieldToWorkflowNode\"},{\"name\":\"action\",\"kind\":\"object\",\"type\":\"Action\",\"relationName\":\"ActionToWorkflowNode\"},{\"name\":\"isDeleted\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"workflow\",\"kind\":\"object\",\"type\":\"Workflow\",\"relationName\":\"WorkflowToWorkflowNode\"}],\"dbName\":null},\"WorkflowEdge\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"workflowId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"sourceNodeId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"targetNodeId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"sourceNode\",\"kind\":\"object\",\"type\":\"WorkflowNode\",\"relationName\":\"SourceEdges\"},{\"name\":\"targetNode\",\"kind\":\"object\",\"type\":\"WorkflowNode\",\"relationName\":\"TargetEdges\"},{\"name\":\"isDeleted\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"workflow\",\"kind\":\"object\",\"type\":\"Workflow\",\"relationName\":\"WorkflowToWorkflowEdge\"}],\"dbName\":null},\"ActionCategory\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"actions\",\"kind\":\"object\",\"type\":\"Action\",\"relationName\":\"ActionToActionCategory\"}],\"dbName\":null},\"Action\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"categoryId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"configSchema\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"configMeta\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"inputType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"outputType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"icon\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"serviceUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"category\",\"kind\":\"object\",\"type\":\"ActionCategory\",\"relationName\":\"ActionToActionCategory\"},{\"name\":\"workflowNodes\",\"kind\":\"object\",\"type\":\"WorkflowNode\",\"relationName\":\"ActionToWorkflowNode\"}],\"dbName\":null},\"WorkflowField\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"workflowId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"sourceNodeId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fieldName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fieldPath\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fieldType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"sourceNode\",\"kind\":\"object\",\"type\":\"WorkflowNode\",\"relationName\":\"WorkflowFieldToWorkflowNode\"},{\"name\":\"workflow\",\"kind\":\"object\",\"type\":\"Workflow\",\"relationName\":\"WorkflowToWorkflowField\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = {
  getRuntime: () => require('./query_engine_bg.js'),
  getQueryEngineWasmModule: async () => {
    const loader = (await import('#wasm-engine-loader')).default
    const engine = (await loader).default
    return engine 
  }
}

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

