/**
 * Seed script for initial permissions
 * Run with: npx prisma db seed
 */
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

const PERMISSIONS = [
    // Workflow permissions
    {
        code: 'WORKFLOW_VIEW',
        name: 'View Workflow',
        description: 'View workflow structure and configuration',
        category: 'workflow'
    },
    {
        code: 'WORKFLOW_EDIT',
        name: 'Edit Workflow',
        description: 'Edit workflow nodes, edges, and settings',
        category: 'workflow'
    },
    {
        code: 'WORKFLOW_PUBLISH',
        name: 'Publish Workflow',
        description: 'Publish or unpublish the workflow',
        category: 'workflow'
    },
    {
        code: 'WORKFLOW_DELETE',
        name: 'Delete Workflow',
        description: 'Delete the workflow',
        category: 'workflow'
    },
    // Review permissions
    {
        code: 'REVIEW_VIEW',
        name: 'View Reviews',
        description: 'View the document review queue',
        category: 'review'
    },
    {
        code: 'REVIEW_APPROVE',
        name: 'Approve Documents',
        description: 'Approve reviewed documents',
        category: 'review'
    },
    {
        code: 'REVIEW_REJECT',
        name: 'Reject Documents',
        description: 'Reject documents or request changes',
        category: 'review'
    },
    // Admin permissions
    {
        code: 'ROLE_MANAGE',
        name: 'Manage Roles',
        description: 'Manage roles and user assignments',
        category: 'admin'
    }
];

async function main() {
    console.log('Seeding permissions...');

    for (const perm of PERMISSIONS) {
        await prisma.permission.upsert({
            where: { code: perm.code },
            update: {
                name: perm.name,
                description: perm.description,
                category: perm.category
            },
            create: perm
        });
        console.log(`  ✓ ${perm.code}`);
    }

    console.log(`\nSeeded ${PERMISSIONS.length} permissions.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
