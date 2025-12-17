import { Alternative } from '../types';

/**
 * Determines if a classification requires human review based on confidence score
 */
export function shouldRequireHumanReview(
    confidence: number,
    threshold: number = 0.7
): boolean {
    return confidence < threshold;
}

/**
 * Sorts alternatives by confidence in descending order
 */
export function sortAlternatives(alternatives: Alternative[]): Alternative[] {
    return alternatives.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Normalizes confidence scores to ensure they sum to 1.0
 */
export function normalizeConfidences(alternatives: Alternative[]): Alternative[] {
    const total = alternatives.reduce((sum, alt) => sum + alt.confidence, 0);

    if (total === 0) {
        return alternatives;
    }

    return alternatives.map(alt => ({
        ...alt,
        confidence: parseFloat((alt.confidence / total).toFixed(4))
    }));
}

/**
 * Get default confidence threshold from environment or use provided value
 */
export function getConfidenceThreshold(customThreshold?: number): number {
    if (customThreshold !== undefined) {
        return customThreshold;
    }

    const envThreshold = process.env.CONFIDENCE_THRESHOLD;
    return envThreshold ? parseFloat(envThreshold) : 0.7;
}
