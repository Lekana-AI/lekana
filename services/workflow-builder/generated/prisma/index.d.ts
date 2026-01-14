
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Workflow
 * 
 */
export type Workflow = $Result.DefaultSelection<Prisma.$WorkflowPayload>
/**
 * Model WorkflowNode
 * 
 */
export type WorkflowNode = $Result.DefaultSelection<Prisma.$WorkflowNodePayload>
/**
 * Model WorkflowEdge
 * 
 */
export type WorkflowEdge = $Result.DefaultSelection<Prisma.$WorkflowEdgePayload>
/**
 * Model ActionCategory
 * 
 */
export type ActionCategory = $Result.DefaultSelection<Prisma.$ActionCategoryPayload>
/**
 * Model Action
 * 
 */
export type Action = $Result.DefaultSelection<Prisma.$ActionPayload>
/**
 * Model WorkflowField
 * 
 */
export type WorkflowField = $Result.DefaultSelection<Prisma.$WorkflowFieldPayload>
/**
 * Model WorkflowRole
 * 
 */
export type WorkflowRole = $Result.DefaultSelection<Prisma.$WorkflowRolePayload>
/**
 * Model WorkflowRoleAssignment
 * 
 */
export type WorkflowRoleAssignment = $Result.DefaultSelection<Prisma.$WorkflowRoleAssignmentPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Permission: {
  WORKFLOW_VIEW: 'WORKFLOW_VIEW',
  WORKFLOW_EDIT: 'WORKFLOW_EDIT',
  WORKFLOW_PUBLISH: 'WORKFLOW_PUBLISH',
  WORKFLOW_DELETE: 'WORKFLOW_DELETE',
  REVIEW_VIEW: 'REVIEW_VIEW',
  REVIEW_APPROVE: 'REVIEW_APPROVE',
  REVIEW_REJECT: 'REVIEW_REJECT',
  ROLE_MANAGE: 'ROLE_MANAGE'
};

export type Permission = (typeof Permission)[keyof typeof Permission]

}

export type Permission = $Enums.Permission

export const Permission: typeof $Enums.Permission

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.workflow`: Exposes CRUD operations for the **Workflow** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Workflows
    * const workflows = await prisma.workflow.findMany()
    * ```
    */
  get workflow(): Prisma.WorkflowDelegate<ExtArgs>;

  /**
   * `prisma.workflowNode`: Exposes CRUD operations for the **WorkflowNode** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WorkflowNodes
    * const workflowNodes = await prisma.workflowNode.findMany()
    * ```
    */
  get workflowNode(): Prisma.WorkflowNodeDelegate<ExtArgs>;

  /**
   * `prisma.workflowEdge`: Exposes CRUD operations for the **WorkflowEdge** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WorkflowEdges
    * const workflowEdges = await prisma.workflowEdge.findMany()
    * ```
    */
  get workflowEdge(): Prisma.WorkflowEdgeDelegate<ExtArgs>;

  /**
   * `prisma.actionCategory`: Exposes CRUD operations for the **ActionCategory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ActionCategories
    * const actionCategories = await prisma.actionCategory.findMany()
    * ```
    */
  get actionCategory(): Prisma.ActionCategoryDelegate<ExtArgs>;

  /**
   * `prisma.action`: Exposes CRUD operations for the **Action** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Actions
    * const actions = await prisma.action.findMany()
    * ```
    */
  get action(): Prisma.ActionDelegate<ExtArgs>;

  /**
   * `prisma.workflowField`: Exposes CRUD operations for the **WorkflowField** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WorkflowFields
    * const workflowFields = await prisma.workflowField.findMany()
    * ```
    */
  get workflowField(): Prisma.WorkflowFieldDelegate<ExtArgs>;

  /**
   * `prisma.workflowRole`: Exposes CRUD operations for the **WorkflowRole** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WorkflowRoles
    * const workflowRoles = await prisma.workflowRole.findMany()
    * ```
    */
  get workflowRole(): Prisma.WorkflowRoleDelegate<ExtArgs>;

  /**
   * `prisma.workflowRoleAssignment`: Exposes CRUD operations for the **WorkflowRoleAssignment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WorkflowRoleAssignments
    * const workflowRoleAssignments = await prisma.workflowRoleAssignment.findMany()
    * ```
    */
  get workflowRoleAssignment(): Prisma.WorkflowRoleAssignmentDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Workflow: 'Workflow',
    WorkflowNode: 'WorkflowNode',
    WorkflowEdge: 'WorkflowEdge',
    ActionCategory: 'ActionCategory',
    Action: 'Action',
    WorkflowField: 'WorkflowField',
    WorkflowRole: 'WorkflowRole',
    WorkflowRoleAssignment: 'WorkflowRoleAssignment'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "workflow" | "workflowNode" | "workflowEdge" | "actionCategory" | "action" | "workflowField" | "workflowRole" | "workflowRoleAssignment"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Workflow: {
        payload: Prisma.$WorkflowPayload<ExtArgs>
        fields: Prisma.WorkflowFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WorkflowFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WorkflowFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowPayload>
          }
          findFirst: {
            args: Prisma.WorkflowFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WorkflowFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowPayload>
          }
          findMany: {
            args: Prisma.WorkflowFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowPayload>[]
          }
          create: {
            args: Prisma.WorkflowCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowPayload>
          }
          createMany: {
            args: Prisma.WorkflowCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WorkflowCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowPayload>[]
          }
          delete: {
            args: Prisma.WorkflowDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowPayload>
          }
          update: {
            args: Prisma.WorkflowUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowPayload>
          }
          deleteMany: {
            args: Prisma.WorkflowDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WorkflowUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.WorkflowUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowPayload>
          }
          aggregate: {
            args: Prisma.WorkflowAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorkflow>
          }
          groupBy: {
            args: Prisma.WorkflowGroupByArgs<ExtArgs>
            result: $Utils.Optional<WorkflowGroupByOutputType>[]
          }
          count: {
            args: Prisma.WorkflowCountArgs<ExtArgs>
            result: $Utils.Optional<WorkflowCountAggregateOutputType> | number
          }
        }
      }
      WorkflowNode: {
        payload: Prisma.$WorkflowNodePayload<ExtArgs>
        fields: Prisma.WorkflowNodeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WorkflowNodeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowNodePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WorkflowNodeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowNodePayload>
          }
          findFirst: {
            args: Prisma.WorkflowNodeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowNodePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WorkflowNodeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowNodePayload>
          }
          findMany: {
            args: Prisma.WorkflowNodeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowNodePayload>[]
          }
          create: {
            args: Prisma.WorkflowNodeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowNodePayload>
          }
          createMany: {
            args: Prisma.WorkflowNodeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WorkflowNodeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowNodePayload>[]
          }
          delete: {
            args: Prisma.WorkflowNodeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowNodePayload>
          }
          update: {
            args: Prisma.WorkflowNodeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowNodePayload>
          }
          deleteMany: {
            args: Prisma.WorkflowNodeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WorkflowNodeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.WorkflowNodeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowNodePayload>
          }
          aggregate: {
            args: Prisma.WorkflowNodeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorkflowNode>
          }
          groupBy: {
            args: Prisma.WorkflowNodeGroupByArgs<ExtArgs>
            result: $Utils.Optional<WorkflowNodeGroupByOutputType>[]
          }
          count: {
            args: Prisma.WorkflowNodeCountArgs<ExtArgs>
            result: $Utils.Optional<WorkflowNodeCountAggregateOutputType> | number
          }
        }
      }
      WorkflowEdge: {
        payload: Prisma.$WorkflowEdgePayload<ExtArgs>
        fields: Prisma.WorkflowEdgeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WorkflowEdgeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowEdgePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WorkflowEdgeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowEdgePayload>
          }
          findFirst: {
            args: Prisma.WorkflowEdgeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowEdgePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WorkflowEdgeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowEdgePayload>
          }
          findMany: {
            args: Prisma.WorkflowEdgeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowEdgePayload>[]
          }
          create: {
            args: Prisma.WorkflowEdgeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowEdgePayload>
          }
          createMany: {
            args: Prisma.WorkflowEdgeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WorkflowEdgeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowEdgePayload>[]
          }
          delete: {
            args: Prisma.WorkflowEdgeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowEdgePayload>
          }
          update: {
            args: Prisma.WorkflowEdgeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowEdgePayload>
          }
          deleteMany: {
            args: Prisma.WorkflowEdgeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WorkflowEdgeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.WorkflowEdgeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowEdgePayload>
          }
          aggregate: {
            args: Prisma.WorkflowEdgeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorkflowEdge>
          }
          groupBy: {
            args: Prisma.WorkflowEdgeGroupByArgs<ExtArgs>
            result: $Utils.Optional<WorkflowEdgeGroupByOutputType>[]
          }
          count: {
            args: Prisma.WorkflowEdgeCountArgs<ExtArgs>
            result: $Utils.Optional<WorkflowEdgeCountAggregateOutputType> | number
          }
        }
      }
      ActionCategory: {
        payload: Prisma.$ActionCategoryPayload<ExtArgs>
        fields: Prisma.ActionCategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ActionCategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionCategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ActionCategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionCategoryPayload>
          }
          findFirst: {
            args: Prisma.ActionCategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionCategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ActionCategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionCategoryPayload>
          }
          findMany: {
            args: Prisma.ActionCategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionCategoryPayload>[]
          }
          create: {
            args: Prisma.ActionCategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionCategoryPayload>
          }
          createMany: {
            args: Prisma.ActionCategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ActionCategoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionCategoryPayload>[]
          }
          delete: {
            args: Prisma.ActionCategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionCategoryPayload>
          }
          update: {
            args: Prisma.ActionCategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionCategoryPayload>
          }
          deleteMany: {
            args: Prisma.ActionCategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ActionCategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ActionCategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionCategoryPayload>
          }
          aggregate: {
            args: Prisma.ActionCategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateActionCategory>
          }
          groupBy: {
            args: Prisma.ActionCategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<ActionCategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.ActionCategoryCountArgs<ExtArgs>
            result: $Utils.Optional<ActionCategoryCountAggregateOutputType> | number
          }
        }
      }
      Action: {
        payload: Prisma.$ActionPayload<ExtArgs>
        fields: Prisma.ActionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ActionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ActionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionPayload>
          }
          findFirst: {
            args: Prisma.ActionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ActionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionPayload>
          }
          findMany: {
            args: Prisma.ActionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionPayload>[]
          }
          create: {
            args: Prisma.ActionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionPayload>
          }
          createMany: {
            args: Prisma.ActionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ActionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionPayload>[]
          }
          delete: {
            args: Prisma.ActionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionPayload>
          }
          update: {
            args: Prisma.ActionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionPayload>
          }
          deleteMany: {
            args: Prisma.ActionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ActionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ActionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionPayload>
          }
          aggregate: {
            args: Prisma.ActionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAction>
          }
          groupBy: {
            args: Prisma.ActionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ActionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ActionCountArgs<ExtArgs>
            result: $Utils.Optional<ActionCountAggregateOutputType> | number
          }
        }
      }
      WorkflowField: {
        payload: Prisma.$WorkflowFieldPayload<ExtArgs>
        fields: Prisma.WorkflowFieldFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WorkflowFieldFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowFieldPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WorkflowFieldFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowFieldPayload>
          }
          findFirst: {
            args: Prisma.WorkflowFieldFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowFieldPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WorkflowFieldFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowFieldPayload>
          }
          findMany: {
            args: Prisma.WorkflowFieldFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowFieldPayload>[]
          }
          create: {
            args: Prisma.WorkflowFieldCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowFieldPayload>
          }
          createMany: {
            args: Prisma.WorkflowFieldCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WorkflowFieldCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowFieldPayload>[]
          }
          delete: {
            args: Prisma.WorkflowFieldDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowFieldPayload>
          }
          update: {
            args: Prisma.WorkflowFieldUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowFieldPayload>
          }
          deleteMany: {
            args: Prisma.WorkflowFieldDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WorkflowFieldUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.WorkflowFieldUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowFieldPayload>
          }
          aggregate: {
            args: Prisma.WorkflowFieldAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorkflowField>
          }
          groupBy: {
            args: Prisma.WorkflowFieldGroupByArgs<ExtArgs>
            result: $Utils.Optional<WorkflowFieldGroupByOutputType>[]
          }
          count: {
            args: Prisma.WorkflowFieldCountArgs<ExtArgs>
            result: $Utils.Optional<WorkflowFieldCountAggregateOutputType> | number
          }
        }
      }
      WorkflowRole: {
        payload: Prisma.$WorkflowRolePayload<ExtArgs>
        fields: Prisma.WorkflowRoleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WorkflowRoleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowRolePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WorkflowRoleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowRolePayload>
          }
          findFirst: {
            args: Prisma.WorkflowRoleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowRolePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WorkflowRoleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowRolePayload>
          }
          findMany: {
            args: Prisma.WorkflowRoleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowRolePayload>[]
          }
          create: {
            args: Prisma.WorkflowRoleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowRolePayload>
          }
          createMany: {
            args: Prisma.WorkflowRoleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WorkflowRoleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowRolePayload>[]
          }
          delete: {
            args: Prisma.WorkflowRoleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowRolePayload>
          }
          update: {
            args: Prisma.WorkflowRoleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowRolePayload>
          }
          deleteMany: {
            args: Prisma.WorkflowRoleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WorkflowRoleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.WorkflowRoleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowRolePayload>
          }
          aggregate: {
            args: Prisma.WorkflowRoleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorkflowRole>
          }
          groupBy: {
            args: Prisma.WorkflowRoleGroupByArgs<ExtArgs>
            result: $Utils.Optional<WorkflowRoleGroupByOutputType>[]
          }
          count: {
            args: Prisma.WorkflowRoleCountArgs<ExtArgs>
            result: $Utils.Optional<WorkflowRoleCountAggregateOutputType> | number
          }
        }
      }
      WorkflowRoleAssignment: {
        payload: Prisma.$WorkflowRoleAssignmentPayload<ExtArgs>
        fields: Prisma.WorkflowRoleAssignmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WorkflowRoleAssignmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowRoleAssignmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WorkflowRoleAssignmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowRoleAssignmentPayload>
          }
          findFirst: {
            args: Prisma.WorkflowRoleAssignmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowRoleAssignmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WorkflowRoleAssignmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowRoleAssignmentPayload>
          }
          findMany: {
            args: Prisma.WorkflowRoleAssignmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowRoleAssignmentPayload>[]
          }
          create: {
            args: Prisma.WorkflowRoleAssignmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowRoleAssignmentPayload>
          }
          createMany: {
            args: Prisma.WorkflowRoleAssignmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WorkflowRoleAssignmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowRoleAssignmentPayload>[]
          }
          delete: {
            args: Prisma.WorkflowRoleAssignmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowRoleAssignmentPayload>
          }
          update: {
            args: Prisma.WorkflowRoleAssignmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowRoleAssignmentPayload>
          }
          deleteMany: {
            args: Prisma.WorkflowRoleAssignmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WorkflowRoleAssignmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.WorkflowRoleAssignmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkflowRoleAssignmentPayload>
          }
          aggregate: {
            args: Prisma.WorkflowRoleAssignmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorkflowRoleAssignment>
          }
          groupBy: {
            args: Prisma.WorkflowRoleAssignmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<WorkflowRoleAssignmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.WorkflowRoleAssignmentCountArgs<ExtArgs>
            result: $Utils.Optional<WorkflowRoleAssignmentCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.DriverAdapter | null
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    workflows: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workflows?: boolean | UserCountOutputTypeCountWorkflowsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountWorkflowsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkflowWhereInput
  }


  /**
   * Count Type WorkflowCountOutputType
   */

  export type WorkflowCountOutputType = {
    edges: number
    nodes: number
    fields: number
    roles: number
  }

  export type WorkflowCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    edges?: boolean | WorkflowCountOutputTypeCountEdgesArgs
    nodes?: boolean | WorkflowCountOutputTypeCountNodesArgs
    fields?: boolean | WorkflowCountOutputTypeCountFieldsArgs
    roles?: boolean | WorkflowCountOutputTypeCountRolesArgs
  }

  // Custom InputTypes
  /**
   * WorkflowCountOutputType without action
   */
  export type WorkflowCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowCountOutputType
     */
    select?: WorkflowCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WorkflowCountOutputType without action
   */
  export type WorkflowCountOutputTypeCountEdgesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkflowEdgeWhereInput
  }

  /**
   * WorkflowCountOutputType without action
   */
  export type WorkflowCountOutputTypeCountNodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkflowNodeWhereInput
  }

  /**
   * WorkflowCountOutputType without action
   */
  export type WorkflowCountOutputTypeCountFieldsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkflowFieldWhereInput
  }

  /**
   * WorkflowCountOutputType without action
   */
  export type WorkflowCountOutputTypeCountRolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkflowRoleWhereInput
  }


  /**
   * Count Type WorkflowNodeCountOutputType
   */

  export type WorkflowNodeCountOutputType = {
    outgoing: number
    incoming: number
    fields: number
  }

  export type WorkflowNodeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    outgoing?: boolean | WorkflowNodeCountOutputTypeCountOutgoingArgs
    incoming?: boolean | WorkflowNodeCountOutputTypeCountIncomingArgs
    fields?: boolean | WorkflowNodeCountOutputTypeCountFieldsArgs
  }

  // Custom InputTypes
  /**
   * WorkflowNodeCountOutputType without action
   */
  export type WorkflowNodeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowNodeCountOutputType
     */
    select?: WorkflowNodeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WorkflowNodeCountOutputType without action
   */
  export type WorkflowNodeCountOutputTypeCountOutgoingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkflowEdgeWhereInput
  }

  /**
   * WorkflowNodeCountOutputType without action
   */
  export type WorkflowNodeCountOutputTypeCountIncomingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkflowEdgeWhereInput
  }

  /**
   * WorkflowNodeCountOutputType without action
   */
  export type WorkflowNodeCountOutputTypeCountFieldsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkflowFieldWhereInput
  }


  /**
   * Count Type ActionCategoryCountOutputType
   */

  export type ActionCategoryCountOutputType = {
    actions: number
  }

  export type ActionCategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    actions?: boolean | ActionCategoryCountOutputTypeCountActionsArgs
  }

  // Custom InputTypes
  /**
   * ActionCategoryCountOutputType without action
   */
  export type ActionCategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionCategoryCountOutputType
     */
    select?: ActionCategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ActionCategoryCountOutputType without action
   */
  export type ActionCategoryCountOutputTypeCountActionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActionWhereInput
  }


  /**
   * Count Type ActionCountOutputType
   */

  export type ActionCountOutputType = {
    workflowNodes: number
  }

  export type ActionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workflowNodes?: boolean | ActionCountOutputTypeCountWorkflowNodesArgs
  }

  // Custom InputTypes
  /**
   * ActionCountOutputType without action
   */
  export type ActionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionCountOutputType
     */
    select?: ActionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ActionCountOutputType without action
   */
  export type ActionCountOutputTypeCountWorkflowNodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkflowNodeWhereInput
  }


  /**
   * Count Type WorkflowRoleCountOutputType
   */

  export type WorkflowRoleCountOutputType = {
    assignments: number
  }

  export type WorkflowRoleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assignments?: boolean | WorkflowRoleCountOutputTypeCountAssignmentsArgs
  }

  // Custom InputTypes
  /**
   * WorkflowRoleCountOutputType without action
   */
  export type WorkflowRoleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowRoleCountOutputType
     */
    select?: WorkflowRoleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WorkflowRoleCountOutputType without action
   */
  export type WorkflowRoleCountOutputTypeCountAssignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkflowRoleAssignmentWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workflows?: boolean | User$workflowsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workflows?: boolean | User$workflowsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      workflows: Prisma.$WorkflowPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    workflows<T extends User$workflowsArgs<ExtArgs> = {}>(args?: Subset<T, User$workflowsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data?: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.workflows
   */
  export type User$workflowsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workflow
     */
    select?: WorkflowSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowInclude<ExtArgs> | null
    where?: WorkflowWhereInput
    orderBy?: WorkflowOrderByWithRelationInput | WorkflowOrderByWithRelationInput[]
    cursor?: WorkflowWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WorkflowScalarFieldEnum | WorkflowScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Workflow
   */

  export type AggregateWorkflow = {
    _count: WorkflowCountAggregateOutputType | null
    _min: WorkflowMinAggregateOutputType | null
    _max: WorkflowMaxAggregateOutputType | null
  }

  export type WorkflowMinAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
    isDeleted: boolean | null
    isPublished: boolean | null
    publishedWorkflowId: string | null
    publishedAt: Date | null
    lastPublishedAt: Date | null
  }

  export type WorkflowMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
    isDeleted: boolean | null
    isPublished: boolean | null
    publishedWorkflowId: string | null
    publishedAt: Date | null
    lastPublishedAt: Date | null
  }

  export type WorkflowCountAggregateOutputType = {
    id: number
    userId: number
    name: number
    createdAt: number
    updatedAt: number
    isDeleted: number
    isPublished: number
    publishedWorkflowId: number
    publishedAt: number
    lastPublishedAt: number
    _all: number
  }


  export type WorkflowMinAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    isDeleted?: true
    isPublished?: true
    publishedWorkflowId?: true
    publishedAt?: true
    lastPublishedAt?: true
  }

  export type WorkflowMaxAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    isDeleted?: true
    isPublished?: true
    publishedWorkflowId?: true
    publishedAt?: true
    lastPublishedAt?: true
  }

  export type WorkflowCountAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    isDeleted?: true
    isPublished?: true
    publishedWorkflowId?: true
    publishedAt?: true
    lastPublishedAt?: true
    _all?: true
  }

  export type WorkflowAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Workflow to aggregate.
     */
    where?: WorkflowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workflows to fetch.
     */
    orderBy?: WorkflowOrderByWithRelationInput | WorkflowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WorkflowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workflows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workflows.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Workflows
    **/
    _count?: true | WorkflowCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WorkflowMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WorkflowMaxAggregateInputType
  }

  export type GetWorkflowAggregateType<T extends WorkflowAggregateArgs> = {
        [P in keyof T & keyof AggregateWorkflow]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorkflow[P]>
      : GetScalarType<T[P], AggregateWorkflow[P]>
  }




  export type WorkflowGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkflowWhereInput
    orderBy?: WorkflowOrderByWithAggregationInput | WorkflowOrderByWithAggregationInput[]
    by: WorkflowScalarFieldEnum[] | WorkflowScalarFieldEnum
    having?: WorkflowScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WorkflowCountAggregateInputType | true
    _min?: WorkflowMinAggregateInputType
    _max?: WorkflowMaxAggregateInputType
  }

  export type WorkflowGroupByOutputType = {
    id: string
    userId: string
    name: string
    createdAt: Date
    updatedAt: Date
    isDeleted: boolean
    isPublished: boolean
    publishedWorkflowId: string | null
    publishedAt: Date | null
    lastPublishedAt: Date | null
    _count: WorkflowCountAggregateOutputType | null
    _min: WorkflowMinAggregateOutputType | null
    _max: WorkflowMaxAggregateOutputType | null
  }

  type GetWorkflowGroupByPayload<T extends WorkflowGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WorkflowGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WorkflowGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorkflowGroupByOutputType[P]>
            : GetScalarType<T[P], WorkflowGroupByOutputType[P]>
        }
      >
    >


  export type WorkflowSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isDeleted?: boolean
    isPublished?: boolean
    publishedWorkflowId?: boolean
    publishedAt?: boolean
    lastPublishedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    edges?: boolean | Workflow$edgesArgs<ExtArgs>
    nodes?: boolean | Workflow$nodesArgs<ExtArgs>
    fields?: boolean | Workflow$fieldsArgs<ExtArgs>
    roles?: boolean | Workflow$rolesArgs<ExtArgs>
    _count?: boolean | WorkflowCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workflow"]>

  export type WorkflowSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isDeleted?: boolean
    isPublished?: boolean
    publishedWorkflowId?: boolean
    publishedAt?: boolean
    lastPublishedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workflow"]>

  export type WorkflowSelectScalar = {
    id?: boolean
    userId?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isDeleted?: boolean
    isPublished?: boolean
    publishedWorkflowId?: boolean
    publishedAt?: boolean
    lastPublishedAt?: boolean
  }

  export type WorkflowInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    edges?: boolean | Workflow$edgesArgs<ExtArgs>
    nodes?: boolean | Workflow$nodesArgs<ExtArgs>
    fields?: boolean | Workflow$fieldsArgs<ExtArgs>
    roles?: boolean | Workflow$rolesArgs<ExtArgs>
    _count?: boolean | WorkflowCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WorkflowIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $WorkflowPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Workflow"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      edges: Prisma.$WorkflowEdgePayload<ExtArgs>[]
      nodes: Prisma.$WorkflowNodePayload<ExtArgs>[]
      fields: Prisma.$WorkflowFieldPayload<ExtArgs>[]
      roles: Prisma.$WorkflowRolePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      name: string
      createdAt: Date
      updatedAt: Date
      isDeleted: boolean
      isPublished: boolean
      publishedWorkflowId: string | null
      publishedAt: Date | null
      lastPublishedAt: Date | null
    }, ExtArgs["result"]["workflow"]>
    composites: {}
  }

  type WorkflowGetPayload<S extends boolean | null | undefined | WorkflowDefaultArgs> = $Result.GetResult<Prisma.$WorkflowPayload, S>

  type WorkflowCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<WorkflowFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: WorkflowCountAggregateInputType | true
    }

  export interface WorkflowDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Workflow'], meta: { name: 'Workflow' } }
    /**
     * Find zero or one Workflow that matches the filter.
     * @param {WorkflowFindUniqueArgs} args - Arguments to find a Workflow
     * @example
     * // Get one Workflow
     * const workflow = await prisma.workflow.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkflowFindUniqueArgs>(args: SelectSubset<T, WorkflowFindUniqueArgs<ExtArgs>>): Prisma__WorkflowClient<$Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Workflow that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {WorkflowFindUniqueOrThrowArgs} args - Arguments to find a Workflow
     * @example
     * // Get one Workflow
     * const workflow = await prisma.workflow.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkflowFindUniqueOrThrowArgs>(args: SelectSubset<T, WorkflowFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WorkflowClient<$Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Workflow that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowFindFirstArgs} args - Arguments to find a Workflow
     * @example
     * // Get one Workflow
     * const workflow = await prisma.workflow.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkflowFindFirstArgs>(args?: SelectSubset<T, WorkflowFindFirstArgs<ExtArgs>>): Prisma__WorkflowClient<$Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Workflow that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowFindFirstOrThrowArgs} args - Arguments to find a Workflow
     * @example
     * // Get one Workflow
     * const workflow = await prisma.workflow.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkflowFindFirstOrThrowArgs>(args?: SelectSubset<T, WorkflowFindFirstOrThrowArgs<ExtArgs>>): Prisma__WorkflowClient<$Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Workflows that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Workflows
     * const workflows = await prisma.workflow.findMany()
     * 
     * // Get first 10 Workflows
     * const workflows = await prisma.workflow.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const workflowWithIdOnly = await prisma.workflow.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WorkflowFindManyArgs>(args?: SelectSubset<T, WorkflowFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Workflow.
     * @param {WorkflowCreateArgs} args - Arguments to create a Workflow.
     * @example
     * // Create one Workflow
     * const Workflow = await prisma.workflow.create({
     *   data: {
     *     // ... data to create a Workflow
     *   }
     * })
     * 
     */
    create<T extends WorkflowCreateArgs>(args: SelectSubset<T, WorkflowCreateArgs<ExtArgs>>): Prisma__WorkflowClient<$Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Workflows.
     * @param {WorkflowCreateManyArgs} args - Arguments to create many Workflows.
     * @example
     * // Create many Workflows
     * const workflow = await prisma.workflow.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WorkflowCreateManyArgs>(args?: SelectSubset<T, WorkflowCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Workflows and returns the data saved in the database.
     * @param {WorkflowCreateManyAndReturnArgs} args - Arguments to create many Workflows.
     * @example
     * // Create many Workflows
     * const workflow = await prisma.workflow.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Workflows and only return the `id`
     * const workflowWithIdOnly = await prisma.workflow.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WorkflowCreateManyAndReturnArgs>(args?: SelectSubset<T, WorkflowCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Workflow.
     * @param {WorkflowDeleteArgs} args - Arguments to delete one Workflow.
     * @example
     * // Delete one Workflow
     * const Workflow = await prisma.workflow.delete({
     *   where: {
     *     // ... filter to delete one Workflow
     *   }
     * })
     * 
     */
    delete<T extends WorkflowDeleteArgs>(args: SelectSubset<T, WorkflowDeleteArgs<ExtArgs>>): Prisma__WorkflowClient<$Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Workflow.
     * @param {WorkflowUpdateArgs} args - Arguments to update one Workflow.
     * @example
     * // Update one Workflow
     * const workflow = await prisma.workflow.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WorkflowUpdateArgs>(args: SelectSubset<T, WorkflowUpdateArgs<ExtArgs>>): Prisma__WorkflowClient<$Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Workflows.
     * @param {WorkflowDeleteManyArgs} args - Arguments to filter Workflows to delete.
     * @example
     * // Delete a few Workflows
     * const { count } = await prisma.workflow.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WorkflowDeleteManyArgs>(args?: SelectSubset<T, WorkflowDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Workflows.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Workflows
     * const workflow = await prisma.workflow.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WorkflowUpdateManyArgs>(args: SelectSubset<T, WorkflowUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Workflow.
     * @param {WorkflowUpsertArgs} args - Arguments to update or create a Workflow.
     * @example
     * // Update or create a Workflow
     * const workflow = await prisma.workflow.upsert({
     *   create: {
     *     // ... data to create a Workflow
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Workflow we want to update
     *   }
     * })
     */
    upsert<T extends WorkflowUpsertArgs>(args: SelectSubset<T, WorkflowUpsertArgs<ExtArgs>>): Prisma__WorkflowClient<$Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Workflows.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowCountArgs} args - Arguments to filter Workflows to count.
     * @example
     * // Count the number of Workflows
     * const count = await prisma.workflow.count({
     *   where: {
     *     // ... the filter for the Workflows we want to count
     *   }
     * })
    **/
    count<T extends WorkflowCountArgs>(
      args?: Subset<T, WorkflowCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorkflowCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Workflow.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WorkflowAggregateArgs>(args: Subset<T, WorkflowAggregateArgs>): Prisma.PrismaPromise<GetWorkflowAggregateType<T>>

    /**
     * Group by Workflow.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WorkflowGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WorkflowGroupByArgs['orderBy'] }
        : { orderBy?: WorkflowGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WorkflowGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkflowGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Workflow model
   */
  readonly fields: WorkflowFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Workflow.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorkflowClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    edges<T extends Workflow$edgesArgs<ExtArgs> = {}>(args?: Subset<T, Workflow$edgesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkflowEdgePayload<ExtArgs>, T, "findMany"> | Null>
    nodes<T extends Workflow$nodesArgs<ExtArgs> = {}>(args?: Subset<T, Workflow$nodesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkflowNodePayload<ExtArgs>, T, "findMany"> | Null>
    fields<T extends Workflow$fieldsArgs<ExtArgs> = {}>(args?: Subset<T, Workflow$fieldsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkflowFieldPayload<ExtArgs>, T, "findMany"> | Null>
    roles<T extends Workflow$rolesArgs<ExtArgs> = {}>(args?: Subset<T, Workflow$rolesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkflowRolePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Workflow model
   */ 
  interface WorkflowFieldRefs {
    readonly id: FieldRef<"Workflow", 'String'>
    readonly userId: FieldRef<"Workflow", 'String'>
    readonly name: FieldRef<"Workflow", 'String'>
    readonly createdAt: FieldRef<"Workflow", 'DateTime'>
    readonly updatedAt: FieldRef<"Workflow", 'DateTime'>
    readonly isDeleted: FieldRef<"Workflow", 'Boolean'>
    readonly isPublished: FieldRef<"Workflow", 'Boolean'>
    readonly publishedWorkflowId: FieldRef<"Workflow", 'String'>
    readonly publishedAt: FieldRef<"Workflow", 'DateTime'>
    readonly lastPublishedAt: FieldRef<"Workflow", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Workflow findUnique
   */
  export type WorkflowFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workflow
     */
    select?: WorkflowSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowInclude<ExtArgs> | null
    /**
     * Filter, which Workflow to fetch.
     */
    where: WorkflowWhereUniqueInput
  }

  /**
   * Workflow findUniqueOrThrow
   */
  export type WorkflowFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workflow
     */
    select?: WorkflowSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowInclude<ExtArgs> | null
    /**
     * Filter, which Workflow to fetch.
     */
    where: WorkflowWhereUniqueInput
  }

  /**
   * Workflow findFirst
   */
  export type WorkflowFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workflow
     */
    select?: WorkflowSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowInclude<ExtArgs> | null
    /**
     * Filter, which Workflow to fetch.
     */
    where?: WorkflowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workflows to fetch.
     */
    orderBy?: WorkflowOrderByWithRelationInput | WorkflowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Workflows.
     */
    cursor?: WorkflowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workflows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workflows.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Workflows.
     */
    distinct?: WorkflowScalarFieldEnum | WorkflowScalarFieldEnum[]
  }

  /**
   * Workflow findFirstOrThrow
   */
  export type WorkflowFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workflow
     */
    select?: WorkflowSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowInclude<ExtArgs> | null
    /**
     * Filter, which Workflow to fetch.
     */
    where?: WorkflowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workflows to fetch.
     */
    orderBy?: WorkflowOrderByWithRelationInput | WorkflowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Workflows.
     */
    cursor?: WorkflowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workflows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workflows.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Workflows.
     */
    distinct?: WorkflowScalarFieldEnum | WorkflowScalarFieldEnum[]
  }

  /**
   * Workflow findMany
   */
  export type WorkflowFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workflow
     */
    select?: WorkflowSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowInclude<ExtArgs> | null
    /**
     * Filter, which Workflows to fetch.
     */
    where?: WorkflowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workflows to fetch.
     */
    orderBy?: WorkflowOrderByWithRelationInput | WorkflowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Workflows.
     */
    cursor?: WorkflowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workflows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workflows.
     */
    skip?: number
    distinct?: WorkflowScalarFieldEnum | WorkflowScalarFieldEnum[]
  }

  /**
   * Workflow create
   */
  export type WorkflowCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workflow
     */
    select?: WorkflowSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowInclude<ExtArgs> | null
    /**
     * The data needed to create a Workflow.
     */
    data: XOR<WorkflowCreateInput, WorkflowUncheckedCreateInput>
  }

  /**
   * Workflow createMany
   */
  export type WorkflowCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Workflows.
     */
    data: WorkflowCreateManyInput | WorkflowCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Workflow createManyAndReturn
   */
  export type WorkflowCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workflow
     */
    select?: WorkflowSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Workflows.
     */
    data: WorkflowCreateManyInput | WorkflowCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Workflow update
   */
  export type WorkflowUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workflow
     */
    select?: WorkflowSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowInclude<ExtArgs> | null
    /**
     * The data needed to update a Workflow.
     */
    data: XOR<WorkflowUpdateInput, WorkflowUncheckedUpdateInput>
    /**
     * Choose, which Workflow to update.
     */
    where: WorkflowWhereUniqueInput
  }

  /**
   * Workflow updateMany
   */
  export type WorkflowUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Workflows.
     */
    data: XOR<WorkflowUpdateManyMutationInput, WorkflowUncheckedUpdateManyInput>
    /**
     * Filter which Workflows to update
     */
    where?: WorkflowWhereInput
  }

  /**
   * Workflow upsert
   */
  export type WorkflowUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workflow
     */
    select?: WorkflowSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowInclude<ExtArgs> | null
    /**
     * The filter to search for the Workflow to update in case it exists.
     */
    where: WorkflowWhereUniqueInput
    /**
     * In case the Workflow found by the `where` argument doesn't exist, create a new Workflow with this data.
     */
    create: XOR<WorkflowCreateInput, WorkflowUncheckedCreateInput>
    /**
     * In case the Workflow was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorkflowUpdateInput, WorkflowUncheckedUpdateInput>
  }

  /**
   * Workflow delete
   */
  export type WorkflowDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workflow
     */
    select?: WorkflowSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowInclude<ExtArgs> | null
    /**
     * Filter which Workflow to delete.
     */
    where: WorkflowWhereUniqueInput
  }

  /**
   * Workflow deleteMany
   */
  export type WorkflowDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Workflows to delete
     */
    where?: WorkflowWhereInput
  }

  /**
   * Workflow.edges
   */
  export type Workflow$edgesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowEdge
     */
    select?: WorkflowEdgeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowEdgeInclude<ExtArgs> | null
    where?: WorkflowEdgeWhereInput
    orderBy?: WorkflowEdgeOrderByWithRelationInput | WorkflowEdgeOrderByWithRelationInput[]
    cursor?: WorkflowEdgeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WorkflowEdgeScalarFieldEnum | WorkflowEdgeScalarFieldEnum[]
  }

  /**
   * Workflow.nodes
   */
  export type Workflow$nodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowNode
     */
    select?: WorkflowNodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowNodeInclude<ExtArgs> | null
    where?: WorkflowNodeWhereInput
    orderBy?: WorkflowNodeOrderByWithRelationInput | WorkflowNodeOrderByWithRelationInput[]
    cursor?: WorkflowNodeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WorkflowNodeScalarFieldEnum | WorkflowNodeScalarFieldEnum[]
  }

  /**
   * Workflow.fields
   */
  export type Workflow$fieldsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowField
     */
    select?: WorkflowFieldSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowFieldInclude<ExtArgs> | null
    where?: WorkflowFieldWhereInput
    orderBy?: WorkflowFieldOrderByWithRelationInput | WorkflowFieldOrderByWithRelationInput[]
    cursor?: WorkflowFieldWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WorkflowFieldScalarFieldEnum | WorkflowFieldScalarFieldEnum[]
  }

  /**
   * Workflow.roles
   */
  export type Workflow$rolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowRole
     */
    select?: WorkflowRoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowRoleInclude<ExtArgs> | null
    where?: WorkflowRoleWhereInput
    orderBy?: WorkflowRoleOrderByWithRelationInput | WorkflowRoleOrderByWithRelationInput[]
    cursor?: WorkflowRoleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WorkflowRoleScalarFieldEnum | WorkflowRoleScalarFieldEnum[]
  }

  /**
   * Workflow without action
   */
  export type WorkflowDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workflow
     */
    select?: WorkflowSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowInclude<ExtArgs> | null
  }


  /**
   * Model WorkflowNode
   */

  export type AggregateWorkflowNode = {
    _count: WorkflowNodeCountAggregateOutputType | null
    _avg: WorkflowNodeAvgAggregateOutputType | null
    _sum: WorkflowNodeSumAggregateOutputType | null
    _min: WorkflowNodeMinAggregateOutputType | null
    _max: WorkflowNodeMaxAggregateOutputType | null
  }

  export type WorkflowNodeAvgAggregateOutputType = {
    positionX: number | null
    positionY: number | null
  }

  export type WorkflowNodeSumAggregateOutputType = {
    positionX: number | null
    positionY: number | null
  }

  export type WorkflowNodeMinAggregateOutputType = {
    id: string | null
    workflowId: string | null
    positionX: number | null
    positionY: number | null
    actionId: string | null
    isDeleted: boolean | null
  }

  export type WorkflowNodeMaxAggregateOutputType = {
    id: string | null
    workflowId: string | null
    positionX: number | null
    positionY: number | null
    actionId: string | null
    isDeleted: boolean | null
  }

  export type WorkflowNodeCountAggregateOutputType = {
    id: number
    workflowId: number
    config: number
    positionX: number
    positionY: number
    actionId: number
    isDeleted: number
    _all: number
  }


  export type WorkflowNodeAvgAggregateInputType = {
    positionX?: true
    positionY?: true
  }

  export type WorkflowNodeSumAggregateInputType = {
    positionX?: true
    positionY?: true
  }

  export type WorkflowNodeMinAggregateInputType = {
    id?: true
    workflowId?: true
    positionX?: true
    positionY?: true
    actionId?: true
    isDeleted?: true
  }

  export type WorkflowNodeMaxAggregateInputType = {
    id?: true
    workflowId?: true
    positionX?: true
    positionY?: true
    actionId?: true
    isDeleted?: true
  }

  export type WorkflowNodeCountAggregateInputType = {
    id?: true
    workflowId?: true
    config?: true
    positionX?: true
    positionY?: true
    actionId?: true
    isDeleted?: true
    _all?: true
  }

  export type WorkflowNodeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkflowNode to aggregate.
     */
    where?: WorkflowNodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkflowNodes to fetch.
     */
    orderBy?: WorkflowNodeOrderByWithRelationInput | WorkflowNodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WorkflowNodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkflowNodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkflowNodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WorkflowNodes
    **/
    _count?: true | WorkflowNodeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WorkflowNodeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WorkflowNodeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WorkflowNodeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WorkflowNodeMaxAggregateInputType
  }

  export type GetWorkflowNodeAggregateType<T extends WorkflowNodeAggregateArgs> = {
        [P in keyof T & keyof AggregateWorkflowNode]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorkflowNode[P]>
      : GetScalarType<T[P], AggregateWorkflowNode[P]>
  }




  export type WorkflowNodeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkflowNodeWhereInput
    orderBy?: WorkflowNodeOrderByWithAggregationInput | WorkflowNodeOrderByWithAggregationInput[]
    by: WorkflowNodeScalarFieldEnum[] | WorkflowNodeScalarFieldEnum
    having?: WorkflowNodeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WorkflowNodeCountAggregateInputType | true
    _avg?: WorkflowNodeAvgAggregateInputType
    _sum?: WorkflowNodeSumAggregateInputType
    _min?: WorkflowNodeMinAggregateInputType
    _max?: WorkflowNodeMaxAggregateInputType
  }

  export type WorkflowNodeGroupByOutputType = {
    id: string
    workflowId: string
    config: JsonValue
    positionX: number
    positionY: number
    actionId: string
    isDeleted: boolean
    _count: WorkflowNodeCountAggregateOutputType | null
    _avg: WorkflowNodeAvgAggregateOutputType | null
    _sum: WorkflowNodeSumAggregateOutputType | null
    _min: WorkflowNodeMinAggregateOutputType | null
    _max: WorkflowNodeMaxAggregateOutputType | null
  }

  type GetWorkflowNodeGroupByPayload<T extends WorkflowNodeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WorkflowNodeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WorkflowNodeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorkflowNodeGroupByOutputType[P]>
            : GetScalarType<T[P], WorkflowNodeGroupByOutputType[P]>
        }
      >
    >


  export type WorkflowNodeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workflowId?: boolean
    config?: boolean
    positionX?: boolean
    positionY?: boolean
    actionId?: boolean
    isDeleted?: boolean
    outgoing?: boolean | WorkflowNode$outgoingArgs<ExtArgs>
    incoming?: boolean | WorkflowNode$incomingArgs<ExtArgs>
    fields?: boolean | WorkflowNode$fieldsArgs<ExtArgs>
    action?: boolean | ActionDefaultArgs<ExtArgs>
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
    _count?: boolean | WorkflowNodeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workflowNode"]>

  export type WorkflowNodeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workflowId?: boolean
    config?: boolean
    positionX?: boolean
    positionY?: boolean
    actionId?: boolean
    isDeleted?: boolean
    action?: boolean | ActionDefaultArgs<ExtArgs>
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workflowNode"]>

  export type WorkflowNodeSelectScalar = {
    id?: boolean
    workflowId?: boolean
    config?: boolean
    positionX?: boolean
    positionY?: boolean
    actionId?: boolean
    isDeleted?: boolean
  }

  export type WorkflowNodeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    outgoing?: boolean | WorkflowNode$outgoingArgs<ExtArgs>
    incoming?: boolean | WorkflowNode$incomingArgs<ExtArgs>
    fields?: boolean | WorkflowNode$fieldsArgs<ExtArgs>
    action?: boolean | ActionDefaultArgs<ExtArgs>
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
    _count?: boolean | WorkflowNodeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WorkflowNodeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    action?: boolean | ActionDefaultArgs<ExtArgs>
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
  }

  export type $WorkflowNodePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WorkflowNode"
    objects: {
      outgoing: Prisma.$WorkflowEdgePayload<ExtArgs>[]
      incoming: Prisma.$WorkflowEdgePayload<ExtArgs>[]
      fields: Prisma.$WorkflowFieldPayload<ExtArgs>[]
      action: Prisma.$ActionPayload<ExtArgs>
      workflow: Prisma.$WorkflowPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      workflowId: string
      config: Prisma.JsonValue
      positionX: number
      positionY: number
      actionId: string
      isDeleted: boolean
    }, ExtArgs["result"]["workflowNode"]>
    composites: {}
  }

  type WorkflowNodeGetPayload<S extends boolean | null | undefined | WorkflowNodeDefaultArgs> = $Result.GetResult<Prisma.$WorkflowNodePayload, S>

  type WorkflowNodeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<WorkflowNodeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: WorkflowNodeCountAggregateInputType | true
    }

  export interface WorkflowNodeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WorkflowNode'], meta: { name: 'WorkflowNode' } }
    /**
     * Find zero or one WorkflowNode that matches the filter.
     * @param {WorkflowNodeFindUniqueArgs} args - Arguments to find a WorkflowNode
     * @example
     * // Get one WorkflowNode
     * const workflowNode = await prisma.workflowNode.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkflowNodeFindUniqueArgs>(args: SelectSubset<T, WorkflowNodeFindUniqueArgs<ExtArgs>>): Prisma__WorkflowNodeClient<$Result.GetResult<Prisma.$WorkflowNodePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one WorkflowNode that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {WorkflowNodeFindUniqueOrThrowArgs} args - Arguments to find a WorkflowNode
     * @example
     * // Get one WorkflowNode
     * const workflowNode = await prisma.workflowNode.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkflowNodeFindUniqueOrThrowArgs>(args: SelectSubset<T, WorkflowNodeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WorkflowNodeClient<$Result.GetResult<Prisma.$WorkflowNodePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first WorkflowNode that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowNodeFindFirstArgs} args - Arguments to find a WorkflowNode
     * @example
     * // Get one WorkflowNode
     * const workflowNode = await prisma.workflowNode.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkflowNodeFindFirstArgs>(args?: SelectSubset<T, WorkflowNodeFindFirstArgs<ExtArgs>>): Prisma__WorkflowNodeClient<$Result.GetResult<Prisma.$WorkflowNodePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first WorkflowNode that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowNodeFindFirstOrThrowArgs} args - Arguments to find a WorkflowNode
     * @example
     * // Get one WorkflowNode
     * const workflowNode = await prisma.workflowNode.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkflowNodeFindFirstOrThrowArgs>(args?: SelectSubset<T, WorkflowNodeFindFirstOrThrowArgs<ExtArgs>>): Prisma__WorkflowNodeClient<$Result.GetResult<Prisma.$WorkflowNodePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more WorkflowNodes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowNodeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WorkflowNodes
     * const workflowNodes = await prisma.workflowNode.findMany()
     * 
     * // Get first 10 WorkflowNodes
     * const workflowNodes = await prisma.workflowNode.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const workflowNodeWithIdOnly = await prisma.workflowNode.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WorkflowNodeFindManyArgs>(args?: SelectSubset<T, WorkflowNodeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkflowNodePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a WorkflowNode.
     * @param {WorkflowNodeCreateArgs} args - Arguments to create a WorkflowNode.
     * @example
     * // Create one WorkflowNode
     * const WorkflowNode = await prisma.workflowNode.create({
     *   data: {
     *     // ... data to create a WorkflowNode
     *   }
     * })
     * 
     */
    create<T extends WorkflowNodeCreateArgs>(args: SelectSubset<T, WorkflowNodeCreateArgs<ExtArgs>>): Prisma__WorkflowNodeClient<$Result.GetResult<Prisma.$WorkflowNodePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many WorkflowNodes.
     * @param {WorkflowNodeCreateManyArgs} args - Arguments to create many WorkflowNodes.
     * @example
     * // Create many WorkflowNodes
     * const workflowNode = await prisma.workflowNode.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WorkflowNodeCreateManyArgs>(args?: SelectSubset<T, WorkflowNodeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WorkflowNodes and returns the data saved in the database.
     * @param {WorkflowNodeCreateManyAndReturnArgs} args - Arguments to create many WorkflowNodes.
     * @example
     * // Create many WorkflowNodes
     * const workflowNode = await prisma.workflowNode.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WorkflowNodes and only return the `id`
     * const workflowNodeWithIdOnly = await prisma.workflowNode.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WorkflowNodeCreateManyAndReturnArgs>(args?: SelectSubset<T, WorkflowNodeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkflowNodePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a WorkflowNode.
     * @param {WorkflowNodeDeleteArgs} args - Arguments to delete one WorkflowNode.
     * @example
     * // Delete one WorkflowNode
     * const WorkflowNode = await prisma.workflowNode.delete({
     *   where: {
     *     // ... filter to delete one WorkflowNode
     *   }
     * })
     * 
     */
    delete<T extends WorkflowNodeDeleteArgs>(args: SelectSubset<T, WorkflowNodeDeleteArgs<ExtArgs>>): Prisma__WorkflowNodeClient<$Result.GetResult<Prisma.$WorkflowNodePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one WorkflowNode.
     * @param {WorkflowNodeUpdateArgs} args - Arguments to update one WorkflowNode.
     * @example
     * // Update one WorkflowNode
     * const workflowNode = await prisma.workflowNode.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WorkflowNodeUpdateArgs>(args: SelectSubset<T, WorkflowNodeUpdateArgs<ExtArgs>>): Prisma__WorkflowNodeClient<$Result.GetResult<Prisma.$WorkflowNodePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more WorkflowNodes.
     * @param {WorkflowNodeDeleteManyArgs} args - Arguments to filter WorkflowNodes to delete.
     * @example
     * // Delete a few WorkflowNodes
     * const { count } = await prisma.workflowNode.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WorkflowNodeDeleteManyArgs>(args?: SelectSubset<T, WorkflowNodeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WorkflowNodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowNodeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WorkflowNodes
     * const workflowNode = await prisma.workflowNode.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WorkflowNodeUpdateManyArgs>(args: SelectSubset<T, WorkflowNodeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one WorkflowNode.
     * @param {WorkflowNodeUpsertArgs} args - Arguments to update or create a WorkflowNode.
     * @example
     * // Update or create a WorkflowNode
     * const workflowNode = await prisma.workflowNode.upsert({
     *   create: {
     *     // ... data to create a WorkflowNode
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WorkflowNode we want to update
     *   }
     * })
     */
    upsert<T extends WorkflowNodeUpsertArgs>(args: SelectSubset<T, WorkflowNodeUpsertArgs<ExtArgs>>): Prisma__WorkflowNodeClient<$Result.GetResult<Prisma.$WorkflowNodePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of WorkflowNodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowNodeCountArgs} args - Arguments to filter WorkflowNodes to count.
     * @example
     * // Count the number of WorkflowNodes
     * const count = await prisma.workflowNode.count({
     *   where: {
     *     // ... the filter for the WorkflowNodes we want to count
     *   }
     * })
    **/
    count<T extends WorkflowNodeCountArgs>(
      args?: Subset<T, WorkflowNodeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorkflowNodeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WorkflowNode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowNodeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WorkflowNodeAggregateArgs>(args: Subset<T, WorkflowNodeAggregateArgs>): Prisma.PrismaPromise<GetWorkflowNodeAggregateType<T>>

    /**
     * Group by WorkflowNode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowNodeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WorkflowNodeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WorkflowNodeGroupByArgs['orderBy'] }
        : { orderBy?: WorkflowNodeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WorkflowNodeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkflowNodeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WorkflowNode model
   */
  readonly fields: WorkflowNodeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WorkflowNode.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorkflowNodeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    outgoing<T extends WorkflowNode$outgoingArgs<ExtArgs> = {}>(args?: Subset<T, WorkflowNode$outgoingArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkflowEdgePayload<ExtArgs>, T, "findMany"> | Null>
    incoming<T extends WorkflowNode$incomingArgs<ExtArgs> = {}>(args?: Subset<T, WorkflowNode$incomingArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkflowEdgePayload<ExtArgs>, T, "findMany"> | Null>
    fields<T extends WorkflowNode$fieldsArgs<ExtArgs> = {}>(args?: Subset<T, WorkflowNode$fieldsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkflowFieldPayload<ExtArgs>, T, "findMany"> | Null>
    action<T extends ActionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ActionDefaultArgs<ExtArgs>>): Prisma__ActionClient<$Result.GetResult<Prisma.$ActionPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    workflow<T extends WorkflowDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkflowDefaultArgs<ExtArgs>>): Prisma__WorkflowClient<$Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WorkflowNode model
   */ 
  interface WorkflowNodeFieldRefs {
    readonly id: FieldRef<"WorkflowNode", 'String'>
    readonly workflowId: FieldRef<"WorkflowNode", 'String'>
    readonly config: FieldRef<"WorkflowNode", 'Json'>
    readonly positionX: FieldRef<"WorkflowNode", 'Float'>
    readonly positionY: FieldRef<"WorkflowNode", 'Float'>
    readonly actionId: FieldRef<"WorkflowNode", 'String'>
    readonly isDeleted: FieldRef<"WorkflowNode", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * WorkflowNode findUnique
   */
  export type WorkflowNodeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowNode
     */
    select?: WorkflowNodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowNodeInclude<ExtArgs> | null
    /**
     * Filter, which WorkflowNode to fetch.
     */
    where: WorkflowNodeWhereUniqueInput
  }

  /**
   * WorkflowNode findUniqueOrThrow
   */
  export type WorkflowNodeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowNode
     */
    select?: WorkflowNodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowNodeInclude<ExtArgs> | null
    /**
     * Filter, which WorkflowNode to fetch.
     */
    where: WorkflowNodeWhereUniqueInput
  }

  /**
   * WorkflowNode findFirst
   */
  export type WorkflowNodeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowNode
     */
    select?: WorkflowNodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowNodeInclude<ExtArgs> | null
    /**
     * Filter, which WorkflowNode to fetch.
     */
    where?: WorkflowNodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkflowNodes to fetch.
     */
    orderBy?: WorkflowNodeOrderByWithRelationInput | WorkflowNodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkflowNodes.
     */
    cursor?: WorkflowNodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkflowNodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkflowNodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkflowNodes.
     */
    distinct?: WorkflowNodeScalarFieldEnum | WorkflowNodeScalarFieldEnum[]
  }

  /**
   * WorkflowNode findFirstOrThrow
   */
  export type WorkflowNodeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowNode
     */
    select?: WorkflowNodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowNodeInclude<ExtArgs> | null
    /**
     * Filter, which WorkflowNode to fetch.
     */
    where?: WorkflowNodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkflowNodes to fetch.
     */
    orderBy?: WorkflowNodeOrderByWithRelationInput | WorkflowNodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkflowNodes.
     */
    cursor?: WorkflowNodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkflowNodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkflowNodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkflowNodes.
     */
    distinct?: WorkflowNodeScalarFieldEnum | WorkflowNodeScalarFieldEnum[]
  }

  /**
   * WorkflowNode findMany
   */
  export type WorkflowNodeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowNode
     */
    select?: WorkflowNodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowNodeInclude<ExtArgs> | null
    /**
     * Filter, which WorkflowNodes to fetch.
     */
    where?: WorkflowNodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkflowNodes to fetch.
     */
    orderBy?: WorkflowNodeOrderByWithRelationInput | WorkflowNodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WorkflowNodes.
     */
    cursor?: WorkflowNodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkflowNodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkflowNodes.
     */
    skip?: number
    distinct?: WorkflowNodeScalarFieldEnum | WorkflowNodeScalarFieldEnum[]
  }

  /**
   * WorkflowNode create
   */
  export type WorkflowNodeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowNode
     */
    select?: WorkflowNodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowNodeInclude<ExtArgs> | null
    /**
     * The data needed to create a WorkflowNode.
     */
    data: XOR<WorkflowNodeCreateInput, WorkflowNodeUncheckedCreateInput>
  }

  /**
   * WorkflowNode createMany
   */
  export type WorkflowNodeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WorkflowNodes.
     */
    data: WorkflowNodeCreateManyInput | WorkflowNodeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WorkflowNode createManyAndReturn
   */
  export type WorkflowNodeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowNode
     */
    select?: WorkflowNodeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many WorkflowNodes.
     */
    data: WorkflowNodeCreateManyInput | WorkflowNodeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowNodeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WorkflowNode update
   */
  export type WorkflowNodeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowNode
     */
    select?: WorkflowNodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowNodeInclude<ExtArgs> | null
    /**
     * The data needed to update a WorkflowNode.
     */
    data: XOR<WorkflowNodeUpdateInput, WorkflowNodeUncheckedUpdateInput>
    /**
     * Choose, which WorkflowNode to update.
     */
    where: WorkflowNodeWhereUniqueInput
  }

  /**
   * WorkflowNode updateMany
   */
  export type WorkflowNodeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WorkflowNodes.
     */
    data: XOR<WorkflowNodeUpdateManyMutationInput, WorkflowNodeUncheckedUpdateManyInput>
    /**
     * Filter which WorkflowNodes to update
     */
    where?: WorkflowNodeWhereInput
  }

  /**
   * WorkflowNode upsert
   */
  export type WorkflowNodeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowNode
     */
    select?: WorkflowNodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowNodeInclude<ExtArgs> | null
    /**
     * The filter to search for the WorkflowNode to update in case it exists.
     */
    where: WorkflowNodeWhereUniqueInput
    /**
     * In case the WorkflowNode found by the `where` argument doesn't exist, create a new WorkflowNode with this data.
     */
    create: XOR<WorkflowNodeCreateInput, WorkflowNodeUncheckedCreateInput>
    /**
     * In case the WorkflowNode was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorkflowNodeUpdateInput, WorkflowNodeUncheckedUpdateInput>
  }

  /**
   * WorkflowNode delete
   */
  export type WorkflowNodeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowNode
     */
    select?: WorkflowNodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowNodeInclude<ExtArgs> | null
    /**
     * Filter which WorkflowNode to delete.
     */
    where: WorkflowNodeWhereUniqueInput
  }

  /**
   * WorkflowNode deleteMany
   */
  export type WorkflowNodeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkflowNodes to delete
     */
    where?: WorkflowNodeWhereInput
  }

  /**
   * WorkflowNode.outgoing
   */
  export type WorkflowNode$outgoingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowEdge
     */
    select?: WorkflowEdgeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowEdgeInclude<ExtArgs> | null
    where?: WorkflowEdgeWhereInput
    orderBy?: WorkflowEdgeOrderByWithRelationInput | WorkflowEdgeOrderByWithRelationInput[]
    cursor?: WorkflowEdgeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WorkflowEdgeScalarFieldEnum | WorkflowEdgeScalarFieldEnum[]
  }

  /**
   * WorkflowNode.incoming
   */
  export type WorkflowNode$incomingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowEdge
     */
    select?: WorkflowEdgeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowEdgeInclude<ExtArgs> | null
    where?: WorkflowEdgeWhereInput
    orderBy?: WorkflowEdgeOrderByWithRelationInput | WorkflowEdgeOrderByWithRelationInput[]
    cursor?: WorkflowEdgeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WorkflowEdgeScalarFieldEnum | WorkflowEdgeScalarFieldEnum[]
  }

  /**
   * WorkflowNode.fields
   */
  export type WorkflowNode$fieldsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowField
     */
    select?: WorkflowFieldSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowFieldInclude<ExtArgs> | null
    where?: WorkflowFieldWhereInput
    orderBy?: WorkflowFieldOrderByWithRelationInput | WorkflowFieldOrderByWithRelationInput[]
    cursor?: WorkflowFieldWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WorkflowFieldScalarFieldEnum | WorkflowFieldScalarFieldEnum[]
  }

  /**
   * WorkflowNode without action
   */
  export type WorkflowNodeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowNode
     */
    select?: WorkflowNodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowNodeInclude<ExtArgs> | null
  }


  /**
   * Model WorkflowEdge
   */

  export type AggregateWorkflowEdge = {
    _count: WorkflowEdgeCountAggregateOutputType | null
    _min: WorkflowEdgeMinAggregateOutputType | null
    _max: WorkflowEdgeMaxAggregateOutputType | null
  }

  export type WorkflowEdgeMinAggregateOutputType = {
    id: string | null
    workflowId: string | null
    sourceNodeId: string | null
    targetNodeId: string | null
    isDeleted: boolean | null
  }

  export type WorkflowEdgeMaxAggregateOutputType = {
    id: string | null
    workflowId: string | null
    sourceNodeId: string | null
    targetNodeId: string | null
    isDeleted: boolean | null
  }

  export type WorkflowEdgeCountAggregateOutputType = {
    id: number
    workflowId: number
    sourceNodeId: number
    targetNodeId: number
    isDeleted: number
    _all: number
  }


  export type WorkflowEdgeMinAggregateInputType = {
    id?: true
    workflowId?: true
    sourceNodeId?: true
    targetNodeId?: true
    isDeleted?: true
  }

  export type WorkflowEdgeMaxAggregateInputType = {
    id?: true
    workflowId?: true
    sourceNodeId?: true
    targetNodeId?: true
    isDeleted?: true
  }

  export type WorkflowEdgeCountAggregateInputType = {
    id?: true
    workflowId?: true
    sourceNodeId?: true
    targetNodeId?: true
    isDeleted?: true
    _all?: true
  }

  export type WorkflowEdgeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkflowEdge to aggregate.
     */
    where?: WorkflowEdgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkflowEdges to fetch.
     */
    orderBy?: WorkflowEdgeOrderByWithRelationInput | WorkflowEdgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WorkflowEdgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkflowEdges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkflowEdges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WorkflowEdges
    **/
    _count?: true | WorkflowEdgeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WorkflowEdgeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WorkflowEdgeMaxAggregateInputType
  }

  export type GetWorkflowEdgeAggregateType<T extends WorkflowEdgeAggregateArgs> = {
        [P in keyof T & keyof AggregateWorkflowEdge]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorkflowEdge[P]>
      : GetScalarType<T[P], AggregateWorkflowEdge[P]>
  }




  export type WorkflowEdgeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkflowEdgeWhereInput
    orderBy?: WorkflowEdgeOrderByWithAggregationInput | WorkflowEdgeOrderByWithAggregationInput[]
    by: WorkflowEdgeScalarFieldEnum[] | WorkflowEdgeScalarFieldEnum
    having?: WorkflowEdgeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WorkflowEdgeCountAggregateInputType | true
    _min?: WorkflowEdgeMinAggregateInputType
    _max?: WorkflowEdgeMaxAggregateInputType
  }

  export type WorkflowEdgeGroupByOutputType = {
    id: string
    workflowId: string
    sourceNodeId: string
    targetNodeId: string
    isDeleted: boolean
    _count: WorkflowEdgeCountAggregateOutputType | null
    _min: WorkflowEdgeMinAggregateOutputType | null
    _max: WorkflowEdgeMaxAggregateOutputType | null
  }

  type GetWorkflowEdgeGroupByPayload<T extends WorkflowEdgeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WorkflowEdgeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WorkflowEdgeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorkflowEdgeGroupByOutputType[P]>
            : GetScalarType<T[P], WorkflowEdgeGroupByOutputType[P]>
        }
      >
    >


  export type WorkflowEdgeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workflowId?: boolean
    sourceNodeId?: boolean
    targetNodeId?: boolean
    isDeleted?: boolean
    sourceNode?: boolean | WorkflowNodeDefaultArgs<ExtArgs>
    targetNode?: boolean | WorkflowNodeDefaultArgs<ExtArgs>
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workflowEdge"]>

  export type WorkflowEdgeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workflowId?: boolean
    sourceNodeId?: boolean
    targetNodeId?: boolean
    isDeleted?: boolean
    sourceNode?: boolean | WorkflowNodeDefaultArgs<ExtArgs>
    targetNode?: boolean | WorkflowNodeDefaultArgs<ExtArgs>
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workflowEdge"]>

  export type WorkflowEdgeSelectScalar = {
    id?: boolean
    workflowId?: boolean
    sourceNodeId?: boolean
    targetNodeId?: boolean
    isDeleted?: boolean
  }

  export type WorkflowEdgeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sourceNode?: boolean | WorkflowNodeDefaultArgs<ExtArgs>
    targetNode?: boolean | WorkflowNodeDefaultArgs<ExtArgs>
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
  }
  export type WorkflowEdgeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sourceNode?: boolean | WorkflowNodeDefaultArgs<ExtArgs>
    targetNode?: boolean | WorkflowNodeDefaultArgs<ExtArgs>
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
  }

  export type $WorkflowEdgePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WorkflowEdge"
    objects: {
      sourceNode: Prisma.$WorkflowNodePayload<ExtArgs>
      targetNode: Prisma.$WorkflowNodePayload<ExtArgs>
      workflow: Prisma.$WorkflowPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      workflowId: string
      sourceNodeId: string
      targetNodeId: string
      isDeleted: boolean
    }, ExtArgs["result"]["workflowEdge"]>
    composites: {}
  }

  type WorkflowEdgeGetPayload<S extends boolean | null | undefined | WorkflowEdgeDefaultArgs> = $Result.GetResult<Prisma.$WorkflowEdgePayload, S>

  type WorkflowEdgeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<WorkflowEdgeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: WorkflowEdgeCountAggregateInputType | true
    }

  export interface WorkflowEdgeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WorkflowEdge'], meta: { name: 'WorkflowEdge' } }
    /**
     * Find zero or one WorkflowEdge that matches the filter.
     * @param {WorkflowEdgeFindUniqueArgs} args - Arguments to find a WorkflowEdge
     * @example
     * // Get one WorkflowEdge
     * const workflowEdge = await prisma.workflowEdge.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkflowEdgeFindUniqueArgs>(args: SelectSubset<T, WorkflowEdgeFindUniqueArgs<ExtArgs>>): Prisma__WorkflowEdgeClient<$Result.GetResult<Prisma.$WorkflowEdgePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one WorkflowEdge that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {WorkflowEdgeFindUniqueOrThrowArgs} args - Arguments to find a WorkflowEdge
     * @example
     * // Get one WorkflowEdge
     * const workflowEdge = await prisma.workflowEdge.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkflowEdgeFindUniqueOrThrowArgs>(args: SelectSubset<T, WorkflowEdgeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WorkflowEdgeClient<$Result.GetResult<Prisma.$WorkflowEdgePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first WorkflowEdge that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowEdgeFindFirstArgs} args - Arguments to find a WorkflowEdge
     * @example
     * // Get one WorkflowEdge
     * const workflowEdge = await prisma.workflowEdge.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkflowEdgeFindFirstArgs>(args?: SelectSubset<T, WorkflowEdgeFindFirstArgs<ExtArgs>>): Prisma__WorkflowEdgeClient<$Result.GetResult<Prisma.$WorkflowEdgePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first WorkflowEdge that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowEdgeFindFirstOrThrowArgs} args - Arguments to find a WorkflowEdge
     * @example
     * // Get one WorkflowEdge
     * const workflowEdge = await prisma.workflowEdge.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkflowEdgeFindFirstOrThrowArgs>(args?: SelectSubset<T, WorkflowEdgeFindFirstOrThrowArgs<ExtArgs>>): Prisma__WorkflowEdgeClient<$Result.GetResult<Prisma.$WorkflowEdgePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more WorkflowEdges that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowEdgeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WorkflowEdges
     * const workflowEdges = await prisma.workflowEdge.findMany()
     * 
     * // Get first 10 WorkflowEdges
     * const workflowEdges = await prisma.workflowEdge.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const workflowEdgeWithIdOnly = await prisma.workflowEdge.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WorkflowEdgeFindManyArgs>(args?: SelectSubset<T, WorkflowEdgeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkflowEdgePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a WorkflowEdge.
     * @param {WorkflowEdgeCreateArgs} args - Arguments to create a WorkflowEdge.
     * @example
     * // Create one WorkflowEdge
     * const WorkflowEdge = await prisma.workflowEdge.create({
     *   data: {
     *     // ... data to create a WorkflowEdge
     *   }
     * })
     * 
     */
    create<T extends WorkflowEdgeCreateArgs>(args: SelectSubset<T, WorkflowEdgeCreateArgs<ExtArgs>>): Prisma__WorkflowEdgeClient<$Result.GetResult<Prisma.$WorkflowEdgePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many WorkflowEdges.
     * @param {WorkflowEdgeCreateManyArgs} args - Arguments to create many WorkflowEdges.
     * @example
     * // Create many WorkflowEdges
     * const workflowEdge = await prisma.workflowEdge.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WorkflowEdgeCreateManyArgs>(args?: SelectSubset<T, WorkflowEdgeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WorkflowEdges and returns the data saved in the database.
     * @param {WorkflowEdgeCreateManyAndReturnArgs} args - Arguments to create many WorkflowEdges.
     * @example
     * // Create many WorkflowEdges
     * const workflowEdge = await prisma.workflowEdge.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WorkflowEdges and only return the `id`
     * const workflowEdgeWithIdOnly = await prisma.workflowEdge.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WorkflowEdgeCreateManyAndReturnArgs>(args?: SelectSubset<T, WorkflowEdgeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkflowEdgePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a WorkflowEdge.
     * @param {WorkflowEdgeDeleteArgs} args - Arguments to delete one WorkflowEdge.
     * @example
     * // Delete one WorkflowEdge
     * const WorkflowEdge = await prisma.workflowEdge.delete({
     *   where: {
     *     // ... filter to delete one WorkflowEdge
     *   }
     * })
     * 
     */
    delete<T extends WorkflowEdgeDeleteArgs>(args: SelectSubset<T, WorkflowEdgeDeleteArgs<ExtArgs>>): Prisma__WorkflowEdgeClient<$Result.GetResult<Prisma.$WorkflowEdgePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one WorkflowEdge.
     * @param {WorkflowEdgeUpdateArgs} args - Arguments to update one WorkflowEdge.
     * @example
     * // Update one WorkflowEdge
     * const workflowEdge = await prisma.workflowEdge.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WorkflowEdgeUpdateArgs>(args: SelectSubset<T, WorkflowEdgeUpdateArgs<ExtArgs>>): Prisma__WorkflowEdgeClient<$Result.GetResult<Prisma.$WorkflowEdgePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more WorkflowEdges.
     * @param {WorkflowEdgeDeleteManyArgs} args - Arguments to filter WorkflowEdges to delete.
     * @example
     * // Delete a few WorkflowEdges
     * const { count } = await prisma.workflowEdge.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WorkflowEdgeDeleteManyArgs>(args?: SelectSubset<T, WorkflowEdgeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WorkflowEdges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowEdgeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WorkflowEdges
     * const workflowEdge = await prisma.workflowEdge.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WorkflowEdgeUpdateManyArgs>(args: SelectSubset<T, WorkflowEdgeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one WorkflowEdge.
     * @param {WorkflowEdgeUpsertArgs} args - Arguments to update or create a WorkflowEdge.
     * @example
     * // Update or create a WorkflowEdge
     * const workflowEdge = await prisma.workflowEdge.upsert({
     *   create: {
     *     // ... data to create a WorkflowEdge
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WorkflowEdge we want to update
     *   }
     * })
     */
    upsert<T extends WorkflowEdgeUpsertArgs>(args: SelectSubset<T, WorkflowEdgeUpsertArgs<ExtArgs>>): Prisma__WorkflowEdgeClient<$Result.GetResult<Prisma.$WorkflowEdgePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of WorkflowEdges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowEdgeCountArgs} args - Arguments to filter WorkflowEdges to count.
     * @example
     * // Count the number of WorkflowEdges
     * const count = await prisma.workflowEdge.count({
     *   where: {
     *     // ... the filter for the WorkflowEdges we want to count
     *   }
     * })
    **/
    count<T extends WorkflowEdgeCountArgs>(
      args?: Subset<T, WorkflowEdgeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorkflowEdgeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WorkflowEdge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowEdgeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WorkflowEdgeAggregateArgs>(args: Subset<T, WorkflowEdgeAggregateArgs>): Prisma.PrismaPromise<GetWorkflowEdgeAggregateType<T>>

    /**
     * Group by WorkflowEdge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowEdgeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WorkflowEdgeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WorkflowEdgeGroupByArgs['orderBy'] }
        : { orderBy?: WorkflowEdgeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WorkflowEdgeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkflowEdgeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WorkflowEdge model
   */
  readonly fields: WorkflowEdgeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WorkflowEdge.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorkflowEdgeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sourceNode<T extends WorkflowNodeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkflowNodeDefaultArgs<ExtArgs>>): Prisma__WorkflowNodeClient<$Result.GetResult<Prisma.$WorkflowNodePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    targetNode<T extends WorkflowNodeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkflowNodeDefaultArgs<ExtArgs>>): Prisma__WorkflowNodeClient<$Result.GetResult<Prisma.$WorkflowNodePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    workflow<T extends WorkflowDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkflowDefaultArgs<ExtArgs>>): Prisma__WorkflowClient<$Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WorkflowEdge model
   */ 
  interface WorkflowEdgeFieldRefs {
    readonly id: FieldRef<"WorkflowEdge", 'String'>
    readonly workflowId: FieldRef<"WorkflowEdge", 'String'>
    readonly sourceNodeId: FieldRef<"WorkflowEdge", 'String'>
    readonly targetNodeId: FieldRef<"WorkflowEdge", 'String'>
    readonly isDeleted: FieldRef<"WorkflowEdge", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * WorkflowEdge findUnique
   */
  export type WorkflowEdgeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowEdge
     */
    select?: WorkflowEdgeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowEdgeInclude<ExtArgs> | null
    /**
     * Filter, which WorkflowEdge to fetch.
     */
    where: WorkflowEdgeWhereUniqueInput
  }

  /**
   * WorkflowEdge findUniqueOrThrow
   */
  export type WorkflowEdgeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowEdge
     */
    select?: WorkflowEdgeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowEdgeInclude<ExtArgs> | null
    /**
     * Filter, which WorkflowEdge to fetch.
     */
    where: WorkflowEdgeWhereUniqueInput
  }

  /**
   * WorkflowEdge findFirst
   */
  export type WorkflowEdgeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowEdge
     */
    select?: WorkflowEdgeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowEdgeInclude<ExtArgs> | null
    /**
     * Filter, which WorkflowEdge to fetch.
     */
    where?: WorkflowEdgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkflowEdges to fetch.
     */
    orderBy?: WorkflowEdgeOrderByWithRelationInput | WorkflowEdgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkflowEdges.
     */
    cursor?: WorkflowEdgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkflowEdges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkflowEdges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkflowEdges.
     */
    distinct?: WorkflowEdgeScalarFieldEnum | WorkflowEdgeScalarFieldEnum[]
  }

  /**
   * WorkflowEdge findFirstOrThrow
   */
  export type WorkflowEdgeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowEdge
     */
    select?: WorkflowEdgeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowEdgeInclude<ExtArgs> | null
    /**
     * Filter, which WorkflowEdge to fetch.
     */
    where?: WorkflowEdgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkflowEdges to fetch.
     */
    orderBy?: WorkflowEdgeOrderByWithRelationInput | WorkflowEdgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkflowEdges.
     */
    cursor?: WorkflowEdgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkflowEdges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkflowEdges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkflowEdges.
     */
    distinct?: WorkflowEdgeScalarFieldEnum | WorkflowEdgeScalarFieldEnum[]
  }

  /**
   * WorkflowEdge findMany
   */
  export type WorkflowEdgeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowEdge
     */
    select?: WorkflowEdgeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowEdgeInclude<ExtArgs> | null
    /**
     * Filter, which WorkflowEdges to fetch.
     */
    where?: WorkflowEdgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkflowEdges to fetch.
     */
    orderBy?: WorkflowEdgeOrderByWithRelationInput | WorkflowEdgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WorkflowEdges.
     */
    cursor?: WorkflowEdgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkflowEdges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkflowEdges.
     */
    skip?: number
    distinct?: WorkflowEdgeScalarFieldEnum | WorkflowEdgeScalarFieldEnum[]
  }

  /**
   * WorkflowEdge create
   */
  export type WorkflowEdgeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowEdge
     */
    select?: WorkflowEdgeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowEdgeInclude<ExtArgs> | null
    /**
     * The data needed to create a WorkflowEdge.
     */
    data: XOR<WorkflowEdgeCreateInput, WorkflowEdgeUncheckedCreateInput>
  }

  /**
   * WorkflowEdge createMany
   */
  export type WorkflowEdgeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WorkflowEdges.
     */
    data: WorkflowEdgeCreateManyInput | WorkflowEdgeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WorkflowEdge createManyAndReturn
   */
  export type WorkflowEdgeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowEdge
     */
    select?: WorkflowEdgeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many WorkflowEdges.
     */
    data: WorkflowEdgeCreateManyInput | WorkflowEdgeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowEdgeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WorkflowEdge update
   */
  export type WorkflowEdgeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowEdge
     */
    select?: WorkflowEdgeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowEdgeInclude<ExtArgs> | null
    /**
     * The data needed to update a WorkflowEdge.
     */
    data: XOR<WorkflowEdgeUpdateInput, WorkflowEdgeUncheckedUpdateInput>
    /**
     * Choose, which WorkflowEdge to update.
     */
    where: WorkflowEdgeWhereUniqueInput
  }

  /**
   * WorkflowEdge updateMany
   */
  export type WorkflowEdgeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WorkflowEdges.
     */
    data: XOR<WorkflowEdgeUpdateManyMutationInput, WorkflowEdgeUncheckedUpdateManyInput>
    /**
     * Filter which WorkflowEdges to update
     */
    where?: WorkflowEdgeWhereInput
  }

  /**
   * WorkflowEdge upsert
   */
  export type WorkflowEdgeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowEdge
     */
    select?: WorkflowEdgeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowEdgeInclude<ExtArgs> | null
    /**
     * The filter to search for the WorkflowEdge to update in case it exists.
     */
    where: WorkflowEdgeWhereUniqueInput
    /**
     * In case the WorkflowEdge found by the `where` argument doesn't exist, create a new WorkflowEdge with this data.
     */
    create: XOR<WorkflowEdgeCreateInput, WorkflowEdgeUncheckedCreateInput>
    /**
     * In case the WorkflowEdge was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorkflowEdgeUpdateInput, WorkflowEdgeUncheckedUpdateInput>
  }

  /**
   * WorkflowEdge delete
   */
  export type WorkflowEdgeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowEdge
     */
    select?: WorkflowEdgeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowEdgeInclude<ExtArgs> | null
    /**
     * Filter which WorkflowEdge to delete.
     */
    where: WorkflowEdgeWhereUniqueInput
  }

  /**
   * WorkflowEdge deleteMany
   */
  export type WorkflowEdgeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkflowEdges to delete
     */
    where?: WorkflowEdgeWhereInput
  }

  /**
   * WorkflowEdge without action
   */
  export type WorkflowEdgeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowEdge
     */
    select?: WorkflowEdgeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowEdgeInclude<ExtArgs> | null
  }


  /**
   * Model ActionCategory
   */

  export type AggregateActionCategory = {
    _count: ActionCategoryCountAggregateOutputType | null
    _min: ActionCategoryMinAggregateOutputType | null
    _max: ActionCategoryMaxAggregateOutputType | null
  }

  export type ActionCategoryMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
  }

  export type ActionCategoryMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
  }

  export type ActionCategoryCountAggregateOutputType = {
    id: number
    name: number
    description: number
    _all: number
  }


  export type ActionCategoryMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
  }

  export type ActionCategoryMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
  }

  export type ActionCategoryCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    _all?: true
  }

  export type ActionCategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ActionCategory to aggregate.
     */
    where?: ActionCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActionCategories to fetch.
     */
    orderBy?: ActionCategoryOrderByWithRelationInput | ActionCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ActionCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActionCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActionCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ActionCategories
    **/
    _count?: true | ActionCategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ActionCategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ActionCategoryMaxAggregateInputType
  }

  export type GetActionCategoryAggregateType<T extends ActionCategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateActionCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateActionCategory[P]>
      : GetScalarType<T[P], AggregateActionCategory[P]>
  }




  export type ActionCategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActionCategoryWhereInput
    orderBy?: ActionCategoryOrderByWithAggregationInput | ActionCategoryOrderByWithAggregationInput[]
    by: ActionCategoryScalarFieldEnum[] | ActionCategoryScalarFieldEnum
    having?: ActionCategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ActionCategoryCountAggregateInputType | true
    _min?: ActionCategoryMinAggregateInputType
    _max?: ActionCategoryMaxAggregateInputType
  }

  export type ActionCategoryGroupByOutputType = {
    id: string
    name: string
    description: string | null
    _count: ActionCategoryCountAggregateOutputType | null
    _min: ActionCategoryMinAggregateOutputType | null
    _max: ActionCategoryMaxAggregateOutputType | null
  }

  type GetActionCategoryGroupByPayload<T extends ActionCategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ActionCategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ActionCategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ActionCategoryGroupByOutputType[P]>
            : GetScalarType<T[P], ActionCategoryGroupByOutputType[P]>
        }
      >
    >


  export type ActionCategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    actions?: boolean | ActionCategory$actionsArgs<ExtArgs>
    _count?: boolean | ActionCategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["actionCategory"]>

  export type ActionCategorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
  }, ExtArgs["result"]["actionCategory"]>

  export type ActionCategorySelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
  }

  export type ActionCategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    actions?: boolean | ActionCategory$actionsArgs<ExtArgs>
    _count?: boolean | ActionCategoryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ActionCategoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ActionCategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ActionCategory"
    objects: {
      actions: Prisma.$ActionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
    }, ExtArgs["result"]["actionCategory"]>
    composites: {}
  }

  type ActionCategoryGetPayload<S extends boolean | null | undefined | ActionCategoryDefaultArgs> = $Result.GetResult<Prisma.$ActionCategoryPayload, S>

  type ActionCategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ActionCategoryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ActionCategoryCountAggregateInputType | true
    }

  export interface ActionCategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ActionCategory'], meta: { name: 'ActionCategory' } }
    /**
     * Find zero or one ActionCategory that matches the filter.
     * @param {ActionCategoryFindUniqueArgs} args - Arguments to find a ActionCategory
     * @example
     * // Get one ActionCategory
     * const actionCategory = await prisma.actionCategory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ActionCategoryFindUniqueArgs>(args: SelectSubset<T, ActionCategoryFindUniqueArgs<ExtArgs>>): Prisma__ActionCategoryClient<$Result.GetResult<Prisma.$ActionCategoryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ActionCategory that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ActionCategoryFindUniqueOrThrowArgs} args - Arguments to find a ActionCategory
     * @example
     * // Get one ActionCategory
     * const actionCategory = await prisma.actionCategory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ActionCategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, ActionCategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ActionCategoryClient<$Result.GetResult<Prisma.$ActionCategoryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ActionCategory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionCategoryFindFirstArgs} args - Arguments to find a ActionCategory
     * @example
     * // Get one ActionCategory
     * const actionCategory = await prisma.actionCategory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ActionCategoryFindFirstArgs>(args?: SelectSubset<T, ActionCategoryFindFirstArgs<ExtArgs>>): Prisma__ActionCategoryClient<$Result.GetResult<Prisma.$ActionCategoryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ActionCategory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionCategoryFindFirstOrThrowArgs} args - Arguments to find a ActionCategory
     * @example
     * // Get one ActionCategory
     * const actionCategory = await prisma.actionCategory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ActionCategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, ActionCategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__ActionCategoryClient<$Result.GetResult<Prisma.$ActionCategoryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ActionCategories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionCategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ActionCategories
     * const actionCategories = await prisma.actionCategory.findMany()
     * 
     * // Get first 10 ActionCategories
     * const actionCategories = await prisma.actionCategory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const actionCategoryWithIdOnly = await prisma.actionCategory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ActionCategoryFindManyArgs>(args?: SelectSubset<T, ActionCategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActionCategoryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ActionCategory.
     * @param {ActionCategoryCreateArgs} args - Arguments to create a ActionCategory.
     * @example
     * // Create one ActionCategory
     * const ActionCategory = await prisma.actionCategory.create({
     *   data: {
     *     // ... data to create a ActionCategory
     *   }
     * })
     * 
     */
    create<T extends ActionCategoryCreateArgs>(args: SelectSubset<T, ActionCategoryCreateArgs<ExtArgs>>): Prisma__ActionCategoryClient<$Result.GetResult<Prisma.$ActionCategoryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ActionCategories.
     * @param {ActionCategoryCreateManyArgs} args - Arguments to create many ActionCategories.
     * @example
     * // Create many ActionCategories
     * const actionCategory = await prisma.actionCategory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ActionCategoryCreateManyArgs>(args?: SelectSubset<T, ActionCategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ActionCategories and returns the data saved in the database.
     * @param {ActionCategoryCreateManyAndReturnArgs} args - Arguments to create many ActionCategories.
     * @example
     * // Create many ActionCategories
     * const actionCategory = await prisma.actionCategory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ActionCategories and only return the `id`
     * const actionCategoryWithIdOnly = await prisma.actionCategory.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ActionCategoryCreateManyAndReturnArgs>(args?: SelectSubset<T, ActionCategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActionCategoryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ActionCategory.
     * @param {ActionCategoryDeleteArgs} args - Arguments to delete one ActionCategory.
     * @example
     * // Delete one ActionCategory
     * const ActionCategory = await prisma.actionCategory.delete({
     *   where: {
     *     // ... filter to delete one ActionCategory
     *   }
     * })
     * 
     */
    delete<T extends ActionCategoryDeleteArgs>(args: SelectSubset<T, ActionCategoryDeleteArgs<ExtArgs>>): Prisma__ActionCategoryClient<$Result.GetResult<Prisma.$ActionCategoryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ActionCategory.
     * @param {ActionCategoryUpdateArgs} args - Arguments to update one ActionCategory.
     * @example
     * // Update one ActionCategory
     * const actionCategory = await prisma.actionCategory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ActionCategoryUpdateArgs>(args: SelectSubset<T, ActionCategoryUpdateArgs<ExtArgs>>): Prisma__ActionCategoryClient<$Result.GetResult<Prisma.$ActionCategoryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ActionCategories.
     * @param {ActionCategoryDeleteManyArgs} args - Arguments to filter ActionCategories to delete.
     * @example
     * // Delete a few ActionCategories
     * const { count } = await prisma.actionCategory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ActionCategoryDeleteManyArgs>(args?: SelectSubset<T, ActionCategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ActionCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionCategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ActionCategories
     * const actionCategory = await prisma.actionCategory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ActionCategoryUpdateManyArgs>(args: SelectSubset<T, ActionCategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ActionCategory.
     * @param {ActionCategoryUpsertArgs} args - Arguments to update or create a ActionCategory.
     * @example
     * // Update or create a ActionCategory
     * const actionCategory = await prisma.actionCategory.upsert({
     *   create: {
     *     // ... data to create a ActionCategory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ActionCategory we want to update
     *   }
     * })
     */
    upsert<T extends ActionCategoryUpsertArgs>(args: SelectSubset<T, ActionCategoryUpsertArgs<ExtArgs>>): Prisma__ActionCategoryClient<$Result.GetResult<Prisma.$ActionCategoryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ActionCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionCategoryCountArgs} args - Arguments to filter ActionCategories to count.
     * @example
     * // Count the number of ActionCategories
     * const count = await prisma.actionCategory.count({
     *   where: {
     *     // ... the filter for the ActionCategories we want to count
     *   }
     * })
    **/
    count<T extends ActionCategoryCountArgs>(
      args?: Subset<T, ActionCategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ActionCategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ActionCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionCategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ActionCategoryAggregateArgs>(args: Subset<T, ActionCategoryAggregateArgs>): Prisma.PrismaPromise<GetActionCategoryAggregateType<T>>

    /**
     * Group by ActionCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionCategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ActionCategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ActionCategoryGroupByArgs['orderBy'] }
        : { orderBy?: ActionCategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ActionCategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetActionCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ActionCategory model
   */
  readonly fields: ActionCategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ActionCategory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ActionCategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    actions<T extends ActionCategory$actionsArgs<ExtArgs> = {}>(args?: Subset<T, ActionCategory$actionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActionPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ActionCategory model
   */ 
  interface ActionCategoryFieldRefs {
    readonly id: FieldRef<"ActionCategory", 'String'>
    readonly name: FieldRef<"ActionCategory", 'String'>
    readonly description: FieldRef<"ActionCategory", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ActionCategory findUnique
   */
  export type ActionCategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionCategory
     */
    select?: ActionCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionCategoryInclude<ExtArgs> | null
    /**
     * Filter, which ActionCategory to fetch.
     */
    where: ActionCategoryWhereUniqueInput
  }

  /**
   * ActionCategory findUniqueOrThrow
   */
  export type ActionCategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionCategory
     */
    select?: ActionCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionCategoryInclude<ExtArgs> | null
    /**
     * Filter, which ActionCategory to fetch.
     */
    where: ActionCategoryWhereUniqueInput
  }

  /**
   * ActionCategory findFirst
   */
  export type ActionCategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionCategory
     */
    select?: ActionCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionCategoryInclude<ExtArgs> | null
    /**
     * Filter, which ActionCategory to fetch.
     */
    where?: ActionCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActionCategories to fetch.
     */
    orderBy?: ActionCategoryOrderByWithRelationInput | ActionCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ActionCategories.
     */
    cursor?: ActionCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActionCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActionCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ActionCategories.
     */
    distinct?: ActionCategoryScalarFieldEnum | ActionCategoryScalarFieldEnum[]
  }

  /**
   * ActionCategory findFirstOrThrow
   */
  export type ActionCategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionCategory
     */
    select?: ActionCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionCategoryInclude<ExtArgs> | null
    /**
     * Filter, which ActionCategory to fetch.
     */
    where?: ActionCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActionCategories to fetch.
     */
    orderBy?: ActionCategoryOrderByWithRelationInput | ActionCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ActionCategories.
     */
    cursor?: ActionCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActionCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActionCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ActionCategories.
     */
    distinct?: ActionCategoryScalarFieldEnum | ActionCategoryScalarFieldEnum[]
  }

  /**
   * ActionCategory findMany
   */
  export type ActionCategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionCategory
     */
    select?: ActionCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionCategoryInclude<ExtArgs> | null
    /**
     * Filter, which ActionCategories to fetch.
     */
    where?: ActionCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActionCategories to fetch.
     */
    orderBy?: ActionCategoryOrderByWithRelationInput | ActionCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ActionCategories.
     */
    cursor?: ActionCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActionCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActionCategories.
     */
    skip?: number
    distinct?: ActionCategoryScalarFieldEnum | ActionCategoryScalarFieldEnum[]
  }

  /**
   * ActionCategory create
   */
  export type ActionCategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionCategory
     */
    select?: ActionCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionCategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a ActionCategory.
     */
    data: XOR<ActionCategoryCreateInput, ActionCategoryUncheckedCreateInput>
  }

  /**
   * ActionCategory createMany
   */
  export type ActionCategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ActionCategories.
     */
    data: ActionCategoryCreateManyInput | ActionCategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ActionCategory createManyAndReturn
   */
  export type ActionCategoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionCategory
     */
    select?: ActionCategorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ActionCategories.
     */
    data: ActionCategoryCreateManyInput | ActionCategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ActionCategory update
   */
  export type ActionCategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionCategory
     */
    select?: ActionCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionCategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a ActionCategory.
     */
    data: XOR<ActionCategoryUpdateInput, ActionCategoryUncheckedUpdateInput>
    /**
     * Choose, which ActionCategory to update.
     */
    where: ActionCategoryWhereUniqueInput
  }

  /**
   * ActionCategory updateMany
   */
  export type ActionCategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ActionCategories.
     */
    data: XOR<ActionCategoryUpdateManyMutationInput, ActionCategoryUncheckedUpdateManyInput>
    /**
     * Filter which ActionCategories to update
     */
    where?: ActionCategoryWhereInput
  }

  /**
   * ActionCategory upsert
   */
  export type ActionCategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionCategory
     */
    select?: ActionCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionCategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the ActionCategory to update in case it exists.
     */
    where: ActionCategoryWhereUniqueInput
    /**
     * In case the ActionCategory found by the `where` argument doesn't exist, create a new ActionCategory with this data.
     */
    create: XOR<ActionCategoryCreateInput, ActionCategoryUncheckedCreateInput>
    /**
     * In case the ActionCategory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ActionCategoryUpdateInput, ActionCategoryUncheckedUpdateInput>
  }

  /**
   * ActionCategory delete
   */
  export type ActionCategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionCategory
     */
    select?: ActionCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionCategoryInclude<ExtArgs> | null
    /**
     * Filter which ActionCategory to delete.
     */
    where: ActionCategoryWhereUniqueInput
  }

  /**
   * ActionCategory deleteMany
   */
  export type ActionCategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ActionCategories to delete
     */
    where?: ActionCategoryWhereInput
  }

  /**
   * ActionCategory.actions
   */
  export type ActionCategory$actionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Action
     */
    select?: ActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionInclude<ExtArgs> | null
    where?: ActionWhereInput
    orderBy?: ActionOrderByWithRelationInput | ActionOrderByWithRelationInput[]
    cursor?: ActionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ActionScalarFieldEnum | ActionScalarFieldEnum[]
  }

  /**
   * ActionCategory without action
   */
  export type ActionCategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionCategory
     */
    select?: ActionCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionCategoryInclude<ExtArgs> | null
  }


  /**
   * Model Action
   */

  export type AggregateAction = {
    _count: ActionCountAggregateOutputType | null
    _min: ActionMinAggregateOutputType | null
    _max: ActionMaxAggregateOutputType | null
  }

  export type ActionMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    categoryId: string | null
    inputType: string | null
    outputType: string | null
    icon: string | null
    serviceUrl: string | null
  }

  export type ActionMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    categoryId: string | null
    inputType: string | null
    outputType: string | null
    icon: string | null
    serviceUrl: string | null
  }

  export type ActionCountAggregateOutputType = {
    id: number
    name: number
    description: number
    categoryId: number
    configSchema: number
    configMeta: number
    inputType: number
    outputType: number
    icon: number
    serviceUrl: number
    _all: number
  }


  export type ActionMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    categoryId?: true
    inputType?: true
    outputType?: true
    icon?: true
    serviceUrl?: true
  }

  export type ActionMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    categoryId?: true
    inputType?: true
    outputType?: true
    icon?: true
    serviceUrl?: true
  }

  export type ActionCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    categoryId?: true
    configSchema?: true
    configMeta?: true
    inputType?: true
    outputType?: true
    icon?: true
    serviceUrl?: true
    _all?: true
  }

  export type ActionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Action to aggregate.
     */
    where?: ActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Actions to fetch.
     */
    orderBy?: ActionOrderByWithRelationInput | ActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Actions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Actions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Actions
    **/
    _count?: true | ActionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ActionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ActionMaxAggregateInputType
  }

  export type GetActionAggregateType<T extends ActionAggregateArgs> = {
        [P in keyof T & keyof AggregateAction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAction[P]>
      : GetScalarType<T[P], AggregateAction[P]>
  }




  export type ActionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActionWhereInput
    orderBy?: ActionOrderByWithAggregationInput | ActionOrderByWithAggregationInput[]
    by: ActionScalarFieldEnum[] | ActionScalarFieldEnum
    having?: ActionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ActionCountAggregateInputType | true
    _min?: ActionMinAggregateInputType
    _max?: ActionMaxAggregateInputType
  }

  export type ActionGroupByOutputType = {
    id: string
    name: string
    description: string | null
    categoryId: string
    configSchema: JsonValue
    configMeta: JsonValue | null
    inputType: string | null
    outputType: string
    icon: string
    serviceUrl: string | null
    _count: ActionCountAggregateOutputType | null
    _min: ActionMinAggregateOutputType | null
    _max: ActionMaxAggregateOutputType | null
  }

  type GetActionGroupByPayload<T extends ActionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ActionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ActionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ActionGroupByOutputType[P]>
            : GetScalarType<T[P], ActionGroupByOutputType[P]>
        }
      >
    >


  export type ActionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    categoryId?: boolean
    configSchema?: boolean
    configMeta?: boolean
    inputType?: boolean
    outputType?: boolean
    icon?: boolean
    serviceUrl?: boolean
    category?: boolean | ActionCategoryDefaultArgs<ExtArgs>
    workflowNodes?: boolean | Action$workflowNodesArgs<ExtArgs>
    _count?: boolean | ActionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["action"]>

  export type ActionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    categoryId?: boolean
    configSchema?: boolean
    configMeta?: boolean
    inputType?: boolean
    outputType?: boolean
    icon?: boolean
    serviceUrl?: boolean
    category?: boolean | ActionCategoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["action"]>

  export type ActionSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    categoryId?: boolean
    configSchema?: boolean
    configMeta?: boolean
    inputType?: boolean
    outputType?: boolean
    icon?: boolean
    serviceUrl?: boolean
  }

  export type ActionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | ActionCategoryDefaultArgs<ExtArgs>
    workflowNodes?: boolean | Action$workflowNodesArgs<ExtArgs>
    _count?: boolean | ActionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ActionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | ActionCategoryDefaultArgs<ExtArgs>
  }

  export type $ActionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Action"
    objects: {
      category: Prisma.$ActionCategoryPayload<ExtArgs>
      workflowNodes: Prisma.$WorkflowNodePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      categoryId: string
      configSchema: Prisma.JsonValue
      configMeta: Prisma.JsonValue | null
      inputType: string | null
      outputType: string
      icon: string
      serviceUrl: string | null
    }, ExtArgs["result"]["action"]>
    composites: {}
  }

  type ActionGetPayload<S extends boolean | null | undefined | ActionDefaultArgs> = $Result.GetResult<Prisma.$ActionPayload, S>

  type ActionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ActionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ActionCountAggregateInputType | true
    }

  export interface ActionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Action'], meta: { name: 'Action' } }
    /**
     * Find zero or one Action that matches the filter.
     * @param {ActionFindUniqueArgs} args - Arguments to find a Action
     * @example
     * // Get one Action
     * const action = await prisma.action.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ActionFindUniqueArgs>(args: SelectSubset<T, ActionFindUniqueArgs<ExtArgs>>): Prisma__ActionClient<$Result.GetResult<Prisma.$ActionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Action that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ActionFindUniqueOrThrowArgs} args - Arguments to find a Action
     * @example
     * // Get one Action
     * const action = await prisma.action.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ActionFindUniqueOrThrowArgs>(args: SelectSubset<T, ActionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ActionClient<$Result.GetResult<Prisma.$ActionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Action that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionFindFirstArgs} args - Arguments to find a Action
     * @example
     * // Get one Action
     * const action = await prisma.action.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ActionFindFirstArgs>(args?: SelectSubset<T, ActionFindFirstArgs<ExtArgs>>): Prisma__ActionClient<$Result.GetResult<Prisma.$ActionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Action that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionFindFirstOrThrowArgs} args - Arguments to find a Action
     * @example
     * // Get one Action
     * const action = await prisma.action.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ActionFindFirstOrThrowArgs>(args?: SelectSubset<T, ActionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ActionClient<$Result.GetResult<Prisma.$ActionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Actions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Actions
     * const actions = await prisma.action.findMany()
     * 
     * // Get first 10 Actions
     * const actions = await prisma.action.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const actionWithIdOnly = await prisma.action.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ActionFindManyArgs>(args?: SelectSubset<T, ActionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Action.
     * @param {ActionCreateArgs} args - Arguments to create a Action.
     * @example
     * // Create one Action
     * const Action = await prisma.action.create({
     *   data: {
     *     // ... data to create a Action
     *   }
     * })
     * 
     */
    create<T extends ActionCreateArgs>(args: SelectSubset<T, ActionCreateArgs<ExtArgs>>): Prisma__ActionClient<$Result.GetResult<Prisma.$ActionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Actions.
     * @param {ActionCreateManyArgs} args - Arguments to create many Actions.
     * @example
     * // Create many Actions
     * const action = await prisma.action.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ActionCreateManyArgs>(args?: SelectSubset<T, ActionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Actions and returns the data saved in the database.
     * @param {ActionCreateManyAndReturnArgs} args - Arguments to create many Actions.
     * @example
     * // Create many Actions
     * const action = await prisma.action.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Actions and only return the `id`
     * const actionWithIdOnly = await prisma.action.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ActionCreateManyAndReturnArgs>(args?: SelectSubset<T, ActionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Action.
     * @param {ActionDeleteArgs} args - Arguments to delete one Action.
     * @example
     * // Delete one Action
     * const Action = await prisma.action.delete({
     *   where: {
     *     // ... filter to delete one Action
     *   }
     * })
     * 
     */
    delete<T extends ActionDeleteArgs>(args: SelectSubset<T, ActionDeleteArgs<ExtArgs>>): Prisma__ActionClient<$Result.GetResult<Prisma.$ActionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Action.
     * @param {ActionUpdateArgs} args - Arguments to update one Action.
     * @example
     * // Update one Action
     * const action = await prisma.action.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ActionUpdateArgs>(args: SelectSubset<T, ActionUpdateArgs<ExtArgs>>): Prisma__ActionClient<$Result.GetResult<Prisma.$ActionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Actions.
     * @param {ActionDeleteManyArgs} args - Arguments to filter Actions to delete.
     * @example
     * // Delete a few Actions
     * const { count } = await prisma.action.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ActionDeleteManyArgs>(args?: SelectSubset<T, ActionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Actions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Actions
     * const action = await prisma.action.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ActionUpdateManyArgs>(args: SelectSubset<T, ActionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Action.
     * @param {ActionUpsertArgs} args - Arguments to update or create a Action.
     * @example
     * // Update or create a Action
     * const action = await prisma.action.upsert({
     *   create: {
     *     // ... data to create a Action
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Action we want to update
     *   }
     * })
     */
    upsert<T extends ActionUpsertArgs>(args: SelectSubset<T, ActionUpsertArgs<ExtArgs>>): Prisma__ActionClient<$Result.GetResult<Prisma.$ActionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Actions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionCountArgs} args - Arguments to filter Actions to count.
     * @example
     * // Count the number of Actions
     * const count = await prisma.action.count({
     *   where: {
     *     // ... the filter for the Actions we want to count
     *   }
     * })
    **/
    count<T extends ActionCountArgs>(
      args?: Subset<T, ActionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ActionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Action.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ActionAggregateArgs>(args: Subset<T, ActionAggregateArgs>): Prisma.PrismaPromise<GetActionAggregateType<T>>

    /**
     * Group by Action.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ActionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ActionGroupByArgs['orderBy'] }
        : { orderBy?: ActionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ActionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetActionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Action model
   */
  readonly fields: ActionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Action.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ActionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    category<T extends ActionCategoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ActionCategoryDefaultArgs<ExtArgs>>): Prisma__ActionCategoryClient<$Result.GetResult<Prisma.$ActionCategoryPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    workflowNodes<T extends Action$workflowNodesArgs<ExtArgs> = {}>(args?: Subset<T, Action$workflowNodesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkflowNodePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Action model
   */ 
  interface ActionFieldRefs {
    readonly id: FieldRef<"Action", 'String'>
    readonly name: FieldRef<"Action", 'String'>
    readonly description: FieldRef<"Action", 'String'>
    readonly categoryId: FieldRef<"Action", 'String'>
    readonly configSchema: FieldRef<"Action", 'Json'>
    readonly configMeta: FieldRef<"Action", 'Json'>
    readonly inputType: FieldRef<"Action", 'String'>
    readonly outputType: FieldRef<"Action", 'String'>
    readonly icon: FieldRef<"Action", 'String'>
    readonly serviceUrl: FieldRef<"Action", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Action findUnique
   */
  export type ActionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Action
     */
    select?: ActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionInclude<ExtArgs> | null
    /**
     * Filter, which Action to fetch.
     */
    where: ActionWhereUniqueInput
  }

  /**
   * Action findUniqueOrThrow
   */
  export type ActionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Action
     */
    select?: ActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionInclude<ExtArgs> | null
    /**
     * Filter, which Action to fetch.
     */
    where: ActionWhereUniqueInput
  }

  /**
   * Action findFirst
   */
  export type ActionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Action
     */
    select?: ActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionInclude<ExtArgs> | null
    /**
     * Filter, which Action to fetch.
     */
    where?: ActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Actions to fetch.
     */
    orderBy?: ActionOrderByWithRelationInput | ActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Actions.
     */
    cursor?: ActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Actions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Actions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Actions.
     */
    distinct?: ActionScalarFieldEnum | ActionScalarFieldEnum[]
  }

  /**
   * Action findFirstOrThrow
   */
  export type ActionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Action
     */
    select?: ActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionInclude<ExtArgs> | null
    /**
     * Filter, which Action to fetch.
     */
    where?: ActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Actions to fetch.
     */
    orderBy?: ActionOrderByWithRelationInput | ActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Actions.
     */
    cursor?: ActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Actions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Actions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Actions.
     */
    distinct?: ActionScalarFieldEnum | ActionScalarFieldEnum[]
  }

  /**
   * Action findMany
   */
  export type ActionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Action
     */
    select?: ActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionInclude<ExtArgs> | null
    /**
     * Filter, which Actions to fetch.
     */
    where?: ActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Actions to fetch.
     */
    orderBy?: ActionOrderByWithRelationInput | ActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Actions.
     */
    cursor?: ActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Actions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Actions.
     */
    skip?: number
    distinct?: ActionScalarFieldEnum | ActionScalarFieldEnum[]
  }

  /**
   * Action create
   */
  export type ActionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Action
     */
    select?: ActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionInclude<ExtArgs> | null
    /**
     * The data needed to create a Action.
     */
    data: XOR<ActionCreateInput, ActionUncheckedCreateInput>
  }

  /**
   * Action createMany
   */
  export type ActionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Actions.
     */
    data: ActionCreateManyInput | ActionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Action createManyAndReturn
   */
  export type ActionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Action
     */
    select?: ActionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Actions.
     */
    data: ActionCreateManyInput | ActionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Action update
   */
  export type ActionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Action
     */
    select?: ActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionInclude<ExtArgs> | null
    /**
     * The data needed to update a Action.
     */
    data: XOR<ActionUpdateInput, ActionUncheckedUpdateInput>
    /**
     * Choose, which Action to update.
     */
    where: ActionWhereUniqueInput
  }

  /**
   * Action updateMany
   */
  export type ActionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Actions.
     */
    data: XOR<ActionUpdateManyMutationInput, ActionUncheckedUpdateManyInput>
    /**
     * Filter which Actions to update
     */
    where?: ActionWhereInput
  }

  /**
   * Action upsert
   */
  export type ActionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Action
     */
    select?: ActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionInclude<ExtArgs> | null
    /**
     * The filter to search for the Action to update in case it exists.
     */
    where: ActionWhereUniqueInput
    /**
     * In case the Action found by the `where` argument doesn't exist, create a new Action with this data.
     */
    create: XOR<ActionCreateInput, ActionUncheckedCreateInput>
    /**
     * In case the Action was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ActionUpdateInput, ActionUncheckedUpdateInput>
  }

  /**
   * Action delete
   */
  export type ActionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Action
     */
    select?: ActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionInclude<ExtArgs> | null
    /**
     * Filter which Action to delete.
     */
    where: ActionWhereUniqueInput
  }

  /**
   * Action deleteMany
   */
  export type ActionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Actions to delete
     */
    where?: ActionWhereInput
  }

  /**
   * Action.workflowNodes
   */
  export type Action$workflowNodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowNode
     */
    select?: WorkflowNodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowNodeInclude<ExtArgs> | null
    where?: WorkflowNodeWhereInput
    orderBy?: WorkflowNodeOrderByWithRelationInput | WorkflowNodeOrderByWithRelationInput[]
    cursor?: WorkflowNodeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WorkflowNodeScalarFieldEnum | WorkflowNodeScalarFieldEnum[]
  }

  /**
   * Action without action
   */
  export type ActionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Action
     */
    select?: ActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionInclude<ExtArgs> | null
  }


  /**
   * Model WorkflowField
   */

  export type AggregateWorkflowField = {
    _count: WorkflowFieldCountAggregateOutputType | null
    _min: WorkflowFieldMinAggregateOutputType | null
    _max: WorkflowFieldMaxAggregateOutputType | null
  }

  export type WorkflowFieldMinAggregateOutputType = {
    id: string | null
    workflowId: string | null
    sourceNodeId: string | null
    fieldName: string | null
    fieldPath: string | null
    fieldType: string | null
    createdAt: Date | null
  }

  export type WorkflowFieldMaxAggregateOutputType = {
    id: string | null
    workflowId: string | null
    sourceNodeId: string | null
    fieldName: string | null
    fieldPath: string | null
    fieldType: string | null
    createdAt: Date | null
  }

  export type WorkflowFieldCountAggregateOutputType = {
    id: number
    workflowId: number
    sourceNodeId: number
    fieldName: number
    fieldPath: number
    fieldType: number
    createdAt: number
    _all: number
  }


  export type WorkflowFieldMinAggregateInputType = {
    id?: true
    workflowId?: true
    sourceNodeId?: true
    fieldName?: true
    fieldPath?: true
    fieldType?: true
    createdAt?: true
  }

  export type WorkflowFieldMaxAggregateInputType = {
    id?: true
    workflowId?: true
    sourceNodeId?: true
    fieldName?: true
    fieldPath?: true
    fieldType?: true
    createdAt?: true
  }

  export type WorkflowFieldCountAggregateInputType = {
    id?: true
    workflowId?: true
    sourceNodeId?: true
    fieldName?: true
    fieldPath?: true
    fieldType?: true
    createdAt?: true
    _all?: true
  }

  export type WorkflowFieldAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkflowField to aggregate.
     */
    where?: WorkflowFieldWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkflowFields to fetch.
     */
    orderBy?: WorkflowFieldOrderByWithRelationInput | WorkflowFieldOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WorkflowFieldWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkflowFields from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkflowFields.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WorkflowFields
    **/
    _count?: true | WorkflowFieldCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WorkflowFieldMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WorkflowFieldMaxAggregateInputType
  }

  export type GetWorkflowFieldAggregateType<T extends WorkflowFieldAggregateArgs> = {
        [P in keyof T & keyof AggregateWorkflowField]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorkflowField[P]>
      : GetScalarType<T[P], AggregateWorkflowField[P]>
  }




  export type WorkflowFieldGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkflowFieldWhereInput
    orderBy?: WorkflowFieldOrderByWithAggregationInput | WorkflowFieldOrderByWithAggregationInput[]
    by: WorkflowFieldScalarFieldEnum[] | WorkflowFieldScalarFieldEnum
    having?: WorkflowFieldScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WorkflowFieldCountAggregateInputType | true
    _min?: WorkflowFieldMinAggregateInputType
    _max?: WorkflowFieldMaxAggregateInputType
  }

  export type WorkflowFieldGroupByOutputType = {
    id: string
    workflowId: string
    sourceNodeId: string
    fieldName: string
    fieldPath: string
    fieldType: string | null
    createdAt: Date
    _count: WorkflowFieldCountAggregateOutputType | null
    _min: WorkflowFieldMinAggregateOutputType | null
    _max: WorkflowFieldMaxAggregateOutputType | null
  }

  type GetWorkflowFieldGroupByPayload<T extends WorkflowFieldGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WorkflowFieldGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WorkflowFieldGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorkflowFieldGroupByOutputType[P]>
            : GetScalarType<T[P], WorkflowFieldGroupByOutputType[P]>
        }
      >
    >


  export type WorkflowFieldSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workflowId?: boolean
    sourceNodeId?: boolean
    fieldName?: boolean
    fieldPath?: boolean
    fieldType?: boolean
    createdAt?: boolean
    sourceNode?: boolean | WorkflowNodeDefaultArgs<ExtArgs>
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workflowField"]>

  export type WorkflowFieldSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workflowId?: boolean
    sourceNodeId?: boolean
    fieldName?: boolean
    fieldPath?: boolean
    fieldType?: boolean
    createdAt?: boolean
    sourceNode?: boolean | WorkflowNodeDefaultArgs<ExtArgs>
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workflowField"]>

  export type WorkflowFieldSelectScalar = {
    id?: boolean
    workflowId?: boolean
    sourceNodeId?: boolean
    fieldName?: boolean
    fieldPath?: boolean
    fieldType?: boolean
    createdAt?: boolean
  }

  export type WorkflowFieldInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sourceNode?: boolean | WorkflowNodeDefaultArgs<ExtArgs>
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
  }
  export type WorkflowFieldIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sourceNode?: boolean | WorkflowNodeDefaultArgs<ExtArgs>
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
  }

  export type $WorkflowFieldPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WorkflowField"
    objects: {
      sourceNode: Prisma.$WorkflowNodePayload<ExtArgs>
      workflow: Prisma.$WorkflowPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      workflowId: string
      sourceNodeId: string
      fieldName: string
      fieldPath: string
      fieldType: string | null
      createdAt: Date
    }, ExtArgs["result"]["workflowField"]>
    composites: {}
  }

  type WorkflowFieldGetPayload<S extends boolean | null | undefined | WorkflowFieldDefaultArgs> = $Result.GetResult<Prisma.$WorkflowFieldPayload, S>

  type WorkflowFieldCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<WorkflowFieldFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: WorkflowFieldCountAggregateInputType | true
    }

  export interface WorkflowFieldDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WorkflowField'], meta: { name: 'WorkflowField' } }
    /**
     * Find zero or one WorkflowField that matches the filter.
     * @param {WorkflowFieldFindUniqueArgs} args - Arguments to find a WorkflowField
     * @example
     * // Get one WorkflowField
     * const workflowField = await prisma.workflowField.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkflowFieldFindUniqueArgs>(args: SelectSubset<T, WorkflowFieldFindUniqueArgs<ExtArgs>>): Prisma__WorkflowFieldClient<$Result.GetResult<Prisma.$WorkflowFieldPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one WorkflowField that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {WorkflowFieldFindUniqueOrThrowArgs} args - Arguments to find a WorkflowField
     * @example
     * // Get one WorkflowField
     * const workflowField = await prisma.workflowField.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkflowFieldFindUniqueOrThrowArgs>(args: SelectSubset<T, WorkflowFieldFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WorkflowFieldClient<$Result.GetResult<Prisma.$WorkflowFieldPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first WorkflowField that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowFieldFindFirstArgs} args - Arguments to find a WorkflowField
     * @example
     * // Get one WorkflowField
     * const workflowField = await prisma.workflowField.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkflowFieldFindFirstArgs>(args?: SelectSubset<T, WorkflowFieldFindFirstArgs<ExtArgs>>): Prisma__WorkflowFieldClient<$Result.GetResult<Prisma.$WorkflowFieldPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first WorkflowField that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowFieldFindFirstOrThrowArgs} args - Arguments to find a WorkflowField
     * @example
     * // Get one WorkflowField
     * const workflowField = await prisma.workflowField.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkflowFieldFindFirstOrThrowArgs>(args?: SelectSubset<T, WorkflowFieldFindFirstOrThrowArgs<ExtArgs>>): Prisma__WorkflowFieldClient<$Result.GetResult<Prisma.$WorkflowFieldPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more WorkflowFields that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowFieldFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WorkflowFields
     * const workflowFields = await prisma.workflowField.findMany()
     * 
     * // Get first 10 WorkflowFields
     * const workflowFields = await prisma.workflowField.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const workflowFieldWithIdOnly = await prisma.workflowField.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WorkflowFieldFindManyArgs>(args?: SelectSubset<T, WorkflowFieldFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkflowFieldPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a WorkflowField.
     * @param {WorkflowFieldCreateArgs} args - Arguments to create a WorkflowField.
     * @example
     * // Create one WorkflowField
     * const WorkflowField = await prisma.workflowField.create({
     *   data: {
     *     // ... data to create a WorkflowField
     *   }
     * })
     * 
     */
    create<T extends WorkflowFieldCreateArgs>(args: SelectSubset<T, WorkflowFieldCreateArgs<ExtArgs>>): Prisma__WorkflowFieldClient<$Result.GetResult<Prisma.$WorkflowFieldPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many WorkflowFields.
     * @param {WorkflowFieldCreateManyArgs} args - Arguments to create many WorkflowFields.
     * @example
     * // Create many WorkflowFields
     * const workflowField = await prisma.workflowField.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WorkflowFieldCreateManyArgs>(args?: SelectSubset<T, WorkflowFieldCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WorkflowFields and returns the data saved in the database.
     * @param {WorkflowFieldCreateManyAndReturnArgs} args - Arguments to create many WorkflowFields.
     * @example
     * // Create many WorkflowFields
     * const workflowField = await prisma.workflowField.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WorkflowFields and only return the `id`
     * const workflowFieldWithIdOnly = await prisma.workflowField.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WorkflowFieldCreateManyAndReturnArgs>(args?: SelectSubset<T, WorkflowFieldCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkflowFieldPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a WorkflowField.
     * @param {WorkflowFieldDeleteArgs} args - Arguments to delete one WorkflowField.
     * @example
     * // Delete one WorkflowField
     * const WorkflowField = await prisma.workflowField.delete({
     *   where: {
     *     // ... filter to delete one WorkflowField
     *   }
     * })
     * 
     */
    delete<T extends WorkflowFieldDeleteArgs>(args: SelectSubset<T, WorkflowFieldDeleteArgs<ExtArgs>>): Prisma__WorkflowFieldClient<$Result.GetResult<Prisma.$WorkflowFieldPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one WorkflowField.
     * @param {WorkflowFieldUpdateArgs} args - Arguments to update one WorkflowField.
     * @example
     * // Update one WorkflowField
     * const workflowField = await prisma.workflowField.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WorkflowFieldUpdateArgs>(args: SelectSubset<T, WorkflowFieldUpdateArgs<ExtArgs>>): Prisma__WorkflowFieldClient<$Result.GetResult<Prisma.$WorkflowFieldPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more WorkflowFields.
     * @param {WorkflowFieldDeleteManyArgs} args - Arguments to filter WorkflowFields to delete.
     * @example
     * // Delete a few WorkflowFields
     * const { count } = await prisma.workflowField.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WorkflowFieldDeleteManyArgs>(args?: SelectSubset<T, WorkflowFieldDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WorkflowFields.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowFieldUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WorkflowFields
     * const workflowField = await prisma.workflowField.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WorkflowFieldUpdateManyArgs>(args: SelectSubset<T, WorkflowFieldUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one WorkflowField.
     * @param {WorkflowFieldUpsertArgs} args - Arguments to update or create a WorkflowField.
     * @example
     * // Update or create a WorkflowField
     * const workflowField = await prisma.workflowField.upsert({
     *   create: {
     *     // ... data to create a WorkflowField
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WorkflowField we want to update
     *   }
     * })
     */
    upsert<T extends WorkflowFieldUpsertArgs>(args: SelectSubset<T, WorkflowFieldUpsertArgs<ExtArgs>>): Prisma__WorkflowFieldClient<$Result.GetResult<Prisma.$WorkflowFieldPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of WorkflowFields.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowFieldCountArgs} args - Arguments to filter WorkflowFields to count.
     * @example
     * // Count the number of WorkflowFields
     * const count = await prisma.workflowField.count({
     *   where: {
     *     // ... the filter for the WorkflowFields we want to count
     *   }
     * })
    **/
    count<T extends WorkflowFieldCountArgs>(
      args?: Subset<T, WorkflowFieldCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorkflowFieldCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WorkflowField.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowFieldAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WorkflowFieldAggregateArgs>(args: Subset<T, WorkflowFieldAggregateArgs>): Prisma.PrismaPromise<GetWorkflowFieldAggregateType<T>>

    /**
     * Group by WorkflowField.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowFieldGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WorkflowFieldGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WorkflowFieldGroupByArgs['orderBy'] }
        : { orderBy?: WorkflowFieldGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WorkflowFieldGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkflowFieldGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WorkflowField model
   */
  readonly fields: WorkflowFieldFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WorkflowField.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorkflowFieldClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sourceNode<T extends WorkflowNodeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkflowNodeDefaultArgs<ExtArgs>>): Prisma__WorkflowNodeClient<$Result.GetResult<Prisma.$WorkflowNodePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    workflow<T extends WorkflowDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkflowDefaultArgs<ExtArgs>>): Prisma__WorkflowClient<$Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WorkflowField model
   */ 
  interface WorkflowFieldFieldRefs {
    readonly id: FieldRef<"WorkflowField", 'String'>
    readonly workflowId: FieldRef<"WorkflowField", 'String'>
    readonly sourceNodeId: FieldRef<"WorkflowField", 'String'>
    readonly fieldName: FieldRef<"WorkflowField", 'String'>
    readonly fieldPath: FieldRef<"WorkflowField", 'String'>
    readonly fieldType: FieldRef<"WorkflowField", 'String'>
    readonly createdAt: FieldRef<"WorkflowField", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WorkflowField findUnique
   */
  export type WorkflowFieldFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowField
     */
    select?: WorkflowFieldSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowFieldInclude<ExtArgs> | null
    /**
     * Filter, which WorkflowField to fetch.
     */
    where: WorkflowFieldWhereUniqueInput
  }

  /**
   * WorkflowField findUniqueOrThrow
   */
  export type WorkflowFieldFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowField
     */
    select?: WorkflowFieldSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowFieldInclude<ExtArgs> | null
    /**
     * Filter, which WorkflowField to fetch.
     */
    where: WorkflowFieldWhereUniqueInput
  }

  /**
   * WorkflowField findFirst
   */
  export type WorkflowFieldFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowField
     */
    select?: WorkflowFieldSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowFieldInclude<ExtArgs> | null
    /**
     * Filter, which WorkflowField to fetch.
     */
    where?: WorkflowFieldWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkflowFields to fetch.
     */
    orderBy?: WorkflowFieldOrderByWithRelationInput | WorkflowFieldOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkflowFields.
     */
    cursor?: WorkflowFieldWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkflowFields from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkflowFields.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkflowFields.
     */
    distinct?: WorkflowFieldScalarFieldEnum | WorkflowFieldScalarFieldEnum[]
  }

  /**
   * WorkflowField findFirstOrThrow
   */
  export type WorkflowFieldFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowField
     */
    select?: WorkflowFieldSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowFieldInclude<ExtArgs> | null
    /**
     * Filter, which WorkflowField to fetch.
     */
    where?: WorkflowFieldWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkflowFields to fetch.
     */
    orderBy?: WorkflowFieldOrderByWithRelationInput | WorkflowFieldOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkflowFields.
     */
    cursor?: WorkflowFieldWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkflowFields from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkflowFields.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkflowFields.
     */
    distinct?: WorkflowFieldScalarFieldEnum | WorkflowFieldScalarFieldEnum[]
  }

  /**
   * WorkflowField findMany
   */
  export type WorkflowFieldFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowField
     */
    select?: WorkflowFieldSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowFieldInclude<ExtArgs> | null
    /**
     * Filter, which WorkflowFields to fetch.
     */
    where?: WorkflowFieldWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkflowFields to fetch.
     */
    orderBy?: WorkflowFieldOrderByWithRelationInput | WorkflowFieldOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WorkflowFields.
     */
    cursor?: WorkflowFieldWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkflowFields from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkflowFields.
     */
    skip?: number
    distinct?: WorkflowFieldScalarFieldEnum | WorkflowFieldScalarFieldEnum[]
  }

  /**
   * WorkflowField create
   */
  export type WorkflowFieldCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowField
     */
    select?: WorkflowFieldSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowFieldInclude<ExtArgs> | null
    /**
     * The data needed to create a WorkflowField.
     */
    data: XOR<WorkflowFieldCreateInput, WorkflowFieldUncheckedCreateInput>
  }

  /**
   * WorkflowField createMany
   */
  export type WorkflowFieldCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WorkflowFields.
     */
    data: WorkflowFieldCreateManyInput | WorkflowFieldCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WorkflowField createManyAndReturn
   */
  export type WorkflowFieldCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowField
     */
    select?: WorkflowFieldSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many WorkflowFields.
     */
    data: WorkflowFieldCreateManyInput | WorkflowFieldCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowFieldIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WorkflowField update
   */
  export type WorkflowFieldUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowField
     */
    select?: WorkflowFieldSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowFieldInclude<ExtArgs> | null
    /**
     * The data needed to update a WorkflowField.
     */
    data: XOR<WorkflowFieldUpdateInput, WorkflowFieldUncheckedUpdateInput>
    /**
     * Choose, which WorkflowField to update.
     */
    where: WorkflowFieldWhereUniqueInput
  }

  /**
   * WorkflowField updateMany
   */
  export type WorkflowFieldUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WorkflowFields.
     */
    data: XOR<WorkflowFieldUpdateManyMutationInput, WorkflowFieldUncheckedUpdateManyInput>
    /**
     * Filter which WorkflowFields to update
     */
    where?: WorkflowFieldWhereInput
  }

  /**
   * WorkflowField upsert
   */
  export type WorkflowFieldUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowField
     */
    select?: WorkflowFieldSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowFieldInclude<ExtArgs> | null
    /**
     * The filter to search for the WorkflowField to update in case it exists.
     */
    where: WorkflowFieldWhereUniqueInput
    /**
     * In case the WorkflowField found by the `where` argument doesn't exist, create a new WorkflowField with this data.
     */
    create: XOR<WorkflowFieldCreateInput, WorkflowFieldUncheckedCreateInput>
    /**
     * In case the WorkflowField was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorkflowFieldUpdateInput, WorkflowFieldUncheckedUpdateInput>
  }

  /**
   * WorkflowField delete
   */
  export type WorkflowFieldDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowField
     */
    select?: WorkflowFieldSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowFieldInclude<ExtArgs> | null
    /**
     * Filter which WorkflowField to delete.
     */
    where: WorkflowFieldWhereUniqueInput
  }

  /**
   * WorkflowField deleteMany
   */
  export type WorkflowFieldDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkflowFields to delete
     */
    where?: WorkflowFieldWhereInput
  }

  /**
   * WorkflowField without action
   */
  export type WorkflowFieldDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowField
     */
    select?: WorkflowFieldSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowFieldInclude<ExtArgs> | null
  }


  /**
   * Model WorkflowRole
   */

  export type AggregateWorkflowRole = {
    _count: WorkflowRoleCountAggregateOutputType | null
    _min: WorkflowRoleMinAggregateOutputType | null
    _max: WorkflowRoleMaxAggregateOutputType | null
  }

  export type WorkflowRoleMinAggregateOutputType = {
    id: string | null
    workflowId: string | null
    name: string | null
    description: string | null
    isSystem: boolean | null
    createdAt: Date | null
  }

  export type WorkflowRoleMaxAggregateOutputType = {
    id: string | null
    workflowId: string | null
    name: string | null
    description: string | null
    isSystem: boolean | null
    createdAt: Date | null
  }

  export type WorkflowRoleCountAggregateOutputType = {
    id: number
    workflowId: number
    name: number
    description: number
    permissions: number
    isSystem: number
    createdAt: number
    _all: number
  }


  export type WorkflowRoleMinAggregateInputType = {
    id?: true
    workflowId?: true
    name?: true
    description?: true
    isSystem?: true
    createdAt?: true
  }

  export type WorkflowRoleMaxAggregateInputType = {
    id?: true
    workflowId?: true
    name?: true
    description?: true
    isSystem?: true
    createdAt?: true
  }

  export type WorkflowRoleCountAggregateInputType = {
    id?: true
    workflowId?: true
    name?: true
    description?: true
    permissions?: true
    isSystem?: true
    createdAt?: true
    _all?: true
  }

  export type WorkflowRoleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkflowRole to aggregate.
     */
    where?: WorkflowRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkflowRoles to fetch.
     */
    orderBy?: WorkflowRoleOrderByWithRelationInput | WorkflowRoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WorkflowRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkflowRoles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkflowRoles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WorkflowRoles
    **/
    _count?: true | WorkflowRoleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WorkflowRoleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WorkflowRoleMaxAggregateInputType
  }

  export type GetWorkflowRoleAggregateType<T extends WorkflowRoleAggregateArgs> = {
        [P in keyof T & keyof AggregateWorkflowRole]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorkflowRole[P]>
      : GetScalarType<T[P], AggregateWorkflowRole[P]>
  }




  export type WorkflowRoleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkflowRoleWhereInput
    orderBy?: WorkflowRoleOrderByWithAggregationInput | WorkflowRoleOrderByWithAggregationInput[]
    by: WorkflowRoleScalarFieldEnum[] | WorkflowRoleScalarFieldEnum
    having?: WorkflowRoleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WorkflowRoleCountAggregateInputType | true
    _min?: WorkflowRoleMinAggregateInputType
    _max?: WorkflowRoleMaxAggregateInputType
  }

  export type WorkflowRoleGroupByOutputType = {
    id: string
    workflowId: string
    name: string
    description: string | null
    permissions: $Enums.Permission[]
    isSystem: boolean
    createdAt: Date
    _count: WorkflowRoleCountAggregateOutputType | null
    _min: WorkflowRoleMinAggregateOutputType | null
    _max: WorkflowRoleMaxAggregateOutputType | null
  }

  type GetWorkflowRoleGroupByPayload<T extends WorkflowRoleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WorkflowRoleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WorkflowRoleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorkflowRoleGroupByOutputType[P]>
            : GetScalarType<T[P], WorkflowRoleGroupByOutputType[P]>
        }
      >
    >


  export type WorkflowRoleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workflowId?: boolean
    name?: boolean
    description?: boolean
    permissions?: boolean
    isSystem?: boolean
    createdAt?: boolean
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
    assignments?: boolean | WorkflowRole$assignmentsArgs<ExtArgs>
    _count?: boolean | WorkflowRoleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workflowRole"]>

  export type WorkflowRoleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workflowId?: boolean
    name?: boolean
    description?: boolean
    permissions?: boolean
    isSystem?: boolean
    createdAt?: boolean
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workflowRole"]>

  export type WorkflowRoleSelectScalar = {
    id?: boolean
    workflowId?: boolean
    name?: boolean
    description?: boolean
    permissions?: boolean
    isSystem?: boolean
    createdAt?: boolean
  }

  export type WorkflowRoleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
    assignments?: boolean | WorkflowRole$assignmentsArgs<ExtArgs>
    _count?: boolean | WorkflowRoleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WorkflowRoleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workflow?: boolean | WorkflowDefaultArgs<ExtArgs>
  }

  export type $WorkflowRolePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WorkflowRole"
    objects: {
      workflow: Prisma.$WorkflowPayload<ExtArgs>
      assignments: Prisma.$WorkflowRoleAssignmentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      workflowId: string
      name: string
      description: string | null
      permissions: $Enums.Permission[]
      isSystem: boolean
      createdAt: Date
    }, ExtArgs["result"]["workflowRole"]>
    composites: {}
  }

  type WorkflowRoleGetPayload<S extends boolean | null | undefined | WorkflowRoleDefaultArgs> = $Result.GetResult<Prisma.$WorkflowRolePayload, S>

  type WorkflowRoleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<WorkflowRoleFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: WorkflowRoleCountAggregateInputType | true
    }

  export interface WorkflowRoleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WorkflowRole'], meta: { name: 'WorkflowRole' } }
    /**
     * Find zero or one WorkflowRole that matches the filter.
     * @param {WorkflowRoleFindUniqueArgs} args - Arguments to find a WorkflowRole
     * @example
     * // Get one WorkflowRole
     * const workflowRole = await prisma.workflowRole.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkflowRoleFindUniqueArgs>(args: SelectSubset<T, WorkflowRoleFindUniqueArgs<ExtArgs>>): Prisma__WorkflowRoleClient<$Result.GetResult<Prisma.$WorkflowRolePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one WorkflowRole that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {WorkflowRoleFindUniqueOrThrowArgs} args - Arguments to find a WorkflowRole
     * @example
     * // Get one WorkflowRole
     * const workflowRole = await prisma.workflowRole.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkflowRoleFindUniqueOrThrowArgs>(args: SelectSubset<T, WorkflowRoleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WorkflowRoleClient<$Result.GetResult<Prisma.$WorkflowRolePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first WorkflowRole that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowRoleFindFirstArgs} args - Arguments to find a WorkflowRole
     * @example
     * // Get one WorkflowRole
     * const workflowRole = await prisma.workflowRole.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkflowRoleFindFirstArgs>(args?: SelectSubset<T, WorkflowRoleFindFirstArgs<ExtArgs>>): Prisma__WorkflowRoleClient<$Result.GetResult<Prisma.$WorkflowRolePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first WorkflowRole that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowRoleFindFirstOrThrowArgs} args - Arguments to find a WorkflowRole
     * @example
     * // Get one WorkflowRole
     * const workflowRole = await prisma.workflowRole.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkflowRoleFindFirstOrThrowArgs>(args?: SelectSubset<T, WorkflowRoleFindFirstOrThrowArgs<ExtArgs>>): Prisma__WorkflowRoleClient<$Result.GetResult<Prisma.$WorkflowRolePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more WorkflowRoles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowRoleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WorkflowRoles
     * const workflowRoles = await prisma.workflowRole.findMany()
     * 
     * // Get first 10 WorkflowRoles
     * const workflowRoles = await prisma.workflowRole.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const workflowRoleWithIdOnly = await prisma.workflowRole.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WorkflowRoleFindManyArgs>(args?: SelectSubset<T, WorkflowRoleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkflowRolePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a WorkflowRole.
     * @param {WorkflowRoleCreateArgs} args - Arguments to create a WorkflowRole.
     * @example
     * // Create one WorkflowRole
     * const WorkflowRole = await prisma.workflowRole.create({
     *   data: {
     *     // ... data to create a WorkflowRole
     *   }
     * })
     * 
     */
    create<T extends WorkflowRoleCreateArgs>(args: SelectSubset<T, WorkflowRoleCreateArgs<ExtArgs>>): Prisma__WorkflowRoleClient<$Result.GetResult<Prisma.$WorkflowRolePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many WorkflowRoles.
     * @param {WorkflowRoleCreateManyArgs} args - Arguments to create many WorkflowRoles.
     * @example
     * // Create many WorkflowRoles
     * const workflowRole = await prisma.workflowRole.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WorkflowRoleCreateManyArgs>(args?: SelectSubset<T, WorkflowRoleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WorkflowRoles and returns the data saved in the database.
     * @param {WorkflowRoleCreateManyAndReturnArgs} args - Arguments to create many WorkflowRoles.
     * @example
     * // Create many WorkflowRoles
     * const workflowRole = await prisma.workflowRole.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WorkflowRoles and only return the `id`
     * const workflowRoleWithIdOnly = await prisma.workflowRole.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WorkflowRoleCreateManyAndReturnArgs>(args?: SelectSubset<T, WorkflowRoleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkflowRolePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a WorkflowRole.
     * @param {WorkflowRoleDeleteArgs} args - Arguments to delete one WorkflowRole.
     * @example
     * // Delete one WorkflowRole
     * const WorkflowRole = await prisma.workflowRole.delete({
     *   where: {
     *     // ... filter to delete one WorkflowRole
     *   }
     * })
     * 
     */
    delete<T extends WorkflowRoleDeleteArgs>(args: SelectSubset<T, WorkflowRoleDeleteArgs<ExtArgs>>): Prisma__WorkflowRoleClient<$Result.GetResult<Prisma.$WorkflowRolePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one WorkflowRole.
     * @param {WorkflowRoleUpdateArgs} args - Arguments to update one WorkflowRole.
     * @example
     * // Update one WorkflowRole
     * const workflowRole = await prisma.workflowRole.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WorkflowRoleUpdateArgs>(args: SelectSubset<T, WorkflowRoleUpdateArgs<ExtArgs>>): Prisma__WorkflowRoleClient<$Result.GetResult<Prisma.$WorkflowRolePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more WorkflowRoles.
     * @param {WorkflowRoleDeleteManyArgs} args - Arguments to filter WorkflowRoles to delete.
     * @example
     * // Delete a few WorkflowRoles
     * const { count } = await prisma.workflowRole.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WorkflowRoleDeleteManyArgs>(args?: SelectSubset<T, WorkflowRoleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WorkflowRoles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowRoleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WorkflowRoles
     * const workflowRole = await prisma.workflowRole.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WorkflowRoleUpdateManyArgs>(args: SelectSubset<T, WorkflowRoleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one WorkflowRole.
     * @param {WorkflowRoleUpsertArgs} args - Arguments to update or create a WorkflowRole.
     * @example
     * // Update or create a WorkflowRole
     * const workflowRole = await prisma.workflowRole.upsert({
     *   create: {
     *     // ... data to create a WorkflowRole
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WorkflowRole we want to update
     *   }
     * })
     */
    upsert<T extends WorkflowRoleUpsertArgs>(args: SelectSubset<T, WorkflowRoleUpsertArgs<ExtArgs>>): Prisma__WorkflowRoleClient<$Result.GetResult<Prisma.$WorkflowRolePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of WorkflowRoles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowRoleCountArgs} args - Arguments to filter WorkflowRoles to count.
     * @example
     * // Count the number of WorkflowRoles
     * const count = await prisma.workflowRole.count({
     *   where: {
     *     // ... the filter for the WorkflowRoles we want to count
     *   }
     * })
    **/
    count<T extends WorkflowRoleCountArgs>(
      args?: Subset<T, WorkflowRoleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorkflowRoleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WorkflowRole.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowRoleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WorkflowRoleAggregateArgs>(args: Subset<T, WorkflowRoleAggregateArgs>): Prisma.PrismaPromise<GetWorkflowRoleAggregateType<T>>

    /**
     * Group by WorkflowRole.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowRoleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WorkflowRoleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WorkflowRoleGroupByArgs['orderBy'] }
        : { orderBy?: WorkflowRoleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WorkflowRoleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkflowRoleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WorkflowRole model
   */
  readonly fields: WorkflowRoleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WorkflowRole.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorkflowRoleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    workflow<T extends WorkflowDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkflowDefaultArgs<ExtArgs>>): Prisma__WorkflowClient<$Result.GetResult<Prisma.$WorkflowPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    assignments<T extends WorkflowRole$assignmentsArgs<ExtArgs> = {}>(args?: Subset<T, WorkflowRole$assignmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkflowRoleAssignmentPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WorkflowRole model
   */ 
  interface WorkflowRoleFieldRefs {
    readonly id: FieldRef<"WorkflowRole", 'String'>
    readonly workflowId: FieldRef<"WorkflowRole", 'String'>
    readonly name: FieldRef<"WorkflowRole", 'String'>
    readonly description: FieldRef<"WorkflowRole", 'String'>
    readonly permissions: FieldRef<"WorkflowRole", 'Permission[]'>
    readonly isSystem: FieldRef<"WorkflowRole", 'Boolean'>
    readonly createdAt: FieldRef<"WorkflowRole", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WorkflowRole findUnique
   */
  export type WorkflowRoleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowRole
     */
    select?: WorkflowRoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowRoleInclude<ExtArgs> | null
    /**
     * Filter, which WorkflowRole to fetch.
     */
    where: WorkflowRoleWhereUniqueInput
  }

  /**
   * WorkflowRole findUniqueOrThrow
   */
  export type WorkflowRoleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowRole
     */
    select?: WorkflowRoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowRoleInclude<ExtArgs> | null
    /**
     * Filter, which WorkflowRole to fetch.
     */
    where: WorkflowRoleWhereUniqueInput
  }

  /**
   * WorkflowRole findFirst
   */
  export type WorkflowRoleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowRole
     */
    select?: WorkflowRoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowRoleInclude<ExtArgs> | null
    /**
     * Filter, which WorkflowRole to fetch.
     */
    where?: WorkflowRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkflowRoles to fetch.
     */
    orderBy?: WorkflowRoleOrderByWithRelationInput | WorkflowRoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkflowRoles.
     */
    cursor?: WorkflowRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkflowRoles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkflowRoles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkflowRoles.
     */
    distinct?: WorkflowRoleScalarFieldEnum | WorkflowRoleScalarFieldEnum[]
  }

  /**
   * WorkflowRole findFirstOrThrow
   */
  export type WorkflowRoleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowRole
     */
    select?: WorkflowRoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowRoleInclude<ExtArgs> | null
    /**
     * Filter, which WorkflowRole to fetch.
     */
    where?: WorkflowRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkflowRoles to fetch.
     */
    orderBy?: WorkflowRoleOrderByWithRelationInput | WorkflowRoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkflowRoles.
     */
    cursor?: WorkflowRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkflowRoles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkflowRoles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkflowRoles.
     */
    distinct?: WorkflowRoleScalarFieldEnum | WorkflowRoleScalarFieldEnum[]
  }

  /**
   * WorkflowRole findMany
   */
  export type WorkflowRoleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowRole
     */
    select?: WorkflowRoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowRoleInclude<ExtArgs> | null
    /**
     * Filter, which WorkflowRoles to fetch.
     */
    where?: WorkflowRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkflowRoles to fetch.
     */
    orderBy?: WorkflowRoleOrderByWithRelationInput | WorkflowRoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WorkflowRoles.
     */
    cursor?: WorkflowRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkflowRoles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkflowRoles.
     */
    skip?: number
    distinct?: WorkflowRoleScalarFieldEnum | WorkflowRoleScalarFieldEnum[]
  }

  /**
   * WorkflowRole create
   */
  export type WorkflowRoleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowRole
     */
    select?: WorkflowRoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowRoleInclude<ExtArgs> | null
    /**
     * The data needed to create a WorkflowRole.
     */
    data: XOR<WorkflowRoleCreateInput, WorkflowRoleUncheckedCreateInput>
  }

  /**
   * WorkflowRole createMany
   */
  export type WorkflowRoleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WorkflowRoles.
     */
    data: WorkflowRoleCreateManyInput | WorkflowRoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WorkflowRole createManyAndReturn
   */
  export type WorkflowRoleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowRole
     */
    select?: WorkflowRoleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many WorkflowRoles.
     */
    data: WorkflowRoleCreateManyInput | WorkflowRoleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowRoleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WorkflowRole update
   */
  export type WorkflowRoleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowRole
     */
    select?: WorkflowRoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowRoleInclude<ExtArgs> | null
    /**
     * The data needed to update a WorkflowRole.
     */
    data: XOR<WorkflowRoleUpdateInput, WorkflowRoleUncheckedUpdateInput>
    /**
     * Choose, which WorkflowRole to update.
     */
    where: WorkflowRoleWhereUniqueInput
  }

  /**
   * WorkflowRole updateMany
   */
  export type WorkflowRoleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WorkflowRoles.
     */
    data: XOR<WorkflowRoleUpdateManyMutationInput, WorkflowRoleUncheckedUpdateManyInput>
    /**
     * Filter which WorkflowRoles to update
     */
    where?: WorkflowRoleWhereInput
  }

  /**
   * WorkflowRole upsert
   */
  export type WorkflowRoleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowRole
     */
    select?: WorkflowRoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowRoleInclude<ExtArgs> | null
    /**
     * The filter to search for the WorkflowRole to update in case it exists.
     */
    where: WorkflowRoleWhereUniqueInput
    /**
     * In case the WorkflowRole found by the `where` argument doesn't exist, create a new WorkflowRole with this data.
     */
    create: XOR<WorkflowRoleCreateInput, WorkflowRoleUncheckedCreateInput>
    /**
     * In case the WorkflowRole was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorkflowRoleUpdateInput, WorkflowRoleUncheckedUpdateInput>
  }

  /**
   * WorkflowRole delete
   */
  export type WorkflowRoleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowRole
     */
    select?: WorkflowRoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowRoleInclude<ExtArgs> | null
    /**
     * Filter which WorkflowRole to delete.
     */
    where: WorkflowRoleWhereUniqueInput
  }

  /**
   * WorkflowRole deleteMany
   */
  export type WorkflowRoleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkflowRoles to delete
     */
    where?: WorkflowRoleWhereInput
  }

  /**
   * WorkflowRole.assignments
   */
  export type WorkflowRole$assignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowRoleAssignment
     */
    select?: WorkflowRoleAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowRoleAssignmentInclude<ExtArgs> | null
    where?: WorkflowRoleAssignmentWhereInput
    orderBy?: WorkflowRoleAssignmentOrderByWithRelationInput | WorkflowRoleAssignmentOrderByWithRelationInput[]
    cursor?: WorkflowRoleAssignmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WorkflowRoleAssignmentScalarFieldEnum | WorkflowRoleAssignmentScalarFieldEnum[]
  }

  /**
   * WorkflowRole without action
   */
  export type WorkflowRoleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowRole
     */
    select?: WorkflowRoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowRoleInclude<ExtArgs> | null
  }


  /**
   * Model WorkflowRoleAssignment
   */

  export type AggregateWorkflowRoleAssignment = {
    _count: WorkflowRoleAssignmentCountAggregateOutputType | null
    _min: WorkflowRoleAssignmentMinAggregateOutputType | null
    _max: WorkflowRoleAssignmentMaxAggregateOutputType | null
  }

  export type WorkflowRoleAssignmentMinAggregateOutputType = {
    id: string | null
    userId: string | null
    userEmail: string | null
    workflowRoleId: string | null
    assignedAt: Date | null
    assignedBy: string | null
  }

  export type WorkflowRoleAssignmentMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    userEmail: string | null
    workflowRoleId: string | null
    assignedAt: Date | null
    assignedBy: string | null
  }

  export type WorkflowRoleAssignmentCountAggregateOutputType = {
    id: number
    userId: number
    userEmail: number
    workflowRoleId: number
    assignedAt: number
    assignedBy: number
    _all: number
  }


  export type WorkflowRoleAssignmentMinAggregateInputType = {
    id?: true
    userId?: true
    userEmail?: true
    workflowRoleId?: true
    assignedAt?: true
    assignedBy?: true
  }

  export type WorkflowRoleAssignmentMaxAggregateInputType = {
    id?: true
    userId?: true
    userEmail?: true
    workflowRoleId?: true
    assignedAt?: true
    assignedBy?: true
  }

  export type WorkflowRoleAssignmentCountAggregateInputType = {
    id?: true
    userId?: true
    userEmail?: true
    workflowRoleId?: true
    assignedAt?: true
    assignedBy?: true
    _all?: true
  }

  export type WorkflowRoleAssignmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkflowRoleAssignment to aggregate.
     */
    where?: WorkflowRoleAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkflowRoleAssignments to fetch.
     */
    orderBy?: WorkflowRoleAssignmentOrderByWithRelationInput | WorkflowRoleAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WorkflowRoleAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkflowRoleAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkflowRoleAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WorkflowRoleAssignments
    **/
    _count?: true | WorkflowRoleAssignmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WorkflowRoleAssignmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WorkflowRoleAssignmentMaxAggregateInputType
  }

  export type GetWorkflowRoleAssignmentAggregateType<T extends WorkflowRoleAssignmentAggregateArgs> = {
        [P in keyof T & keyof AggregateWorkflowRoleAssignment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorkflowRoleAssignment[P]>
      : GetScalarType<T[P], AggregateWorkflowRoleAssignment[P]>
  }




  export type WorkflowRoleAssignmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkflowRoleAssignmentWhereInput
    orderBy?: WorkflowRoleAssignmentOrderByWithAggregationInput | WorkflowRoleAssignmentOrderByWithAggregationInput[]
    by: WorkflowRoleAssignmentScalarFieldEnum[] | WorkflowRoleAssignmentScalarFieldEnum
    having?: WorkflowRoleAssignmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WorkflowRoleAssignmentCountAggregateInputType | true
    _min?: WorkflowRoleAssignmentMinAggregateInputType
    _max?: WorkflowRoleAssignmentMaxAggregateInputType
  }

  export type WorkflowRoleAssignmentGroupByOutputType = {
    id: string
    userId: string
    userEmail: string | null
    workflowRoleId: string
    assignedAt: Date
    assignedBy: string | null
    _count: WorkflowRoleAssignmentCountAggregateOutputType | null
    _min: WorkflowRoleAssignmentMinAggregateOutputType | null
    _max: WorkflowRoleAssignmentMaxAggregateOutputType | null
  }

  type GetWorkflowRoleAssignmentGroupByPayload<T extends WorkflowRoleAssignmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WorkflowRoleAssignmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WorkflowRoleAssignmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorkflowRoleAssignmentGroupByOutputType[P]>
            : GetScalarType<T[P], WorkflowRoleAssignmentGroupByOutputType[P]>
        }
      >
    >


  export type WorkflowRoleAssignmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    userEmail?: boolean
    workflowRoleId?: boolean
    assignedAt?: boolean
    assignedBy?: boolean
    workflowRole?: boolean | WorkflowRoleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workflowRoleAssignment"]>

  export type WorkflowRoleAssignmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    userEmail?: boolean
    workflowRoleId?: boolean
    assignedAt?: boolean
    assignedBy?: boolean
    workflowRole?: boolean | WorkflowRoleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workflowRoleAssignment"]>

  export type WorkflowRoleAssignmentSelectScalar = {
    id?: boolean
    userId?: boolean
    userEmail?: boolean
    workflowRoleId?: boolean
    assignedAt?: boolean
    assignedBy?: boolean
  }

  export type WorkflowRoleAssignmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workflowRole?: boolean | WorkflowRoleDefaultArgs<ExtArgs>
  }
  export type WorkflowRoleAssignmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workflowRole?: boolean | WorkflowRoleDefaultArgs<ExtArgs>
  }

  export type $WorkflowRoleAssignmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WorkflowRoleAssignment"
    objects: {
      workflowRole: Prisma.$WorkflowRolePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      userEmail: string | null
      workflowRoleId: string
      assignedAt: Date
      assignedBy: string | null
    }, ExtArgs["result"]["workflowRoleAssignment"]>
    composites: {}
  }

  type WorkflowRoleAssignmentGetPayload<S extends boolean | null | undefined | WorkflowRoleAssignmentDefaultArgs> = $Result.GetResult<Prisma.$WorkflowRoleAssignmentPayload, S>

  type WorkflowRoleAssignmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<WorkflowRoleAssignmentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: WorkflowRoleAssignmentCountAggregateInputType | true
    }

  export interface WorkflowRoleAssignmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WorkflowRoleAssignment'], meta: { name: 'WorkflowRoleAssignment' } }
    /**
     * Find zero or one WorkflowRoleAssignment that matches the filter.
     * @param {WorkflowRoleAssignmentFindUniqueArgs} args - Arguments to find a WorkflowRoleAssignment
     * @example
     * // Get one WorkflowRoleAssignment
     * const workflowRoleAssignment = await prisma.workflowRoleAssignment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkflowRoleAssignmentFindUniqueArgs>(args: SelectSubset<T, WorkflowRoleAssignmentFindUniqueArgs<ExtArgs>>): Prisma__WorkflowRoleAssignmentClient<$Result.GetResult<Prisma.$WorkflowRoleAssignmentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one WorkflowRoleAssignment that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {WorkflowRoleAssignmentFindUniqueOrThrowArgs} args - Arguments to find a WorkflowRoleAssignment
     * @example
     * // Get one WorkflowRoleAssignment
     * const workflowRoleAssignment = await prisma.workflowRoleAssignment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkflowRoleAssignmentFindUniqueOrThrowArgs>(args: SelectSubset<T, WorkflowRoleAssignmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WorkflowRoleAssignmentClient<$Result.GetResult<Prisma.$WorkflowRoleAssignmentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first WorkflowRoleAssignment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowRoleAssignmentFindFirstArgs} args - Arguments to find a WorkflowRoleAssignment
     * @example
     * // Get one WorkflowRoleAssignment
     * const workflowRoleAssignment = await prisma.workflowRoleAssignment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkflowRoleAssignmentFindFirstArgs>(args?: SelectSubset<T, WorkflowRoleAssignmentFindFirstArgs<ExtArgs>>): Prisma__WorkflowRoleAssignmentClient<$Result.GetResult<Prisma.$WorkflowRoleAssignmentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first WorkflowRoleAssignment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowRoleAssignmentFindFirstOrThrowArgs} args - Arguments to find a WorkflowRoleAssignment
     * @example
     * // Get one WorkflowRoleAssignment
     * const workflowRoleAssignment = await prisma.workflowRoleAssignment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkflowRoleAssignmentFindFirstOrThrowArgs>(args?: SelectSubset<T, WorkflowRoleAssignmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__WorkflowRoleAssignmentClient<$Result.GetResult<Prisma.$WorkflowRoleAssignmentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more WorkflowRoleAssignments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowRoleAssignmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WorkflowRoleAssignments
     * const workflowRoleAssignments = await prisma.workflowRoleAssignment.findMany()
     * 
     * // Get first 10 WorkflowRoleAssignments
     * const workflowRoleAssignments = await prisma.workflowRoleAssignment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const workflowRoleAssignmentWithIdOnly = await prisma.workflowRoleAssignment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WorkflowRoleAssignmentFindManyArgs>(args?: SelectSubset<T, WorkflowRoleAssignmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkflowRoleAssignmentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a WorkflowRoleAssignment.
     * @param {WorkflowRoleAssignmentCreateArgs} args - Arguments to create a WorkflowRoleAssignment.
     * @example
     * // Create one WorkflowRoleAssignment
     * const WorkflowRoleAssignment = await prisma.workflowRoleAssignment.create({
     *   data: {
     *     // ... data to create a WorkflowRoleAssignment
     *   }
     * })
     * 
     */
    create<T extends WorkflowRoleAssignmentCreateArgs>(args: SelectSubset<T, WorkflowRoleAssignmentCreateArgs<ExtArgs>>): Prisma__WorkflowRoleAssignmentClient<$Result.GetResult<Prisma.$WorkflowRoleAssignmentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many WorkflowRoleAssignments.
     * @param {WorkflowRoleAssignmentCreateManyArgs} args - Arguments to create many WorkflowRoleAssignments.
     * @example
     * // Create many WorkflowRoleAssignments
     * const workflowRoleAssignment = await prisma.workflowRoleAssignment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WorkflowRoleAssignmentCreateManyArgs>(args?: SelectSubset<T, WorkflowRoleAssignmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WorkflowRoleAssignments and returns the data saved in the database.
     * @param {WorkflowRoleAssignmentCreateManyAndReturnArgs} args - Arguments to create many WorkflowRoleAssignments.
     * @example
     * // Create many WorkflowRoleAssignments
     * const workflowRoleAssignment = await prisma.workflowRoleAssignment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WorkflowRoleAssignments and only return the `id`
     * const workflowRoleAssignmentWithIdOnly = await prisma.workflowRoleAssignment.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WorkflowRoleAssignmentCreateManyAndReturnArgs>(args?: SelectSubset<T, WorkflowRoleAssignmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkflowRoleAssignmentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a WorkflowRoleAssignment.
     * @param {WorkflowRoleAssignmentDeleteArgs} args - Arguments to delete one WorkflowRoleAssignment.
     * @example
     * // Delete one WorkflowRoleAssignment
     * const WorkflowRoleAssignment = await prisma.workflowRoleAssignment.delete({
     *   where: {
     *     // ... filter to delete one WorkflowRoleAssignment
     *   }
     * })
     * 
     */
    delete<T extends WorkflowRoleAssignmentDeleteArgs>(args: SelectSubset<T, WorkflowRoleAssignmentDeleteArgs<ExtArgs>>): Prisma__WorkflowRoleAssignmentClient<$Result.GetResult<Prisma.$WorkflowRoleAssignmentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one WorkflowRoleAssignment.
     * @param {WorkflowRoleAssignmentUpdateArgs} args - Arguments to update one WorkflowRoleAssignment.
     * @example
     * // Update one WorkflowRoleAssignment
     * const workflowRoleAssignment = await prisma.workflowRoleAssignment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WorkflowRoleAssignmentUpdateArgs>(args: SelectSubset<T, WorkflowRoleAssignmentUpdateArgs<ExtArgs>>): Prisma__WorkflowRoleAssignmentClient<$Result.GetResult<Prisma.$WorkflowRoleAssignmentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more WorkflowRoleAssignments.
     * @param {WorkflowRoleAssignmentDeleteManyArgs} args - Arguments to filter WorkflowRoleAssignments to delete.
     * @example
     * // Delete a few WorkflowRoleAssignments
     * const { count } = await prisma.workflowRoleAssignment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WorkflowRoleAssignmentDeleteManyArgs>(args?: SelectSubset<T, WorkflowRoleAssignmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WorkflowRoleAssignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowRoleAssignmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WorkflowRoleAssignments
     * const workflowRoleAssignment = await prisma.workflowRoleAssignment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WorkflowRoleAssignmentUpdateManyArgs>(args: SelectSubset<T, WorkflowRoleAssignmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one WorkflowRoleAssignment.
     * @param {WorkflowRoleAssignmentUpsertArgs} args - Arguments to update or create a WorkflowRoleAssignment.
     * @example
     * // Update or create a WorkflowRoleAssignment
     * const workflowRoleAssignment = await prisma.workflowRoleAssignment.upsert({
     *   create: {
     *     // ... data to create a WorkflowRoleAssignment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WorkflowRoleAssignment we want to update
     *   }
     * })
     */
    upsert<T extends WorkflowRoleAssignmentUpsertArgs>(args: SelectSubset<T, WorkflowRoleAssignmentUpsertArgs<ExtArgs>>): Prisma__WorkflowRoleAssignmentClient<$Result.GetResult<Prisma.$WorkflowRoleAssignmentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of WorkflowRoleAssignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowRoleAssignmentCountArgs} args - Arguments to filter WorkflowRoleAssignments to count.
     * @example
     * // Count the number of WorkflowRoleAssignments
     * const count = await prisma.workflowRoleAssignment.count({
     *   where: {
     *     // ... the filter for the WorkflowRoleAssignments we want to count
     *   }
     * })
    **/
    count<T extends WorkflowRoleAssignmentCountArgs>(
      args?: Subset<T, WorkflowRoleAssignmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorkflowRoleAssignmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WorkflowRoleAssignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowRoleAssignmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WorkflowRoleAssignmentAggregateArgs>(args: Subset<T, WorkflowRoleAssignmentAggregateArgs>): Prisma.PrismaPromise<GetWorkflowRoleAssignmentAggregateType<T>>

    /**
     * Group by WorkflowRoleAssignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkflowRoleAssignmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WorkflowRoleAssignmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WorkflowRoleAssignmentGroupByArgs['orderBy'] }
        : { orderBy?: WorkflowRoleAssignmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WorkflowRoleAssignmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkflowRoleAssignmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WorkflowRoleAssignment model
   */
  readonly fields: WorkflowRoleAssignmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WorkflowRoleAssignment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorkflowRoleAssignmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    workflowRole<T extends WorkflowRoleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkflowRoleDefaultArgs<ExtArgs>>): Prisma__WorkflowRoleClient<$Result.GetResult<Prisma.$WorkflowRolePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WorkflowRoleAssignment model
   */ 
  interface WorkflowRoleAssignmentFieldRefs {
    readonly id: FieldRef<"WorkflowRoleAssignment", 'String'>
    readonly userId: FieldRef<"WorkflowRoleAssignment", 'String'>
    readonly userEmail: FieldRef<"WorkflowRoleAssignment", 'String'>
    readonly workflowRoleId: FieldRef<"WorkflowRoleAssignment", 'String'>
    readonly assignedAt: FieldRef<"WorkflowRoleAssignment", 'DateTime'>
    readonly assignedBy: FieldRef<"WorkflowRoleAssignment", 'String'>
  }
    

  // Custom InputTypes
  /**
   * WorkflowRoleAssignment findUnique
   */
  export type WorkflowRoleAssignmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowRoleAssignment
     */
    select?: WorkflowRoleAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowRoleAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which WorkflowRoleAssignment to fetch.
     */
    where: WorkflowRoleAssignmentWhereUniqueInput
  }

  /**
   * WorkflowRoleAssignment findUniqueOrThrow
   */
  export type WorkflowRoleAssignmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowRoleAssignment
     */
    select?: WorkflowRoleAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowRoleAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which WorkflowRoleAssignment to fetch.
     */
    where: WorkflowRoleAssignmentWhereUniqueInput
  }

  /**
   * WorkflowRoleAssignment findFirst
   */
  export type WorkflowRoleAssignmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowRoleAssignment
     */
    select?: WorkflowRoleAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowRoleAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which WorkflowRoleAssignment to fetch.
     */
    where?: WorkflowRoleAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkflowRoleAssignments to fetch.
     */
    orderBy?: WorkflowRoleAssignmentOrderByWithRelationInput | WorkflowRoleAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkflowRoleAssignments.
     */
    cursor?: WorkflowRoleAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkflowRoleAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkflowRoleAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkflowRoleAssignments.
     */
    distinct?: WorkflowRoleAssignmentScalarFieldEnum | WorkflowRoleAssignmentScalarFieldEnum[]
  }

  /**
   * WorkflowRoleAssignment findFirstOrThrow
   */
  export type WorkflowRoleAssignmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowRoleAssignment
     */
    select?: WorkflowRoleAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowRoleAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which WorkflowRoleAssignment to fetch.
     */
    where?: WorkflowRoleAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkflowRoleAssignments to fetch.
     */
    orderBy?: WorkflowRoleAssignmentOrderByWithRelationInput | WorkflowRoleAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkflowRoleAssignments.
     */
    cursor?: WorkflowRoleAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkflowRoleAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkflowRoleAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkflowRoleAssignments.
     */
    distinct?: WorkflowRoleAssignmentScalarFieldEnum | WorkflowRoleAssignmentScalarFieldEnum[]
  }

  /**
   * WorkflowRoleAssignment findMany
   */
  export type WorkflowRoleAssignmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowRoleAssignment
     */
    select?: WorkflowRoleAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowRoleAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which WorkflowRoleAssignments to fetch.
     */
    where?: WorkflowRoleAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkflowRoleAssignments to fetch.
     */
    orderBy?: WorkflowRoleAssignmentOrderByWithRelationInput | WorkflowRoleAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WorkflowRoleAssignments.
     */
    cursor?: WorkflowRoleAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkflowRoleAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkflowRoleAssignments.
     */
    skip?: number
    distinct?: WorkflowRoleAssignmentScalarFieldEnum | WorkflowRoleAssignmentScalarFieldEnum[]
  }

  /**
   * WorkflowRoleAssignment create
   */
  export type WorkflowRoleAssignmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowRoleAssignment
     */
    select?: WorkflowRoleAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowRoleAssignmentInclude<ExtArgs> | null
    /**
     * The data needed to create a WorkflowRoleAssignment.
     */
    data: XOR<WorkflowRoleAssignmentCreateInput, WorkflowRoleAssignmentUncheckedCreateInput>
  }

  /**
   * WorkflowRoleAssignment createMany
   */
  export type WorkflowRoleAssignmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WorkflowRoleAssignments.
     */
    data: WorkflowRoleAssignmentCreateManyInput | WorkflowRoleAssignmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WorkflowRoleAssignment createManyAndReturn
   */
  export type WorkflowRoleAssignmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowRoleAssignment
     */
    select?: WorkflowRoleAssignmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many WorkflowRoleAssignments.
     */
    data: WorkflowRoleAssignmentCreateManyInput | WorkflowRoleAssignmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowRoleAssignmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WorkflowRoleAssignment update
   */
  export type WorkflowRoleAssignmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowRoleAssignment
     */
    select?: WorkflowRoleAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowRoleAssignmentInclude<ExtArgs> | null
    /**
     * The data needed to update a WorkflowRoleAssignment.
     */
    data: XOR<WorkflowRoleAssignmentUpdateInput, WorkflowRoleAssignmentUncheckedUpdateInput>
    /**
     * Choose, which WorkflowRoleAssignment to update.
     */
    where: WorkflowRoleAssignmentWhereUniqueInput
  }

  /**
   * WorkflowRoleAssignment updateMany
   */
  export type WorkflowRoleAssignmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WorkflowRoleAssignments.
     */
    data: XOR<WorkflowRoleAssignmentUpdateManyMutationInput, WorkflowRoleAssignmentUncheckedUpdateManyInput>
    /**
     * Filter which WorkflowRoleAssignments to update
     */
    where?: WorkflowRoleAssignmentWhereInput
  }

  /**
   * WorkflowRoleAssignment upsert
   */
  export type WorkflowRoleAssignmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowRoleAssignment
     */
    select?: WorkflowRoleAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowRoleAssignmentInclude<ExtArgs> | null
    /**
     * The filter to search for the WorkflowRoleAssignment to update in case it exists.
     */
    where: WorkflowRoleAssignmentWhereUniqueInput
    /**
     * In case the WorkflowRoleAssignment found by the `where` argument doesn't exist, create a new WorkflowRoleAssignment with this data.
     */
    create: XOR<WorkflowRoleAssignmentCreateInput, WorkflowRoleAssignmentUncheckedCreateInput>
    /**
     * In case the WorkflowRoleAssignment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorkflowRoleAssignmentUpdateInput, WorkflowRoleAssignmentUncheckedUpdateInput>
  }

  /**
   * WorkflowRoleAssignment delete
   */
  export type WorkflowRoleAssignmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowRoleAssignment
     */
    select?: WorkflowRoleAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowRoleAssignmentInclude<ExtArgs> | null
    /**
     * Filter which WorkflowRoleAssignment to delete.
     */
    where: WorkflowRoleAssignmentWhereUniqueInput
  }

  /**
   * WorkflowRoleAssignment deleteMany
   */
  export type WorkflowRoleAssignmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkflowRoleAssignments to delete
     */
    where?: WorkflowRoleAssignmentWhereInput
  }

  /**
   * WorkflowRoleAssignment without action
   */
  export type WorkflowRoleAssignmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkflowRoleAssignment
     */
    select?: WorkflowRoleAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkflowRoleAssignmentInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const WorkflowScalarFieldEnum: {
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

  export type WorkflowScalarFieldEnum = (typeof WorkflowScalarFieldEnum)[keyof typeof WorkflowScalarFieldEnum]


  export const WorkflowNodeScalarFieldEnum: {
    id: 'id',
    workflowId: 'workflowId',
    config: 'config',
    positionX: 'positionX',
    positionY: 'positionY',
    actionId: 'actionId',
    isDeleted: 'isDeleted'
  };

  export type WorkflowNodeScalarFieldEnum = (typeof WorkflowNodeScalarFieldEnum)[keyof typeof WorkflowNodeScalarFieldEnum]


  export const WorkflowEdgeScalarFieldEnum: {
    id: 'id',
    workflowId: 'workflowId',
    sourceNodeId: 'sourceNodeId',
    targetNodeId: 'targetNodeId',
    isDeleted: 'isDeleted'
  };

  export type WorkflowEdgeScalarFieldEnum = (typeof WorkflowEdgeScalarFieldEnum)[keyof typeof WorkflowEdgeScalarFieldEnum]


  export const ActionCategoryScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description'
  };

  export type ActionCategoryScalarFieldEnum = (typeof ActionCategoryScalarFieldEnum)[keyof typeof ActionCategoryScalarFieldEnum]


  export const ActionScalarFieldEnum: {
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

  export type ActionScalarFieldEnum = (typeof ActionScalarFieldEnum)[keyof typeof ActionScalarFieldEnum]


  export const WorkflowFieldScalarFieldEnum: {
    id: 'id',
    workflowId: 'workflowId',
    sourceNodeId: 'sourceNodeId',
    fieldName: 'fieldName',
    fieldPath: 'fieldPath',
    fieldType: 'fieldType',
    createdAt: 'createdAt'
  };

  export type WorkflowFieldScalarFieldEnum = (typeof WorkflowFieldScalarFieldEnum)[keyof typeof WorkflowFieldScalarFieldEnum]


  export const WorkflowRoleScalarFieldEnum: {
    id: 'id',
    workflowId: 'workflowId',
    name: 'name',
    description: 'description',
    permissions: 'permissions',
    isSystem: 'isSystem',
    createdAt: 'createdAt'
  };

  export type WorkflowRoleScalarFieldEnum = (typeof WorkflowRoleScalarFieldEnum)[keyof typeof WorkflowRoleScalarFieldEnum]


  export const WorkflowRoleAssignmentScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    userEmail: 'userEmail',
    workflowRoleId: 'workflowRoleId',
    assignedAt: 'assignedAt',
    assignedBy: 'assignedBy'
  };

  export type WorkflowRoleAssignmentScalarFieldEnum = (typeof WorkflowRoleAssignmentScalarFieldEnum)[keyof typeof WorkflowRoleAssignmentScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Permission[]'
   */
  export type ListEnumPermissionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Permission[]'>
    


  /**
   * Reference to a field of type 'Permission'
   */
  export type EnumPermissionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Permission'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    workflows?: WorkflowListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    workflows?: WorkflowOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    workflows?: WorkflowListRelationFilter
  }, "id">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
  }

  export type WorkflowWhereInput = {
    AND?: WorkflowWhereInput | WorkflowWhereInput[]
    OR?: WorkflowWhereInput[]
    NOT?: WorkflowWhereInput | WorkflowWhereInput[]
    id?: StringFilter<"Workflow"> | string
    userId?: StringFilter<"Workflow"> | string
    name?: StringFilter<"Workflow"> | string
    createdAt?: DateTimeFilter<"Workflow"> | Date | string
    updatedAt?: DateTimeFilter<"Workflow"> | Date | string
    isDeleted?: BoolFilter<"Workflow"> | boolean
    isPublished?: BoolFilter<"Workflow"> | boolean
    publishedWorkflowId?: StringNullableFilter<"Workflow"> | string | null
    publishedAt?: DateTimeNullableFilter<"Workflow"> | Date | string | null
    lastPublishedAt?: DateTimeNullableFilter<"Workflow"> | Date | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
    edges?: WorkflowEdgeListRelationFilter
    nodes?: WorkflowNodeListRelationFilter
    fields?: WorkflowFieldListRelationFilter
    roles?: WorkflowRoleListRelationFilter
  }

  export type WorkflowOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isDeleted?: SortOrder
    isPublished?: SortOrder
    publishedWorkflowId?: SortOrderInput | SortOrder
    publishedAt?: SortOrderInput | SortOrder
    lastPublishedAt?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    edges?: WorkflowEdgeOrderByRelationAggregateInput
    nodes?: WorkflowNodeOrderByRelationAggregateInput
    fields?: WorkflowFieldOrderByRelationAggregateInput
    roles?: WorkflowRoleOrderByRelationAggregateInput
  }

  export type WorkflowWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WorkflowWhereInput | WorkflowWhereInput[]
    OR?: WorkflowWhereInput[]
    NOT?: WorkflowWhereInput | WorkflowWhereInput[]
    userId?: StringFilter<"Workflow"> | string
    name?: StringFilter<"Workflow"> | string
    createdAt?: DateTimeFilter<"Workflow"> | Date | string
    updatedAt?: DateTimeFilter<"Workflow"> | Date | string
    isDeleted?: BoolFilter<"Workflow"> | boolean
    isPublished?: BoolFilter<"Workflow"> | boolean
    publishedWorkflowId?: StringNullableFilter<"Workflow"> | string | null
    publishedAt?: DateTimeNullableFilter<"Workflow"> | Date | string | null
    lastPublishedAt?: DateTimeNullableFilter<"Workflow"> | Date | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
    edges?: WorkflowEdgeListRelationFilter
    nodes?: WorkflowNodeListRelationFilter
    fields?: WorkflowFieldListRelationFilter
    roles?: WorkflowRoleListRelationFilter
  }, "id">

  export type WorkflowOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isDeleted?: SortOrder
    isPublished?: SortOrder
    publishedWorkflowId?: SortOrderInput | SortOrder
    publishedAt?: SortOrderInput | SortOrder
    lastPublishedAt?: SortOrderInput | SortOrder
    _count?: WorkflowCountOrderByAggregateInput
    _max?: WorkflowMaxOrderByAggregateInput
    _min?: WorkflowMinOrderByAggregateInput
  }

  export type WorkflowScalarWhereWithAggregatesInput = {
    AND?: WorkflowScalarWhereWithAggregatesInput | WorkflowScalarWhereWithAggregatesInput[]
    OR?: WorkflowScalarWhereWithAggregatesInput[]
    NOT?: WorkflowScalarWhereWithAggregatesInput | WorkflowScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Workflow"> | string
    userId?: StringWithAggregatesFilter<"Workflow"> | string
    name?: StringWithAggregatesFilter<"Workflow"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Workflow"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Workflow"> | Date | string
    isDeleted?: BoolWithAggregatesFilter<"Workflow"> | boolean
    isPublished?: BoolWithAggregatesFilter<"Workflow"> | boolean
    publishedWorkflowId?: StringNullableWithAggregatesFilter<"Workflow"> | string | null
    publishedAt?: DateTimeNullableWithAggregatesFilter<"Workflow"> | Date | string | null
    lastPublishedAt?: DateTimeNullableWithAggregatesFilter<"Workflow"> | Date | string | null
  }

  export type WorkflowNodeWhereInput = {
    AND?: WorkflowNodeWhereInput | WorkflowNodeWhereInput[]
    OR?: WorkflowNodeWhereInput[]
    NOT?: WorkflowNodeWhereInput | WorkflowNodeWhereInput[]
    id?: StringFilter<"WorkflowNode"> | string
    workflowId?: StringFilter<"WorkflowNode"> | string
    config?: JsonFilter<"WorkflowNode">
    positionX?: FloatFilter<"WorkflowNode"> | number
    positionY?: FloatFilter<"WorkflowNode"> | number
    actionId?: StringFilter<"WorkflowNode"> | string
    isDeleted?: BoolFilter<"WorkflowNode"> | boolean
    outgoing?: WorkflowEdgeListRelationFilter
    incoming?: WorkflowEdgeListRelationFilter
    fields?: WorkflowFieldListRelationFilter
    action?: XOR<ActionRelationFilter, ActionWhereInput>
    workflow?: XOR<WorkflowRelationFilter, WorkflowWhereInput>
  }

  export type WorkflowNodeOrderByWithRelationInput = {
    id?: SortOrder
    workflowId?: SortOrder
    config?: SortOrder
    positionX?: SortOrder
    positionY?: SortOrder
    actionId?: SortOrder
    isDeleted?: SortOrder
    outgoing?: WorkflowEdgeOrderByRelationAggregateInput
    incoming?: WorkflowEdgeOrderByRelationAggregateInput
    fields?: WorkflowFieldOrderByRelationAggregateInput
    action?: ActionOrderByWithRelationInput
    workflow?: WorkflowOrderByWithRelationInput
  }

  export type WorkflowNodeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WorkflowNodeWhereInput | WorkflowNodeWhereInput[]
    OR?: WorkflowNodeWhereInput[]
    NOT?: WorkflowNodeWhereInput | WorkflowNodeWhereInput[]
    workflowId?: StringFilter<"WorkflowNode"> | string
    config?: JsonFilter<"WorkflowNode">
    positionX?: FloatFilter<"WorkflowNode"> | number
    positionY?: FloatFilter<"WorkflowNode"> | number
    actionId?: StringFilter<"WorkflowNode"> | string
    isDeleted?: BoolFilter<"WorkflowNode"> | boolean
    outgoing?: WorkflowEdgeListRelationFilter
    incoming?: WorkflowEdgeListRelationFilter
    fields?: WorkflowFieldListRelationFilter
    action?: XOR<ActionRelationFilter, ActionWhereInput>
    workflow?: XOR<WorkflowRelationFilter, WorkflowWhereInput>
  }, "id">

  export type WorkflowNodeOrderByWithAggregationInput = {
    id?: SortOrder
    workflowId?: SortOrder
    config?: SortOrder
    positionX?: SortOrder
    positionY?: SortOrder
    actionId?: SortOrder
    isDeleted?: SortOrder
    _count?: WorkflowNodeCountOrderByAggregateInput
    _avg?: WorkflowNodeAvgOrderByAggregateInput
    _max?: WorkflowNodeMaxOrderByAggregateInput
    _min?: WorkflowNodeMinOrderByAggregateInput
    _sum?: WorkflowNodeSumOrderByAggregateInput
  }

  export type WorkflowNodeScalarWhereWithAggregatesInput = {
    AND?: WorkflowNodeScalarWhereWithAggregatesInput | WorkflowNodeScalarWhereWithAggregatesInput[]
    OR?: WorkflowNodeScalarWhereWithAggregatesInput[]
    NOT?: WorkflowNodeScalarWhereWithAggregatesInput | WorkflowNodeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WorkflowNode"> | string
    workflowId?: StringWithAggregatesFilter<"WorkflowNode"> | string
    config?: JsonWithAggregatesFilter<"WorkflowNode">
    positionX?: FloatWithAggregatesFilter<"WorkflowNode"> | number
    positionY?: FloatWithAggregatesFilter<"WorkflowNode"> | number
    actionId?: StringWithAggregatesFilter<"WorkflowNode"> | string
    isDeleted?: BoolWithAggregatesFilter<"WorkflowNode"> | boolean
  }

  export type WorkflowEdgeWhereInput = {
    AND?: WorkflowEdgeWhereInput | WorkflowEdgeWhereInput[]
    OR?: WorkflowEdgeWhereInput[]
    NOT?: WorkflowEdgeWhereInput | WorkflowEdgeWhereInput[]
    id?: StringFilter<"WorkflowEdge"> | string
    workflowId?: StringFilter<"WorkflowEdge"> | string
    sourceNodeId?: StringFilter<"WorkflowEdge"> | string
    targetNodeId?: StringFilter<"WorkflowEdge"> | string
    isDeleted?: BoolFilter<"WorkflowEdge"> | boolean
    sourceNode?: XOR<WorkflowNodeRelationFilter, WorkflowNodeWhereInput>
    targetNode?: XOR<WorkflowNodeRelationFilter, WorkflowNodeWhereInput>
    workflow?: XOR<WorkflowRelationFilter, WorkflowWhereInput>
  }

  export type WorkflowEdgeOrderByWithRelationInput = {
    id?: SortOrder
    workflowId?: SortOrder
    sourceNodeId?: SortOrder
    targetNodeId?: SortOrder
    isDeleted?: SortOrder
    sourceNode?: WorkflowNodeOrderByWithRelationInput
    targetNode?: WorkflowNodeOrderByWithRelationInput
    workflow?: WorkflowOrderByWithRelationInput
  }

  export type WorkflowEdgeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WorkflowEdgeWhereInput | WorkflowEdgeWhereInput[]
    OR?: WorkflowEdgeWhereInput[]
    NOT?: WorkflowEdgeWhereInput | WorkflowEdgeWhereInput[]
    workflowId?: StringFilter<"WorkflowEdge"> | string
    sourceNodeId?: StringFilter<"WorkflowEdge"> | string
    targetNodeId?: StringFilter<"WorkflowEdge"> | string
    isDeleted?: BoolFilter<"WorkflowEdge"> | boolean
    sourceNode?: XOR<WorkflowNodeRelationFilter, WorkflowNodeWhereInput>
    targetNode?: XOR<WorkflowNodeRelationFilter, WorkflowNodeWhereInput>
    workflow?: XOR<WorkflowRelationFilter, WorkflowWhereInput>
  }, "id">

  export type WorkflowEdgeOrderByWithAggregationInput = {
    id?: SortOrder
    workflowId?: SortOrder
    sourceNodeId?: SortOrder
    targetNodeId?: SortOrder
    isDeleted?: SortOrder
    _count?: WorkflowEdgeCountOrderByAggregateInput
    _max?: WorkflowEdgeMaxOrderByAggregateInput
    _min?: WorkflowEdgeMinOrderByAggregateInput
  }

  export type WorkflowEdgeScalarWhereWithAggregatesInput = {
    AND?: WorkflowEdgeScalarWhereWithAggregatesInput | WorkflowEdgeScalarWhereWithAggregatesInput[]
    OR?: WorkflowEdgeScalarWhereWithAggregatesInput[]
    NOT?: WorkflowEdgeScalarWhereWithAggregatesInput | WorkflowEdgeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WorkflowEdge"> | string
    workflowId?: StringWithAggregatesFilter<"WorkflowEdge"> | string
    sourceNodeId?: StringWithAggregatesFilter<"WorkflowEdge"> | string
    targetNodeId?: StringWithAggregatesFilter<"WorkflowEdge"> | string
    isDeleted?: BoolWithAggregatesFilter<"WorkflowEdge"> | boolean
  }

  export type ActionCategoryWhereInput = {
    AND?: ActionCategoryWhereInput | ActionCategoryWhereInput[]
    OR?: ActionCategoryWhereInput[]
    NOT?: ActionCategoryWhereInput | ActionCategoryWhereInput[]
    id?: StringFilter<"ActionCategory"> | string
    name?: StringFilter<"ActionCategory"> | string
    description?: StringNullableFilter<"ActionCategory"> | string | null
    actions?: ActionListRelationFilter
  }

  export type ActionCategoryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    actions?: ActionOrderByRelationAggregateInput
  }

  export type ActionCategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: ActionCategoryWhereInput | ActionCategoryWhereInput[]
    OR?: ActionCategoryWhereInput[]
    NOT?: ActionCategoryWhereInput | ActionCategoryWhereInput[]
    description?: StringNullableFilter<"ActionCategory"> | string | null
    actions?: ActionListRelationFilter
  }, "id" | "name">

  export type ActionCategoryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    _count?: ActionCategoryCountOrderByAggregateInput
    _max?: ActionCategoryMaxOrderByAggregateInput
    _min?: ActionCategoryMinOrderByAggregateInput
  }

  export type ActionCategoryScalarWhereWithAggregatesInput = {
    AND?: ActionCategoryScalarWhereWithAggregatesInput | ActionCategoryScalarWhereWithAggregatesInput[]
    OR?: ActionCategoryScalarWhereWithAggregatesInput[]
    NOT?: ActionCategoryScalarWhereWithAggregatesInput | ActionCategoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ActionCategory"> | string
    name?: StringWithAggregatesFilter<"ActionCategory"> | string
    description?: StringNullableWithAggregatesFilter<"ActionCategory"> | string | null
  }

  export type ActionWhereInput = {
    AND?: ActionWhereInput | ActionWhereInput[]
    OR?: ActionWhereInput[]
    NOT?: ActionWhereInput | ActionWhereInput[]
    id?: StringFilter<"Action"> | string
    name?: StringFilter<"Action"> | string
    description?: StringNullableFilter<"Action"> | string | null
    categoryId?: StringFilter<"Action"> | string
    configSchema?: JsonFilter<"Action">
    configMeta?: JsonNullableFilter<"Action">
    inputType?: StringNullableFilter<"Action"> | string | null
    outputType?: StringFilter<"Action"> | string
    icon?: StringFilter<"Action"> | string
    serviceUrl?: StringNullableFilter<"Action"> | string | null
    category?: XOR<ActionCategoryRelationFilter, ActionCategoryWhereInput>
    workflowNodes?: WorkflowNodeListRelationFilter
  }

  export type ActionOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    categoryId?: SortOrder
    configSchema?: SortOrder
    configMeta?: SortOrderInput | SortOrder
    inputType?: SortOrderInput | SortOrder
    outputType?: SortOrder
    icon?: SortOrder
    serviceUrl?: SortOrderInput | SortOrder
    category?: ActionCategoryOrderByWithRelationInput
    workflowNodes?: WorkflowNodeOrderByRelationAggregateInput
  }

  export type ActionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: ActionWhereInput | ActionWhereInput[]
    OR?: ActionWhereInput[]
    NOT?: ActionWhereInput | ActionWhereInput[]
    description?: StringNullableFilter<"Action"> | string | null
    categoryId?: StringFilter<"Action"> | string
    configSchema?: JsonFilter<"Action">
    configMeta?: JsonNullableFilter<"Action">
    inputType?: StringNullableFilter<"Action"> | string | null
    outputType?: StringFilter<"Action"> | string
    icon?: StringFilter<"Action"> | string
    serviceUrl?: StringNullableFilter<"Action"> | string | null
    category?: XOR<ActionCategoryRelationFilter, ActionCategoryWhereInput>
    workflowNodes?: WorkflowNodeListRelationFilter
  }, "id" | "name">

  export type ActionOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    categoryId?: SortOrder
    configSchema?: SortOrder
    configMeta?: SortOrderInput | SortOrder
    inputType?: SortOrderInput | SortOrder
    outputType?: SortOrder
    icon?: SortOrder
    serviceUrl?: SortOrderInput | SortOrder
    _count?: ActionCountOrderByAggregateInput
    _max?: ActionMaxOrderByAggregateInput
    _min?: ActionMinOrderByAggregateInput
  }

  export type ActionScalarWhereWithAggregatesInput = {
    AND?: ActionScalarWhereWithAggregatesInput | ActionScalarWhereWithAggregatesInput[]
    OR?: ActionScalarWhereWithAggregatesInput[]
    NOT?: ActionScalarWhereWithAggregatesInput | ActionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Action"> | string
    name?: StringWithAggregatesFilter<"Action"> | string
    description?: StringNullableWithAggregatesFilter<"Action"> | string | null
    categoryId?: StringWithAggregatesFilter<"Action"> | string
    configSchema?: JsonWithAggregatesFilter<"Action">
    configMeta?: JsonNullableWithAggregatesFilter<"Action">
    inputType?: StringNullableWithAggregatesFilter<"Action"> | string | null
    outputType?: StringWithAggregatesFilter<"Action"> | string
    icon?: StringWithAggregatesFilter<"Action"> | string
    serviceUrl?: StringNullableWithAggregatesFilter<"Action"> | string | null
  }

  export type WorkflowFieldWhereInput = {
    AND?: WorkflowFieldWhereInput | WorkflowFieldWhereInput[]
    OR?: WorkflowFieldWhereInput[]
    NOT?: WorkflowFieldWhereInput | WorkflowFieldWhereInput[]
    id?: StringFilter<"WorkflowField"> | string
    workflowId?: StringFilter<"WorkflowField"> | string
    sourceNodeId?: StringFilter<"WorkflowField"> | string
    fieldName?: StringFilter<"WorkflowField"> | string
    fieldPath?: StringFilter<"WorkflowField"> | string
    fieldType?: StringNullableFilter<"WorkflowField"> | string | null
    createdAt?: DateTimeFilter<"WorkflowField"> | Date | string
    sourceNode?: XOR<WorkflowNodeRelationFilter, WorkflowNodeWhereInput>
    workflow?: XOR<WorkflowRelationFilter, WorkflowWhereInput>
  }

  export type WorkflowFieldOrderByWithRelationInput = {
    id?: SortOrder
    workflowId?: SortOrder
    sourceNodeId?: SortOrder
    fieldName?: SortOrder
    fieldPath?: SortOrder
    fieldType?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    sourceNode?: WorkflowNodeOrderByWithRelationInput
    workflow?: WorkflowOrderByWithRelationInput
  }

  export type WorkflowFieldWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    workflowId_sourceNodeId_fieldName?: WorkflowFieldWorkflowIdSourceNodeIdFieldNameCompoundUniqueInput
    AND?: WorkflowFieldWhereInput | WorkflowFieldWhereInput[]
    OR?: WorkflowFieldWhereInput[]
    NOT?: WorkflowFieldWhereInput | WorkflowFieldWhereInput[]
    workflowId?: StringFilter<"WorkflowField"> | string
    sourceNodeId?: StringFilter<"WorkflowField"> | string
    fieldName?: StringFilter<"WorkflowField"> | string
    fieldPath?: StringFilter<"WorkflowField"> | string
    fieldType?: StringNullableFilter<"WorkflowField"> | string | null
    createdAt?: DateTimeFilter<"WorkflowField"> | Date | string
    sourceNode?: XOR<WorkflowNodeRelationFilter, WorkflowNodeWhereInput>
    workflow?: XOR<WorkflowRelationFilter, WorkflowWhereInput>
  }, "id" | "workflowId_sourceNodeId_fieldName">

  export type WorkflowFieldOrderByWithAggregationInput = {
    id?: SortOrder
    workflowId?: SortOrder
    sourceNodeId?: SortOrder
    fieldName?: SortOrder
    fieldPath?: SortOrder
    fieldType?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: WorkflowFieldCountOrderByAggregateInput
    _max?: WorkflowFieldMaxOrderByAggregateInput
    _min?: WorkflowFieldMinOrderByAggregateInput
  }

  export type WorkflowFieldScalarWhereWithAggregatesInput = {
    AND?: WorkflowFieldScalarWhereWithAggregatesInput | WorkflowFieldScalarWhereWithAggregatesInput[]
    OR?: WorkflowFieldScalarWhereWithAggregatesInput[]
    NOT?: WorkflowFieldScalarWhereWithAggregatesInput | WorkflowFieldScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WorkflowField"> | string
    workflowId?: StringWithAggregatesFilter<"WorkflowField"> | string
    sourceNodeId?: StringWithAggregatesFilter<"WorkflowField"> | string
    fieldName?: StringWithAggregatesFilter<"WorkflowField"> | string
    fieldPath?: StringWithAggregatesFilter<"WorkflowField"> | string
    fieldType?: StringNullableWithAggregatesFilter<"WorkflowField"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"WorkflowField"> | Date | string
  }

  export type WorkflowRoleWhereInput = {
    AND?: WorkflowRoleWhereInput | WorkflowRoleWhereInput[]
    OR?: WorkflowRoleWhereInput[]
    NOT?: WorkflowRoleWhereInput | WorkflowRoleWhereInput[]
    id?: StringFilter<"WorkflowRole"> | string
    workflowId?: StringFilter<"WorkflowRole"> | string
    name?: StringFilter<"WorkflowRole"> | string
    description?: StringNullableFilter<"WorkflowRole"> | string | null
    permissions?: EnumPermissionNullableListFilter<"WorkflowRole">
    isSystem?: BoolFilter<"WorkflowRole"> | boolean
    createdAt?: DateTimeFilter<"WorkflowRole"> | Date | string
    workflow?: XOR<WorkflowRelationFilter, WorkflowWhereInput>
    assignments?: WorkflowRoleAssignmentListRelationFilter
  }

  export type WorkflowRoleOrderByWithRelationInput = {
    id?: SortOrder
    workflowId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    permissions?: SortOrder
    isSystem?: SortOrder
    createdAt?: SortOrder
    workflow?: WorkflowOrderByWithRelationInput
    assignments?: WorkflowRoleAssignmentOrderByRelationAggregateInput
  }

  export type WorkflowRoleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    workflowId_name?: WorkflowRoleWorkflowIdNameCompoundUniqueInput
    AND?: WorkflowRoleWhereInput | WorkflowRoleWhereInput[]
    OR?: WorkflowRoleWhereInput[]
    NOT?: WorkflowRoleWhereInput | WorkflowRoleWhereInput[]
    workflowId?: StringFilter<"WorkflowRole"> | string
    name?: StringFilter<"WorkflowRole"> | string
    description?: StringNullableFilter<"WorkflowRole"> | string | null
    permissions?: EnumPermissionNullableListFilter<"WorkflowRole">
    isSystem?: BoolFilter<"WorkflowRole"> | boolean
    createdAt?: DateTimeFilter<"WorkflowRole"> | Date | string
    workflow?: XOR<WorkflowRelationFilter, WorkflowWhereInput>
    assignments?: WorkflowRoleAssignmentListRelationFilter
  }, "id" | "workflowId_name">

  export type WorkflowRoleOrderByWithAggregationInput = {
    id?: SortOrder
    workflowId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    permissions?: SortOrder
    isSystem?: SortOrder
    createdAt?: SortOrder
    _count?: WorkflowRoleCountOrderByAggregateInput
    _max?: WorkflowRoleMaxOrderByAggregateInput
    _min?: WorkflowRoleMinOrderByAggregateInput
  }

  export type WorkflowRoleScalarWhereWithAggregatesInput = {
    AND?: WorkflowRoleScalarWhereWithAggregatesInput | WorkflowRoleScalarWhereWithAggregatesInput[]
    OR?: WorkflowRoleScalarWhereWithAggregatesInput[]
    NOT?: WorkflowRoleScalarWhereWithAggregatesInput | WorkflowRoleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WorkflowRole"> | string
    workflowId?: StringWithAggregatesFilter<"WorkflowRole"> | string
    name?: StringWithAggregatesFilter<"WorkflowRole"> | string
    description?: StringNullableWithAggregatesFilter<"WorkflowRole"> | string | null
    permissions?: EnumPermissionNullableListFilter<"WorkflowRole">
    isSystem?: BoolWithAggregatesFilter<"WorkflowRole"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"WorkflowRole"> | Date | string
  }

  export type WorkflowRoleAssignmentWhereInput = {
    AND?: WorkflowRoleAssignmentWhereInput | WorkflowRoleAssignmentWhereInput[]
    OR?: WorkflowRoleAssignmentWhereInput[]
    NOT?: WorkflowRoleAssignmentWhereInput | WorkflowRoleAssignmentWhereInput[]
    id?: StringFilter<"WorkflowRoleAssignment"> | string
    userId?: StringFilter<"WorkflowRoleAssignment"> | string
    userEmail?: StringNullableFilter<"WorkflowRoleAssignment"> | string | null
    workflowRoleId?: StringFilter<"WorkflowRoleAssignment"> | string
    assignedAt?: DateTimeFilter<"WorkflowRoleAssignment"> | Date | string
    assignedBy?: StringNullableFilter<"WorkflowRoleAssignment"> | string | null
    workflowRole?: XOR<WorkflowRoleRelationFilter, WorkflowRoleWhereInput>
  }

  export type WorkflowRoleAssignmentOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    userEmail?: SortOrderInput | SortOrder
    workflowRoleId?: SortOrder
    assignedAt?: SortOrder
    assignedBy?: SortOrderInput | SortOrder
    workflowRole?: WorkflowRoleOrderByWithRelationInput
  }

  export type WorkflowRoleAssignmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_workflowRoleId?: WorkflowRoleAssignmentUserIdWorkflowRoleIdCompoundUniqueInput
    AND?: WorkflowRoleAssignmentWhereInput | WorkflowRoleAssignmentWhereInput[]
    OR?: WorkflowRoleAssignmentWhereInput[]
    NOT?: WorkflowRoleAssignmentWhereInput | WorkflowRoleAssignmentWhereInput[]
    userId?: StringFilter<"WorkflowRoleAssignment"> | string
    userEmail?: StringNullableFilter<"WorkflowRoleAssignment"> | string | null
    workflowRoleId?: StringFilter<"WorkflowRoleAssignment"> | string
    assignedAt?: DateTimeFilter<"WorkflowRoleAssignment"> | Date | string
    assignedBy?: StringNullableFilter<"WorkflowRoleAssignment"> | string | null
    workflowRole?: XOR<WorkflowRoleRelationFilter, WorkflowRoleWhereInput>
  }, "id" | "userId_workflowRoleId">

  export type WorkflowRoleAssignmentOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    userEmail?: SortOrderInput | SortOrder
    workflowRoleId?: SortOrder
    assignedAt?: SortOrder
    assignedBy?: SortOrderInput | SortOrder
    _count?: WorkflowRoleAssignmentCountOrderByAggregateInput
    _max?: WorkflowRoleAssignmentMaxOrderByAggregateInput
    _min?: WorkflowRoleAssignmentMinOrderByAggregateInput
  }

  export type WorkflowRoleAssignmentScalarWhereWithAggregatesInput = {
    AND?: WorkflowRoleAssignmentScalarWhereWithAggregatesInput | WorkflowRoleAssignmentScalarWhereWithAggregatesInput[]
    OR?: WorkflowRoleAssignmentScalarWhereWithAggregatesInput[]
    NOT?: WorkflowRoleAssignmentScalarWhereWithAggregatesInput | WorkflowRoleAssignmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WorkflowRoleAssignment"> | string
    userId?: StringWithAggregatesFilter<"WorkflowRoleAssignment"> | string
    userEmail?: StringNullableWithAggregatesFilter<"WorkflowRoleAssignment"> | string | null
    workflowRoleId?: StringWithAggregatesFilter<"WorkflowRoleAssignment"> | string
    assignedAt?: DateTimeWithAggregatesFilter<"WorkflowRoleAssignment"> | Date | string
    assignedBy?: StringNullableWithAggregatesFilter<"WorkflowRoleAssignment"> | string | null
  }

  export type UserCreateInput = {
    id?: string
    workflows?: WorkflowCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    workflows?: WorkflowUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflows?: WorkflowUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflows?: WorkflowUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
  }

  export type WorkflowCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    isPublished?: boolean
    publishedWorkflowId?: string | null
    publishedAt?: Date | string | null
    lastPublishedAt?: Date | string | null
    user: UserCreateNestedOneWithoutWorkflowsInput
    edges?: WorkflowEdgeCreateNestedManyWithoutWorkflowInput
    nodes?: WorkflowNodeCreateNestedManyWithoutWorkflowInput
    fields?: WorkflowFieldCreateNestedManyWithoutWorkflowInput
    roles?: WorkflowRoleCreateNestedManyWithoutWorkflowInput
  }

  export type WorkflowUncheckedCreateInput = {
    id?: string
    userId: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    isPublished?: boolean
    publishedWorkflowId?: string | null
    publishedAt?: Date | string | null
    lastPublishedAt?: Date | string | null
    edges?: WorkflowEdgeUncheckedCreateNestedManyWithoutWorkflowInput
    nodes?: WorkflowNodeUncheckedCreateNestedManyWithoutWorkflowInput
    fields?: WorkflowFieldUncheckedCreateNestedManyWithoutWorkflowInput
    roles?: WorkflowRoleUncheckedCreateNestedManyWithoutWorkflowInput
  }

  export type WorkflowUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    publishedWorkflowId?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPublishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutWorkflowsNestedInput
    edges?: WorkflowEdgeUpdateManyWithoutWorkflowNestedInput
    nodes?: WorkflowNodeUpdateManyWithoutWorkflowNestedInput
    fields?: WorkflowFieldUpdateManyWithoutWorkflowNestedInput
    roles?: WorkflowRoleUpdateManyWithoutWorkflowNestedInput
  }

  export type WorkflowUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    publishedWorkflowId?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPublishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    edges?: WorkflowEdgeUncheckedUpdateManyWithoutWorkflowNestedInput
    nodes?: WorkflowNodeUncheckedUpdateManyWithoutWorkflowNestedInput
    fields?: WorkflowFieldUncheckedUpdateManyWithoutWorkflowNestedInput
    roles?: WorkflowRoleUncheckedUpdateManyWithoutWorkflowNestedInput
  }

  export type WorkflowCreateManyInput = {
    id?: string
    userId: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    isPublished?: boolean
    publishedWorkflowId?: string | null
    publishedAt?: Date | string | null
    lastPublishedAt?: Date | string | null
  }

  export type WorkflowUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    publishedWorkflowId?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPublishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WorkflowUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    publishedWorkflowId?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPublishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WorkflowNodeCreateInput = {
    id?: string
    config: JsonNullValueInput | InputJsonValue
    positionX: number
    positionY: number
    isDeleted?: boolean
    outgoing?: WorkflowEdgeCreateNestedManyWithoutSourceNodeInput
    incoming?: WorkflowEdgeCreateNestedManyWithoutTargetNodeInput
    fields?: WorkflowFieldCreateNestedManyWithoutSourceNodeInput
    action: ActionCreateNestedOneWithoutWorkflowNodesInput
    workflow: WorkflowCreateNestedOneWithoutNodesInput
  }

  export type WorkflowNodeUncheckedCreateInput = {
    id?: string
    workflowId: string
    config: JsonNullValueInput | InputJsonValue
    positionX: number
    positionY: number
    actionId: string
    isDeleted?: boolean
    outgoing?: WorkflowEdgeUncheckedCreateNestedManyWithoutSourceNodeInput
    incoming?: WorkflowEdgeUncheckedCreateNestedManyWithoutTargetNodeInput
    fields?: WorkflowFieldUncheckedCreateNestedManyWithoutSourceNodeInput
  }

  export type WorkflowNodeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    positionX?: FloatFieldUpdateOperationsInput | number
    positionY?: FloatFieldUpdateOperationsInput | number
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    outgoing?: WorkflowEdgeUpdateManyWithoutSourceNodeNestedInput
    incoming?: WorkflowEdgeUpdateManyWithoutTargetNodeNestedInput
    fields?: WorkflowFieldUpdateManyWithoutSourceNodeNestedInput
    action?: ActionUpdateOneRequiredWithoutWorkflowNodesNestedInput
    workflow?: WorkflowUpdateOneRequiredWithoutNodesNestedInput
  }

  export type WorkflowNodeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    positionX?: FloatFieldUpdateOperationsInput | number
    positionY?: FloatFieldUpdateOperationsInput | number
    actionId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    outgoing?: WorkflowEdgeUncheckedUpdateManyWithoutSourceNodeNestedInput
    incoming?: WorkflowEdgeUncheckedUpdateManyWithoutTargetNodeNestedInput
    fields?: WorkflowFieldUncheckedUpdateManyWithoutSourceNodeNestedInput
  }

  export type WorkflowNodeCreateManyInput = {
    id?: string
    workflowId: string
    config: JsonNullValueInput | InputJsonValue
    positionX: number
    positionY: number
    actionId: string
    isDeleted?: boolean
  }

  export type WorkflowNodeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    positionX?: FloatFieldUpdateOperationsInput | number
    positionY?: FloatFieldUpdateOperationsInput | number
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type WorkflowNodeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    positionX?: FloatFieldUpdateOperationsInput | number
    positionY?: FloatFieldUpdateOperationsInput | number
    actionId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type WorkflowEdgeCreateInput = {
    id?: string
    isDeleted?: boolean
    sourceNode: WorkflowNodeCreateNestedOneWithoutOutgoingInput
    targetNode: WorkflowNodeCreateNestedOneWithoutIncomingInput
    workflow: WorkflowCreateNestedOneWithoutEdgesInput
  }

  export type WorkflowEdgeUncheckedCreateInput = {
    id?: string
    workflowId: string
    sourceNodeId: string
    targetNodeId: string
    isDeleted?: boolean
  }

  export type WorkflowEdgeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    sourceNode?: WorkflowNodeUpdateOneRequiredWithoutOutgoingNestedInput
    targetNode?: WorkflowNodeUpdateOneRequiredWithoutIncomingNestedInput
    workflow?: WorkflowUpdateOneRequiredWithoutEdgesNestedInput
  }

  export type WorkflowEdgeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    sourceNodeId?: StringFieldUpdateOperationsInput | string
    targetNodeId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type WorkflowEdgeCreateManyInput = {
    id?: string
    workflowId: string
    sourceNodeId: string
    targetNodeId: string
    isDeleted?: boolean
  }

  export type WorkflowEdgeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type WorkflowEdgeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    sourceNodeId?: StringFieldUpdateOperationsInput | string
    targetNodeId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ActionCategoryCreateInput = {
    id?: string
    name: string
    description?: string | null
    actions?: ActionCreateNestedManyWithoutCategoryInput
  }

  export type ActionCategoryUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    actions?: ActionUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type ActionCategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    actions?: ActionUpdateManyWithoutCategoryNestedInput
  }

  export type ActionCategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    actions?: ActionUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type ActionCategoryCreateManyInput = {
    id?: string
    name: string
    description?: string | null
  }

  export type ActionCategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ActionCategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ActionCreateInput = {
    id?: string
    name: string
    description?: string | null
    configSchema: JsonNullValueInput | InputJsonValue
    configMeta?: NullableJsonNullValueInput | InputJsonValue
    inputType?: string | null
    outputType: string
    icon: string
    serviceUrl?: string | null
    category: ActionCategoryCreateNestedOneWithoutActionsInput
    workflowNodes?: WorkflowNodeCreateNestedManyWithoutActionInput
  }

  export type ActionUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    categoryId: string
    configSchema: JsonNullValueInput | InputJsonValue
    configMeta?: NullableJsonNullValueInput | InputJsonValue
    inputType?: string | null
    outputType: string
    icon: string
    serviceUrl?: string | null
    workflowNodes?: WorkflowNodeUncheckedCreateNestedManyWithoutActionInput
  }

  export type ActionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    configSchema?: JsonNullValueInput | InputJsonValue
    configMeta?: NullableJsonNullValueInput | InputJsonValue
    inputType?: NullableStringFieldUpdateOperationsInput | string | null
    outputType?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    serviceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: ActionCategoryUpdateOneRequiredWithoutActionsNestedInput
    workflowNodes?: WorkflowNodeUpdateManyWithoutActionNestedInput
  }

  export type ActionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: StringFieldUpdateOperationsInput | string
    configSchema?: JsonNullValueInput | InputJsonValue
    configMeta?: NullableJsonNullValueInput | InputJsonValue
    inputType?: NullableStringFieldUpdateOperationsInput | string | null
    outputType?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    serviceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    workflowNodes?: WorkflowNodeUncheckedUpdateManyWithoutActionNestedInput
  }

  export type ActionCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    categoryId: string
    configSchema: JsonNullValueInput | InputJsonValue
    configMeta?: NullableJsonNullValueInput | InputJsonValue
    inputType?: string | null
    outputType: string
    icon: string
    serviceUrl?: string | null
  }

  export type ActionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    configSchema?: JsonNullValueInput | InputJsonValue
    configMeta?: NullableJsonNullValueInput | InputJsonValue
    inputType?: NullableStringFieldUpdateOperationsInput | string | null
    outputType?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    serviceUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ActionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: StringFieldUpdateOperationsInput | string
    configSchema?: JsonNullValueInput | InputJsonValue
    configMeta?: NullableJsonNullValueInput | InputJsonValue
    inputType?: NullableStringFieldUpdateOperationsInput | string | null
    outputType?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    serviceUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type WorkflowFieldCreateInput = {
    id?: string
    fieldName: string
    fieldPath: string
    fieldType?: string | null
    createdAt?: Date | string
    sourceNode: WorkflowNodeCreateNestedOneWithoutFieldsInput
    workflow: WorkflowCreateNestedOneWithoutFieldsInput
  }

  export type WorkflowFieldUncheckedCreateInput = {
    id?: string
    workflowId: string
    sourceNodeId: string
    fieldName: string
    fieldPath: string
    fieldType?: string | null
    createdAt?: Date | string
  }

  export type WorkflowFieldUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    fieldPath?: StringFieldUpdateOperationsInput | string
    fieldType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sourceNode?: WorkflowNodeUpdateOneRequiredWithoutFieldsNestedInput
    workflow?: WorkflowUpdateOneRequiredWithoutFieldsNestedInput
  }

  export type WorkflowFieldUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    sourceNodeId?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    fieldPath?: StringFieldUpdateOperationsInput | string
    fieldType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkflowFieldCreateManyInput = {
    id?: string
    workflowId: string
    sourceNodeId: string
    fieldName: string
    fieldPath: string
    fieldType?: string | null
    createdAt?: Date | string
  }

  export type WorkflowFieldUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    fieldPath?: StringFieldUpdateOperationsInput | string
    fieldType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkflowFieldUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    sourceNodeId?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    fieldPath?: StringFieldUpdateOperationsInput | string
    fieldType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkflowRoleCreateInput = {
    id?: string
    name: string
    description?: string | null
    permissions?: WorkflowRoleCreatepermissionsInput | $Enums.Permission[]
    isSystem?: boolean
    createdAt?: Date | string
    workflow: WorkflowCreateNestedOneWithoutRolesInput
    assignments?: WorkflowRoleAssignmentCreateNestedManyWithoutWorkflowRoleInput
  }

  export type WorkflowRoleUncheckedCreateInput = {
    id?: string
    workflowId: string
    name: string
    description?: string | null
    permissions?: WorkflowRoleCreatepermissionsInput | $Enums.Permission[]
    isSystem?: boolean
    createdAt?: Date | string
    assignments?: WorkflowRoleAssignmentUncheckedCreateNestedManyWithoutWorkflowRoleInput
  }

  export type WorkflowRoleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: WorkflowRoleUpdatepermissionsInput | $Enums.Permission[]
    isSystem?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workflow?: WorkflowUpdateOneRequiredWithoutRolesNestedInput
    assignments?: WorkflowRoleAssignmentUpdateManyWithoutWorkflowRoleNestedInput
  }

  export type WorkflowRoleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: WorkflowRoleUpdatepermissionsInput | $Enums.Permission[]
    isSystem?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignments?: WorkflowRoleAssignmentUncheckedUpdateManyWithoutWorkflowRoleNestedInput
  }

  export type WorkflowRoleCreateManyInput = {
    id?: string
    workflowId: string
    name: string
    description?: string | null
    permissions?: WorkflowRoleCreatepermissionsInput | $Enums.Permission[]
    isSystem?: boolean
    createdAt?: Date | string
  }

  export type WorkflowRoleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: WorkflowRoleUpdatepermissionsInput | $Enums.Permission[]
    isSystem?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkflowRoleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: WorkflowRoleUpdatepermissionsInput | $Enums.Permission[]
    isSystem?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkflowRoleAssignmentCreateInput = {
    id?: string
    userId: string
    userEmail?: string | null
    assignedAt?: Date | string
    assignedBy?: string | null
    workflowRole: WorkflowRoleCreateNestedOneWithoutAssignmentsInput
  }

  export type WorkflowRoleAssignmentUncheckedCreateInput = {
    id?: string
    userId: string
    userEmail?: string | null
    workflowRoleId: string
    assignedAt?: Date | string
    assignedBy?: string | null
  }

  export type WorkflowRoleAssignmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userEmail?: NullableStringFieldUpdateOperationsInput | string | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedBy?: NullableStringFieldUpdateOperationsInput | string | null
    workflowRole?: WorkflowRoleUpdateOneRequiredWithoutAssignmentsNestedInput
  }

  export type WorkflowRoleAssignmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userEmail?: NullableStringFieldUpdateOperationsInput | string | null
    workflowRoleId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type WorkflowRoleAssignmentCreateManyInput = {
    id?: string
    userId: string
    userEmail?: string | null
    workflowRoleId: string
    assignedAt?: Date | string
    assignedBy?: string | null
  }

  export type WorkflowRoleAssignmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userEmail?: NullableStringFieldUpdateOperationsInput | string | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type WorkflowRoleAssignmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userEmail?: NullableStringFieldUpdateOperationsInput | string | null
    workflowRoleId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type WorkflowListRelationFilter = {
    every?: WorkflowWhereInput
    some?: WorkflowWhereInput
    none?: WorkflowWhereInput
  }

  export type WorkflowOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type WorkflowEdgeListRelationFilter = {
    every?: WorkflowEdgeWhereInput
    some?: WorkflowEdgeWhereInput
    none?: WorkflowEdgeWhereInput
  }

  export type WorkflowNodeListRelationFilter = {
    every?: WorkflowNodeWhereInput
    some?: WorkflowNodeWhereInput
    none?: WorkflowNodeWhereInput
  }

  export type WorkflowFieldListRelationFilter = {
    every?: WorkflowFieldWhereInput
    some?: WorkflowFieldWhereInput
    none?: WorkflowFieldWhereInput
  }

  export type WorkflowRoleListRelationFilter = {
    every?: WorkflowRoleWhereInput
    some?: WorkflowRoleWhereInput
    none?: WorkflowRoleWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type WorkflowEdgeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WorkflowNodeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WorkflowFieldOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WorkflowRoleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WorkflowCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isDeleted?: SortOrder
    isPublished?: SortOrder
    publishedWorkflowId?: SortOrder
    publishedAt?: SortOrder
    lastPublishedAt?: SortOrder
  }

  export type WorkflowMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isDeleted?: SortOrder
    isPublished?: SortOrder
    publishedWorkflowId?: SortOrder
    publishedAt?: SortOrder
    lastPublishedAt?: SortOrder
  }

  export type WorkflowMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isDeleted?: SortOrder
    isPublished?: SortOrder
    publishedWorkflowId?: SortOrder
    publishedAt?: SortOrder
    lastPublishedAt?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type ActionRelationFilter = {
    is?: ActionWhereInput
    isNot?: ActionWhereInput
  }

  export type WorkflowRelationFilter = {
    is?: WorkflowWhereInput
    isNot?: WorkflowWhereInput
  }

  export type WorkflowNodeCountOrderByAggregateInput = {
    id?: SortOrder
    workflowId?: SortOrder
    config?: SortOrder
    positionX?: SortOrder
    positionY?: SortOrder
    actionId?: SortOrder
    isDeleted?: SortOrder
  }

  export type WorkflowNodeAvgOrderByAggregateInput = {
    positionX?: SortOrder
    positionY?: SortOrder
  }

  export type WorkflowNodeMaxOrderByAggregateInput = {
    id?: SortOrder
    workflowId?: SortOrder
    positionX?: SortOrder
    positionY?: SortOrder
    actionId?: SortOrder
    isDeleted?: SortOrder
  }

  export type WorkflowNodeMinOrderByAggregateInput = {
    id?: SortOrder
    workflowId?: SortOrder
    positionX?: SortOrder
    positionY?: SortOrder
    actionId?: SortOrder
    isDeleted?: SortOrder
  }

  export type WorkflowNodeSumOrderByAggregateInput = {
    positionX?: SortOrder
    positionY?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type WorkflowNodeRelationFilter = {
    is?: WorkflowNodeWhereInput
    isNot?: WorkflowNodeWhereInput
  }

  export type WorkflowEdgeCountOrderByAggregateInput = {
    id?: SortOrder
    workflowId?: SortOrder
    sourceNodeId?: SortOrder
    targetNodeId?: SortOrder
    isDeleted?: SortOrder
  }

  export type WorkflowEdgeMaxOrderByAggregateInput = {
    id?: SortOrder
    workflowId?: SortOrder
    sourceNodeId?: SortOrder
    targetNodeId?: SortOrder
    isDeleted?: SortOrder
  }

  export type WorkflowEdgeMinOrderByAggregateInput = {
    id?: SortOrder
    workflowId?: SortOrder
    sourceNodeId?: SortOrder
    targetNodeId?: SortOrder
    isDeleted?: SortOrder
  }

  export type ActionListRelationFilter = {
    every?: ActionWhereInput
    some?: ActionWhereInput
    none?: ActionWhereInput
  }

  export type ActionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ActionCategoryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }

  export type ActionCategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }

  export type ActionCategoryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ActionCategoryRelationFilter = {
    is?: ActionCategoryWhereInput
    isNot?: ActionCategoryWhereInput
  }

  export type ActionCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    categoryId?: SortOrder
    configSchema?: SortOrder
    configMeta?: SortOrder
    inputType?: SortOrder
    outputType?: SortOrder
    icon?: SortOrder
    serviceUrl?: SortOrder
  }

  export type ActionMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    categoryId?: SortOrder
    inputType?: SortOrder
    outputType?: SortOrder
    icon?: SortOrder
    serviceUrl?: SortOrder
  }

  export type ActionMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    categoryId?: SortOrder
    inputType?: SortOrder
    outputType?: SortOrder
    icon?: SortOrder
    serviceUrl?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type WorkflowFieldWorkflowIdSourceNodeIdFieldNameCompoundUniqueInput = {
    workflowId: string
    sourceNodeId: string
    fieldName: string
  }

  export type WorkflowFieldCountOrderByAggregateInput = {
    id?: SortOrder
    workflowId?: SortOrder
    sourceNodeId?: SortOrder
    fieldName?: SortOrder
    fieldPath?: SortOrder
    fieldType?: SortOrder
    createdAt?: SortOrder
  }

  export type WorkflowFieldMaxOrderByAggregateInput = {
    id?: SortOrder
    workflowId?: SortOrder
    sourceNodeId?: SortOrder
    fieldName?: SortOrder
    fieldPath?: SortOrder
    fieldType?: SortOrder
    createdAt?: SortOrder
  }

  export type WorkflowFieldMinOrderByAggregateInput = {
    id?: SortOrder
    workflowId?: SortOrder
    sourceNodeId?: SortOrder
    fieldName?: SortOrder
    fieldPath?: SortOrder
    fieldType?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumPermissionNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.Permission[] | ListEnumPermissionFieldRefInput<$PrismaModel> | null
    has?: $Enums.Permission | EnumPermissionFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.Permission[] | ListEnumPermissionFieldRefInput<$PrismaModel>
    hasSome?: $Enums.Permission[] | ListEnumPermissionFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type WorkflowRoleAssignmentListRelationFilter = {
    every?: WorkflowRoleAssignmentWhereInput
    some?: WorkflowRoleAssignmentWhereInput
    none?: WorkflowRoleAssignmentWhereInput
  }

  export type WorkflowRoleAssignmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WorkflowRoleWorkflowIdNameCompoundUniqueInput = {
    workflowId: string
    name: string
  }

  export type WorkflowRoleCountOrderByAggregateInput = {
    id?: SortOrder
    workflowId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    permissions?: SortOrder
    isSystem?: SortOrder
    createdAt?: SortOrder
  }

  export type WorkflowRoleMaxOrderByAggregateInput = {
    id?: SortOrder
    workflowId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    isSystem?: SortOrder
    createdAt?: SortOrder
  }

  export type WorkflowRoleMinOrderByAggregateInput = {
    id?: SortOrder
    workflowId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    isSystem?: SortOrder
    createdAt?: SortOrder
  }

  export type WorkflowRoleRelationFilter = {
    is?: WorkflowRoleWhereInput
    isNot?: WorkflowRoleWhereInput
  }

  export type WorkflowRoleAssignmentUserIdWorkflowRoleIdCompoundUniqueInput = {
    userId: string
    workflowRoleId: string
  }

  export type WorkflowRoleAssignmentCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    userEmail?: SortOrder
    workflowRoleId?: SortOrder
    assignedAt?: SortOrder
    assignedBy?: SortOrder
  }

  export type WorkflowRoleAssignmentMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    userEmail?: SortOrder
    workflowRoleId?: SortOrder
    assignedAt?: SortOrder
    assignedBy?: SortOrder
  }

  export type WorkflowRoleAssignmentMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    userEmail?: SortOrder
    workflowRoleId?: SortOrder
    assignedAt?: SortOrder
    assignedBy?: SortOrder
  }

  export type WorkflowCreateNestedManyWithoutUserInput = {
    create?: XOR<WorkflowCreateWithoutUserInput, WorkflowUncheckedCreateWithoutUserInput> | WorkflowCreateWithoutUserInput[] | WorkflowUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WorkflowCreateOrConnectWithoutUserInput | WorkflowCreateOrConnectWithoutUserInput[]
    createMany?: WorkflowCreateManyUserInputEnvelope
    connect?: WorkflowWhereUniqueInput | WorkflowWhereUniqueInput[]
  }

  export type WorkflowUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<WorkflowCreateWithoutUserInput, WorkflowUncheckedCreateWithoutUserInput> | WorkflowCreateWithoutUserInput[] | WorkflowUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WorkflowCreateOrConnectWithoutUserInput | WorkflowCreateOrConnectWithoutUserInput[]
    createMany?: WorkflowCreateManyUserInputEnvelope
    connect?: WorkflowWhereUniqueInput | WorkflowWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type WorkflowUpdateManyWithoutUserNestedInput = {
    create?: XOR<WorkflowCreateWithoutUserInput, WorkflowUncheckedCreateWithoutUserInput> | WorkflowCreateWithoutUserInput[] | WorkflowUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WorkflowCreateOrConnectWithoutUserInput | WorkflowCreateOrConnectWithoutUserInput[]
    upsert?: WorkflowUpsertWithWhereUniqueWithoutUserInput | WorkflowUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: WorkflowCreateManyUserInputEnvelope
    set?: WorkflowWhereUniqueInput | WorkflowWhereUniqueInput[]
    disconnect?: WorkflowWhereUniqueInput | WorkflowWhereUniqueInput[]
    delete?: WorkflowWhereUniqueInput | WorkflowWhereUniqueInput[]
    connect?: WorkflowWhereUniqueInput | WorkflowWhereUniqueInput[]
    update?: WorkflowUpdateWithWhereUniqueWithoutUserInput | WorkflowUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: WorkflowUpdateManyWithWhereWithoutUserInput | WorkflowUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: WorkflowScalarWhereInput | WorkflowScalarWhereInput[]
  }

  export type WorkflowUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<WorkflowCreateWithoutUserInput, WorkflowUncheckedCreateWithoutUserInput> | WorkflowCreateWithoutUserInput[] | WorkflowUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WorkflowCreateOrConnectWithoutUserInput | WorkflowCreateOrConnectWithoutUserInput[]
    upsert?: WorkflowUpsertWithWhereUniqueWithoutUserInput | WorkflowUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: WorkflowCreateManyUserInputEnvelope
    set?: WorkflowWhereUniqueInput | WorkflowWhereUniqueInput[]
    disconnect?: WorkflowWhereUniqueInput | WorkflowWhereUniqueInput[]
    delete?: WorkflowWhereUniqueInput | WorkflowWhereUniqueInput[]
    connect?: WorkflowWhereUniqueInput | WorkflowWhereUniqueInput[]
    update?: WorkflowUpdateWithWhereUniqueWithoutUserInput | WorkflowUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: WorkflowUpdateManyWithWhereWithoutUserInput | WorkflowUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: WorkflowScalarWhereInput | WorkflowScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutWorkflowsInput = {
    create?: XOR<UserCreateWithoutWorkflowsInput, UserUncheckedCreateWithoutWorkflowsInput>
    connectOrCreate?: UserCreateOrConnectWithoutWorkflowsInput
    connect?: UserWhereUniqueInput
  }

  export type WorkflowEdgeCreateNestedManyWithoutWorkflowInput = {
    create?: XOR<WorkflowEdgeCreateWithoutWorkflowInput, WorkflowEdgeUncheckedCreateWithoutWorkflowInput> | WorkflowEdgeCreateWithoutWorkflowInput[] | WorkflowEdgeUncheckedCreateWithoutWorkflowInput[]
    connectOrCreate?: WorkflowEdgeCreateOrConnectWithoutWorkflowInput | WorkflowEdgeCreateOrConnectWithoutWorkflowInput[]
    createMany?: WorkflowEdgeCreateManyWorkflowInputEnvelope
    connect?: WorkflowEdgeWhereUniqueInput | WorkflowEdgeWhereUniqueInput[]
  }

  export type WorkflowNodeCreateNestedManyWithoutWorkflowInput = {
    create?: XOR<WorkflowNodeCreateWithoutWorkflowInput, WorkflowNodeUncheckedCreateWithoutWorkflowInput> | WorkflowNodeCreateWithoutWorkflowInput[] | WorkflowNodeUncheckedCreateWithoutWorkflowInput[]
    connectOrCreate?: WorkflowNodeCreateOrConnectWithoutWorkflowInput | WorkflowNodeCreateOrConnectWithoutWorkflowInput[]
    createMany?: WorkflowNodeCreateManyWorkflowInputEnvelope
    connect?: WorkflowNodeWhereUniqueInput | WorkflowNodeWhereUniqueInput[]
  }

  export type WorkflowFieldCreateNestedManyWithoutWorkflowInput = {
    create?: XOR<WorkflowFieldCreateWithoutWorkflowInput, WorkflowFieldUncheckedCreateWithoutWorkflowInput> | WorkflowFieldCreateWithoutWorkflowInput[] | WorkflowFieldUncheckedCreateWithoutWorkflowInput[]
    connectOrCreate?: WorkflowFieldCreateOrConnectWithoutWorkflowInput | WorkflowFieldCreateOrConnectWithoutWorkflowInput[]
    createMany?: WorkflowFieldCreateManyWorkflowInputEnvelope
    connect?: WorkflowFieldWhereUniqueInput | WorkflowFieldWhereUniqueInput[]
  }

  export type WorkflowRoleCreateNestedManyWithoutWorkflowInput = {
    create?: XOR<WorkflowRoleCreateWithoutWorkflowInput, WorkflowRoleUncheckedCreateWithoutWorkflowInput> | WorkflowRoleCreateWithoutWorkflowInput[] | WorkflowRoleUncheckedCreateWithoutWorkflowInput[]
    connectOrCreate?: WorkflowRoleCreateOrConnectWithoutWorkflowInput | WorkflowRoleCreateOrConnectWithoutWorkflowInput[]
    createMany?: WorkflowRoleCreateManyWorkflowInputEnvelope
    connect?: WorkflowRoleWhereUniqueInput | WorkflowRoleWhereUniqueInput[]
  }

  export type WorkflowEdgeUncheckedCreateNestedManyWithoutWorkflowInput = {
    create?: XOR<WorkflowEdgeCreateWithoutWorkflowInput, WorkflowEdgeUncheckedCreateWithoutWorkflowInput> | WorkflowEdgeCreateWithoutWorkflowInput[] | WorkflowEdgeUncheckedCreateWithoutWorkflowInput[]
    connectOrCreate?: WorkflowEdgeCreateOrConnectWithoutWorkflowInput | WorkflowEdgeCreateOrConnectWithoutWorkflowInput[]
    createMany?: WorkflowEdgeCreateManyWorkflowInputEnvelope
    connect?: WorkflowEdgeWhereUniqueInput | WorkflowEdgeWhereUniqueInput[]
  }

  export type WorkflowNodeUncheckedCreateNestedManyWithoutWorkflowInput = {
    create?: XOR<WorkflowNodeCreateWithoutWorkflowInput, WorkflowNodeUncheckedCreateWithoutWorkflowInput> | WorkflowNodeCreateWithoutWorkflowInput[] | WorkflowNodeUncheckedCreateWithoutWorkflowInput[]
    connectOrCreate?: WorkflowNodeCreateOrConnectWithoutWorkflowInput | WorkflowNodeCreateOrConnectWithoutWorkflowInput[]
    createMany?: WorkflowNodeCreateManyWorkflowInputEnvelope
    connect?: WorkflowNodeWhereUniqueInput | WorkflowNodeWhereUniqueInput[]
  }

  export type WorkflowFieldUncheckedCreateNestedManyWithoutWorkflowInput = {
    create?: XOR<WorkflowFieldCreateWithoutWorkflowInput, WorkflowFieldUncheckedCreateWithoutWorkflowInput> | WorkflowFieldCreateWithoutWorkflowInput[] | WorkflowFieldUncheckedCreateWithoutWorkflowInput[]
    connectOrCreate?: WorkflowFieldCreateOrConnectWithoutWorkflowInput | WorkflowFieldCreateOrConnectWithoutWorkflowInput[]
    createMany?: WorkflowFieldCreateManyWorkflowInputEnvelope
    connect?: WorkflowFieldWhereUniqueInput | WorkflowFieldWhereUniqueInput[]
  }

  export type WorkflowRoleUncheckedCreateNestedManyWithoutWorkflowInput = {
    create?: XOR<WorkflowRoleCreateWithoutWorkflowInput, WorkflowRoleUncheckedCreateWithoutWorkflowInput> | WorkflowRoleCreateWithoutWorkflowInput[] | WorkflowRoleUncheckedCreateWithoutWorkflowInput[]
    connectOrCreate?: WorkflowRoleCreateOrConnectWithoutWorkflowInput | WorkflowRoleCreateOrConnectWithoutWorkflowInput[]
    createMany?: WorkflowRoleCreateManyWorkflowInputEnvelope
    connect?: WorkflowRoleWhereUniqueInput | WorkflowRoleWhereUniqueInput[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutWorkflowsNestedInput = {
    create?: XOR<UserCreateWithoutWorkflowsInput, UserUncheckedCreateWithoutWorkflowsInput>
    connectOrCreate?: UserCreateOrConnectWithoutWorkflowsInput
    upsert?: UserUpsertWithoutWorkflowsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutWorkflowsInput, UserUpdateWithoutWorkflowsInput>, UserUncheckedUpdateWithoutWorkflowsInput>
  }

  export type WorkflowEdgeUpdateManyWithoutWorkflowNestedInput = {
    create?: XOR<WorkflowEdgeCreateWithoutWorkflowInput, WorkflowEdgeUncheckedCreateWithoutWorkflowInput> | WorkflowEdgeCreateWithoutWorkflowInput[] | WorkflowEdgeUncheckedCreateWithoutWorkflowInput[]
    connectOrCreate?: WorkflowEdgeCreateOrConnectWithoutWorkflowInput | WorkflowEdgeCreateOrConnectWithoutWorkflowInput[]
    upsert?: WorkflowEdgeUpsertWithWhereUniqueWithoutWorkflowInput | WorkflowEdgeUpsertWithWhereUniqueWithoutWorkflowInput[]
    createMany?: WorkflowEdgeCreateManyWorkflowInputEnvelope
    set?: WorkflowEdgeWhereUniqueInput | WorkflowEdgeWhereUniqueInput[]
    disconnect?: WorkflowEdgeWhereUniqueInput | WorkflowEdgeWhereUniqueInput[]
    delete?: WorkflowEdgeWhereUniqueInput | WorkflowEdgeWhereUniqueInput[]
    connect?: WorkflowEdgeWhereUniqueInput | WorkflowEdgeWhereUniqueInput[]
    update?: WorkflowEdgeUpdateWithWhereUniqueWithoutWorkflowInput | WorkflowEdgeUpdateWithWhereUniqueWithoutWorkflowInput[]
    updateMany?: WorkflowEdgeUpdateManyWithWhereWithoutWorkflowInput | WorkflowEdgeUpdateManyWithWhereWithoutWorkflowInput[]
    deleteMany?: WorkflowEdgeScalarWhereInput | WorkflowEdgeScalarWhereInput[]
  }

  export type WorkflowNodeUpdateManyWithoutWorkflowNestedInput = {
    create?: XOR<WorkflowNodeCreateWithoutWorkflowInput, WorkflowNodeUncheckedCreateWithoutWorkflowInput> | WorkflowNodeCreateWithoutWorkflowInput[] | WorkflowNodeUncheckedCreateWithoutWorkflowInput[]
    connectOrCreate?: WorkflowNodeCreateOrConnectWithoutWorkflowInput | WorkflowNodeCreateOrConnectWithoutWorkflowInput[]
    upsert?: WorkflowNodeUpsertWithWhereUniqueWithoutWorkflowInput | WorkflowNodeUpsertWithWhereUniqueWithoutWorkflowInput[]
    createMany?: WorkflowNodeCreateManyWorkflowInputEnvelope
    set?: WorkflowNodeWhereUniqueInput | WorkflowNodeWhereUniqueInput[]
    disconnect?: WorkflowNodeWhereUniqueInput | WorkflowNodeWhereUniqueInput[]
    delete?: WorkflowNodeWhereUniqueInput | WorkflowNodeWhereUniqueInput[]
    connect?: WorkflowNodeWhereUniqueInput | WorkflowNodeWhereUniqueInput[]
    update?: WorkflowNodeUpdateWithWhereUniqueWithoutWorkflowInput | WorkflowNodeUpdateWithWhereUniqueWithoutWorkflowInput[]
    updateMany?: WorkflowNodeUpdateManyWithWhereWithoutWorkflowInput | WorkflowNodeUpdateManyWithWhereWithoutWorkflowInput[]
    deleteMany?: WorkflowNodeScalarWhereInput | WorkflowNodeScalarWhereInput[]
  }

  export type WorkflowFieldUpdateManyWithoutWorkflowNestedInput = {
    create?: XOR<WorkflowFieldCreateWithoutWorkflowInput, WorkflowFieldUncheckedCreateWithoutWorkflowInput> | WorkflowFieldCreateWithoutWorkflowInput[] | WorkflowFieldUncheckedCreateWithoutWorkflowInput[]
    connectOrCreate?: WorkflowFieldCreateOrConnectWithoutWorkflowInput | WorkflowFieldCreateOrConnectWithoutWorkflowInput[]
    upsert?: WorkflowFieldUpsertWithWhereUniqueWithoutWorkflowInput | WorkflowFieldUpsertWithWhereUniqueWithoutWorkflowInput[]
    createMany?: WorkflowFieldCreateManyWorkflowInputEnvelope
    set?: WorkflowFieldWhereUniqueInput | WorkflowFieldWhereUniqueInput[]
    disconnect?: WorkflowFieldWhereUniqueInput | WorkflowFieldWhereUniqueInput[]
    delete?: WorkflowFieldWhereUniqueInput | WorkflowFieldWhereUniqueInput[]
    connect?: WorkflowFieldWhereUniqueInput | WorkflowFieldWhereUniqueInput[]
    update?: WorkflowFieldUpdateWithWhereUniqueWithoutWorkflowInput | WorkflowFieldUpdateWithWhereUniqueWithoutWorkflowInput[]
    updateMany?: WorkflowFieldUpdateManyWithWhereWithoutWorkflowInput | WorkflowFieldUpdateManyWithWhereWithoutWorkflowInput[]
    deleteMany?: WorkflowFieldScalarWhereInput | WorkflowFieldScalarWhereInput[]
  }

  export type WorkflowRoleUpdateManyWithoutWorkflowNestedInput = {
    create?: XOR<WorkflowRoleCreateWithoutWorkflowInput, WorkflowRoleUncheckedCreateWithoutWorkflowInput> | WorkflowRoleCreateWithoutWorkflowInput[] | WorkflowRoleUncheckedCreateWithoutWorkflowInput[]
    connectOrCreate?: WorkflowRoleCreateOrConnectWithoutWorkflowInput | WorkflowRoleCreateOrConnectWithoutWorkflowInput[]
    upsert?: WorkflowRoleUpsertWithWhereUniqueWithoutWorkflowInput | WorkflowRoleUpsertWithWhereUniqueWithoutWorkflowInput[]
    createMany?: WorkflowRoleCreateManyWorkflowInputEnvelope
    set?: WorkflowRoleWhereUniqueInput | WorkflowRoleWhereUniqueInput[]
    disconnect?: WorkflowRoleWhereUniqueInput | WorkflowRoleWhereUniqueInput[]
    delete?: WorkflowRoleWhereUniqueInput | WorkflowRoleWhereUniqueInput[]
    connect?: WorkflowRoleWhereUniqueInput | WorkflowRoleWhereUniqueInput[]
    update?: WorkflowRoleUpdateWithWhereUniqueWithoutWorkflowInput | WorkflowRoleUpdateWithWhereUniqueWithoutWorkflowInput[]
    updateMany?: WorkflowRoleUpdateManyWithWhereWithoutWorkflowInput | WorkflowRoleUpdateManyWithWhereWithoutWorkflowInput[]
    deleteMany?: WorkflowRoleScalarWhereInput | WorkflowRoleScalarWhereInput[]
  }

  export type WorkflowEdgeUncheckedUpdateManyWithoutWorkflowNestedInput = {
    create?: XOR<WorkflowEdgeCreateWithoutWorkflowInput, WorkflowEdgeUncheckedCreateWithoutWorkflowInput> | WorkflowEdgeCreateWithoutWorkflowInput[] | WorkflowEdgeUncheckedCreateWithoutWorkflowInput[]
    connectOrCreate?: WorkflowEdgeCreateOrConnectWithoutWorkflowInput | WorkflowEdgeCreateOrConnectWithoutWorkflowInput[]
    upsert?: WorkflowEdgeUpsertWithWhereUniqueWithoutWorkflowInput | WorkflowEdgeUpsertWithWhereUniqueWithoutWorkflowInput[]
    createMany?: WorkflowEdgeCreateManyWorkflowInputEnvelope
    set?: WorkflowEdgeWhereUniqueInput | WorkflowEdgeWhereUniqueInput[]
    disconnect?: WorkflowEdgeWhereUniqueInput | WorkflowEdgeWhereUniqueInput[]
    delete?: WorkflowEdgeWhereUniqueInput | WorkflowEdgeWhereUniqueInput[]
    connect?: WorkflowEdgeWhereUniqueInput | WorkflowEdgeWhereUniqueInput[]
    update?: WorkflowEdgeUpdateWithWhereUniqueWithoutWorkflowInput | WorkflowEdgeUpdateWithWhereUniqueWithoutWorkflowInput[]
    updateMany?: WorkflowEdgeUpdateManyWithWhereWithoutWorkflowInput | WorkflowEdgeUpdateManyWithWhereWithoutWorkflowInput[]
    deleteMany?: WorkflowEdgeScalarWhereInput | WorkflowEdgeScalarWhereInput[]
  }

  export type WorkflowNodeUncheckedUpdateManyWithoutWorkflowNestedInput = {
    create?: XOR<WorkflowNodeCreateWithoutWorkflowInput, WorkflowNodeUncheckedCreateWithoutWorkflowInput> | WorkflowNodeCreateWithoutWorkflowInput[] | WorkflowNodeUncheckedCreateWithoutWorkflowInput[]
    connectOrCreate?: WorkflowNodeCreateOrConnectWithoutWorkflowInput | WorkflowNodeCreateOrConnectWithoutWorkflowInput[]
    upsert?: WorkflowNodeUpsertWithWhereUniqueWithoutWorkflowInput | WorkflowNodeUpsertWithWhereUniqueWithoutWorkflowInput[]
    createMany?: WorkflowNodeCreateManyWorkflowInputEnvelope
    set?: WorkflowNodeWhereUniqueInput | WorkflowNodeWhereUniqueInput[]
    disconnect?: WorkflowNodeWhereUniqueInput | WorkflowNodeWhereUniqueInput[]
    delete?: WorkflowNodeWhereUniqueInput | WorkflowNodeWhereUniqueInput[]
    connect?: WorkflowNodeWhereUniqueInput | WorkflowNodeWhereUniqueInput[]
    update?: WorkflowNodeUpdateWithWhereUniqueWithoutWorkflowInput | WorkflowNodeUpdateWithWhereUniqueWithoutWorkflowInput[]
    updateMany?: WorkflowNodeUpdateManyWithWhereWithoutWorkflowInput | WorkflowNodeUpdateManyWithWhereWithoutWorkflowInput[]
    deleteMany?: WorkflowNodeScalarWhereInput | WorkflowNodeScalarWhereInput[]
  }

  export type WorkflowFieldUncheckedUpdateManyWithoutWorkflowNestedInput = {
    create?: XOR<WorkflowFieldCreateWithoutWorkflowInput, WorkflowFieldUncheckedCreateWithoutWorkflowInput> | WorkflowFieldCreateWithoutWorkflowInput[] | WorkflowFieldUncheckedCreateWithoutWorkflowInput[]
    connectOrCreate?: WorkflowFieldCreateOrConnectWithoutWorkflowInput | WorkflowFieldCreateOrConnectWithoutWorkflowInput[]
    upsert?: WorkflowFieldUpsertWithWhereUniqueWithoutWorkflowInput | WorkflowFieldUpsertWithWhereUniqueWithoutWorkflowInput[]
    createMany?: WorkflowFieldCreateManyWorkflowInputEnvelope
    set?: WorkflowFieldWhereUniqueInput | WorkflowFieldWhereUniqueInput[]
    disconnect?: WorkflowFieldWhereUniqueInput | WorkflowFieldWhereUniqueInput[]
    delete?: WorkflowFieldWhereUniqueInput | WorkflowFieldWhereUniqueInput[]
    connect?: WorkflowFieldWhereUniqueInput | WorkflowFieldWhereUniqueInput[]
    update?: WorkflowFieldUpdateWithWhereUniqueWithoutWorkflowInput | WorkflowFieldUpdateWithWhereUniqueWithoutWorkflowInput[]
    updateMany?: WorkflowFieldUpdateManyWithWhereWithoutWorkflowInput | WorkflowFieldUpdateManyWithWhereWithoutWorkflowInput[]
    deleteMany?: WorkflowFieldScalarWhereInput | WorkflowFieldScalarWhereInput[]
  }

  export type WorkflowRoleUncheckedUpdateManyWithoutWorkflowNestedInput = {
    create?: XOR<WorkflowRoleCreateWithoutWorkflowInput, WorkflowRoleUncheckedCreateWithoutWorkflowInput> | WorkflowRoleCreateWithoutWorkflowInput[] | WorkflowRoleUncheckedCreateWithoutWorkflowInput[]
    connectOrCreate?: WorkflowRoleCreateOrConnectWithoutWorkflowInput | WorkflowRoleCreateOrConnectWithoutWorkflowInput[]
    upsert?: WorkflowRoleUpsertWithWhereUniqueWithoutWorkflowInput | WorkflowRoleUpsertWithWhereUniqueWithoutWorkflowInput[]
    createMany?: WorkflowRoleCreateManyWorkflowInputEnvelope
    set?: WorkflowRoleWhereUniqueInput | WorkflowRoleWhereUniqueInput[]
    disconnect?: WorkflowRoleWhereUniqueInput | WorkflowRoleWhereUniqueInput[]
    delete?: WorkflowRoleWhereUniqueInput | WorkflowRoleWhereUniqueInput[]
    connect?: WorkflowRoleWhereUniqueInput | WorkflowRoleWhereUniqueInput[]
    update?: WorkflowRoleUpdateWithWhereUniqueWithoutWorkflowInput | WorkflowRoleUpdateWithWhereUniqueWithoutWorkflowInput[]
    updateMany?: WorkflowRoleUpdateManyWithWhereWithoutWorkflowInput | WorkflowRoleUpdateManyWithWhereWithoutWorkflowInput[]
    deleteMany?: WorkflowRoleScalarWhereInput | WorkflowRoleScalarWhereInput[]
  }

  export type WorkflowEdgeCreateNestedManyWithoutSourceNodeInput = {
    create?: XOR<WorkflowEdgeCreateWithoutSourceNodeInput, WorkflowEdgeUncheckedCreateWithoutSourceNodeInput> | WorkflowEdgeCreateWithoutSourceNodeInput[] | WorkflowEdgeUncheckedCreateWithoutSourceNodeInput[]
    connectOrCreate?: WorkflowEdgeCreateOrConnectWithoutSourceNodeInput | WorkflowEdgeCreateOrConnectWithoutSourceNodeInput[]
    createMany?: WorkflowEdgeCreateManySourceNodeInputEnvelope
    connect?: WorkflowEdgeWhereUniqueInput | WorkflowEdgeWhereUniqueInput[]
  }

  export type WorkflowEdgeCreateNestedManyWithoutTargetNodeInput = {
    create?: XOR<WorkflowEdgeCreateWithoutTargetNodeInput, WorkflowEdgeUncheckedCreateWithoutTargetNodeInput> | WorkflowEdgeCreateWithoutTargetNodeInput[] | WorkflowEdgeUncheckedCreateWithoutTargetNodeInput[]
    connectOrCreate?: WorkflowEdgeCreateOrConnectWithoutTargetNodeInput | WorkflowEdgeCreateOrConnectWithoutTargetNodeInput[]
    createMany?: WorkflowEdgeCreateManyTargetNodeInputEnvelope
    connect?: WorkflowEdgeWhereUniqueInput | WorkflowEdgeWhereUniqueInput[]
  }

  export type WorkflowFieldCreateNestedManyWithoutSourceNodeInput = {
    create?: XOR<WorkflowFieldCreateWithoutSourceNodeInput, WorkflowFieldUncheckedCreateWithoutSourceNodeInput> | WorkflowFieldCreateWithoutSourceNodeInput[] | WorkflowFieldUncheckedCreateWithoutSourceNodeInput[]
    connectOrCreate?: WorkflowFieldCreateOrConnectWithoutSourceNodeInput | WorkflowFieldCreateOrConnectWithoutSourceNodeInput[]
    createMany?: WorkflowFieldCreateManySourceNodeInputEnvelope
    connect?: WorkflowFieldWhereUniqueInput | WorkflowFieldWhereUniqueInput[]
  }

  export type ActionCreateNestedOneWithoutWorkflowNodesInput = {
    create?: XOR<ActionCreateWithoutWorkflowNodesInput, ActionUncheckedCreateWithoutWorkflowNodesInput>
    connectOrCreate?: ActionCreateOrConnectWithoutWorkflowNodesInput
    connect?: ActionWhereUniqueInput
  }

  export type WorkflowCreateNestedOneWithoutNodesInput = {
    create?: XOR<WorkflowCreateWithoutNodesInput, WorkflowUncheckedCreateWithoutNodesInput>
    connectOrCreate?: WorkflowCreateOrConnectWithoutNodesInput
    connect?: WorkflowWhereUniqueInput
  }

  export type WorkflowEdgeUncheckedCreateNestedManyWithoutSourceNodeInput = {
    create?: XOR<WorkflowEdgeCreateWithoutSourceNodeInput, WorkflowEdgeUncheckedCreateWithoutSourceNodeInput> | WorkflowEdgeCreateWithoutSourceNodeInput[] | WorkflowEdgeUncheckedCreateWithoutSourceNodeInput[]
    connectOrCreate?: WorkflowEdgeCreateOrConnectWithoutSourceNodeInput | WorkflowEdgeCreateOrConnectWithoutSourceNodeInput[]
    createMany?: WorkflowEdgeCreateManySourceNodeInputEnvelope
    connect?: WorkflowEdgeWhereUniqueInput | WorkflowEdgeWhereUniqueInput[]
  }

  export type WorkflowEdgeUncheckedCreateNestedManyWithoutTargetNodeInput = {
    create?: XOR<WorkflowEdgeCreateWithoutTargetNodeInput, WorkflowEdgeUncheckedCreateWithoutTargetNodeInput> | WorkflowEdgeCreateWithoutTargetNodeInput[] | WorkflowEdgeUncheckedCreateWithoutTargetNodeInput[]
    connectOrCreate?: WorkflowEdgeCreateOrConnectWithoutTargetNodeInput | WorkflowEdgeCreateOrConnectWithoutTargetNodeInput[]
    createMany?: WorkflowEdgeCreateManyTargetNodeInputEnvelope
    connect?: WorkflowEdgeWhereUniqueInput | WorkflowEdgeWhereUniqueInput[]
  }

  export type WorkflowFieldUncheckedCreateNestedManyWithoutSourceNodeInput = {
    create?: XOR<WorkflowFieldCreateWithoutSourceNodeInput, WorkflowFieldUncheckedCreateWithoutSourceNodeInput> | WorkflowFieldCreateWithoutSourceNodeInput[] | WorkflowFieldUncheckedCreateWithoutSourceNodeInput[]
    connectOrCreate?: WorkflowFieldCreateOrConnectWithoutSourceNodeInput | WorkflowFieldCreateOrConnectWithoutSourceNodeInput[]
    createMany?: WorkflowFieldCreateManySourceNodeInputEnvelope
    connect?: WorkflowFieldWhereUniqueInput | WorkflowFieldWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type WorkflowEdgeUpdateManyWithoutSourceNodeNestedInput = {
    create?: XOR<WorkflowEdgeCreateWithoutSourceNodeInput, WorkflowEdgeUncheckedCreateWithoutSourceNodeInput> | WorkflowEdgeCreateWithoutSourceNodeInput[] | WorkflowEdgeUncheckedCreateWithoutSourceNodeInput[]
    connectOrCreate?: WorkflowEdgeCreateOrConnectWithoutSourceNodeInput | WorkflowEdgeCreateOrConnectWithoutSourceNodeInput[]
    upsert?: WorkflowEdgeUpsertWithWhereUniqueWithoutSourceNodeInput | WorkflowEdgeUpsertWithWhereUniqueWithoutSourceNodeInput[]
    createMany?: WorkflowEdgeCreateManySourceNodeInputEnvelope
    set?: WorkflowEdgeWhereUniqueInput | WorkflowEdgeWhereUniqueInput[]
    disconnect?: WorkflowEdgeWhereUniqueInput | WorkflowEdgeWhereUniqueInput[]
    delete?: WorkflowEdgeWhereUniqueInput | WorkflowEdgeWhereUniqueInput[]
    connect?: WorkflowEdgeWhereUniqueInput | WorkflowEdgeWhereUniqueInput[]
    update?: WorkflowEdgeUpdateWithWhereUniqueWithoutSourceNodeInput | WorkflowEdgeUpdateWithWhereUniqueWithoutSourceNodeInput[]
    updateMany?: WorkflowEdgeUpdateManyWithWhereWithoutSourceNodeInput | WorkflowEdgeUpdateManyWithWhereWithoutSourceNodeInput[]
    deleteMany?: WorkflowEdgeScalarWhereInput | WorkflowEdgeScalarWhereInput[]
  }

  export type WorkflowEdgeUpdateManyWithoutTargetNodeNestedInput = {
    create?: XOR<WorkflowEdgeCreateWithoutTargetNodeInput, WorkflowEdgeUncheckedCreateWithoutTargetNodeInput> | WorkflowEdgeCreateWithoutTargetNodeInput[] | WorkflowEdgeUncheckedCreateWithoutTargetNodeInput[]
    connectOrCreate?: WorkflowEdgeCreateOrConnectWithoutTargetNodeInput | WorkflowEdgeCreateOrConnectWithoutTargetNodeInput[]
    upsert?: WorkflowEdgeUpsertWithWhereUniqueWithoutTargetNodeInput | WorkflowEdgeUpsertWithWhereUniqueWithoutTargetNodeInput[]
    createMany?: WorkflowEdgeCreateManyTargetNodeInputEnvelope
    set?: WorkflowEdgeWhereUniqueInput | WorkflowEdgeWhereUniqueInput[]
    disconnect?: WorkflowEdgeWhereUniqueInput | WorkflowEdgeWhereUniqueInput[]
    delete?: WorkflowEdgeWhereUniqueInput | WorkflowEdgeWhereUniqueInput[]
    connect?: WorkflowEdgeWhereUniqueInput | WorkflowEdgeWhereUniqueInput[]
    update?: WorkflowEdgeUpdateWithWhereUniqueWithoutTargetNodeInput | WorkflowEdgeUpdateWithWhereUniqueWithoutTargetNodeInput[]
    updateMany?: WorkflowEdgeUpdateManyWithWhereWithoutTargetNodeInput | WorkflowEdgeUpdateManyWithWhereWithoutTargetNodeInput[]
    deleteMany?: WorkflowEdgeScalarWhereInput | WorkflowEdgeScalarWhereInput[]
  }

  export type WorkflowFieldUpdateManyWithoutSourceNodeNestedInput = {
    create?: XOR<WorkflowFieldCreateWithoutSourceNodeInput, WorkflowFieldUncheckedCreateWithoutSourceNodeInput> | WorkflowFieldCreateWithoutSourceNodeInput[] | WorkflowFieldUncheckedCreateWithoutSourceNodeInput[]
    connectOrCreate?: WorkflowFieldCreateOrConnectWithoutSourceNodeInput | WorkflowFieldCreateOrConnectWithoutSourceNodeInput[]
    upsert?: WorkflowFieldUpsertWithWhereUniqueWithoutSourceNodeInput | WorkflowFieldUpsertWithWhereUniqueWithoutSourceNodeInput[]
    createMany?: WorkflowFieldCreateManySourceNodeInputEnvelope
    set?: WorkflowFieldWhereUniqueInput | WorkflowFieldWhereUniqueInput[]
    disconnect?: WorkflowFieldWhereUniqueInput | WorkflowFieldWhereUniqueInput[]
    delete?: WorkflowFieldWhereUniqueInput | WorkflowFieldWhereUniqueInput[]
    connect?: WorkflowFieldWhereUniqueInput | WorkflowFieldWhereUniqueInput[]
    update?: WorkflowFieldUpdateWithWhereUniqueWithoutSourceNodeInput | WorkflowFieldUpdateWithWhereUniqueWithoutSourceNodeInput[]
    updateMany?: WorkflowFieldUpdateManyWithWhereWithoutSourceNodeInput | WorkflowFieldUpdateManyWithWhereWithoutSourceNodeInput[]
    deleteMany?: WorkflowFieldScalarWhereInput | WorkflowFieldScalarWhereInput[]
  }

  export type ActionUpdateOneRequiredWithoutWorkflowNodesNestedInput = {
    create?: XOR<ActionCreateWithoutWorkflowNodesInput, ActionUncheckedCreateWithoutWorkflowNodesInput>
    connectOrCreate?: ActionCreateOrConnectWithoutWorkflowNodesInput
    upsert?: ActionUpsertWithoutWorkflowNodesInput
    connect?: ActionWhereUniqueInput
    update?: XOR<XOR<ActionUpdateToOneWithWhereWithoutWorkflowNodesInput, ActionUpdateWithoutWorkflowNodesInput>, ActionUncheckedUpdateWithoutWorkflowNodesInput>
  }

  export type WorkflowUpdateOneRequiredWithoutNodesNestedInput = {
    create?: XOR<WorkflowCreateWithoutNodesInput, WorkflowUncheckedCreateWithoutNodesInput>
    connectOrCreate?: WorkflowCreateOrConnectWithoutNodesInput
    upsert?: WorkflowUpsertWithoutNodesInput
    connect?: WorkflowWhereUniqueInput
    update?: XOR<XOR<WorkflowUpdateToOneWithWhereWithoutNodesInput, WorkflowUpdateWithoutNodesInput>, WorkflowUncheckedUpdateWithoutNodesInput>
  }

  export type WorkflowEdgeUncheckedUpdateManyWithoutSourceNodeNestedInput = {
    create?: XOR<WorkflowEdgeCreateWithoutSourceNodeInput, WorkflowEdgeUncheckedCreateWithoutSourceNodeInput> | WorkflowEdgeCreateWithoutSourceNodeInput[] | WorkflowEdgeUncheckedCreateWithoutSourceNodeInput[]
    connectOrCreate?: WorkflowEdgeCreateOrConnectWithoutSourceNodeInput | WorkflowEdgeCreateOrConnectWithoutSourceNodeInput[]
    upsert?: WorkflowEdgeUpsertWithWhereUniqueWithoutSourceNodeInput | WorkflowEdgeUpsertWithWhereUniqueWithoutSourceNodeInput[]
    createMany?: WorkflowEdgeCreateManySourceNodeInputEnvelope
    set?: WorkflowEdgeWhereUniqueInput | WorkflowEdgeWhereUniqueInput[]
    disconnect?: WorkflowEdgeWhereUniqueInput | WorkflowEdgeWhereUniqueInput[]
    delete?: WorkflowEdgeWhereUniqueInput | WorkflowEdgeWhereUniqueInput[]
    connect?: WorkflowEdgeWhereUniqueInput | WorkflowEdgeWhereUniqueInput[]
    update?: WorkflowEdgeUpdateWithWhereUniqueWithoutSourceNodeInput | WorkflowEdgeUpdateWithWhereUniqueWithoutSourceNodeInput[]
    updateMany?: WorkflowEdgeUpdateManyWithWhereWithoutSourceNodeInput | WorkflowEdgeUpdateManyWithWhereWithoutSourceNodeInput[]
    deleteMany?: WorkflowEdgeScalarWhereInput | WorkflowEdgeScalarWhereInput[]
  }

  export type WorkflowEdgeUncheckedUpdateManyWithoutTargetNodeNestedInput = {
    create?: XOR<WorkflowEdgeCreateWithoutTargetNodeInput, WorkflowEdgeUncheckedCreateWithoutTargetNodeInput> | WorkflowEdgeCreateWithoutTargetNodeInput[] | WorkflowEdgeUncheckedCreateWithoutTargetNodeInput[]
    connectOrCreate?: WorkflowEdgeCreateOrConnectWithoutTargetNodeInput | WorkflowEdgeCreateOrConnectWithoutTargetNodeInput[]
    upsert?: WorkflowEdgeUpsertWithWhereUniqueWithoutTargetNodeInput | WorkflowEdgeUpsertWithWhereUniqueWithoutTargetNodeInput[]
    createMany?: WorkflowEdgeCreateManyTargetNodeInputEnvelope
    set?: WorkflowEdgeWhereUniqueInput | WorkflowEdgeWhereUniqueInput[]
    disconnect?: WorkflowEdgeWhereUniqueInput | WorkflowEdgeWhereUniqueInput[]
    delete?: WorkflowEdgeWhereUniqueInput | WorkflowEdgeWhereUniqueInput[]
    connect?: WorkflowEdgeWhereUniqueInput | WorkflowEdgeWhereUniqueInput[]
    update?: WorkflowEdgeUpdateWithWhereUniqueWithoutTargetNodeInput | WorkflowEdgeUpdateWithWhereUniqueWithoutTargetNodeInput[]
    updateMany?: WorkflowEdgeUpdateManyWithWhereWithoutTargetNodeInput | WorkflowEdgeUpdateManyWithWhereWithoutTargetNodeInput[]
    deleteMany?: WorkflowEdgeScalarWhereInput | WorkflowEdgeScalarWhereInput[]
  }

  export type WorkflowFieldUncheckedUpdateManyWithoutSourceNodeNestedInput = {
    create?: XOR<WorkflowFieldCreateWithoutSourceNodeInput, WorkflowFieldUncheckedCreateWithoutSourceNodeInput> | WorkflowFieldCreateWithoutSourceNodeInput[] | WorkflowFieldUncheckedCreateWithoutSourceNodeInput[]
    connectOrCreate?: WorkflowFieldCreateOrConnectWithoutSourceNodeInput | WorkflowFieldCreateOrConnectWithoutSourceNodeInput[]
    upsert?: WorkflowFieldUpsertWithWhereUniqueWithoutSourceNodeInput | WorkflowFieldUpsertWithWhereUniqueWithoutSourceNodeInput[]
    createMany?: WorkflowFieldCreateManySourceNodeInputEnvelope
    set?: WorkflowFieldWhereUniqueInput | WorkflowFieldWhereUniqueInput[]
    disconnect?: WorkflowFieldWhereUniqueInput | WorkflowFieldWhereUniqueInput[]
    delete?: WorkflowFieldWhereUniqueInput | WorkflowFieldWhereUniqueInput[]
    connect?: WorkflowFieldWhereUniqueInput | WorkflowFieldWhereUniqueInput[]
    update?: WorkflowFieldUpdateWithWhereUniqueWithoutSourceNodeInput | WorkflowFieldUpdateWithWhereUniqueWithoutSourceNodeInput[]
    updateMany?: WorkflowFieldUpdateManyWithWhereWithoutSourceNodeInput | WorkflowFieldUpdateManyWithWhereWithoutSourceNodeInput[]
    deleteMany?: WorkflowFieldScalarWhereInput | WorkflowFieldScalarWhereInput[]
  }

  export type WorkflowNodeCreateNestedOneWithoutOutgoingInput = {
    create?: XOR<WorkflowNodeCreateWithoutOutgoingInput, WorkflowNodeUncheckedCreateWithoutOutgoingInput>
    connectOrCreate?: WorkflowNodeCreateOrConnectWithoutOutgoingInput
    connect?: WorkflowNodeWhereUniqueInput
  }

  export type WorkflowNodeCreateNestedOneWithoutIncomingInput = {
    create?: XOR<WorkflowNodeCreateWithoutIncomingInput, WorkflowNodeUncheckedCreateWithoutIncomingInput>
    connectOrCreate?: WorkflowNodeCreateOrConnectWithoutIncomingInput
    connect?: WorkflowNodeWhereUniqueInput
  }

  export type WorkflowCreateNestedOneWithoutEdgesInput = {
    create?: XOR<WorkflowCreateWithoutEdgesInput, WorkflowUncheckedCreateWithoutEdgesInput>
    connectOrCreate?: WorkflowCreateOrConnectWithoutEdgesInput
    connect?: WorkflowWhereUniqueInput
  }

  export type WorkflowNodeUpdateOneRequiredWithoutOutgoingNestedInput = {
    create?: XOR<WorkflowNodeCreateWithoutOutgoingInput, WorkflowNodeUncheckedCreateWithoutOutgoingInput>
    connectOrCreate?: WorkflowNodeCreateOrConnectWithoutOutgoingInput
    upsert?: WorkflowNodeUpsertWithoutOutgoingInput
    connect?: WorkflowNodeWhereUniqueInput
    update?: XOR<XOR<WorkflowNodeUpdateToOneWithWhereWithoutOutgoingInput, WorkflowNodeUpdateWithoutOutgoingInput>, WorkflowNodeUncheckedUpdateWithoutOutgoingInput>
  }

  export type WorkflowNodeUpdateOneRequiredWithoutIncomingNestedInput = {
    create?: XOR<WorkflowNodeCreateWithoutIncomingInput, WorkflowNodeUncheckedCreateWithoutIncomingInput>
    connectOrCreate?: WorkflowNodeCreateOrConnectWithoutIncomingInput
    upsert?: WorkflowNodeUpsertWithoutIncomingInput
    connect?: WorkflowNodeWhereUniqueInput
    update?: XOR<XOR<WorkflowNodeUpdateToOneWithWhereWithoutIncomingInput, WorkflowNodeUpdateWithoutIncomingInput>, WorkflowNodeUncheckedUpdateWithoutIncomingInput>
  }

  export type WorkflowUpdateOneRequiredWithoutEdgesNestedInput = {
    create?: XOR<WorkflowCreateWithoutEdgesInput, WorkflowUncheckedCreateWithoutEdgesInput>
    connectOrCreate?: WorkflowCreateOrConnectWithoutEdgesInput
    upsert?: WorkflowUpsertWithoutEdgesInput
    connect?: WorkflowWhereUniqueInput
    update?: XOR<XOR<WorkflowUpdateToOneWithWhereWithoutEdgesInput, WorkflowUpdateWithoutEdgesInput>, WorkflowUncheckedUpdateWithoutEdgesInput>
  }

  export type ActionCreateNestedManyWithoutCategoryInput = {
    create?: XOR<ActionCreateWithoutCategoryInput, ActionUncheckedCreateWithoutCategoryInput> | ActionCreateWithoutCategoryInput[] | ActionUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ActionCreateOrConnectWithoutCategoryInput | ActionCreateOrConnectWithoutCategoryInput[]
    createMany?: ActionCreateManyCategoryInputEnvelope
    connect?: ActionWhereUniqueInput | ActionWhereUniqueInput[]
  }

  export type ActionUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<ActionCreateWithoutCategoryInput, ActionUncheckedCreateWithoutCategoryInput> | ActionCreateWithoutCategoryInput[] | ActionUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ActionCreateOrConnectWithoutCategoryInput | ActionCreateOrConnectWithoutCategoryInput[]
    createMany?: ActionCreateManyCategoryInputEnvelope
    connect?: ActionWhereUniqueInput | ActionWhereUniqueInput[]
  }

  export type ActionUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<ActionCreateWithoutCategoryInput, ActionUncheckedCreateWithoutCategoryInput> | ActionCreateWithoutCategoryInput[] | ActionUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ActionCreateOrConnectWithoutCategoryInput | ActionCreateOrConnectWithoutCategoryInput[]
    upsert?: ActionUpsertWithWhereUniqueWithoutCategoryInput | ActionUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: ActionCreateManyCategoryInputEnvelope
    set?: ActionWhereUniqueInput | ActionWhereUniqueInput[]
    disconnect?: ActionWhereUniqueInput | ActionWhereUniqueInput[]
    delete?: ActionWhereUniqueInput | ActionWhereUniqueInput[]
    connect?: ActionWhereUniqueInput | ActionWhereUniqueInput[]
    update?: ActionUpdateWithWhereUniqueWithoutCategoryInput | ActionUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: ActionUpdateManyWithWhereWithoutCategoryInput | ActionUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: ActionScalarWhereInput | ActionScalarWhereInput[]
  }

  export type ActionUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<ActionCreateWithoutCategoryInput, ActionUncheckedCreateWithoutCategoryInput> | ActionCreateWithoutCategoryInput[] | ActionUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ActionCreateOrConnectWithoutCategoryInput | ActionCreateOrConnectWithoutCategoryInput[]
    upsert?: ActionUpsertWithWhereUniqueWithoutCategoryInput | ActionUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: ActionCreateManyCategoryInputEnvelope
    set?: ActionWhereUniqueInput | ActionWhereUniqueInput[]
    disconnect?: ActionWhereUniqueInput | ActionWhereUniqueInput[]
    delete?: ActionWhereUniqueInput | ActionWhereUniqueInput[]
    connect?: ActionWhereUniqueInput | ActionWhereUniqueInput[]
    update?: ActionUpdateWithWhereUniqueWithoutCategoryInput | ActionUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: ActionUpdateManyWithWhereWithoutCategoryInput | ActionUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: ActionScalarWhereInput | ActionScalarWhereInput[]
  }

  export type ActionCategoryCreateNestedOneWithoutActionsInput = {
    create?: XOR<ActionCategoryCreateWithoutActionsInput, ActionCategoryUncheckedCreateWithoutActionsInput>
    connectOrCreate?: ActionCategoryCreateOrConnectWithoutActionsInput
    connect?: ActionCategoryWhereUniqueInput
  }

  export type WorkflowNodeCreateNestedManyWithoutActionInput = {
    create?: XOR<WorkflowNodeCreateWithoutActionInput, WorkflowNodeUncheckedCreateWithoutActionInput> | WorkflowNodeCreateWithoutActionInput[] | WorkflowNodeUncheckedCreateWithoutActionInput[]
    connectOrCreate?: WorkflowNodeCreateOrConnectWithoutActionInput | WorkflowNodeCreateOrConnectWithoutActionInput[]
    createMany?: WorkflowNodeCreateManyActionInputEnvelope
    connect?: WorkflowNodeWhereUniqueInput | WorkflowNodeWhereUniqueInput[]
  }

  export type WorkflowNodeUncheckedCreateNestedManyWithoutActionInput = {
    create?: XOR<WorkflowNodeCreateWithoutActionInput, WorkflowNodeUncheckedCreateWithoutActionInput> | WorkflowNodeCreateWithoutActionInput[] | WorkflowNodeUncheckedCreateWithoutActionInput[]
    connectOrCreate?: WorkflowNodeCreateOrConnectWithoutActionInput | WorkflowNodeCreateOrConnectWithoutActionInput[]
    createMany?: WorkflowNodeCreateManyActionInputEnvelope
    connect?: WorkflowNodeWhereUniqueInput | WorkflowNodeWhereUniqueInput[]
  }

  export type ActionCategoryUpdateOneRequiredWithoutActionsNestedInput = {
    create?: XOR<ActionCategoryCreateWithoutActionsInput, ActionCategoryUncheckedCreateWithoutActionsInput>
    connectOrCreate?: ActionCategoryCreateOrConnectWithoutActionsInput
    upsert?: ActionCategoryUpsertWithoutActionsInput
    connect?: ActionCategoryWhereUniqueInput
    update?: XOR<XOR<ActionCategoryUpdateToOneWithWhereWithoutActionsInput, ActionCategoryUpdateWithoutActionsInput>, ActionCategoryUncheckedUpdateWithoutActionsInput>
  }

  export type WorkflowNodeUpdateManyWithoutActionNestedInput = {
    create?: XOR<WorkflowNodeCreateWithoutActionInput, WorkflowNodeUncheckedCreateWithoutActionInput> | WorkflowNodeCreateWithoutActionInput[] | WorkflowNodeUncheckedCreateWithoutActionInput[]
    connectOrCreate?: WorkflowNodeCreateOrConnectWithoutActionInput | WorkflowNodeCreateOrConnectWithoutActionInput[]
    upsert?: WorkflowNodeUpsertWithWhereUniqueWithoutActionInput | WorkflowNodeUpsertWithWhereUniqueWithoutActionInput[]
    createMany?: WorkflowNodeCreateManyActionInputEnvelope
    set?: WorkflowNodeWhereUniqueInput | WorkflowNodeWhereUniqueInput[]
    disconnect?: WorkflowNodeWhereUniqueInput | WorkflowNodeWhereUniqueInput[]
    delete?: WorkflowNodeWhereUniqueInput | WorkflowNodeWhereUniqueInput[]
    connect?: WorkflowNodeWhereUniqueInput | WorkflowNodeWhereUniqueInput[]
    update?: WorkflowNodeUpdateWithWhereUniqueWithoutActionInput | WorkflowNodeUpdateWithWhereUniqueWithoutActionInput[]
    updateMany?: WorkflowNodeUpdateManyWithWhereWithoutActionInput | WorkflowNodeUpdateManyWithWhereWithoutActionInput[]
    deleteMany?: WorkflowNodeScalarWhereInput | WorkflowNodeScalarWhereInput[]
  }

  export type WorkflowNodeUncheckedUpdateManyWithoutActionNestedInput = {
    create?: XOR<WorkflowNodeCreateWithoutActionInput, WorkflowNodeUncheckedCreateWithoutActionInput> | WorkflowNodeCreateWithoutActionInput[] | WorkflowNodeUncheckedCreateWithoutActionInput[]
    connectOrCreate?: WorkflowNodeCreateOrConnectWithoutActionInput | WorkflowNodeCreateOrConnectWithoutActionInput[]
    upsert?: WorkflowNodeUpsertWithWhereUniqueWithoutActionInput | WorkflowNodeUpsertWithWhereUniqueWithoutActionInput[]
    createMany?: WorkflowNodeCreateManyActionInputEnvelope
    set?: WorkflowNodeWhereUniqueInput | WorkflowNodeWhereUniqueInput[]
    disconnect?: WorkflowNodeWhereUniqueInput | WorkflowNodeWhereUniqueInput[]
    delete?: WorkflowNodeWhereUniqueInput | WorkflowNodeWhereUniqueInput[]
    connect?: WorkflowNodeWhereUniqueInput | WorkflowNodeWhereUniqueInput[]
    update?: WorkflowNodeUpdateWithWhereUniqueWithoutActionInput | WorkflowNodeUpdateWithWhereUniqueWithoutActionInput[]
    updateMany?: WorkflowNodeUpdateManyWithWhereWithoutActionInput | WorkflowNodeUpdateManyWithWhereWithoutActionInput[]
    deleteMany?: WorkflowNodeScalarWhereInput | WorkflowNodeScalarWhereInput[]
  }

  export type WorkflowNodeCreateNestedOneWithoutFieldsInput = {
    create?: XOR<WorkflowNodeCreateWithoutFieldsInput, WorkflowNodeUncheckedCreateWithoutFieldsInput>
    connectOrCreate?: WorkflowNodeCreateOrConnectWithoutFieldsInput
    connect?: WorkflowNodeWhereUniqueInput
  }

  export type WorkflowCreateNestedOneWithoutFieldsInput = {
    create?: XOR<WorkflowCreateWithoutFieldsInput, WorkflowUncheckedCreateWithoutFieldsInput>
    connectOrCreate?: WorkflowCreateOrConnectWithoutFieldsInput
    connect?: WorkflowWhereUniqueInput
  }

  export type WorkflowNodeUpdateOneRequiredWithoutFieldsNestedInput = {
    create?: XOR<WorkflowNodeCreateWithoutFieldsInput, WorkflowNodeUncheckedCreateWithoutFieldsInput>
    connectOrCreate?: WorkflowNodeCreateOrConnectWithoutFieldsInput
    upsert?: WorkflowNodeUpsertWithoutFieldsInput
    connect?: WorkflowNodeWhereUniqueInput
    update?: XOR<XOR<WorkflowNodeUpdateToOneWithWhereWithoutFieldsInput, WorkflowNodeUpdateWithoutFieldsInput>, WorkflowNodeUncheckedUpdateWithoutFieldsInput>
  }

  export type WorkflowUpdateOneRequiredWithoutFieldsNestedInput = {
    create?: XOR<WorkflowCreateWithoutFieldsInput, WorkflowUncheckedCreateWithoutFieldsInput>
    connectOrCreate?: WorkflowCreateOrConnectWithoutFieldsInput
    upsert?: WorkflowUpsertWithoutFieldsInput
    connect?: WorkflowWhereUniqueInput
    update?: XOR<XOR<WorkflowUpdateToOneWithWhereWithoutFieldsInput, WorkflowUpdateWithoutFieldsInput>, WorkflowUncheckedUpdateWithoutFieldsInput>
  }

  export type WorkflowRoleCreatepermissionsInput = {
    set: $Enums.Permission[]
  }

  export type WorkflowCreateNestedOneWithoutRolesInput = {
    create?: XOR<WorkflowCreateWithoutRolesInput, WorkflowUncheckedCreateWithoutRolesInput>
    connectOrCreate?: WorkflowCreateOrConnectWithoutRolesInput
    connect?: WorkflowWhereUniqueInput
  }

  export type WorkflowRoleAssignmentCreateNestedManyWithoutWorkflowRoleInput = {
    create?: XOR<WorkflowRoleAssignmentCreateWithoutWorkflowRoleInput, WorkflowRoleAssignmentUncheckedCreateWithoutWorkflowRoleInput> | WorkflowRoleAssignmentCreateWithoutWorkflowRoleInput[] | WorkflowRoleAssignmentUncheckedCreateWithoutWorkflowRoleInput[]
    connectOrCreate?: WorkflowRoleAssignmentCreateOrConnectWithoutWorkflowRoleInput | WorkflowRoleAssignmentCreateOrConnectWithoutWorkflowRoleInput[]
    createMany?: WorkflowRoleAssignmentCreateManyWorkflowRoleInputEnvelope
    connect?: WorkflowRoleAssignmentWhereUniqueInput | WorkflowRoleAssignmentWhereUniqueInput[]
  }

  export type WorkflowRoleAssignmentUncheckedCreateNestedManyWithoutWorkflowRoleInput = {
    create?: XOR<WorkflowRoleAssignmentCreateWithoutWorkflowRoleInput, WorkflowRoleAssignmentUncheckedCreateWithoutWorkflowRoleInput> | WorkflowRoleAssignmentCreateWithoutWorkflowRoleInput[] | WorkflowRoleAssignmentUncheckedCreateWithoutWorkflowRoleInput[]
    connectOrCreate?: WorkflowRoleAssignmentCreateOrConnectWithoutWorkflowRoleInput | WorkflowRoleAssignmentCreateOrConnectWithoutWorkflowRoleInput[]
    createMany?: WorkflowRoleAssignmentCreateManyWorkflowRoleInputEnvelope
    connect?: WorkflowRoleAssignmentWhereUniqueInput | WorkflowRoleAssignmentWhereUniqueInput[]
  }

  export type WorkflowRoleUpdatepermissionsInput = {
    set?: $Enums.Permission[]
    push?: $Enums.Permission | $Enums.Permission[]
  }

  export type WorkflowUpdateOneRequiredWithoutRolesNestedInput = {
    create?: XOR<WorkflowCreateWithoutRolesInput, WorkflowUncheckedCreateWithoutRolesInput>
    connectOrCreate?: WorkflowCreateOrConnectWithoutRolesInput
    upsert?: WorkflowUpsertWithoutRolesInput
    connect?: WorkflowWhereUniqueInput
    update?: XOR<XOR<WorkflowUpdateToOneWithWhereWithoutRolesInput, WorkflowUpdateWithoutRolesInput>, WorkflowUncheckedUpdateWithoutRolesInput>
  }

  export type WorkflowRoleAssignmentUpdateManyWithoutWorkflowRoleNestedInput = {
    create?: XOR<WorkflowRoleAssignmentCreateWithoutWorkflowRoleInput, WorkflowRoleAssignmentUncheckedCreateWithoutWorkflowRoleInput> | WorkflowRoleAssignmentCreateWithoutWorkflowRoleInput[] | WorkflowRoleAssignmentUncheckedCreateWithoutWorkflowRoleInput[]
    connectOrCreate?: WorkflowRoleAssignmentCreateOrConnectWithoutWorkflowRoleInput | WorkflowRoleAssignmentCreateOrConnectWithoutWorkflowRoleInput[]
    upsert?: WorkflowRoleAssignmentUpsertWithWhereUniqueWithoutWorkflowRoleInput | WorkflowRoleAssignmentUpsertWithWhereUniqueWithoutWorkflowRoleInput[]
    createMany?: WorkflowRoleAssignmentCreateManyWorkflowRoleInputEnvelope
    set?: WorkflowRoleAssignmentWhereUniqueInput | WorkflowRoleAssignmentWhereUniqueInput[]
    disconnect?: WorkflowRoleAssignmentWhereUniqueInput | WorkflowRoleAssignmentWhereUniqueInput[]
    delete?: WorkflowRoleAssignmentWhereUniqueInput | WorkflowRoleAssignmentWhereUniqueInput[]
    connect?: WorkflowRoleAssignmentWhereUniqueInput | WorkflowRoleAssignmentWhereUniqueInput[]
    update?: WorkflowRoleAssignmentUpdateWithWhereUniqueWithoutWorkflowRoleInput | WorkflowRoleAssignmentUpdateWithWhereUniqueWithoutWorkflowRoleInput[]
    updateMany?: WorkflowRoleAssignmentUpdateManyWithWhereWithoutWorkflowRoleInput | WorkflowRoleAssignmentUpdateManyWithWhereWithoutWorkflowRoleInput[]
    deleteMany?: WorkflowRoleAssignmentScalarWhereInput | WorkflowRoleAssignmentScalarWhereInput[]
  }

  export type WorkflowRoleAssignmentUncheckedUpdateManyWithoutWorkflowRoleNestedInput = {
    create?: XOR<WorkflowRoleAssignmentCreateWithoutWorkflowRoleInput, WorkflowRoleAssignmentUncheckedCreateWithoutWorkflowRoleInput> | WorkflowRoleAssignmentCreateWithoutWorkflowRoleInput[] | WorkflowRoleAssignmentUncheckedCreateWithoutWorkflowRoleInput[]
    connectOrCreate?: WorkflowRoleAssignmentCreateOrConnectWithoutWorkflowRoleInput | WorkflowRoleAssignmentCreateOrConnectWithoutWorkflowRoleInput[]
    upsert?: WorkflowRoleAssignmentUpsertWithWhereUniqueWithoutWorkflowRoleInput | WorkflowRoleAssignmentUpsertWithWhereUniqueWithoutWorkflowRoleInput[]
    createMany?: WorkflowRoleAssignmentCreateManyWorkflowRoleInputEnvelope
    set?: WorkflowRoleAssignmentWhereUniqueInput | WorkflowRoleAssignmentWhereUniqueInput[]
    disconnect?: WorkflowRoleAssignmentWhereUniqueInput | WorkflowRoleAssignmentWhereUniqueInput[]
    delete?: WorkflowRoleAssignmentWhereUniqueInput | WorkflowRoleAssignmentWhereUniqueInput[]
    connect?: WorkflowRoleAssignmentWhereUniqueInput | WorkflowRoleAssignmentWhereUniqueInput[]
    update?: WorkflowRoleAssignmentUpdateWithWhereUniqueWithoutWorkflowRoleInput | WorkflowRoleAssignmentUpdateWithWhereUniqueWithoutWorkflowRoleInput[]
    updateMany?: WorkflowRoleAssignmentUpdateManyWithWhereWithoutWorkflowRoleInput | WorkflowRoleAssignmentUpdateManyWithWhereWithoutWorkflowRoleInput[]
    deleteMany?: WorkflowRoleAssignmentScalarWhereInput | WorkflowRoleAssignmentScalarWhereInput[]
  }

  export type WorkflowRoleCreateNestedOneWithoutAssignmentsInput = {
    create?: XOR<WorkflowRoleCreateWithoutAssignmentsInput, WorkflowRoleUncheckedCreateWithoutAssignmentsInput>
    connectOrCreate?: WorkflowRoleCreateOrConnectWithoutAssignmentsInput
    connect?: WorkflowRoleWhereUniqueInput
  }

  export type WorkflowRoleUpdateOneRequiredWithoutAssignmentsNestedInput = {
    create?: XOR<WorkflowRoleCreateWithoutAssignmentsInput, WorkflowRoleUncheckedCreateWithoutAssignmentsInput>
    connectOrCreate?: WorkflowRoleCreateOrConnectWithoutAssignmentsInput
    upsert?: WorkflowRoleUpsertWithoutAssignmentsInput
    connect?: WorkflowRoleWhereUniqueInput
    update?: XOR<XOR<WorkflowRoleUpdateToOneWithWhereWithoutAssignmentsInput, WorkflowRoleUpdateWithoutAssignmentsInput>, WorkflowRoleUncheckedUpdateWithoutAssignmentsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type WorkflowCreateWithoutUserInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    isPublished?: boolean
    publishedWorkflowId?: string | null
    publishedAt?: Date | string | null
    lastPublishedAt?: Date | string | null
    edges?: WorkflowEdgeCreateNestedManyWithoutWorkflowInput
    nodes?: WorkflowNodeCreateNestedManyWithoutWorkflowInput
    fields?: WorkflowFieldCreateNestedManyWithoutWorkflowInput
    roles?: WorkflowRoleCreateNestedManyWithoutWorkflowInput
  }

  export type WorkflowUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    isPublished?: boolean
    publishedWorkflowId?: string | null
    publishedAt?: Date | string | null
    lastPublishedAt?: Date | string | null
    edges?: WorkflowEdgeUncheckedCreateNestedManyWithoutWorkflowInput
    nodes?: WorkflowNodeUncheckedCreateNestedManyWithoutWorkflowInput
    fields?: WorkflowFieldUncheckedCreateNestedManyWithoutWorkflowInput
    roles?: WorkflowRoleUncheckedCreateNestedManyWithoutWorkflowInput
  }

  export type WorkflowCreateOrConnectWithoutUserInput = {
    where: WorkflowWhereUniqueInput
    create: XOR<WorkflowCreateWithoutUserInput, WorkflowUncheckedCreateWithoutUserInput>
  }

  export type WorkflowCreateManyUserInputEnvelope = {
    data: WorkflowCreateManyUserInput | WorkflowCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type WorkflowUpsertWithWhereUniqueWithoutUserInput = {
    where: WorkflowWhereUniqueInput
    update: XOR<WorkflowUpdateWithoutUserInput, WorkflowUncheckedUpdateWithoutUserInput>
    create: XOR<WorkflowCreateWithoutUserInput, WorkflowUncheckedCreateWithoutUserInput>
  }

  export type WorkflowUpdateWithWhereUniqueWithoutUserInput = {
    where: WorkflowWhereUniqueInput
    data: XOR<WorkflowUpdateWithoutUserInput, WorkflowUncheckedUpdateWithoutUserInput>
  }

  export type WorkflowUpdateManyWithWhereWithoutUserInput = {
    where: WorkflowScalarWhereInput
    data: XOR<WorkflowUpdateManyMutationInput, WorkflowUncheckedUpdateManyWithoutUserInput>
  }

  export type WorkflowScalarWhereInput = {
    AND?: WorkflowScalarWhereInput | WorkflowScalarWhereInput[]
    OR?: WorkflowScalarWhereInput[]
    NOT?: WorkflowScalarWhereInput | WorkflowScalarWhereInput[]
    id?: StringFilter<"Workflow"> | string
    userId?: StringFilter<"Workflow"> | string
    name?: StringFilter<"Workflow"> | string
    createdAt?: DateTimeFilter<"Workflow"> | Date | string
    updatedAt?: DateTimeFilter<"Workflow"> | Date | string
    isDeleted?: BoolFilter<"Workflow"> | boolean
    isPublished?: BoolFilter<"Workflow"> | boolean
    publishedWorkflowId?: StringNullableFilter<"Workflow"> | string | null
    publishedAt?: DateTimeNullableFilter<"Workflow"> | Date | string | null
    lastPublishedAt?: DateTimeNullableFilter<"Workflow"> | Date | string | null
  }

  export type UserCreateWithoutWorkflowsInput = {
    id?: string
  }

  export type UserUncheckedCreateWithoutWorkflowsInput = {
    id?: string
  }

  export type UserCreateOrConnectWithoutWorkflowsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutWorkflowsInput, UserUncheckedCreateWithoutWorkflowsInput>
  }

  export type WorkflowEdgeCreateWithoutWorkflowInput = {
    id?: string
    isDeleted?: boolean
    sourceNode: WorkflowNodeCreateNestedOneWithoutOutgoingInput
    targetNode: WorkflowNodeCreateNestedOneWithoutIncomingInput
  }

  export type WorkflowEdgeUncheckedCreateWithoutWorkflowInput = {
    id?: string
    sourceNodeId: string
    targetNodeId: string
    isDeleted?: boolean
  }

  export type WorkflowEdgeCreateOrConnectWithoutWorkflowInput = {
    where: WorkflowEdgeWhereUniqueInput
    create: XOR<WorkflowEdgeCreateWithoutWorkflowInput, WorkflowEdgeUncheckedCreateWithoutWorkflowInput>
  }

  export type WorkflowEdgeCreateManyWorkflowInputEnvelope = {
    data: WorkflowEdgeCreateManyWorkflowInput | WorkflowEdgeCreateManyWorkflowInput[]
    skipDuplicates?: boolean
  }

  export type WorkflowNodeCreateWithoutWorkflowInput = {
    id?: string
    config: JsonNullValueInput | InputJsonValue
    positionX: number
    positionY: number
    isDeleted?: boolean
    outgoing?: WorkflowEdgeCreateNestedManyWithoutSourceNodeInput
    incoming?: WorkflowEdgeCreateNestedManyWithoutTargetNodeInput
    fields?: WorkflowFieldCreateNestedManyWithoutSourceNodeInput
    action: ActionCreateNestedOneWithoutWorkflowNodesInput
  }

  export type WorkflowNodeUncheckedCreateWithoutWorkflowInput = {
    id?: string
    config: JsonNullValueInput | InputJsonValue
    positionX: number
    positionY: number
    actionId: string
    isDeleted?: boolean
    outgoing?: WorkflowEdgeUncheckedCreateNestedManyWithoutSourceNodeInput
    incoming?: WorkflowEdgeUncheckedCreateNestedManyWithoutTargetNodeInput
    fields?: WorkflowFieldUncheckedCreateNestedManyWithoutSourceNodeInput
  }

  export type WorkflowNodeCreateOrConnectWithoutWorkflowInput = {
    where: WorkflowNodeWhereUniqueInput
    create: XOR<WorkflowNodeCreateWithoutWorkflowInput, WorkflowNodeUncheckedCreateWithoutWorkflowInput>
  }

  export type WorkflowNodeCreateManyWorkflowInputEnvelope = {
    data: WorkflowNodeCreateManyWorkflowInput | WorkflowNodeCreateManyWorkflowInput[]
    skipDuplicates?: boolean
  }

  export type WorkflowFieldCreateWithoutWorkflowInput = {
    id?: string
    fieldName: string
    fieldPath: string
    fieldType?: string | null
    createdAt?: Date | string
    sourceNode: WorkflowNodeCreateNestedOneWithoutFieldsInput
  }

  export type WorkflowFieldUncheckedCreateWithoutWorkflowInput = {
    id?: string
    sourceNodeId: string
    fieldName: string
    fieldPath: string
    fieldType?: string | null
    createdAt?: Date | string
  }

  export type WorkflowFieldCreateOrConnectWithoutWorkflowInput = {
    where: WorkflowFieldWhereUniqueInput
    create: XOR<WorkflowFieldCreateWithoutWorkflowInput, WorkflowFieldUncheckedCreateWithoutWorkflowInput>
  }

  export type WorkflowFieldCreateManyWorkflowInputEnvelope = {
    data: WorkflowFieldCreateManyWorkflowInput | WorkflowFieldCreateManyWorkflowInput[]
    skipDuplicates?: boolean
  }

  export type WorkflowRoleCreateWithoutWorkflowInput = {
    id?: string
    name: string
    description?: string | null
    permissions?: WorkflowRoleCreatepermissionsInput | $Enums.Permission[]
    isSystem?: boolean
    createdAt?: Date | string
    assignments?: WorkflowRoleAssignmentCreateNestedManyWithoutWorkflowRoleInput
  }

  export type WorkflowRoleUncheckedCreateWithoutWorkflowInput = {
    id?: string
    name: string
    description?: string | null
    permissions?: WorkflowRoleCreatepermissionsInput | $Enums.Permission[]
    isSystem?: boolean
    createdAt?: Date | string
    assignments?: WorkflowRoleAssignmentUncheckedCreateNestedManyWithoutWorkflowRoleInput
  }

  export type WorkflowRoleCreateOrConnectWithoutWorkflowInput = {
    where: WorkflowRoleWhereUniqueInput
    create: XOR<WorkflowRoleCreateWithoutWorkflowInput, WorkflowRoleUncheckedCreateWithoutWorkflowInput>
  }

  export type WorkflowRoleCreateManyWorkflowInputEnvelope = {
    data: WorkflowRoleCreateManyWorkflowInput | WorkflowRoleCreateManyWorkflowInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutWorkflowsInput = {
    update: XOR<UserUpdateWithoutWorkflowsInput, UserUncheckedUpdateWithoutWorkflowsInput>
    create: XOR<UserCreateWithoutWorkflowsInput, UserUncheckedCreateWithoutWorkflowsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutWorkflowsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutWorkflowsInput, UserUncheckedUpdateWithoutWorkflowsInput>
  }

  export type UserUpdateWithoutWorkflowsInput = {
    id?: StringFieldUpdateOperationsInput | string
  }

  export type UserUncheckedUpdateWithoutWorkflowsInput = {
    id?: StringFieldUpdateOperationsInput | string
  }

  export type WorkflowEdgeUpsertWithWhereUniqueWithoutWorkflowInput = {
    where: WorkflowEdgeWhereUniqueInput
    update: XOR<WorkflowEdgeUpdateWithoutWorkflowInput, WorkflowEdgeUncheckedUpdateWithoutWorkflowInput>
    create: XOR<WorkflowEdgeCreateWithoutWorkflowInput, WorkflowEdgeUncheckedCreateWithoutWorkflowInput>
  }

  export type WorkflowEdgeUpdateWithWhereUniqueWithoutWorkflowInput = {
    where: WorkflowEdgeWhereUniqueInput
    data: XOR<WorkflowEdgeUpdateWithoutWorkflowInput, WorkflowEdgeUncheckedUpdateWithoutWorkflowInput>
  }

  export type WorkflowEdgeUpdateManyWithWhereWithoutWorkflowInput = {
    where: WorkflowEdgeScalarWhereInput
    data: XOR<WorkflowEdgeUpdateManyMutationInput, WorkflowEdgeUncheckedUpdateManyWithoutWorkflowInput>
  }

  export type WorkflowEdgeScalarWhereInput = {
    AND?: WorkflowEdgeScalarWhereInput | WorkflowEdgeScalarWhereInput[]
    OR?: WorkflowEdgeScalarWhereInput[]
    NOT?: WorkflowEdgeScalarWhereInput | WorkflowEdgeScalarWhereInput[]
    id?: StringFilter<"WorkflowEdge"> | string
    workflowId?: StringFilter<"WorkflowEdge"> | string
    sourceNodeId?: StringFilter<"WorkflowEdge"> | string
    targetNodeId?: StringFilter<"WorkflowEdge"> | string
    isDeleted?: BoolFilter<"WorkflowEdge"> | boolean
  }

  export type WorkflowNodeUpsertWithWhereUniqueWithoutWorkflowInput = {
    where: WorkflowNodeWhereUniqueInput
    update: XOR<WorkflowNodeUpdateWithoutWorkflowInput, WorkflowNodeUncheckedUpdateWithoutWorkflowInput>
    create: XOR<WorkflowNodeCreateWithoutWorkflowInput, WorkflowNodeUncheckedCreateWithoutWorkflowInput>
  }

  export type WorkflowNodeUpdateWithWhereUniqueWithoutWorkflowInput = {
    where: WorkflowNodeWhereUniqueInput
    data: XOR<WorkflowNodeUpdateWithoutWorkflowInput, WorkflowNodeUncheckedUpdateWithoutWorkflowInput>
  }

  export type WorkflowNodeUpdateManyWithWhereWithoutWorkflowInput = {
    where: WorkflowNodeScalarWhereInput
    data: XOR<WorkflowNodeUpdateManyMutationInput, WorkflowNodeUncheckedUpdateManyWithoutWorkflowInput>
  }

  export type WorkflowNodeScalarWhereInput = {
    AND?: WorkflowNodeScalarWhereInput | WorkflowNodeScalarWhereInput[]
    OR?: WorkflowNodeScalarWhereInput[]
    NOT?: WorkflowNodeScalarWhereInput | WorkflowNodeScalarWhereInput[]
    id?: StringFilter<"WorkflowNode"> | string
    workflowId?: StringFilter<"WorkflowNode"> | string
    config?: JsonFilter<"WorkflowNode">
    positionX?: FloatFilter<"WorkflowNode"> | number
    positionY?: FloatFilter<"WorkflowNode"> | number
    actionId?: StringFilter<"WorkflowNode"> | string
    isDeleted?: BoolFilter<"WorkflowNode"> | boolean
  }

  export type WorkflowFieldUpsertWithWhereUniqueWithoutWorkflowInput = {
    where: WorkflowFieldWhereUniqueInput
    update: XOR<WorkflowFieldUpdateWithoutWorkflowInput, WorkflowFieldUncheckedUpdateWithoutWorkflowInput>
    create: XOR<WorkflowFieldCreateWithoutWorkflowInput, WorkflowFieldUncheckedCreateWithoutWorkflowInput>
  }

  export type WorkflowFieldUpdateWithWhereUniqueWithoutWorkflowInput = {
    where: WorkflowFieldWhereUniqueInput
    data: XOR<WorkflowFieldUpdateWithoutWorkflowInput, WorkflowFieldUncheckedUpdateWithoutWorkflowInput>
  }

  export type WorkflowFieldUpdateManyWithWhereWithoutWorkflowInput = {
    where: WorkflowFieldScalarWhereInput
    data: XOR<WorkflowFieldUpdateManyMutationInput, WorkflowFieldUncheckedUpdateManyWithoutWorkflowInput>
  }

  export type WorkflowFieldScalarWhereInput = {
    AND?: WorkflowFieldScalarWhereInput | WorkflowFieldScalarWhereInput[]
    OR?: WorkflowFieldScalarWhereInput[]
    NOT?: WorkflowFieldScalarWhereInput | WorkflowFieldScalarWhereInput[]
    id?: StringFilter<"WorkflowField"> | string
    workflowId?: StringFilter<"WorkflowField"> | string
    sourceNodeId?: StringFilter<"WorkflowField"> | string
    fieldName?: StringFilter<"WorkflowField"> | string
    fieldPath?: StringFilter<"WorkflowField"> | string
    fieldType?: StringNullableFilter<"WorkflowField"> | string | null
    createdAt?: DateTimeFilter<"WorkflowField"> | Date | string
  }

  export type WorkflowRoleUpsertWithWhereUniqueWithoutWorkflowInput = {
    where: WorkflowRoleWhereUniqueInput
    update: XOR<WorkflowRoleUpdateWithoutWorkflowInput, WorkflowRoleUncheckedUpdateWithoutWorkflowInput>
    create: XOR<WorkflowRoleCreateWithoutWorkflowInput, WorkflowRoleUncheckedCreateWithoutWorkflowInput>
  }

  export type WorkflowRoleUpdateWithWhereUniqueWithoutWorkflowInput = {
    where: WorkflowRoleWhereUniqueInput
    data: XOR<WorkflowRoleUpdateWithoutWorkflowInput, WorkflowRoleUncheckedUpdateWithoutWorkflowInput>
  }

  export type WorkflowRoleUpdateManyWithWhereWithoutWorkflowInput = {
    where: WorkflowRoleScalarWhereInput
    data: XOR<WorkflowRoleUpdateManyMutationInput, WorkflowRoleUncheckedUpdateManyWithoutWorkflowInput>
  }

  export type WorkflowRoleScalarWhereInput = {
    AND?: WorkflowRoleScalarWhereInput | WorkflowRoleScalarWhereInput[]
    OR?: WorkflowRoleScalarWhereInput[]
    NOT?: WorkflowRoleScalarWhereInput | WorkflowRoleScalarWhereInput[]
    id?: StringFilter<"WorkflowRole"> | string
    workflowId?: StringFilter<"WorkflowRole"> | string
    name?: StringFilter<"WorkflowRole"> | string
    description?: StringNullableFilter<"WorkflowRole"> | string | null
    permissions?: EnumPermissionNullableListFilter<"WorkflowRole">
    isSystem?: BoolFilter<"WorkflowRole"> | boolean
    createdAt?: DateTimeFilter<"WorkflowRole"> | Date | string
  }

  export type WorkflowEdgeCreateWithoutSourceNodeInput = {
    id?: string
    isDeleted?: boolean
    targetNode: WorkflowNodeCreateNestedOneWithoutIncomingInput
    workflow: WorkflowCreateNestedOneWithoutEdgesInput
  }

  export type WorkflowEdgeUncheckedCreateWithoutSourceNodeInput = {
    id?: string
    workflowId: string
    targetNodeId: string
    isDeleted?: boolean
  }

  export type WorkflowEdgeCreateOrConnectWithoutSourceNodeInput = {
    where: WorkflowEdgeWhereUniqueInput
    create: XOR<WorkflowEdgeCreateWithoutSourceNodeInput, WorkflowEdgeUncheckedCreateWithoutSourceNodeInput>
  }

  export type WorkflowEdgeCreateManySourceNodeInputEnvelope = {
    data: WorkflowEdgeCreateManySourceNodeInput | WorkflowEdgeCreateManySourceNodeInput[]
    skipDuplicates?: boolean
  }

  export type WorkflowEdgeCreateWithoutTargetNodeInput = {
    id?: string
    isDeleted?: boolean
    sourceNode: WorkflowNodeCreateNestedOneWithoutOutgoingInput
    workflow: WorkflowCreateNestedOneWithoutEdgesInput
  }

  export type WorkflowEdgeUncheckedCreateWithoutTargetNodeInput = {
    id?: string
    workflowId: string
    sourceNodeId: string
    isDeleted?: boolean
  }

  export type WorkflowEdgeCreateOrConnectWithoutTargetNodeInput = {
    where: WorkflowEdgeWhereUniqueInput
    create: XOR<WorkflowEdgeCreateWithoutTargetNodeInput, WorkflowEdgeUncheckedCreateWithoutTargetNodeInput>
  }

  export type WorkflowEdgeCreateManyTargetNodeInputEnvelope = {
    data: WorkflowEdgeCreateManyTargetNodeInput | WorkflowEdgeCreateManyTargetNodeInput[]
    skipDuplicates?: boolean
  }

  export type WorkflowFieldCreateWithoutSourceNodeInput = {
    id?: string
    fieldName: string
    fieldPath: string
    fieldType?: string | null
    createdAt?: Date | string
    workflow: WorkflowCreateNestedOneWithoutFieldsInput
  }

  export type WorkflowFieldUncheckedCreateWithoutSourceNodeInput = {
    id?: string
    workflowId: string
    fieldName: string
    fieldPath: string
    fieldType?: string | null
    createdAt?: Date | string
  }

  export type WorkflowFieldCreateOrConnectWithoutSourceNodeInput = {
    where: WorkflowFieldWhereUniqueInput
    create: XOR<WorkflowFieldCreateWithoutSourceNodeInput, WorkflowFieldUncheckedCreateWithoutSourceNodeInput>
  }

  export type WorkflowFieldCreateManySourceNodeInputEnvelope = {
    data: WorkflowFieldCreateManySourceNodeInput | WorkflowFieldCreateManySourceNodeInput[]
    skipDuplicates?: boolean
  }

  export type ActionCreateWithoutWorkflowNodesInput = {
    id?: string
    name: string
    description?: string | null
    configSchema: JsonNullValueInput | InputJsonValue
    configMeta?: NullableJsonNullValueInput | InputJsonValue
    inputType?: string | null
    outputType: string
    icon: string
    serviceUrl?: string | null
    category: ActionCategoryCreateNestedOneWithoutActionsInput
  }

  export type ActionUncheckedCreateWithoutWorkflowNodesInput = {
    id?: string
    name: string
    description?: string | null
    categoryId: string
    configSchema: JsonNullValueInput | InputJsonValue
    configMeta?: NullableJsonNullValueInput | InputJsonValue
    inputType?: string | null
    outputType: string
    icon: string
    serviceUrl?: string | null
  }

  export type ActionCreateOrConnectWithoutWorkflowNodesInput = {
    where: ActionWhereUniqueInput
    create: XOR<ActionCreateWithoutWorkflowNodesInput, ActionUncheckedCreateWithoutWorkflowNodesInput>
  }

  export type WorkflowCreateWithoutNodesInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    isPublished?: boolean
    publishedWorkflowId?: string | null
    publishedAt?: Date | string | null
    lastPublishedAt?: Date | string | null
    user: UserCreateNestedOneWithoutWorkflowsInput
    edges?: WorkflowEdgeCreateNestedManyWithoutWorkflowInput
    fields?: WorkflowFieldCreateNestedManyWithoutWorkflowInput
    roles?: WorkflowRoleCreateNestedManyWithoutWorkflowInput
  }

  export type WorkflowUncheckedCreateWithoutNodesInput = {
    id?: string
    userId: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    isPublished?: boolean
    publishedWorkflowId?: string | null
    publishedAt?: Date | string | null
    lastPublishedAt?: Date | string | null
    edges?: WorkflowEdgeUncheckedCreateNestedManyWithoutWorkflowInput
    fields?: WorkflowFieldUncheckedCreateNestedManyWithoutWorkflowInput
    roles?: WorkflowRoleUncheckedCreateNestedManyWithoutWorkflowInput
  }

  export type WorkflowCreateOrConnectWithoutNodesInput = {
    where: WorkflowWhereUniqueInput
    create: XOR<WorkflowCreateWithoutNodesInput, WorkflowUncheckedCreateWithoutNodesInput>
  }

  export type WorkflowEdgeUpsertWithWhereUniqueWithoutSourceNodeInput = {
    where: WorkflowEdgeWhereUniqueInput
    update: XOR<WorkflowEdgeUpdateWithoutSourceNodeInput, WorkflowEdgeUncheckedUpdateWithoutSourceNodeInput>
    create: XOR<WorkflowEdgeCreateWithoutSourceNodeInput, WorkflowEdgeUncheckedCreateWithoutSourceNodeInput>
  }

  export type WorkflowEdgeUpdateWithWhereUniqueWithoutSourceNodeInput = {
    where: WorkflowEdgeWhereUniqueInput
    data: XOR<WorkflowEdgeUpdateWithoutSourceNodeInput, WorkflowEdgeUncheckedUpdateWithoutSourceNodeInput>
  }

  export type WorkflowEdgeUpdateManyWithWhereWithoutSourceNodeInput = {
    where: WorkflowEdgeScalarWhereInput
    data: XOR<WorkflowEdgeUpdateManyMutationInput, WorkflowEdgeUncheckedUpdateManyWithoutSourceNodeInput>
  }

  export type WorkflowEdgeUpsertWithWhereUniqueWithoutTargetNodeInput = {
    where: WorkflowEdgeWhereUniqueInput
    update: XOR<WorkflowEdgeUpdateWithoutTargetNodeInput, WorkflowEdgeUncheckedUpdateWithoutTargetNodeInput>
    create: XOR<WorkflowEdgeCreateWithoutTargetNodeInput, WorkflowEdgeUncheckedCreateWithoutTargetNodeInput>
  }

  export type WorkflowEdgeUpdateWithWhereUniqueWithoutTargetNodeInput = {
    where: WorkflowEdgeWhereUniqueInput
    data: XOR<WorkflowEdgeUpdateWithoutTargetNodeInput, WorkflowEdgeUncheckedUpdateWithoutTargetNodeInput>
  }

  export type WorkflowEdgeUpdateManyWithWhereWithoutTargetNodeInput = {
    where: WorkflowEdgeScalarWhereInput
    data: XOR<WorkflowEdgeUpdateManyMutationInput, WorkflowEdgeUncheckedUpdateManyWithoutTargetNodeInput>
  }

  export type WorkflowFieldUpsertWithWhereUniqueWithoutSourceNodeInput = {
    where: WorkflowFieldWhereUniqueInput
    update: XOR<WorkflowFieldUpdateWithoutSourceNodeInput, WorkflowFieldUncheckedUpdateWithoutSourceNodeInput>
    create: XOR<WorkflowFieldCreateWithoutSourceNodeInput, WorkflowFieldUncheckedCreateWithoutSourceNodeInput>
  }

  export type WorkflowFieldUpdateWithWhereUniqueWithoutSourceNodeInput = {
    where: WorkflowFieldWhereUniqueInput
    data: XOR<WorkflowFieldUpdateWithoutSourceNodeInput, WorkflowFieldUncheckedUpdateWithoutSourceNodeInput>
  }

  export type WorkflowFieldUpdateManyWithWhereWithoutSourceNodeInput = {
    where: WorkflowFieldScalarWhereInput
    data: XOR<WorkflowFieldUpdateManyMutationInput, WorkflowFieldUncheckedUpdateManyWithoutSourceNodeInput>
  }

  export type ActionUpsertWithoutWorkflowNodesInput = {
    update: XOR<ActionUpdateWithoutWorkflowNodesInput, ActionUncheckedUpdateWithoutWorkflowNodesInput>
    create: XOR<ActionCreateWithoutWorkflowNodesInput, ActionUncheckedCreateWithoutWorkflowNodesInput>
    where?: ActionWhereInput
  }

  export type ActionUpdateToOneWithWhereWithoutWorkflowNodesInput = {
    where?: ActionWhereInput
    data: XOR<ActionUpdateWithoutWorkflowNodesInput, ActionUncheckedUpdateWithoutWorkflowNodesInput>
  }

  export type ActionUpdateWithoutWorkflowNodesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    configSchema?: JsonNullValueInput | InputJsonValue
    configMeta?: NullableJsonNullValueInput | InputJsonValue
    inputType?: NullableStringFieldUpdateOperationsInput | string | null
    outputType?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    serviceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: ActionCategoryUpdateOneRequiredWithoutActionsNestedInput
  }

  export type ActionUncheckedUpdateWithoutWorkflowNodesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: StringFieldUpdateOperationsInput | string
    configSchema?: JsonNullValueInput | InputJsonValue
    configMeta?: NullableJsonNullValueInput | InputJsonValue
    inputType?: NullableStringFieldUpdateOperationsInput | string | null
    outputType?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    serviceUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type WorkflowUpsertWithoutNodesInput = {
    update: XOR<WorkflowUpdateWithoutNodesInput, WorkflowUncheckedUpdateWithoutNodesInput>
    create: XOR<WorkflowCreateWithoutNodesInput, WorkflowUncheckedCreateWithoutNodesInput>
    where?: WorkflowWhereInput
  }

  export type WorkflowUpdateToOneWithWhereWithoutNodesInput = {
    where?: WorkflowWhereInput
    data: XOR<WorkflowUpdateWithoutNodesInput, WorkflowUncheckedUpdateWithoutNodesInput>
  }

  export type WorkflowUpdateWithoutNodesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    publishedWorkflowId?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPublishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutWorkflowsNestedInput
    edges?: WorkflowEdgeUpdateManyWithoutWorkflowNestedInput
    fields?: WorkflowFieldUpdateManyWithoutWorkflowNestedInput
    roles?: WorkflowRoleUpdateManyWithoutWorkflowNestedInput
  }

  export type WorkflowUncheckedUpdateWithoutNodesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    publishedWorkflowId?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPublishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    edges?: WorkflowEdgeUncheckedUpdateManyWithoutWorkflowNestedInput
    fields?: WorkflowFieldUncheckedUpdateManyWithoutWorkflowNestedInput
    roles?: WorkflowRoleUncheckedUpdateManyWithoutWorkflowNestedInput
  }

  export type WorkflowNodeCreateWithoutOutgoingInput = {
    id?: string
    config: JsonNullValueInput | InputJsonValue
    positionX: number
    positionY: number
    isDeleted?: boolean
    incoming?: WorkflowEdgeCreateNestedManyWithoutTargetNodeInput
    fields?: WorkflowFieldCreateNestedManyWithoutSourceNodeInput
    action: ActionCreateNestedOneWithoutWorkflowNodesInput
    workflow: WorkflowCreateNestedOneWithoutNodesInput
  }

  export type WorkflowNodeUncheckedCreateWithoutOutgoingInput = {
    id?: string
    workflowId: string
    config: JsonNullValueInput | InputJsonValue
    positionX: number
    positionY: number
    actionId: string
    isDeleted?: boolean
    incoming?: WorkflowEdgeUncheckedCreateNestedManyWithoutTargetNodeInput
    fields?: WorkflowFieldUncheckedCreateNestedManyWithoutSourceNodeInput
  }

  export type WorkflowNodeCreateOrConnectWithoutOutgoingInput = {
    where: WorkflowNodeWhereUniqueInput
    create: XOR<WorkflowNodeCreateWithoutOutgoingInput, WorkflowNodeUncheckedCreateWithoutOutgoingInput>
  }

  export type WorkflowNodeCreateWithoutIncomingInput = {
    id?: string
    config: JsonNullValueInput | InputJsonValue
    positionX: number
    positionY: number
    isDeleted?: boolean
    outgoing?: WorkflowEdgeCreateNestedManyWithoutSourceNodeInput
    fields?: WorkflowFieldCreateNestedManyWithoutSourceNodeInput
    action: ActionCreateNestedOneWithoutWorkflowNodesInput
    workflow: WorkflowCreateNestedOneWithoutNodesInput
  }

  export type WorkflowNodeUncheckedCreateWithoutIncomingInput = {
    id?: string
    workflowId: string
    config: JsonNullValueInput | InputJsonValue
    positionX: number
    positionY: number
    actionId: string
    isDeleted?: boolean
    outgoing?: WorkflowEdgeUncheckedCreateNestedManyWithoutSourceNodeInput
    fields?: WorkflowFieldUncheckedCreateNestedManyWithoutSourceNodeInput
  }

  export type WorkflowNodeCreateOrConnectWithoutIncomingInput = {
    where: WorkflowNodeWhereUniqueInput
    create: XOR<WorkflowNodeCreateWithoutIncomingInput, WorkflowNodeUncheckedCreateWithoutIncomingInput>
  }

  export type WorkflowCreateWithoutEdgesInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    isPublished?: boolean
    publishedWorkflowId?: string | null
    publishedAt?: Date | string | null
    lastPublishedAt?: Date | string | null
    user: UserCreateNestedOneWithoutWorkflowsInput
    nodes?: WorkflowNodeCreateNestedManyWithoutWorkflowInput
    fields?: WorkflowFieldCreateNestedManyWithoutWorkflowInput
    roles?: WorkflowRoleCreateNestedManyWithoutWorkflowInput
  }

  export type WorkflowUncheckedCreateWithoutEdgesInput = {
    id?: string
    userId: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    isPublished?: boolean
    publishedWorkflowId?: string | null
    publishedAt?: Date | string | null
    lastPublishedAt?: Date | string | null
    nodes?: WorkflowNodeUncheckedCreateNestedManyWithoutWorkflowInput
    fields?: WorkflowFieldUncheckedCreateNestedManyWithoutWorkflowInput
    roles?: WorkflowRoleUncheckedCreateNestedManyWithoutWorkflowInput
  }

  export type WorkflowCreateOrConnectWithoutEdgesInput = {
    where: WorkflowWhereUniqueInput
    create: XOR<WorkflowCreateWithoutEdgesInput, WorkflowUncheckedCreateWithoutEdgesInput>
  }

  export type WorkflowNodeUpsertWithoutOutgoingInput = {
    update: XOR<WorkflowNodeUpdateWithoutOutgoingInput, WorkflowNodeUncheckedUpdateWithoutOutgoingInput>
    create: XOR<WorkflowNodeCreateWithoutOutgoingInput, WorkflowNodeUncheckedCreateWithoutOutgoingInput>
    where?: WorkflowNodeWhereInput
  }

  export type WorkflowNodeUpdateToOneWithWhereWithoutOutgoingInput = {
    where?: WorkflowNodeWhereInput
    data: XOR<WorkflowNodeUpdateWithoutOutgoingInput, WorkflowNodeUncheckedUpdateWithoutOutgoingInput>
  }

  export type WorkflowNodeUpdateWithoutOutgoingInput = {
    id?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    positionX?: FloatFieldUpdateOperationsInput | number
    positionY?: FloatFieldUpdateOperationsInput | number
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    incoming?: WorkflowEdgeUpdateManyWithoutTargetNodeNestedInput
    fields?: WorkflowFieldUpdateManyWithoutSourceNodeNestedInput
    action?: ActionUpdateOneRequiredWithoutWorkflowNodesNestedInput
    workflow?: WorkflowUpdateOneRequiredWithoutNodesNestedInput
  }

  export type WorkflowNodeUncheckedUpdateWithoutOutgoingInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    positionX?: FloatFieldUpdateOperationsInput | number
    positionY?: FloatFieldUpdateOperationsInput | number
    actionId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    incoming?: WorkflowEdgeUncheckedUpdateManyWithoutTargetNodeNestedInput
    fields?: WorkflowFieldUncheckedUpdateManyWithoutSourceNodeNestedInput
  }

  export type WorkflowNodeUpsertWithoutIncomingInput = {
    update: XOR<WorkflowNodeUpdateWithoutIncomingInput, WorkflowNodeUncheckedUpdateWithoutIncomingInput>
    create: XOR<WorkflowNodeCreateWithoutIncomingInput, WorkflowNodeUncheckedCreateWithoutIncomingInput>
    where?: WorkflowNodeWhereInput
  }

  export type WorkflowNodeUpdateToOneWithWhereWithoutIncomingInput = {
    where?: WorkflowNodeWhereInput
    data: XOR<WorkflowNodeUpdateWithoutIncomingInput, WorkflowNodeUncheckedUpdateWithoutIncomingInput>
  }

  export type WorkflowNodeUpdateWithoutIncomingInput = {
    id?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    positionX?: FloatFieldUpdateOperationsInput | number
    positionY?: FloatFieldUpdateOperationsInput | number
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    outgoing?: WorkflowEdgeUpdateManyWithoutSourceNodeNestedInput
    fields?: WorkflowFieldUpdateManyWithoutSourceNodeNestedInput
    action?: ActionUpdateOneRequiredWithoutWorkflowNodesNestedInput
    workflow?: WorkflowUpdateOneRequiredWithoutNodesNestedInput
  }

  export type WorkflowNodeUncheckedUpdateWithoutIncomingInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    positionX?: FloatFieldUpdateOperationsInput | number
    positionY?: FloatFieldUpdateOperationsInput | number
    actionId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    outgoing?: WorkflowEdgeUncheckedUpdateManyWithoutSourceNodeNestedInput
    fields?: WorkflowFieldUncheckedUpdateManyWithoutSourceNodeNestedInput
  }

  export type WorkflowUpsertWithoutEdgesInput = {
    update: XOR<WorkflowUpdateWithoutEdgesInput, WorkflowUncheckedUpdateWithoutEdgesInput>
    create: XOR<WorkflowCreateWithoutEdgesInput, WorkflowUncheckedCreateWithoutEdgesInput>
    where?: WorkflowWhereInput
  }

  export type WorkflowUpdateToOneWithWhereWithoutEdgesInput = {
    where?: WorkflowWhereInput
    data: XOR<WorkflowUpdateWithoutEdgesInput, WorkflowUncheckedUpdateWithoutEdgesInput>
  }

  export type WorkflowUpdateWithoutEdgesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    publishedWorkflowId?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPublishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutWorkflowsNestedInput
    nodes?: WorkflowNodeUpdateManyWithoutWorkflowNestedInput
    fields?: WorkflowFieldUpdateManyWithoutWorkflowNestedInput
    roles?: WorkflowRoleUpdateManyWithoutWorkflowNestedInput
  }

  export type WorkflowUncheckedUpdateWithoutEdgesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    publishedWorkflowId?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPublishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nodes?: WorkflowNodeUncheckedUpdateManyWithoutWorkflowNestedInput
    fields?: WorkflowFieldUncheckedUpdateManyWithoutWorkflowNestedInput
    roles?: WorkflowRoleUncheckedUpdateManyWithoutWorkflowNestedInput
  }

  export type ActionCreateWithoutCategoryInput = {
    id?: string
    name: string
    description?: string | null
    configSchema: JsonNullValueInput | InputJsonValue
    configMeta?: NullableJsonNullValueInput | InputJsonValue
    inputType?: string | null
    outputType: string
    icon: string
    serviceUrl?: string | null
    workflowNodes?: WorkflowNodeCreateNestedManyWithoutActionInput
  }

  export type ActionUncheckedCreateWithoutCategoryInput = {
    id?: string
    name: string
    description?: string | null
    configSchema: JsonNullValueInput | InputJsonValue
    configMeta?: NullableJsonNullValueInput | InputJsonValue
    inputType?: string | null
    outputType: string
    icon: string
    serviceUrl?: string | null
    workflowNodes?: WorkflowNodeUncheckedCreateNestedManyWithoutActionInput
  }

  export type ActionCreateOrConnectWithoutCategoryInput = {
    where: ActionWhereUniqueInput
    create: XOR<ActionCreateWithoutCategoryInput, ActionUncheckedCreateWithoutCategoryInput>
  }

  export type ActionCreateManyCategoryInputEnvelope = {
    data: ActionCreateManyCategoryInput | ActionCreateManyCategoryInput[]
    skipDuplicates?: boolean
  }

  export type ActionUpsertWithWhereUniqueWithoutCategoryInput = {
    where: ActionWhereUniqueInput
    update: XOR<ActionUpdateWithoutCategoryInput, ActionUncheckedUpdateWithoutCategoryInput>
    create: XOR<ActionCreateWithoutCategoryInput, ActionUncheckedCreateWithoutCategoryInput>
  }

  export type ActionUpdateWithWhereUniqueWithoutCategoryInput = {
    where: ActionWhereUniqueInput
    data: XOR<ActionUpdateWithoutCategoryInput, ActionUncheckedUpdateWithoutCategoryInput>
  }

  export type ActionUpdateManyWithWhereWithoutCategoryInput = {
    where: ActionScalarWhereInput
    data: XOR<ActionUpdateManyMutationInput, ActionUncheckedUpdateManyWithoutCategoryInput>
  }

  export type ActionScalarWhereInput = {
    AND?: ActionScalarWhereInput | ActionScalarWhereInput[]
    OR?: ActionScalarWhereInput[]
    NOT?: ActionScalarWhereInput | ActionScalarWhereInput[]
    id?: StringFilter<"Action"> | string
    name?: StringFilter<"Action"> | string
    description?: StringNullableFilter<"Action"> | string | null
    categoryId?: StringFilter<"Action"> | string
    configSchema?: JsonFilter<"Action">
    configMeta?: JsonNullableFilter<"Action">
    inputType?: StringNullableFilter<"Action"> | string | null
    outputType?: StringFilter<"Action"> | string
    icon?: StringFilter<"Action"> | string
    serviceUrl?: StringNullableFilter<"Action"> | string | null
  }

  export type ActionCategoryCreateWithoutActionsInput = {
    id?: string
    name: string
    description?: string | null
  }

  export type ActionCategoryUncheckedCreateWithoutActionsInput = {
    id?: string
    name: string
    description?: string | null
  }

  export type ActionCategoryCreateOrConnectWithoutActionsInput = {
    where: ActionCategoryWhereUniqueInput
    create: XOR<ActionCategoryCreateWithoutActionsInput, ActionCategoryUncheckedCreateWithoutActionsInput>
  }

  export type WorkflowNodeCreateWithoutActionInput = {
    id?: string
    config: JsonNullValueInput | InputJsonValue
    positionX: number
    positionY: number
    isDeleted?: boolean
    outgoing?: WorkflowEdgeCreateNestedManyWithoutSourceNodeInput
    incoming?: WorkflowEdgeCreateNestedManyWithoutTargetNodeInput
    fields?: WorkflowFieldCreateNestedManyWithoutSourceNodeInput
    workflow: WorkflowCreateNestedOneWithoutNodesInput
  }

  export type WorkflowNodeUncheckedCreateWithoutActionInput = {
    id?: string
    workflowId: string
    config: JsonNullValueInput | InputJsonValue
    positionX: number
    positionY: number
    isDeleted?: boolean
    outgoing?: WorkflowEdgeUncheckedCreateNestedManyWithoutSourceNodeInput
    incoming?: WorkflowEdgeUncheckedCreateNestedManyWithoutTargetNodeInput
    fields?: WorkflowFieldUncheckedCreateNestedManyWithoutSourceNodeInput
  }

  export type WorkflowNodeCreateOrConnectWithoutActionInput = {
    where: WorkflowNodeWhereUniqueInput
    create: XOR<WorkflowNodeCreateWithoutActionInput, WorkflowNodeUncheckedCreateWithoutActionInput>
  }

  export type WorkflowNodeCreateManyActionInputEnvelope = {
    data: WorkflowNodeCreateManyActionInput | WorkflowNodeCreateManyActionInput[]
    skipDuplicates?: boolean
  }

  export type ActionCategoryUpsertWithoutActionsInput = {
    update: XOR<ActionCategoryUpdateWithoutActionsInput, ActionCategoryUncheckedUpdateWithoutActionsInput>
    create: XOR<ActionCategoryCreateWithoutActionsInput, ActionCategoryUncheckedCreateWithoutActionsInput>
    where?: ActionCategoryWhereInput
  }

  export type ActionCategoryUpdateToOneWithWhereWithoutActionsInput = {
    where?: ActionCategoryWhereInput
    data: XOR<ActionCategoryUpdateWithoutActionsInput, ActionCategoryUncheckedUpdateWithoutActionsInput>
  }

  export type ActionCategoryUpdateWithoutActionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ActionCategoryUncheckedUpdateWithoutActionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type WorkflowNodeUpsertWithWhereUniqueWithoutActionInput = {
    where: WorkflowNodeWhereUniqueInput
    update: XOR<WorkflowNodeUpdateWithoutActionInput, WorkflowNodeUncheckedUpdateWithoutActionInput>
    create: XOR<WorkflowNodeCreateWithoutActionInput, WorkflowNodeUncheckedCreateWithoutActionInput>
  }

  export type WorkflowNodeUpdateWithWhereUniqueWithoutActionInput = {
    where: WorkflowNodeWhereUniqueInput
    data: XOR<WorkflowNodeUpdateWithoutActionInput, WorkflowNodeUncheckedUpdateWithoutActionInput>
  }

  export type WorkflowNodeUpdateManyWithWhereWithoutActionInput = {
    where: WorkflowNodeScalarWhereInput
    data: XOR<WorkflowNodeUpdateManyMutationInput, WorkflowNodeUncheckedUpdateManyWithoutActionInput>
  }

  export type WorkflowNodeCreateWithoutFieldsInput = {
    id?: string
    config: JsonNullValueInput | InputJsonValue
    positionX: number
    positionY: number
    isDeleted?: boolean
    outgoing?: WorkflowEdgeCreateNestedManyWithoutSourceNodeInput
    incoming?: WorkflowEdgeCreateNestedManyWithoutTargetNodeInput
    action: ActionCreateNestedOneWithoutWorkflowNodesInput
    workflow: WorkflowCreateNestedOneWithoutNodesInput
  }

  export type WorkflowNodeUncheckedCreateWithoutFieldsInput = {
    id?: string
    workflowId: string
    config: JsonNullValueInput | InputJsonValue
    positionX: number
    positionY: number
    actionId: string
    isDeleted?: boolean
    outgoing?: WorkflowEdgeUncheckedCreateNestedManyWithoutSourceNodeInput
    incoming?: WorkflowEdgeUncheckedCreateNestedManyWithoutTargetNodeInput
  }

  export type WorkflowNodeCreateOrConnectWithoutFieldsInput = {
    where: WorkflowNodeWhereUniqueInput
    create: XOR<WorkflowNodeCreateWithoutFieldsInput, WorkflowNodeUncheckedCreateWithoutFieldsInput>
  }

  export type WorkflowCreateWithoutFieldsInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    isPublished?: boolean
    publishedWorkflowId?: string | null
    publishedAt?: Date | string | null
    lastPublishedAt?: Date | string | null
    user: UserCreateNestedOneWithoutWorkflowsInput
    edges?: WorkflowEdgeCreateNestedManyWithoutWorkflowInput
    nodes?: WorkflowNodeCreateNestedManyWithoutWorkflowInput
    roles?: WorkflowRoleCreateNestedManyWithoutWorkflowInput
  }

  export type WorkflowUncheckedCreateWithoutFieldsInput = {
    id?: string
    userId: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    isPublished?: boolean
    publishedWorkflowId?: string | null
    publishedAt?: Date | string | null
    lastPublishedAt?: Date | string | null
    edges?: WorkflowEdgeUncheckedCreateNestedManyWithoutWorkflowInput
    nodes?: WorkflowNodeUncheckedCreateNestedManyWithoutWorkflowInput
    roles?: WorkflowRoleUncheckedCreateNestedManyWithoutWorkflowInput
  }

  export type WorkflowCreateOrConnectWithoutFieldsInput = {
    where: WorkflowWhereUniqueInput
    create: XOR<WorkflowCreateWithoutFieldsInput, WorkflowUncheckedCreateWithoutFieldsInput>
  }

  export type WorkflowNodeUpsertWithoutFieldsInput = {
    update: XOR<WorkflowNodeUpdateWithoutFieldsInput, WorkflowNodeUncheckedUpdateWithoutFieldsInput>
    create: XOR<WorkflowNodeCreateWithoutFieldsInput, WorkflowNodeUncheckedCreateWithoutFieldsInput>
    where?: WorkflowNodeWhereInput
  }

  export type WorkflowNodeUpdateToOneWithWhereWithoutFieldsInput = {
    where?: WorkflowNodeWhereInput
    data: XOR<WorkflowNodeUpdateWithoutFieldsInput, WorkflowNodeUncheckedUpdateWithoutFieldsInput>
  }

  export type WorkflowNodeUpdateWithoutFieldsInput = {
    id?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    positionX?: FloatFieldUpdateOperationsInput | number
    positionY?: FloatFieldUpdateOperationsInput | number
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    outgoing?: WorkflowEdgeUpdateManyWithoutSourceNodeNestedInput
    incoming?: WorkflowEdgeUpdateManyWithoutTargetNodeNestedInput
    action?: ActionUpdateOneRequiredWithoutWorkflowNodesNestedInput
    workflow?: WorkflowUpdateOneRequiredWithoutNodesNestedInput
  }

  export type WorkflowNodeUncheckedUpdateWithoutFieldsInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    positionX?: FloatFieldUpdateOperationsInput | number
    positionY?: FloatFieldUpdateOperationsInput | number
    actionId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    outgoing?: WorkflowEdgeUncheckedUpdateManyWithoutSourceNodeNestedInput
    incoming?: WorkflowEdgeUncheckedUpdateManyWithoutTargetNodeNestedInput
  }

  export type WorkflowUpsertWithoutFieldsInput = {
    update: XOR<WorkflowUpdateWithoutFieldsInput, WorkflowUncheckedUpdateWithoutFieldsInput>
    create: XOR<WorkflowCreateWithoutFieldsInput, WorkflowUncheckedCreateWithoutFieldsInput>
    where?: WorkflowWhereInput
  }

  export type WorkflowUpdateToOneWithWhereWithoutFieldsInput = {
    where?: WorkflowWhereInput
    data: XOR<WorkflowUpdateWithoutFieldsInput, WorkflowUncheckedUpdateWithoutFieldsInput>
  }

  export type WorkflowUpdateWithoutFieldsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    publishedWorkflowId?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPublishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutWorkflowsNestedInput
    edges?: WorkflowEdgeUpdateManyWithoutWorkflowNestedInput
    nodes?: WorkflowNodeUpdateManyWithoutWorkflowNestedInput
    roles?: WorkflowRoleUpdateManyWithoutWorkflowNestedInput
  }

  export type WorkflowUncheckedUpdateWithoutFieldsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    publishedWorkflowId?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPublishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    edges?: WorkflowEdgeUncheckedUpdateManyWithoutWorkflowNestedInput
    nodes?: WorkflowNodeUncheckedUpdateManyWithoutWorkflowNestedInput
    roles?: WorkflowRoleUncheckedUpdateManyWithoutWorkflowNestedInput
  }

  export type WorkflowCreateWithoutRolesInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    isPublished?: boolean
    publishedWorkflowId?: string | null
    publishedAt?: Date | string | null
    lastPublishedAt?: Date | string | null
    user: UserCreateNestedOneWithoutWorkflowsInput
    edges?: WorkflowEdgeCreateNestedManyWithoutWorkflowInput
    nodes?: WorkflowNodeCreateNestedManyWithoutWorkflowInput
    fields?: WorkflowFieldCreateNestedManyWithoutWorkflowInput
  }

  export type WorkflowUncheckedCreateWithoutRolesInput = {
    id?: string
    userId: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    isPublished?: boolean
    publishedWorkflowId?: string | null
    publishedAt?: Date | string | null
    lastPublishedAt?: Date | string | null
    edges?: WorkflowEdgeUncheckedCreateNestedManyWithoutWorkflowInput
    nodes?: WorkflowNodeUncheckedCreateNestedManyWithoutWorkflowInput
    fields?: WorkflowFieldUncheckedCreateNestedManyWithoutWorkflowInput
  }

  export type WorkflowCreateOrConnectWithoutRolesInput = {
    where: WorkflowWhereUniqueInput
    create: XOR<WorkflowCreateWithoutRolesInput, WorkflowUncheckedCreateWithoutRolesInput>
  }

  export type WorkflowRoleAssignmentCreateWithoutWorkflowRoleInput = {
    id?: string
    userId: string
    userEmail?: string | null
    assignedAt?: Date | string
    assignedBy?: string | null
  }

  export type WorkflowRoleAssignmentUncheckedCreateWithoutWorkflowRoleInput = {
    id?: string
    userId: string
    userEmail?: string | null
    assignedAt?: Date | string
    assignedBy?: string | null
  }

  export type WorkflowRoleAssignmentCreateOrConnectWithoutWorkflowRoleInput = {
    where: WorkflowRoleAssignmentWhereUniqueInput
    create: XOR<WorkflowRoleAssignmentCreateWithoutWorkflowRoleInput, WorkflowRoleAssignmentUncheckedCreateWithoutWorkflowRoleInput>
  }

  export type WorkflowRoleAssignmentCreateManyWorkflowRoleInputEnvelope = {
    data: WorkflowRoleAssignmentCreateManyWorkflowRoleInput | WorkflowRoleAssignmentCreateManyWorkflowRoleInput[]
    skipDuplicates?: boolean
  }

  export type WorkflowUpsertWithoutRolesInput = {
    update: XOR<WorkflowUpdateWithoutRolesInput, WorkflowUncheckedUpdateWithoutRolesInput>
    create: XOR<WorkflowCreateWithoutRolesInput, WorkflowUncheckedCreateWithoutRolesInput>
    where?: WorkflowWhereInput
  }

  export type WorkflowUpdateToOneWithWhereWithoutRolesInput = {
    where?: WorkflowWhereInput
    data: XOR<WorkflowUpdateWithoutRolesInput, WorkflowUncheckedUpdateWithoutRolesInput>
  }

  export type WorkflowUpdateWithoutRolesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    publishedWorkflowId?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPublishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutWorkflowsNestedInput
    edges?: WorkflowEdgeUpdateManyWithoutWorkflowNestedInput
    nodes?: WorkflowNodeUpdateManyWithoutWorkflowNestedInput
    fields?: WorkflowFieldUpdateManyWithoutWorkflowNestedInput
  }

  export type WorkflowUncheckedUpdateWithoutRolesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    publishedWorkflowId?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPublishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    edges?: WorkflowEdgeUncheckedUpdateManyWithoutWorkflowNestedInput
    nodes?: WorkflowNodeUncheckedUpdateManyWithoutWorkflowNestedInput
    fields?: WorkflowFieldUncheckedUpdateManyWithoutWorkflowNestedInput
  }

  export type WorkflowRoleAssignmentUpsertWithWhereUniqueWithoutWorkflowRoleInput = {
    where: WorkflowRoleAssignmentWhereUniqueInput
    update: XOR<WorkflowRoleAssignmentUpdateWithoutWorkflowRoleInput, WorkflowRoleAssignmentUncheckedUpdateWithoutWorkflowRoleInput>
    create: XOR<WorkflowRoleAssignmentCreateWithoutWorkflowRoleInput, WorkflowRoleAssignmentUncheckedCreateWithoutWorkflowRoleInput>
  }

  export type WorkflowRoleAssignmentUpdateWithWhereUniqueWithoutWorkflowRoleInput = {
    where: WorkflowRoleAssignmentWhereUniqueInput
    data: XOR<WorkflowRoleAssignmentUpdateWithoutWorkflowRoleInput, WorkflowRoleAssignmentUncheckedUpdateWithoutWorkflowRoleInput>
  }

  export type WorkflowRoleAssignmentUpdateManyWithWhereWithoutWorkflowRoleInput = {
    where: WorkflowRoleAssignmentScalarWhereInput
    data: XOR<WorkflowRoleAssignmentUpdateManyMutationInput, WorkflowRoleAssignmentUncheckedUpdateManyWithoutWorkflowRoleInput>
  }

  export type WorkflowRoleAssignmentScalarWhereInput = {
    AND?: WorkflowRoleAssignmentScalarWhereInput | WorkflowRoleAssignmentScalarWhereInput[]
    OR?: WorkflowRoleAssignmentScalarWhereInput[]
    NOT?: WorkflowRoleAssignmentScalarWhereInput | WorkflowRoleAssignmentScalarWhereInput[]
    id?: StringFilter<"WorkflowRoleAssignment"> | string
    userId?: StringFilter<"WorkflowRoleAssignment"> | string
    userEmail?: StringNullableFilter<"WorkflowRoleAssignment"> | string | null
    workflowRoleId?: StringFilter<"WorkflowRoleAssignment"> | string
    assignedAt?: DateTimeFilter<"WorkflowRoleAssignment"> | Date | string
    assignedBy?: StringNullableFilter<"WorkflowRoleAssignment"> | string | null
  }

  export type WorkflowRoleCreateWithoutAssignmentsInput = {
    id?: string
    name: string
    description?: string | null
    permissions?: WorkflowRoleCreatepermissionsInput | $Enums.Permission[]
    isSystem?: boolean
    createdAt?: Date | string
    workflow: WorkflowCreateNestedOneWithoutRolesInput
  }

  export type WorkflowRoleUncheckedCreateWithoutAssignmentsInput = {
    id?: string
    workflowId: string
    name: string
    description?: string | null
    permissions?: WorkflowRoleCreatepermissionsInput | $Enums.Permission[]
    isSystem?: boolean
    createdAt?: Date | string
  }

  export type WorkflowRoleCreateOrConnectWithoutAssignmentsInput = {
    where: WorkflowRoleWhereUniqueInput
    create: XOR<WorkflowRoleCreateWithoutAssignmentsInput, WorkflowRoleUncheckedCreateWithoutAssignmentsInput>
  }

  export type WorkflowRoleUpsertWithoutAssignmentsInput = {
    update: XOR<WorkflowRoleUpdateWithoutAssignmentsInput, WorkflowRoleUncheckedUpdateWithoutAssignmentsInput>
    create: XOR<WorkflowRoleCreateWithoutAssignmentsInput, WorkflowRoleUncheckedCreateWithoutAssignmentsInput>
    where?: WorkflowRoleWhereInput
  }

  export type WorkflowRoleUpdateToOneWithWhereWithoutAssignmentsInput = {
    where?: WorkflowRoleWhereInput
    data: XOR<WorkflowRoleUpdateWithoutAssignmentsInput, WorkflowRoleUncheckedUpdateWithoutAssignmentsInput>
  }

  export type WorkflowRoleUpdateWithoutAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: WorkflowRoleUpdatepermissionsInput | $Enums.Permission[]
    isSystem?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workflow?: WorkflowUpdateOneRequiredWithoutRolesNestedInput
  }

  export type WorkflowRoleUncheckedUpdateWithoutAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: WorkflowRoleUpdatepermissionsInput | $Enums.Permission[]
    isSystem?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkflowCreateManyUserInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    isPublished?: boolean
    publishedWorkflowId?: string | null
    publishedAt?: Date | string | null
    lastPublishedAt?: Date | string | null
  }

  export type WorkflowUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    publishedWorkflowId?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPublishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    edges?: WorkflowEdgeUpdateManyWithoutWorkflowNestedInput
    nodes?: WorkflowNodeUpdateManyWithoutWorkflowNestedInput
    fields?: WorkflowFieldUpdateManyWithoutWorkflowNestedInput
    roles?: WorkflowRoleUpdateManyWithoutWorkflowNestedInput
  }

  export type WorkflowUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    publishedWorkflowId?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPublishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    edges?: WorkflowEdgeUncheckedUpdateManyWithoutWorkflowNestedInput
    nodes?: WorkflowNodeUncheckedUpdateManyWithoutWorkflowNestedInput
    fields?: WorkflowFieldUncheckedUpdateManyWithoutWorkflowNestedInput
    roles?: WorkflowRoleUncheckedUpdateManyWithoutWorkflowNestedInput
  }

  export type WorkflowUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    publishedWorkflowId?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPublishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WorkflowEdgeCreateManyWorkflowInput = {
    id?: string
    sourceNodeId: string
    targetNodeId: string
    isDeleted?: boolean
  }

  export type WorkflowNodeCreateManyWorkflowInput = {
    id?: string
    config: JsonNullValueInput | InputJsonValue
    positionX: number
    positionY: number
    actionId: string
    isDeleted?: boolean
  }

  export type WorkflowFieldCreateManyWorkflowInput = {
    id?: string
    sourceNodeId: string
    fieldName: string
    fieldPath: string
    fieldType?: string | null
    createdAt?: Date | string
  }

  export type WorkflowRoleCreateManyWorkflowInput = {
    id?: string
    name: string
    description?: string | null
    permissions?: WorkflowRoleCreatepermissionsInput | $Enums.Permission[]
    isSystem?: boolean
    createdAt?: Date | string
  }

  export type WorkflowEdgeUpdateWithoutWorkflowInput = {
    id?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    sourceNode?: WorkflowNodeUpdateOneRequiredWithoutOutgoingNestedInput
    targetNode?: WorkflowNodeUpdateOneRequiredWithoutIncomingNestedInput
  }

  export type WorkflowEdgeUncheckedUpdateWithoutWorkflowInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceNodeId?: StringFieldUpdateOperationsInput | string
    targetNodeId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type WorkflowEdgeUncheckedUpdateManyWithoutWorkflowInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceNodeId?: StringFieldUpdateOperationsInput | string
    targetNodeId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type WorkflowNodeUpdateWithoutWorkflowInput = {
    id?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    positionX?: FloatFieldUpdateOperationsInput | number
    positionY?: FloatFieldUpdateOperationsInput | number
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    outgoing?: WorkflowEdgeUpdateManyWithoutSourceNodeNestedInput
    incoming?: WorkflowEdgeUpdateManyWithoutTargetNodeNestedInput
    fields?: WorkflowFieldUpdateManyWithoutSourceNodeNestedInput
    action?: ActionUpdateOneRequiredWithoutWorkflowNodesNestedInput
  }

  export type WorkflowNodeUncheckedUpdateWithoutWorkflowInput = {
    id?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    positionX?: FloatFieldUpdateOperationsInput | number
    positionY?: FloatFieldUpdateOperationsInput | number
    actionId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    outgoing?: WorkflowEdgeUncheckedUpdateManyWithoutSourceNodeNestedInput
    incoming?: WorkflowEdgeUncheckedUpdateManyWithoutTargetNodeNestedInput
    fields?: WorkflowFieldUncheckedUpdateManyWithoutSourceNodeNestedInput
  }

  export type WorkflowNodeUncheckedUpdateManyWithoutWorkflowInput = {
    id?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    positionX?: FloatFieldUpdateOperationsInput | number
    positionY?: FloatFieldUpdateOperationsInput | number
    actionId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type WorkflowFieldUpdateWithoutWorkflowInput = {
    id?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    fieldPath?: StringFieldUpdateOperationsInput | string
    fieldType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sourceNode?: WorkflowNodeUpdateOneRequiredWithoutFieldsNestedInput
  }

  export type WorkflowFieldUncheckedUpdateWithoutWorkflowInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceNodeId?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    fieldPath?: StringFieldUpdateOperationsInput | string
    fieldType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkflowFieldUncheckedUpdateManyWithoutWorkflowInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceNodeId?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    fieldPath?: StringFieldUpdateOperationsInput | string
    fieldType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkflowRoleUpdateWithoutWorkflowInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: WorkflowRoleUpdatepermissionsInput | $Enums.Permission[]
    isSystem?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignments?: WorkflowRoleAssignmentUpdateManyWithoutWorkflowRoleNestedInput
  }

  export type WorkflowRoleUncheckedUpdateWithoutWorkflowInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: WorkflowRoleUpdatepermissionsInput | $Enums.Permission[]
    isSystem?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignments?: WorkflowRoleAssignmentUncheckedUpdateManyWithoutWorkflowRoleNestedInput
  }

  export type WorkflowRoleUncheckedUpdateManyWithoutWorkflowInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: WorkflowRoleUpdatepermissionsInput | $Enums.Permission[]
    isSystem?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkflowEdgeCreateManySourceNodeInput = {
    id?: string
    workflowId: string
    targetNodeId: string
    isDeleted?: boolean
  }

  export type WorkflowEdgeCreateManyTargetNodeInput = {
    id?: string
    workflowId: string
    sourceNodeId: string
    isDeleted?: boolean
  }

  export type WorkflowFieldCreateManySourceNodeInput = {
    id?: string
    workflowId: string
    fieldName: string
    fieldPath: string
    fieldType?: string | null
    createdAt?: Date | string
  }

  export type WorkflowEdgeUpdateWithoutSourceNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    targetNode?: WorkflowNodeUpdateOneRequiredWithoutIncomingNestedInput
    workflow?: WorkflowUpdateOneRequiredWithoutEdgesNestedInput
  }

  export type WorkflowEdgeUncheckedUpdateWithoutSourceNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    targetNodeId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type WorkflowEdgeUncheckedUpdateManyWithoutSourceNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    targetNodeId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type WorkflowEdgeUpdateWithoutTargetNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    sourceNode?: WorkflowNodeUpdateOneRequiredWithoutOutgoingNestedInput
    workflow?: WorkflowUpdateOneRequiredWithoutEdgesNestedInput
  }

  export type WorkflowEdgeUncheckedUpdateWithoutTargetNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    sourceNodeId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type WorkflowEdgeUncheckedUpdateManyWithoutTargetNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    sourceNodeId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type WorkflowFieldUpdateWithoutSourceNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    fieldPath?: StringFieldUpdateOperationsInput | string
    fieldType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workflow?: WorkflowUpdateOneRequiredWithoutFieldsNestedInput
  }

  export type WorkflowFieldUncheckedUpdateWithoutSourceNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    fieldPath?: StringFieldUpdateOperationsInput | string
    fieldType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkflowFieldUncheckedUpdateManyWithoutSourceNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    fieldPath?: StringFieldUpdateOperationsInput | string
    fieldType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActionCreateManyCategoryInput = {
    id?: string
    name: string
    description?: string | null
    configSchema: JsonNullValueInput | InputJsonValue
    configMeta?: NullableJsonNullValueInput | InputJsonValue
    inputType?: string | null
    outputType: string
    icon: string
    serviceUrl?: string | null
  }

  export type ActionUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    configSchema?: JsonNullValueInput | InputJsonValue
    configMeta?: NullableJsonNullValueInput | InputJsonValue
    inputType?: NullableStringFieldUpdateOperationsInput | string | null
    outputType?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    serviceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    workflowNodes?: WorkflowNodeUpdateManyWithoutActionNestedInput
  }

  export type ActionUncheckedUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    configSchema?: JsonNullValueInput | InputJsonValue
    configMeta?: NullableJsonNullValueInput | InputJsonValue
    inputType?: NullableStringFieldUpdateOperationsInput | string | null
    outputType?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    serviceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    workflowNodes?: WorkflowNodeUncheckedUpdateManyWithoutActionNestedInput
  }

  export type ActionUncheckedUpdateManyWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    configSchema?: JsonNullValueInput | InputJsonValue
    configMeta?: NullableJsonNullValueInput | InputJsonValue
    inputType?: NullableStringFieldUpdateOperationsInput | string | null
    outputType?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    serviceUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type WorkflowNodeCreateManyActionInput = {
    id?: string
    workflowId: string
    config: JsonNullValueInput | InputJsonValue
    positionX: number
    positionY: number
    isDeleted?: boolean
  }

  export type WorkflowNodeUpdateWithoutActionInput = {
    id?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    positionX?: FloatFieldUpdateOperationsInput | number
    positionY?: FloatFieldUpdateOperationsInput | number
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    outgoing?: WorkflowEdgeUpdateManyWithoutSourceNodeNestedInput
    incoming?: WorkflowEdgeUpdateManyWithoutTargetNodeNestedInput
    fields?: WorkflowFieldUpdateManyWithoutSourceNodeNestedInput
    workflow?: WorkflowUpdateOneRequiredWithoutNodesNestedInput
  }

  export type WorkflowNodeUncheckedUpdateWithoutActionInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    positionX?: FloatFieldUpdateOperationsInput | number
    positionY?: FloatFieldUpdateOperationsInput | number
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    outgoing?: WorkflowEdgeUncheckedUpdateManyWithoutSourceNodeNestedInput
    incoming?: WorkflowEdgeUncheckedUpdateManyWithoutTargetNodeNestedInput
    fields?: WorkflowFieldUncheckedUpdateManyWithoutSourceNodeNestedInput
  }

  export type WorkflowNodeUncheckedUpdateManyWithoutActionInput = {
    id?: StringFieldUpdateOperationsInput | string
    workflowId?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    positionX?: FloatFieldUpdateOperationsInput | number
    positionY?: FloatFieldUpdateOperationsInput | number
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type WorkflowRoleAssignmentCreateManyWorkflowRoleInput = {
    id?: string
    userId: string
    userEmail?: string | null
    assignedAt?: Date | string
    assignedBy?: string | null
  }

  export type WorkflowRoleAssignmentUpdateWithoutWorkflowRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userEmail?: NullableStringFieldUpdateOperationsInput | string | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type WorkflowRoleAssignmentUncheckedUpdateWithoutWorkflowRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userEmail?: NullableStringFieldUpdateOperationsInput | string | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type WorkflowRoleAssignmentUncheckedUpdateManyWithoutWorkflowRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userEmail?: NullableStringFieldUpdateOperationsInput | string | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use WorkflowCountOutputTypeDefaultArgs instead
     */
    export type WorkflowCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = WorkflowCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use WorkflowNodeCountOutputTypeDefaultArgs instead
     */
    export type WorkflowNodeCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = WorkflowNodeCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ActionCategoryCountOutputTypeDefaultArgs instead
     */
    export type ActionCategoryCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ActionCategoryCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ActionCountOutputTypeDefaultArgs instead
     */
    export type ActionCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ActionCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use WorkflowRoleCountOutputTypeDefaultArgs instead
     */
    export type WorkflowRoleCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = WorkflowRoleCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use WorkflowDefaultArgs instead
     */
    export type WorkflowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = WorkflowDefaultArgs<ExtArgs>
    /**
     * @deprecated Use WorkflowNodeDefaultArgs instead
     */
    export type WorkflowNodeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = WorkflowNodeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use WorkflowEdgeDefaultArgs instead
     */
    export type WorkflowEdgeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = WorkflowEdgeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ActionCategoryDefaultArgs instead
     */
    export type ActionCategoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ActionCategoryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ActionDefaultArgs instead
     */
    export type ActionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ActionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use WorkflowFieldDefaultArgs instead
     */
    export type WorkflowFieldArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = WorkflowFieldDefaultArgs<ExtArgs>
    /**
     * @deprecated Use WorkflowRoleDefaultArgs instead
     */
    export type WorkflowRoleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = WorkflowRoleDefaultArgs<ExtArgs>
    /**
     * @deprecated Use WorkflowRoleAssignmentDefaultArgs instead
     */
    export type WorkflowRoleAssignmentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = WorkflowRoleAssignmentDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}