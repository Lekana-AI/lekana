/**
 * Clerk JWT Verification Middleware
 * Validates access tokens from Clerk for protected API routes
 */
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

// Clerk JWKS configuration
const CLERK_DOMAIN = process.env.CLERK_DOMAIN || 'your-app.clerk.accounts.dev';

/**
 * JWT validation middleware using Clerk's JWKS endpoint
 */
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${CLERK_DOMAIN}/.well-known/jwks.json`
  }),
  issuer: `https://${CLERK_DOMAIN}`,
  algorithms: ['RS256']
});

/**
 * Error handler for JWT validation errors
 */
const handleAuthError = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    console.error('JWT validation error:', err.message);
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or missing authentication token'
    });
  }
  next(err);
};

/**
 * Helper middleware to extract user info from validated Clerk token
 */
const extractUserInfo = (req, res, next) => {
  if (req.auth) {
    req.userId = req.auth.sub;
    req.userRoles = ['developer'];
    req.sessionId = req.auth.sid;
  }
  next();
};

module.exports = {
  checkJwt,
  handleAuthError,
  extractUserInfo
};
