/**
 * Review Routes
 * Endpoints for human review workflow (validators)
 */
import { Router } from 'express';
import {
    getReviewQueue,
    getReviewTask,
    claimReviewTask,
    approveReviewTask,
    rejectReviewTask,
    unclaimReviewTask,
    getReviewStats
} from '../controllers/review.controller';

const router = Router();

// Review queue
router.get('/queue', getReviewQueue);
router.get('/stats', getReviewStats);

// Individual review task operations
router.get('/:taskId', getReviewTask);
router.post('/:taskId/claim', claimReviewTask);
router.post('/:taskId/approve', approveReviewTask);
router.post('/:taskId/reject', rejectReviewTask);
router.post('/:taskId/unclaim', unclaimReviewTask);

export default router;
