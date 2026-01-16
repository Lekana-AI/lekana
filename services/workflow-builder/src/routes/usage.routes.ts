/**
 * Usage Routes
 * API endpoints for user usage management
 */

import express from 'express';
import {
    getUsage,
    getUserUsage,
    updateLimits,
    incrementUsage,
    checkUsage,
    getSystemConfig,
    updateSystemConfig
} from '../controllers/usage.controller';

const router = express.Router();

// User endpoints (requires Clerk auth)
router.get('/', getUsage);

// System config endpoints (admin only)
router.get('/config', getSystemConfig);
router.put('/config', updateSystemConfig);

// Admin endpoints (requires Clerk auth + admin role)
router.get('/:userId', getUserUsage);
router.patch('/:userId/limits', updateLimits);

// Internal endpoints (called by runtime service)
// Note: These should be protected by service-to-service auth in production
router.post('/increment', incrementUsage);
router.post('/check', checkUsage);

export default router;
