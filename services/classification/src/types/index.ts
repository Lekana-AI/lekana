// Document input types
export interface DocumentInput {
    url: string;
    filename: string;
    mimeType: string;
}

// Classification result types
export interface Alternative {
    label: string;
    confidence: number;
}

export interface Classification {
    documentUrl: string;
    filename: string;
    label: string;
    confidence: number;
    alternatives: Alternative[];
    model: 'document-ai' | 'gemini';
}

// API request types
export interface ClassifyCustomRequest {
    workflowId: string;
    documents: DocumentInput[];
    customLabels: string[];
    confidenceThreshold?: number;
}

export interface ClassifyAutoRequest {
    workflowId: string;
    documents: DocumentInput[];
    confidenceThreshold?: number;
}

// API response types
export interface ServiceMetadata {
    processingTime: number;
    serviceVersion: string;
    modelUsed: string;
}

export interface ClassificationResponse {
    success: boolean;
    data: {
        classifications: Classification[];
    };
    metadata: ServiceMetadata;
    requiresHumanReview: boolean;
}

// Category types
export interface Category {
    label: string;
    normalizedLabel: string;
    firstSeenAt: Date;
    count: number;
}

// Database document types
export interface WorkflowDocument {
    workflowId: string;
    categories: Category[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ClassifiedDocument {
    workflowId: string;
    documentUrl: string;
    filename: string;
    mimeType: string;
    classification: Classification;
    requiresHumanReview: boolean;
    createdAt: Date;
}
