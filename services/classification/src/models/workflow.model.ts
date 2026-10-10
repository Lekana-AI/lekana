import mongoose, { Schema, Document } from 'mongoose';
import { Category } from '../types';

export interface IWorkflow extends Document {
    workflowId: string;
    categories: Category[];
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema = new Schema<Category>({
    label: { type: String, required: true },
    normalizedLabel: { type: String, required: true },
    firstSeenAt: { type: Date, default: Date.now },
    count: { type: Number, default: 1 }
});

const WorkflowSchema = new Schema<IWorkflow>(
    {
        workflowId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        categories: {
            type: [CategorySchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);

// Index for faster category lookups
WorkflowSchema.index({ 'categories.normalizedLabel': 1 });

export const Workflow = mongoose.model<IWorkflow>('Workflow', WorkflowSchema);
