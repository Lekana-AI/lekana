/**
 * Clerk JWT Verification Middleware for Runtime Service
 * Validates access tokens from Clerk for protected API routes
 */
import { expressjwt, GetVerificationKey } from 'express-jwt';
import { expressJwtSecret } from 'jwks-rsa';
import { Request, Response, NextFunction, RequestHandler } from 'express';

// Clerk JWKS configuration
const CLERK_DOMAIN = process.env.CLERK_DOMAIN || 'your-app.clerk.accounts.dev';

// Extend Express Request type to include auth properties
declare global {
    namespace Express {
        interface Request {
            auth?: {
                sub: string;
                sid?: string;
                email?: string;
                name?: string;
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
 */
export const checkJwt = expressjwt({
    secret: expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${CLERK_DOMAIN}/.well-known/jwks.json`
    }) as GetVerificationKey,
    issuer: `https://${CLERK_DOMAIN}`,
    algorithms: ['RS256']
});

/**
 * Error handler for JWT validation errors
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
 */
export const extractUserInfo: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (req.auth) {
        req.userId = req.auth.sub;
        req.userRoles = ['developer'];
        req.sessionId = req.auth.sid;
    }
    next();
};
