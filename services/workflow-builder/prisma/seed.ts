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

    // Invoice Upload action - Start node (no input), outputs file
    await prisma.action.upsert({
        where: { name: 'Invoice Upload' },
        update: {
            icon: 'CloudUpload',
            inputType: null,  // Start node - no input
            outputType: 'file',
            serviceUrl: 'http://localhost:4001',
            configSchema: {
                stepName: 'Invoice Upload',
                bulkUpload: false,
                allowedFileTypes: ['pdf', 'images'],
                allowedInputs: { form: true, api: true }
            },
            configMeta: {
                stepName: { type: 'text', label: 'Step Name', required: true, placeholder: 'Enter step name' },
                bulkUpload: { type: 'checkbox', label: 'Bulk Upload (zip, rar)' },
                allowedFileTypes: {
                    type: 'checkbox-group',
                    label: 'Allowed File Types',
                    options: [
                        { label: 'PDF Files (pdf)', value: 'pdf' },
                        { label: 'Images (jpg, png, webp)', value: 'images' },
                        { label: 'Document (docx)', value: 'docx' }
                    ]
                },
                allowedInputs: {
                    type: 'object',
                    label: 'Allowed Inputs',
                    fields: [
                        { name: 'form', label: 'Form Input', type: 'checkbox', trigger: 'button', triggerText: 'Edit Form Input' },
                        { name: 'api', label: 'API Input', type: 'checkbox', trigger: 'button', triggerText: 'Edit API Input' }
                    ]
                }
            }
        },
        create: {
            name: 'Invoice Upload',
            description: 'Upload and process invoice documents',
            icon: 'CloudUpload',
            categoryId: documentProcessingCategory.id,
            inputType: null,  // Start node - no input
            outputType: 'file',
            serviceUrl: 'http://localhost:4001',
            configSchema: {
                stepName: 'Invoice Upload',
                bulkUpload: false,
                allowedFileTypes: ['pdf', 'images'],
                allowedInputs: { form: true, api: true }
            },
            configMeta: {
                stepName: { type: 'text', label: 'Step Name', required: true, placeholder: 'Enter step name' },
                bulkUpload: { type: 'checkbox', label: 'Bulk Upload (zip, rar)' },
                allowedFileTypes: {
                    type: 'checkbox-group',
                    label: 'Allowed File Types',
                    options: [
                        { label: 'PDF Files (pdf)', value: 'pdf' },
                        { label: 'Images (jpg, png, webp)', value: 'images' },
                        { label: 'Document (docx)', value: 'docx' }
                    ]
                },
                allowedInputs: {
                    type: 'object',
                    label: 'Allowed Inputs',
                    fields: [
                        { name: 'form', label: 'Form Input', type: 'checkbox', trigger: 'button', triggerText: 'Edit Form Input' },
                        { name: 'api', label: 'API Input', type: 'checkbox', trigger: 'button', triggerText: 'Edit API Input' }
                    ]
                }
            }
        }
    });

    // Data Validation action - Takes JSON, outputs JSON
    await prisma.action.upsert({
        where: { name: 'Data Validation' },
        update: {
            icon: 'ShieldCheck',
            inputType: 'json',
            outputType: 'json',
            serviceUrl: 'http://localhost:4005',
            configSchema: {
                stepName: 'Data Validation',
                validationRules: ''
            },
            configMeta: {
                stepName: { type: 'text', label: 'Step Name', required: true, placeholder: 'Enter step name' },
                validationRules: { type: 'textarea', label: 'Validation Rules', placeholder: 'Enter validation rules (JSON format)' }
            }
        },
        create: {
            name: 'Data Validation',
            description: 'Validate data against defined rules',
            icon: 'ShieldCheck',
            categoryId: dataOperationsCategory.id,
            inputType: 'json',
            outputType: 'json',
            serviceUrl: 'http://localhost:4005',
            configSchema: {
                stepName: 'Data Validation',
                validationRules: ''
            },
            configMeta: {
                stepName: { type: 'text', label: 'Step Name', required: true, placeholder: 'Enter step name' },
                validationRules: { type: 'textarea', label: 'Validation Rules', placeholder: 'Enter validation rules (JSON format)' }
            }
        }
    });

    // API Call action - Takes JSON, outputs JSON
    await prisma.action.upsert({
        where: { name: 'API Call' },
        update: {
            icon: 'Globe',
            inputType: 'json',
            outputType: 'json',
            configSchema: {
                stepName: 'API Call',
                endpoint: '',
                method: 'GET',
                headers: {},
                body: null
            },
            configMeta: {
                stepName: { type: 'text', label: 'Step Name', required: true, placeholder: 'Enter step name' },
                endpoint: { type: 'text', label: 'API Endpoint', required: true, placeholder: 'https://api.example.com/endpoint' },
                method: {
                    type: 'select',
                    label: 'HTTP Method',
                    options: [
                        { label: 'GET', value: 'GET' },
                        { label: 'POST', value: 'POST' },
                        { label: 'PUT', value: 'PUT' },
                        { label: 'DELETE', value: 'DELETE' }
                    ]
                },
                headers: { type: 'json', label: 'Request Headers', placeholder: '{"Content-Type": "application/json"}' },
                body: { type: 'json', label: 'Request Body', placeholder: 'Request payload (for POST/PUT)' }
            }
        },
        create: {
            name: 'API Call',
            description: 'Make HTTP requests to external APIs',
            icon: 'Globe',
            categoryId: dataOperationsCategory.id,
            inputType: 'json',
            outputType: 'json',
            configSchema: {
                stepName: 'API Call',
                endpoint: '',
                method: 'GET',
                headers: {},
                body: null
            },
            configMeta: {
                stepName: { type: 'text', label: 'Step Name', required: true, placeholder: 'Enter step name' },
                endpoint: { type: 'text', label: 'API Endpoint', required: true, placeholder: 'https://api.example.com/endpoint' },
                method: {
                    type: 'select',
                    label: 'HTTP Method',
                    options: [
                        { label: 'GET', value: 'GET' },
                        { label: 'POST', value: 'POST' },
                        { label: 'PUT', value: 'PUT' },
                        { label: 'DELETE', value: 'DELETE' }
                    ]
                },
                headers: { type: 'json', label: 'Request Headers', placeholder: '{"Content-Type": "application/json"}' },
                body: { type: 'json', label: 'Request Body', placeholder: 'Request payload (for POST/PUT)' }
            }
        }
    });

    console.log('✅ Actions created with configSchema and configMeta');
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
