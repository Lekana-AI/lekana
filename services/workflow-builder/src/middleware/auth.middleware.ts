/**
 * Clerk JWT Verification Middleware for TypeScript
 * Validates access tokens from Clerk for protected API routes
 */
import { expressjwt, GetVerificationKey } from 'express-jwt';
import { expressJwtSecret } from 'jwks-rsa';
import { Request, Response, NextFunction, RequestHandler } from 'express';

// Clerk JWKS configuration
// Clerk's JWKS endpoint follows the pattern: https://<clerk-domain>/.well-known/jwks.json
// The domain is extracted from your publishable key
const CLERK_DOMAIN = process.env.CLERK_DOMAIN || 'your-app.clerk.accounts.dev';

// Extend Express Request type to include auth properties
declare global {
    namespace Express {
        interface Request {
            auth?: {
                sub: string;
                sid?: string;
                [key: string]: any;
            };
            userId?: string;
            userRoles?: string[];
            sessionId?: string;
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
 * Clerk tokens have a different structure than Auth0
 */
export const extractUserInfo: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (req.auth) {
        // Clerk's sub claim contains the user ID
        req.userId = req.auth.sub;

        // Default all users to 'developer' role
        req.userRoles = ['developer'];

        // Session ID from Clerk
        req.sessionId = req.auth.sid;
    }
    next();
};

/**
 * Role-based access control middleware factory
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
