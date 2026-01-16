
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
  userId: 'userId',
  name: 'name',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  isDeleted: 'isDeleted',
  isPublished: 'isPublished',
  publishedWorkflowId: 'publishedWorkflowId',
  publishedAt: 'publishedAt',
  lastPublishedAt: 'lastPublishedAt'
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

exports.Prisma.PermissionScalarFieldEnum = {
  id: 'id',
  code: 'code',
  name: 'name',
  description: 'description',
  category: 'category',
  createdAt: 'createdAt'
};

exports.Prisma.WorkflowRolePermissionScalarFieldEnum = {
  id: 'id',
  workflowRoleId: 'workflowRoleId',
  permissionId: 'permissionId',
  createdAt: 'createdAt'
};

exports.Prisma.WorkflowRoleScalarFieldEnum = {
  id: 'id',
  workflowId: 'workflowId',
  name: 'name',
  description: 'description',
  isSystem: 'isSystem',
  createdAt: 'createdAt'
};

exports.Prisma.WorkflowRoleAssignmentScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  userEmail: 'userEmail',
  workflowRoleId: 'workflowRoleId',
  assignedAt: 'assignedAt',
  assignedBy: 'assignedBy'
};

exports.Prisma.DefaultRoleScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  isActive: 'isActive',
  createdAt: 'createdAt'
};

exports.Prisma.DefaultRolePermissionScalarFieldEnum = {
  id: 'id',
  defaultRoleId: 'defaultRoleId',
  permissionId: 'permissionId',
  createdAt: 'createdAt'
};

exports.Prisma.FeedbackScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  workflowId: 'workflowId',
  comment: 'comment',
  createdAt: 'createdAt'
};

exports.Prisma.UserUsageScalarFieldEnum = {
  userId: 'userId',
  storageLimit: 'storageLimit',
  storageUsed: 'storageUsed',
  tokenLimit: 'tokenLimit',
  tokensUsed: 'tokensUsed',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SystemConfigScalarFieldEnum = {
  key: 'key',
  value: 'value',
  updatedAt: 'updatedAt'
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
  WorkflowField: 'WorkflowField',
  Permission: 'Permission',
  WorkflowRolePermission: 'WorkflowRolePermission',
  WorkflowRole: 'WorkflowRole',
  WorkflowRoleAssignment: 'WorkflowRoleAssignment',
  DefaultRole: 'DefaultRole',
  DefaultRolePermission: 'DefaultRolePermission',
  Feedback: 'Feedback',
  UserUsage: 'UserUsage',
  SystemConfig: 'SystemConfig'
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
      "value": "c:\\Users\\pasid\\OneDrive\\Desktop\\lekana.ai\\services\\workflow-builder\\generated\\prisma",
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
    "sourceFilePath": "c:\\Users\\pasid\\OneDrive\\Desktop\\lekana.ai\\services\\workflow-builder\\prisma\\schema.prisma",
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
  "inlineSchema": "generator client {\n  provider        = \"prisma-client-js\"\n  output          = \"../generated/prisma\"\n  previewFeatures = [\"driverAdapters\"]\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nmodel User {\n  id        String     @id @default(uuid())\n  workflows Workflow[]\n  feedbacks Feedback[]\n}\n\nmodel Workflow {\n  id        String          @id @default(uuid())\n  userId    String\n  name      String\n  createdAt DateTime        @default(now())\n  updatedAt DateTime        @updatedAt\n  isDeleted Boolean         @default(false)\n  user      User            @relation(fields: [userId], references: [id], onDelete: Cascade)\n  edges     WorkflowEdge[]\n  nodes     WorkflowNode[]\n  fields    WorkflowField[]\n  roles     WorkflowRole[]\n  feedbacks Feedback[]\n\n  // Publish status tracking (synced from runtime)\n  isPublished         Boolean   @default(false)\n  publishedWorkflowId String? // Runtime's published workflow ID\n  publishedAt         DateTime? // First publish time\n  lastPublishedAt     DateTime? // Most recent publish time\n\n  @@index([userId])\n}\n\nmodel WorkflowNode {\n  id         String          @id @default(uuid())\n  workflowId String\n  config     Json\n  positionX  Float\n  positionY  Float\n  actionId   String\n  outgoing   WorkflowEdge[]  @relation(\"SourceEdges\")\n  incoming   WorkflowEdge[]  @relation(\"TargetEdges\")\n  fields     WorkflowField[]\n  action     Action          @relation(fields: [actionId], references: [id])\n  isDeleted  Boolean         @default(false)\n  workflow   Workflow        @relation(fields: [workflowId], references: [id], onDelete: Cascade)\n\n  @@index([workflowId])\n  @@index([actionId])\n}\n\nmodel WorkflowEdge {\n  id           String       @id @default(uuid())\n  workflowId   String\n  sourceNodeId String\n  targetNodeId String\n  sourceNode   WorkflowNode @relation(\"SourceEdges\", fields: [sourceNodeId], references: [id], onDelete: Cascade)\n  targetNode   WorkflowNode @relation(\"TargetEdges\", fields: [targetNodeId], references: [id], onDelete: Cascade)\n  isDeleted    Boolean      @default(false)\n  workflow     Workflow     @relation(fields: [workflowId], references: [id], onDelete: Cascade)\n\n  @@index([workflowId])\n}\n\nmodel ActionCategory {\n  id          String   @id @default(uuid())\n  name        String   @unique\n  description String?\n  actions     Action[]\n}\n\nmodel Action {\n  id            String         @id @default(uuid())\n  name          String         @unique\n  description   String?\n  categoryId    String\n  configSchema  Json\n  configMeta    Json?\n  inputType     String?\n  outputType    String\n  icon          String\n  serviceUrl    String?\n  category      ActionCategory @relation(fields: [categoryId], references: [id])\n  workflowNodes WorkflowNode[]\n\n  @@index([categoryId])\n}\n\nmodel WorkflowField {\n  id           String       @id @default(uuid())\n  workflowId   String\n  sourceNodeId String\n  fieldName    String\n  fieldPath    String\n  fieldType    String?\n  createdAt    DateTime     @default(now())\n  sourceNode   WorkflowNode @relation(fields: [sourceNodeId], references: [id], onDelete: Cascade)\n  workflow     Workflow     @relation(fields: [workflowId], references: [id], onDelete: Cascade)\n\n  @@unique([workflowId, sourceNodeId, fieldName])\n  @@index([workflowId])\n}\n\n// Available permissions in the system for role-based access control\nmodel Permission {\n  id                     String                   @id @default(uuid())\n  code                   String                   @unique // e.g., \"WORKFLOW_VIEW\"\n  name                   String // e.g., \"View Workflow\"\n  description            String? // Detailed description\n  category               String                   @default(\"general\") // e.g., \"workflow\", \"review\", \"admin\"\n  createdAt              DateTime                 @default(now())\n  rolePermissions        WorkflowRolePermission[]\n  defaultRolePermissions DefaultRolePermission[]\n\n  @@index([category])\n}\n\n// Junction table linking WorkflowRole to Permission\nmodel WorkflowRolePermission {\n  id             String       @id @default(uuid())\n  workflowRoleId String\n  permissionId   String\n  workflowRole   WorkflowRole @relation(fields: [workflowRoleId], references: [id], onDelete: Cascade)\n  permission     Permission   @relation(fields: [permissionId], references: [id], onDelete: Cascade)\n  createdAt      DateTime     @default(now())\n\n  @@unique([workflowRoleId, permissionId])\n  @@index([workflowRoleId])\n  @@index([permissionId])\n}\n\n// Role definition with explicit permissions for each workflow\nmodel WorkflowRole {\n  id              String                   @id @default(uuid())\n  workflowId      String\n  name            String // \"developer\", \"validator\", custom names\n  description     String?\n  isSystem        Boolean                  @default(false) // true for developer/validator\n  createdAt       DateTime                 @default(now())\n  workflow        Workflow                 @relation(fields: [workflowId], references: [id], onDelete: Cascade)\n  assignments     WorkflowRoleAssignment[]\n  rolePermissions WorkflowRolePermission[]\n\n  @@unique([workflowId, name])\n  @@index([workflowId])\n}\n\n// Role assignment - links users to roles for specific workflows\nmodel WorkflowRoleAssignment {\n  id             String       @id @default(uuid())\n  userId         String // Clerk user ID\n  userEmail      String? // For display/invite\n  workflowRoleId String\n  workflowRole   WorkflowRole @relation(fields: [workflowRoleId], references: [id], onDelete: Cascade)\n  assignedAt     DateTime     @default(now())\n  assignedBy     String? // Who assigned this role\n\n  @@unique([userId, workflowRoleId])\n  @@index([userId])\n  @@index([workflowRoleId])\n}\n\n// Default role templates - automatically created for each new workflow\nmodel DefaultRole {\n  id                     String                  @id @default(uuid())\n  name                   String                  @unique // e.g., \"developer\", \"validator\"\n  description            String?\n  isActive               Boolean                 @default(true) // Can disable without deleting\n  createdAt              DateTime                @default(now())\n  defaultRolePermissions DefaultRolePermission[]\n}\n\n// Junction table linking DefaultRole to Permission\nmodel DefaultRolePermission {\n  id            String      @id @default(uuid())\n  defaultRoleId String\n  permissionId  String\n  defaultRole   DefaultRole @relation(fields: [defaultRoleId], references: [id], onDelete: Cascade)\n  permission    Permission  @relation(fields: [permissionId], references: [id], onDelete: Cascade)\n  createdAt     DateTime    @default(now())\n\n  @@unique([defaultRoleId, permissionId])\n  @@index([defaultRoleId])\n  @@index([permissionId])\n}\n\nmodel Feedback {\n  id         String   @id @default(uuid())\n  userId     String\n  workflowId String?\n  comment    String\n  createdAt  DateTime @default(now())\n\n  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  workflow Workflow? @relation(fields: [workflowId], references: [id], onDelete: SetNull)\n\n  @@index([userId])\n  @@index([workflowId])\n}\n\n// User usage tracking for storage and token limits\nmodel UserUsage {\n  userId       String   @id // Clerk user ID\n  storageLimit BigInt   @default(1073741824) // 1GB in bytes\n  storageUsed  BigInt   @default(0)\n  tokenLimit   Int? // Optional hard cap on tokens\n  tokensUsed   Float    @default(0) // Total tokens consumed\n  createdAt    DateTime @default(now())\n  updatedAt    DateTime @updatedAt\n}\n\n// System configuration for default limits and settings\n// Use key-value pairs for flexibility\nmodel SystemConfig {\n  key       String   @id\n  value     String // JSON string for complex values\n  updatedAt DateTime @updatedAt\n}\n",
  "inlineSchemaHash": "3ebba2087010502140fdd85ce6eb5dd72bf172ccce4df9c25aac8dfc3383164a",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"workflows\",\"kind\":\"object\",\"type\":\"Workflow\",\"relationName\":\"UserToWorkflow\"},{\"name\":\"feedbacks\",\"kind\":\"object\",\"type\":\"Feedback\",\"relationName\":\"FeedbackToUser\"}],\"dbName\":null},\"Workflow\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"isDeleted\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserToWorkflow\"},{\"name\":\"edges\",\"kind\":\"object\",\"type\":\"WorkflowEdge\",\"relationName\":\"WorkflowToWorkflowEdge\"},{\"name\":\"nodes\",\"kind\":\"object\",\"type\":\"WorkflowNode\",\"relationName\":\"WorkflowToWorkflowNode\"},{\"name\":\"fields\",\"kind\":\"object\",\"type\":\"WorkflowField\",\"relationName\":\"WorkflowToWorkflowField\"},{\"name\":\"roles\",\"kind\":\"object\",\"type\":\"WorkflowRole\",\"relationName\":\"WorkflowToWorkflowRole\"},{\"name\":\"feedbacks\",\"kind\":\"object\",\"type\":\"Feedback\",\"relationName\":\"FeedbackToWorkflow\"},{\"name\":\"isPublished\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"publishedWorkflowId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"publishedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"lastPublishedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"WorkflowNode\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"workflowId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"config\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"positionX\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"positionY\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"actionId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"outgoing\",\"kind\":\"object\",\"type\":\"WorkflowEdge\",\"relationName\":\"SourceEdges\"},{\"name\":\"incoming\",\"kind\":\"object\",\"type\":\"WorkflowEdge\",\"relationName\":\"TargetEdges\"},{\"name\":\"fields\",\"kind\":\"object\",\"type\":\"WorkflowField\",\"relationName\":\"WorkflowFieldToWorkflowNode\"},{\"name\":\"action\",\"kind\":\"object\",\"type\":\"Action\",\"relationName\":\"ActionToWorkflowNode\"},{\"name\":\"isDeleted\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"workflow\",\"kind\":\"object\",\"type\":\"Workflow\",\"relationName\":\"WorkflowToWorkflowNode\"}],\"dbName\":null},\"WorkflowEdge\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"workflowId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"sourceNodeId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"targetNodeId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"sourceNode\",\"kind\":\"object\",\"type\":\"WorkflowNode\",\"relationName\":\"SourceEdges\"},{\"name\":\"targetNode\",\"kind\":\"object\",\"type\":\"WorkflowNode\",\"relationName\":\"TargetEdges\"},{\"name\":\"isDeleted\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"workflow\",\"kind\":\"object\",\"type\":\"Workflow\",\"relationName\":\"WorkflowToWorkflowEdge\"}],\"dbName\":null},\"ActionCategory\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"actions\",\"kind\":\"object\",\"type\":\"Action\",\"relationName\":\"ActionToActionCategory\"}],\"dbName\":null},\"Action\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"categoryId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"configSchema\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"configMeta\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"inputType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"outputType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"icon\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"serviceUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"category\",\"kind\":\"object\",\"type\":\"ActionCategory\",\"relationName\":\"ActionToActionCategory\"},{\"name\":\"workflowNodes\",\"kind\":\"object\",\"type\":\"WorkflowNode\",\"relationName\":\"ActionToWorkflowNode\"}],\"dbName\":null},\"WorkflowField\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"workflowId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"sourceNodeId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fieldName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fieldPath\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fieldType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"sourceNode\",\"kind\":\"object\",\"type\":\"WorkflowNode\",\"relationName\":\"WorkflowFieldToWorkflowNode\"},{\"name\":\"workflow\",\"kind\":\"object\",\"type\":\"Workflow\",\"relationName\":\"WorkflowToWorkflowField\"}],\"dbName\":null},\"Permission\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"code\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"category\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"rolePermissions\",\"kind\":\"object\",\"type\":\"WorkflowRolePermission\",\"relationName\":\"PermissionToWorkflowRolePermission\"},{\"name\":\"defaultRolePermissions\",\"kind\":\"object\",\"type\":\"DefaultRolePermission\",\"relationName\":\"DefaultRolePermissionToPermission\"}],\"dbName\":null},\"WorkflowRolePermission\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"workflowRoleId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"permissionId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"workflowRole\",\"kind\":\"object\",\"type\":\"WorkflowRole\",\"relationName\":\"WorkflowRoleToWorkflowRolePermission\"},{\"name\":\"permission\",\"kind\":\"object\",\"type\":\"Permission\",\"relationName\":\"PermissionToWorkflowRolePermission\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"WorkflowRole\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"workflowId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isSystem\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"workflow\",\"kind\":\"object\",\"type\":\"Workflow\",\"relationName\":\"WorkflowToWorkflowRole\"},{\"name\":\"assignments\",\"kind\":\"object\",\"type\":\"WorkflowRoleAssignment\",\"relationName\":\"WorkflowRoleToWorkflowRoleAssignment\"},{\"name\":\"rolePermissions\",\"kind\":\"object\",\"type\":\"WorkflowRolePermission\",\"relationName\":\"WorkflowRoleToWorkflowRolePermission\"}],\"dbName\":null},\"WorkflowRoleAssignment\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userEmail\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"workflowRoleId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"workflowRole\",\"kind\":\"object\",\"type\":\"WorkflowRole\",\"relationName\":\"WorkflowRoleToWorkflowRoleAssignment\"},{\"name\":\"assignedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"assignedBy\",\"kind\":\"scalar\",\"type\":\"String\"}],\"dbName\":null},\"DefaultRole\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"defaultRolePermissions\",\"kind\":\"object\",\"type\":\"DefaultRolePermission\",\"relationName\":\"DefaultRoleToDefaultRolePermission\"}],\"dbName\":null},\"DefaultRolePermission\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"defaultRoleId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"permissionId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"defaultRole\",\"kind\":\"object\",\"type\":\"DefaultRole\",\"relationName\":\"DefaultRoleToDefaultRolePermission\"},{\"name\":\"permission\",\"kind\":\"object\",\"type\":\"Permission\",\"relationName\":\"DefaultRolePermissionToPermission\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Feedback\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"workflowId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"comment\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"FeedbackToUser\"},{\"name\":\"workflow\",\"kind\":\"object\",\"type\":\"Workflow\",\"relationName\":\"FeedbackToWorkflow\"}],\"dbName\":null},\"UserUsage\":{\"fields\":[{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"storageLimit\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"storageUsed\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"tokenLimit\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"tokensUsed\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"SystemConfig\":{\"fields\":[{\"name\":\"key\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"value\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}")
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

