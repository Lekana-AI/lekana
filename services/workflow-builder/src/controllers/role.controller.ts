/**
 * Role Management Controller
 * Handles CRUD operations for workflow roles and role assignments
 */
import { Request, Response } from 'express';
import { PrismaClient, Permission } from '@prisma/client';

const prisma = new PrismaClient();

// Default permissions for system roles
const DEVELOPER_PERMISSIONS: Permission[] = [
    'WORKFLOW_VIEW',
    'WORKFLOW_EDIT',
    'WORKFLOW_PUBLISH',
    'WORKFLOW_DELETE',
    'REVIEW_VIEW',
    'REVIEW_APPROVE',
    'REVIEW_REJECT',
    'ROLE_MANAGE'
];

const VALIDATOR_PERMISSIONS: Permission[] = [
    'REVIEW_VIEW',
    'REVIEW_APPROVE',
    'REVIEW_REJECT'
];

/**
 * Create default system roles for a new workflow
 */
export async function createDefaultRoles(workflowId: string): Promise<void> {
    await prisma.workflowRole.createMany({
        data: [
            {
                workflowId,
                name: 'developer',
                description: 'Full access to workflow editing and publishing',
                permissions: DEVELOPER_PERMISSIONS,
                isSystem: true
            },
            {
                workflowId,
                name: 'validator',
                description: 'Can review and approve/reject documents',
                permissions: VALIDATOR_PERMISSIONS,
                isSystem: true
            }
        ],
        skipDuplicates: true
    });
}

/**
 * GET /workflows/:id/roles
 * List all roles for a workflow
 */
export async function getWorkflowRoles(req: Request, res: Response): Promise<void> {
    try {
        const { id: workflowId } = req.params;

        const roles = await prisma.workflowRole.findMany({
            where: { workflowId },
            include: {
                _count: {
                    select: { assignments: true }
                }
            },
            orderBy: [
                { isSystem: 'desc' },
                { name: 'asc' }
            ]
        });

        res.json(roles);
    } catch (error) {
        console.error('Error fetching workflow roles:', error);
        res.status(500).json({ error: 'Failed to fetch roles' });
    }
}

/**
 * POST /workflows/:id/roles
 * Create a new custom role
 */
export async function createRole(req: Request, res: Response): Promise<void> {
    try {
        const { id: workflowId } = req.params;
        const { name, description, permissions } = req.body;

        if (!name) {
            res.status(400).json({ error: 'Role name is required' });
            return;
        }

        // Validate permissions
        const validPermissions = Object.values(Permission);
        const invalidPerms = (permissions || []).filter(
            (p: string) => !validPermissions.includes(p as Permission)
        );
        if (invalidPerms.length > 0) {
            res.status(400).json({
                error: `Invalid permissions: ${invalidPerms.join(', ')}`,
                validPermissions
            });
            return;
        }

        const role = await prisma.workflowRole.create({
            data: {
                workflowId,
                name,
                description,
                permissions: permissions || [],
                isSystem: false
            }
        });

        res.status(201).json(role);
    } catch (error: any) {
        if (error.code === 'P2002') {
            res.status(409).json({ error: 'Role with this name already exists' });
            return;
        }
        console.error('Error creating role:', error);
        res.status(500).json({ error: 'Failed to create role' });
    }
}

/**
 * PUT /workflows/:id/roles/:roleId
 * Update a role
 */
export async function updateRole(req: Request, res: Response): Promise<void> {
    try {
        const { roleId } = req.params;
        const { name, description, permissions } = req.body;

        const existingRole = await prisma.workflowRole.findUnique({
            where: { id: roleId }
        });

        if (!existingRole) {
            res.status(404).json({ error: 'Role not found' });
            return;
        }

        // Prevent modifying system role names
        if (existingRole.isSystem && name && name !== existingRole.name) {
            res.status(400).json({ error: 'Cannot rename system roles' });
            return;
        }

        // Validate permissions
        if (permissions) {
            const validPermissions = Object.values(Permission);
            const invalidPerms = permissions.filter(
                (p: string) => !validPermissions.includes(p as Permission)
            );
            if (invalidPerms.length > 0) {
                res.status(400).json({
                    error: `Invalid permissions: ${invalidPerms.join(', ')}`,
                    validPermissions
                });
                return;
            }
        }

        const role = await prisma.workflowRole.update({
            where: { id: roleId },
            data: {
                ...(name && !existingRole.isSystem && { name }),
                ...(description !== undefined && { description }),
                ...(permissions && { permissions })
            }
        });

        res.json(role);
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ error: 'Failed to update role' });
    }
}

/**
 * DELETE /workflows/:id/roles/:roleId
 * Delete a custom role
 */
export async function deleteRole(req: Request, res: Response): Promise<void> {
    try {
        const { roleId } = req.params;

        const role = await prisma.workflowRole.findUnique({
            where: { id: roleId }
        });

        if (!role) {
            res.status(404).json({ error: 'Role not found' });
            return;
        }

        if (role.isSystem) {
            res.status(400).json({ error: 'Cannot delete system roles' });
            return;
        }

        await prisma.workflowRole.delete({
            where: { id: roleId }
        });

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting role:', error);
        res.status(500).json({ error: 'Failed to delete role' });
    }
}

/**
 * GET /workflows/:id/roles/:roleId/assignments
 * List users assigned to a role
 */
export async function getRoleAssignments(req: Request, res: Response): Promise<void> {
    try {
        const { roleId } = req.params;

        const assignments = await prisma.workflowRoleAssignment.findMany({
            where: { workflowRoleId: roleId },
            include: {
                workflowRole: {
                    select: { name: true, permissions: true }
                }
            },
            orderBy: { assignedAt: 'desc' }
        });

        res.json(assignments);
    } catch (error) {
        console.error('Error fetching role assignments:', error);
        res.status(500).json({ error: 'Failed to fetch assignments' });
    }
}

/**
 * POST /workflows/:id/roles/:roleId/assignments
 * Assign a user to a role by email address
 * If user exists in Clerk, uses their userId; otherwise stores email for pending invitation
 */
export async function assignRole(req: Request, res: Response): Promise<void> {
    try {
        const { roleId } = req.params;
        const { userEmail } = req.body;
        const assignedBy = req.userId;

        if (!userEmail) {
            res.status(400).json({ error: 'userEmail is required' });
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userEmail)) {
            res.status(400).json({ error: 'Invalid email format' });
            return;
        }

        // Verify role exists
        const role = await prisma.workflowRole.findUnique({
            where: { id: roleId }
        });

        if (!role) {
            res.status(404).json({ error: 'Role not found' });
            return;
        }

        // Try to find user in Clerk by email
        let userId: string | null = null;
        try {
            const { clerkClient } = await import('@clerk/clerk-sdk-node');
            const users = await clerkClient.users.getUserList({
                emailAddress: [userEmail]
            });

            if (users && users.length > 0) {
                userId = users[0].id;
            }
        } catch (clerkError) {
            console.warn('Clerk lookup failed, storing email only:', clerkError);
            // Continue without userId - will be a pending invitation
        }

        // Check if user already has this role (by email or userId)
        const existingAssignment = await prisma.workflowRoleAssignment.findFirst({
            where: {
                workflowRoleId: roleId,
                OR: [
                    { userEmail },
                    ...(userId ? [{ userId }] : [])
                ]
            }
        });

        if (existingAssignment) {
            res.status(409).json({ error: 'User already has this role' });
            return;
        }

        const assignment = await prisma.workflowRoleAssignment.create({
            data: {
                userId: userId || `pending_${userEmail}`, // Use pending_ prefix for unregistered users
                userEmail,
                workflowRoleId: roleId,
                assignedBy
            },
            include: {
                workflowRole: {
                    select: { name: true, permissions: true, workflowId: true }
                }
            }
        });

        // Sync to Clerk if user exists
        if (userId && !userId.startsWith('pending_')) {
            try {
                const { syncUserRolesToClerk } = await import('../services/clerk-sync.service');
                await syncUserRolesToClerk(userId);
            } catch (syncError) {
                console.warn('Clerk sync failed:', syncError);
            }
        }

        res.status(201).json({
            ...assignment,
            isPending: !userId || userId.startsWith('pending_'),
            message: userId
                ? 'User assigned successfully'
                : 'Invitation pending - user will receive access when they sign up with this email'
        });
    } catch (error: any) {
        if (error.code === 'P2002') {
            res.status(409).json({ error: 'User already has this role' });
            return;
        }
        console.error('Error assigning role:', error);
        res.status(500).json({ error: 'Failed to assign role' });
    }
}

/**
 * DELETE /workflows/:id/roles/:roleId/assignments/:assignmentId
 * Remove a user from a role
 */
export async function revokeRole(req: Request, res: Response): Promise<void> {
    try {
        const { assignmentId } = req.params;

        const assignment = await prisma.workflowRoleAssignment.findUnique({
            where: { id: assignmentId }
        });

        if (!assignment) {
            res.status(404).json({ error: 'Assignment not found' });
            return;
        }

        await prisma.workflowRoleAssignment.delete({
            where: { id: assignmentId }
        });

        // TODO: Sync to Clerk public metadata
        // await syncUserRolesToClerk(assignment.userId);

        res.status(204).send();
    } catch (error) {
        console.error('Error revoking role:', error);
        res.status(500).json({ error: 'Failed to revoke role' });
    }
}

/**
 * GET /user/workflow-roles
 * Get all role assignments for the current user
 */
export async function getUserWorkflowRoles(req: Request, res: Response): Promise<void> {
    try {
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }

        const assignments = await prisma.workflowRoleAssignment.findMany({
            where: { userId },
            include: {
                workflowRole: {
                    include: {
                        workflow: {
                            select: { id: true, name: true }
                        }
                    }
                }
            }
        });

        // Transform into a map: { workflowId: { roles: [...], permissions: [...] } }
        const roleMap: Record<string, { roles: string[]; permissions: string[]; workflowName: string }> = {};

        for (const assignment of assignments) {
            const { workflowRole } = assignment;
            const workflowId = workflowRole.workflowId;

            if (!roleMap[workflowId]) {
                roleMap[workflowId] = {
                    roles: [],
                    permissions: [],
                    workflowName: workflowRole.workflow.name
                };
            }

            roleMap[workflowId].roles.push(workflowRole.name);
            roleMap[workflowId].permissions.push(
                ...workflowRole.permissions.filter(p => !roleMap[workflowId].permissions.includes(p))
            );
        }

        res.json(roleMap);
    } catch (error) {
        console.error('Error fetching user workflow roles:', error);
        res.status(500).json({ error: 'Failed to fetch user roles' });
    }
}

/**
 * Get available permissions list
 */
export async function getAvailablePermissions(req: Request, res: Response): Promise<void> {
    res.json({
        permissions: Object.values(Permission),
        descriptions: {
            WORKFLOW_VIEW: 'View workflow structure and configuration',
            WORKFLOW_EDIT: 'Edit workflow nodes, edges, and settings',
            WORKFLOW_PUBLISH: 'Publish or unpublish the workflow',
            WORKFLOW_DELETE: 'Delete the workflow',
            REVIEW_VIEW: 'View the document review queue',
            REVIEW_APPROVE: 'Approve reviewed documents',
            REVIEW_REJECT: 'Reject documents or request changes',
            ROLE_MANAGE: 'Manage roles and user assignments'
        }
    });
}
