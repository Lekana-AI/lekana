/**
 * Clerk JWT Verification Middleware for TypeScript
 * Validates access tokens from Clerk for protected API routes
 */
import { expressjwt, GetVerificationKey } from 'express-jwt';
import { expressJwtSecret } from 'jwks-rsa';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { PrismaClient, Permission } from '../../generated/prisma';

const prisma = new PrismaClient();

// Clerk JWKS configuration
// Clerk's JWKS endpoint follows the pattern: https://<clerk-domain>/.well-known/jwks.json
// The domain is extracted from your publishable key
const CLERK_DOMAIN = process.env.CLERK_DOMAIN || 'your-app.clerk.accounts.dev';

// Type for workflow role data
interface WorkflowRoleData {
    roles: string[];
    permissions: Permission[];
}

// Extend Express Request type to include auth properties
declare global {
    namespace Express {
        interface Request {
            auth?: {
                sub: string;
                sid?: string;
                email?: string;  // Custom claim from Clerk JWT template
                name?: string;   // Custom claim from Clerk JWT template
                [key: string]: any;
            };
            userId?: string;
            userRoles?: string[];
            sessionId?: string;
            workflowRoles?: Record<string, WorkflowRoleData>;
        }
    }
}

/**
 * JWT validation middleware using Clerk's JWKS endpoint
 * This middleware:
 * 1. Extracts the Bearer token from the Authorization header
 * 2. Validates the token signature using Clerk's public keys (JWKS)
 * 3. Verifies the token's issuer
 * 4. Attaches the decoded token payload to req.auth
 */
export const checkJwt = expressjwt({
    // Dynamically provide the signing key based on the kid in the header
    secret: expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${CLERK_DOMAIN}/.well-known/jwks.json`
    }) as GetVerificationKey,

    // Clerk tokens use the domain as issuer
    issuer: `https://${CLERK_DOMAIN}`,
    algorithms: ['RS256']
});

/**
 * Error handler for JWT validation errors
 * Returns appropriate HTTP status codes and messages
 */
export const handleAuthError = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err.name === 'UnauthorizedError') {
        console.error('JWT validation error:', err.message);
        res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid or missing authentication token'
        });
        return;
    }
    next(err);
};

/**
 * Helper middleware to extract user info from validated Clerk token
 * After checkJwt runs, req.auth contains the decoded token
 * Also loads workflow-specific roles from database
 * Activates any pending role assignments for this user's email
 */
export const extractUserInfo: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    if (req.auth) {
        // Clerk's sub claim contains the user ID
        req.userId = req.auth.sub;

        // Default all users to 'developer' role
        req.userRoles = ['developer'];

        // Session ID from Clerk
        req.sessionId = req.auth.sid;

        // Get user email from Clerk token (if available in custom claims)
        const userEmail = req.auth.email;

        // Activate any pending assignments for this user's email
        if (userEmail) {
            try {
                const pendingUserId = `pending_${userEmail}`;
                const updated = await prisma.workflowRoleAssignment.updateMany({
                    where: { userId: pendingUserId },
                    data: { userId: req.userId }
                });
                if (updated.count > 0) {
                    console.log(`[Auth] Activated ${updated.count} pending role assignment(s) for ${userEmail}`);
                }
            } catch (error) {
                console.error('Error activating pending assignments:', error);
                // Non-fatal, continue with login
            }
        }

        // Load workflow-specific roles from database
        try {
            const assignments = await prisma.workflowRoleAssignment.findMany({
                where: { userId: req.userId },
                include: {
                    workflowRole: {
                        select: { workflowId: true, name: true, permissions: true }
                    }
                }
            });

            // Build workflow roles map
            const workflowRoles: Record<string, WorkflowRoleData> = {};
            for (const assignment of assignments) {
                const { workflowId, name, permissions } = assignment.workflowRole;
                if (!workflowRoles[workflowId]) {
                    workflowRoles[workflowId] = { roles: [], permissions: [] };
                }
                workflowRoles[workflowId].roles.push(name);
                for (const perm of permissions) {
                    if (!workflowRoles[workflowId].permissions.includes(perm)) {
                        workflowRoles[workflowId].permissions.push(perm);
                    }
                }
            }

            req.workflowRoles = workflowRoles;
        } catch (error) {
            console.error('Error loading workflow roles:', error);
            // Continue without roles - will fall back to ownership check
            req.workflowRoles = {};
        }
    }
    next();
};

/**
 * Check if user is the owner of a workflow
 */
async function isWorkflowOwner(userId: string, workflowId: string): Promise<boolean> {
    const workflow = await prisma.workflow.findUnique({
        where: { id: workflowId },
        select: { userId: true }
    });
    return workflow?.userId === userId;
}

/**
 * Permission-based access control middleware factory
 * Checks if user has required permissions for the workflow from URL params
 * @param requiredPermissions - Array of permissions needed (ALL must be present)
 * @returns Express middleware
 */
export const requirePermission = (requiredPermissions: Permission[]): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const workflowId = req.params.id;
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }

        if (!workflowId) {
            res.status(400).json({ error: 'Workflow ID required' });
            return;
        }

        // Workflow owner always has full access
        if (await isWorkflowOwner(userId, workflowId)) {
            next();
            return;
        }

        // Check user's permissions for this workflow
        const userPerms = req.workflowRoles?.[workflowId]?.permissions || [];
        const hasPermissions = requiredPermissions.every(p => userPerms.includes(p));

        if (!hasPermissions) {
            res.status(403).json({
                error: 'Forbidden',
                message: 'You do not have the required permissions for this workflow'
            });
            return;
        }

        next();
    };
};

/**
 * Role-based access control middleware factory (legacy)
 * @param allowedRoles - Array of roles that are allowed access
 * @returns Express middleware
 */
export const requireRole = (allowedRoles: string[]): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const userRoles = req.userRoles || [];
        const hasRole = allowedRoles.some(role => userRoles.includes(role));

        if (!hasRole) {
            res.status(403).json({
                error: 'Forbidden',
                message: 'You do not have permission to access this resource'
            });
            return;
        }
        next();
    };
};

/**
 * Middleware to require workflow ownership
 * Useful for sensitive operations like deleting workflows
 */
export const requireOwnership: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const workflowId = req.params.id;
    const userId = req.userId;

    if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }

    if (!workflowId) {
        res.status(400).json({ error: 'Workflow ID required' });
        return;
    }

    if (await isWorkflowOwner(userId, workflowId)) {
        next();
        return;
    }

    res.status(403).json({
        error: 'Forbidden',
        message: 'Only the workflow owner can perform this action'
    });
};

