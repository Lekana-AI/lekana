/**
 * Seed script for permissions and default roles
 * Run with: npx prisma db seed
 */
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

const PERMISSIONS = [
    // Workflow permissions
    { code: 'WORKFLOW_VIEW', name: 'View Workflow', description: 'View workflow structure and configuration', category: 'workflow' },
    { code: 'WORKFLOW_EDIT', name: 'Edit Workflow', description: 'Edit workflow nodes, edges, and settings', category: 'workflow' },
    { code: 'WORKFLOW_PUBLISH', name: 'Publish Workflow', description: 'Publish or unpublish the workflow', category: 'workflow' },
    { code: 'WORKFLOW_DELETE', name: 'Delete Workflow', description: 'Delete the workflow', category: 'workflow' },
    // Review permissions
    { code: 'REVIEW_VIEW', name: 'View Reviews', description: 'View the document review queue', category: 'review' },
    { code: 'REVIEW_APPROVE', name: 'Approve Documents', description: 'Approve reviewed documents', category: 'review' },
    { code: 'REVIEW_REJECT', name: 'Reject Documents', description: 'Reject documents or request changes', category: 'review' },
    // Admin permissions
    { code: 'ROLE_MANAGE', name: 'Manage Roles', description: 'Manage roles and user assignments', category: 'admin' }
];

// Default roles that get created for each new workflow
const DEFAULT_ROLES = [
    {
        name: 'developer',
        description: 'Full access to workflow editing and publishing',
        permissions: ['WORKFLOW_VIEW', 'WORKFLOW_EDIT', 'WORKFLOW_PUBLISH', 'WORKFLOW_DELETE', 'REVIEW_VIEW', 'REVIEW_APPROVE', 'REVIEW_REJECT', 'ROLE_MANAGE']
    },
    {
        name: 'validator',
        description: 'Can review and approve/reject documents',
        permissions: ['REVIEW_VIEW', 'REVIEW_APPROVE', 'REVIEW_REJECT']
    }
];

async function main() {
    console.log('Seeding permissions...');

    // Seed permissions
    for (const perm of PERMISSIONS) {
        await prisma.permission.upsert({
            where: { code: perm.code },
            update: { name: perm.name, description: perm.description, category: perm.category },
            create: perm
        });
        console.log(`  ✓ ${perm.code}`);
    }
    console.log(`\nSeeded ${PERMISSIONS.length} permissions.\n`);

    // Get all permission IDs for mapping
    const allPermissions = await prisma.permission.findMany();
    const permissionMap = new Map(allPermissions.map((p: { code: string; id: string }) => [p.code, p.id]));

    console.log('Seeding default roles...');

    // Seed default roles
    for (const role of DEFAULT_ROLES) {
        // Upsert the default role
        const defaultRole = await prisma.defaultRole.upsert({
            where: { name: role.name },
            update: { description: role.description },
            create: { name: role.name, description: role.description }
        });

        // Clear existing permissions for this default role
        await prisma.defaultRolePermission.deleteMany({
            where: { defaultRoleId: defaultRole.id }
        });

        // Assign permissions
        for (const permCode of role.permissions) {
            const permissionId = permissionMap.get(permCode);
            if (permissionId) {
                await prisma.defaultRolePermission.create({
                    data: { defaultRoleId: defaultRole.id, permissionId }
                });
            }
        }

        console.log(`  ✓ ${role.name} (${role.permissions.length} permissions)`);
    }

    console.log(`\nSeeded ${DEFAULT_ROLES.length} default roles.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
