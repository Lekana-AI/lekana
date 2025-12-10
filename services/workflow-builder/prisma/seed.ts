import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create categories
    const documentProcessingCategory = await prisma.actionCategory.upsert({
        where: { name: 'Document Processing' },
        update: {},
        create: {
            name: 'Document Processing',
            description: 'Actions for processing and managing documents'
        }
    });

    const dataOperationsCategory = await prisma.actionCategory.upsert({
        where: { name: 'Data Operations' },
        update: {},
        create: {
            name: 'Data Operations',
            description: 'Actions for data manipulation and validation'
        }
    });

    console.log('✅ Categories created');

    // Create Invoice Upload action
    await prisma.action.upsert({
        where: { name: 'Invoice Upload' },
        update: {},
        create: {
            name: 'Invoice Upload',
            description: 'Upload and process invoice documents',
            categoryId: documentProcessingCategory.id,
            // Simple default config values
            configSchema: {
                stepName: 'Invoice Upload',
                bulkUpload: false,
                allowedFileTypes: ['pdf', 'images'],
                allowedInputs: {
                    form: true,
                    api: true
                }
            },
            // UI form schema for frontend
            uiSchema: {
                fields: [
                    {
                        name: 'stepName',
                        label: 'Step Name',
                        type: 'text',
                        placeholder: 'Enter step name',
                        required: true
                    },
                    {
                        name: 'bulkUpload',
                        label: 'Bulk Upload (zip, rar)',
                        type: 'checkbox'
                    },
                    {
                        name: 'allowedFileTypes',
                        label: 'Allowed File Types',
                        type: 'checkbox-group',
                        options: [
                            { label: 'PDF Files (pdf)', value: 'pdf' },
                            { label: 'Images (jpg, png, webp)', value: 'images' },
                            { label: 'Document (docx)', value: 'docx' }
                        ]
                    },
                    {
                        name: 'allowedInputs',
                        label: 'Allowed Inputs',
                        type: 'object',
                        fields: [
                            {
                                name: 'form',
                                label: 'Form Input',
                                type: 'checkbox',
                                trigger: 'button',
                                triggerText: 'Edit Form Input'
                            },
                            {
                                name: 'api',
                                label: 'API Input',
                                type: 'checkbox',
                                trigger: 'button',
                                triggerText: 'Edit API Input'
                            }
                        ]
                    }
                ]
            }
        }
    });

    // Create Data Validation action
    await prisma.action.upsert({
        where: { name: 'Data Validation' },
        update: {},
        create: {
            name: 'Data Validation',
            description: 'Validate data against defined rules',
            categoryId: dataOperationsCategory.id,
            // Simple default config values
            configSchema: {
                stepName: 'Data Validation',
                validationRules: ''
            },
            // UI form schema
            uiSchema: {
                fields: [
                    {
                        name: 'stepName',
                        label: 'Step Name',
                        type: 'text',
                        placeholder: 'Enter step name',
                        required: true
                    },
                    {
                        name: 'validationRules',
                        label: 'Validation Rules',
                        type: 'textarea',
                        placeholder: 'Enter validation rules (JSON format)'
                    }
                ]
            }
        }
    });

    // Create API Call action
    await prisma.action.upsert({
        where: { name: 'API Call' },
        update: {},
        create: {
            name: 'API Call',
            description: 'Make HTTP requests to external APIs',
            categoryId: dataOperationsCategory.id,
            // Simple default config values
            configSchema: {
                stepName: 'API Call',
                endpoint: '',
                method: 'GET',
                headers: {},
                body: null
            },
            // UI form schema
            uiSchema: {
                fields: [
                    {
                        name: 'stepName',
                        label: 'Step Name',
                        type: 'text',
                        placeholder: 'Enter step name',
                        required: true
                    },
                    {
                        name: 'endpoint',
                        label: 'API Endpoint',
                        type: 'text',
                        placeholder: 'https://api.example.com/endpoint',
                        required: true
                    },
                    {
                        name: 'method',
                        label: 'HTTP Method',
                        type: 'select',
                        options: [
                            { label: 'GET', value: 'GET' },
                            { label: 'POST', value: 'POST' },
                            { label: 'PUT', value: 'PUT' },
                            { label: 'DELETE', value: 'DELETE' }
                        ]
                    },
                    {
                        name: 'headers',
                        label: 'Request Headers',
                        type: 'json',
                        placeholder: '{"Content-Type": "application/json"}'
                    },
                    {
                        name: 'body',
                        label: 'Request Body',
                        type: 'json',
                        placeholder: 'Request payload (for POST/PUT)'
                    }
                ]
            }
        }
    });

    console.log('✅ Actions created with config and UI schemas');
    console.log('🎉 Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
