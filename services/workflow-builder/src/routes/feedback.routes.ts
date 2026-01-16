import { Router } from 'express';
import * as feedbackController from '../controllers/feedback.controller';

const router = Router();

// POST /feedback - Submit new feedback
router.post('/', feedbackController.createFeedback);

export default router;
