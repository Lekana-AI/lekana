import mongoose, { Schema, Document } from 'mongoose';
import { Classification } from '../types';

export interface IDocument extends Document {
    workflowId: string;
    documentUrl: string;
    filename: string;
    mimeType: string;
    classification: Classification;
    requiresHumanReview: boolean;
    createdAt: Date;
}

const AlternativeSchema = new Schema({
    label: { type: String, required: true },
    confidence: { type: Number, required: true }
});

const ClassificationSchema = new Schema<Classification>({
    documentUrl: { type: String, required: true },
    filename: { type: String, required: true },
    label: { type: String, required: true },
    confidence: { type: Number, required: true },
    alternatives: { type: [AlternativeSchema], default: [] },
    model: { type: String, enum: ['document-ai', 'gemini'], required: true }
});

const DocumentSchema = new Schema<IDocument>(
    {
        workflowId: {
            type: String,
            required: true,
            index: true
        },
        documentUrl: {
            type: String,
            required: true
        },
        filename: {
            type: String,
            required: true
        },
        mimeType: {
            type: String,
            required: true
        },
        classification: {
            type: ClassificationSchema,
            required: true
        },
        requiresHumanReview: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Compound index for workflow and document lookups
DocumentSchema.index({ workflowId: 1, createdAt: -1 });

export const DocumentModel = mongoose.model<IDocument>('Document', DocumentSchema);
