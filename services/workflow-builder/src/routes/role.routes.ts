/**
 * Role Management Routes
 * Routes for managing workflow roles and role assignments
 */
import { Router } from 'express';
import {
    getWorkflowRoles,
    createRole,
    updateRole,
    deleteRole,
    getRoleAssignments,
    assignRole,
    revokeRole,
    getAvailablePermissions
} from '../controllers/role.controller';

const router = Router({ mergeParams: true }); // mergeParams to access :id from parent

// Role CRUD
router.get('/', getWorkflowRoles);
router.post('/', createRole);
router.put('/:roleId', updateRole);
router.delete('/:roleId', deleteRole);

// Role assignment management
router.get('/:roleId/assignments', getRoleAssignments);
router.post('/:roleId/assignments', assignRole);
router.delete('/:roleId/assignments/:assignmentId', revokeRole);

// Utility routes
router.get('/permissions/available', getAvailablePermissions);

export default router;
