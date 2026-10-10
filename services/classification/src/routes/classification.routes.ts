import { Router } from 'express';
import { classificationController } from '../controllers/classification.controller';
import {
    validateCustomClassifyRequest,
    validateAutoClassifyRequest
} from '../middleware/validation.middleware';

const router = Router();

/**
 * @route   POST /api/classify/custom
 * @desc    Classify documents with custom labels using Document AI + Gemini fallback
 * @access  Public
 */
router.post(
    '/custom',
    validateCustomClassifyRequest,
    async (req, res, next) => {
        try {
            await classificationController.classifyWithCustomLabels(req, res);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @route   POST /api/classify/auto
 * @desc    Auto-categorize documents using Gemini with workflow category history
 * @access  Public
 */
router.post(
    '/auto',
    validateAutoClassifyRequest,
    async (req, res, next) => {
        try {
            await classificationController.autoClassify(req, res);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
