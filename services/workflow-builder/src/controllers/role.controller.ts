/**
 * Role Management Controller
 * Handles CRUD operations for workflow roles and role assignments
 */
import { Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

/**
 * Create default system roles for a new workflow
 * Reads role templates from DefaultRole table in database
 */
export async function createDefaultRoles(workflowId: string): Promise<void> {
    // Fetch active default roles with their permissions from database
    const defaultRoles = await prisma.defaultRole.findMany({
        where: { isActive: true },
        include: {
            defaultRolePermissions: {
                include: {
                    permission: {
                        select: { id: true, code: true }
                    }
                }
            }
        }
    });

    // Create each default role for this workflow
    for (const defaultRole of defaultRoles) {
        // Create or get the workflow role
        const workflowRole = await prisma.workflowRole.upsert({
            where: { workflowId_name: { workflowId, name: defaultRole.name } },
            update: {},
            create: {
                workflowId,
                name: defaultRole.name,
                description: defaultRole.description,
                isSystem: true
            }
        });

        // Assign permissions from the default role template
        for (const drp of defaultRole.defaultRolePermissions) {
            await prisma.workflowRolePermission.upsert({
                where: {
                    workflowRoleId_permissionId: {
                        workflowRoleId: workflowRole.id,
                        permissionId: drp.permission.id
                    }
                },
                update: {},
                create: {
                    workflowRoleId: workflowRole.id,
                    permissionId: drp.permission.id
                }
            });
        }
    }
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
                },
                rolePermissions: {
                    include: {
                        permission: true
                    }
                }
            },
            orderBy: [
                { isSystem: 'desc' },
                { name: 'asc' }
            ]
        });

        // Transform to include permission codes array for backward compatibility
        const transformedRoles = roles.map(role => ({
            ...role,
            permissions: role.rolePermissions.map(rp => rp.permission.code)
        }));

        res.json(transformedRoles);
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

        // Validate permissions exist in database
        const dbPermissions = await prisma.permission.findMany({
            where: { code: { in: permissions || [] } }
        });
        const validCodes = dbPermissions.map(p => p.code);
        const invalidPerms = (permissions || []).filter((p: string) => !validCodes.includes(p));

        if (invalidPerms.length > 0) {
            res.status(400).json({
                error: `Invalid permissions: ${invalidPerms.join(', ')}`,
                validPermissions: validCodes
            });
            return;
        }

        // Create role
        const role = await prisma.workflowRole.create({
            data: {
                workflowId,
                name,
                description,
                isSystem: false
            }
        });

        // Create permission links
        if (dbPermissions.length > 0) {
            await prisma.workflowRolePermission.createMany({
                data: dbPermissions.map(p => ({
                    workflowRoleId: role.id,
                    permissionId: p.id
                }))
            });
        }

        // Fetch role with permissions
        const roleWithPerms = await prisma.workflowRole.findUnique({
            where: { id: role.id },
            include: {
                rolePermissions: {
                    include: { permission: true }
                }
            }
        });

        res.status(201).json({
            ...roleWithPerms,
            permissions: roleWithPerms?.rolePermissions.map(rp => rp.permission.code) || []
        });
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

        // Validate permissions if provided
        let dbPermissions: any[] = [];
        if (permissions) {
            dbPermissions = await prisma.permission.findMany({
                where: { code: { in: permissions } }
            });
            const validCodes = dbPermissions.map(p => p.code);
            const invalidPerms = permissions.filter((p: string) => !validCodes.includes(p));

            if (invalidPerms.length > 0) {
                res.status(400).json({
                    error: `Invalid permissions: ${invalidPerms.join(', ')}`,
                    validPermissions: validCodes
                });
                return;
            }
        }

        // Update role basic info
        const role = await prisma.workflowRole.update({
            where: { id: roleId },
            data: {
                ...(name && !existingRole.isSystem && { name }),
                ...(description !== undefined && { description })
            }
        });

        // Update permissions if provided
        if (permissions) {
            // Delete existing permission links
            await prisma.workflowRolePermission.deleteMany({
                where: { workflowRoleId: roleId }
            });

            // Create new permission links
            if (dbPermissions.length > 0) {
                await prisma.workflowRolePermission.createMany({
                    data: dbPermissions.map(p => ({
                        workflowRoleId: roleId,
                        permissionId: p.id
                    }))
                });
            }
        }

        // Fetch updated role with permissions
        const roleWithPerms = await prisma.workflowRole.findUnique({
            where: { id: roleId },
            include: {
                rolePermissions: {
                    include: { permission: true }
                }
            }
        });

        res.json({
            ...roleWithPerms,
            permissions: roleWithPerms?.rolePermissions.map(rp => rp.permission.code) || []
        });
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
                    include: {
                        rolePermissions: {
                            include: { permission: true }
                        }
                    }
                }
            },
            orderBy: { assignedAt: 'desc' }
        });

        // Transform to include permission codes
        const transformedAssignments = assignments.map(a => ({
            ...a,
            workflowRole: {
                ...a.workflowRole,
                permissions: a.workflowRole.rolePermissions.map(rp => rp.permission.code)
            }
        }));

        res.json(transformedAssignments);
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
                    include: {
                        rolePermissions: { include: { permission: true } }
                    }
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
            workflowRole: {
                ...assignment.workflowRole,
                permissions: assignment.workflowRole.rolePermissions.map(rp => rp.permission.code)
            },
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
                        },
                        rolePermissions: {
                            include: { permission: true }
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

            // Add permissions from role
            for (const rp of workflowRole.rolePermissions) {
                if (!roleMap[workflowId].permissions.includes(rp.permission.code)) {
                    roleMap[workflowId].permissions.push(rp.permission.code);
                }
            }
        }

        res.json(roleMap);
    } catch (error) {
        console.error('Error fetching user workflow roles:', error);
        res.status(500).json({ error: 'Failed to fetch user roles' });
    }
}

/**
 * Get available permissions list from database
 */
export async function getAvailablePermissions(req: Request, res: Response): Promise<void> {
    try {
        const permissions = await prisma.permission.findMany({
            orderBy: [
                { category: 'asc' },
                { code: 'asc' }
            ]
        });

        // Build descriptions map for backward compatibility
        const descriptions: Record<string, string> = {};
        for (const p of permissions) {
            descriptions[p.code] = p.description || p.name;
        }

        res.json({
            permissions: permissions.map(p => p.code),
            descriptions,
            // Also return full permission objects for rich UI
            permissionsList: permissions
        });
    } catch (error) {
        console.error('Error fetching permissions:', error);
        res.status(500).json({ error: 'Failed to fetch permissions' });
    }
}
