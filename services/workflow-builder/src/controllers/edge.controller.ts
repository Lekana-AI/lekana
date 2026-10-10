import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { touchWorkflow } from '../utils/workflow.utils';

export const addEdge = async (req: Request, res: Response) => {
    try {
        const { id: workflowId } = req.params;
        const { sourceNodeId, targetNodeId } = req.body;

        if (!sourceNodeId || !targetNodeId) {
            return res.status(400).json({ error: 'sourceNodeId and targetNodeId are required' });
        }

        // Prevent self-loops - a node cannot connect to itself
        if (sourceNodeId === targetNodeId) {
            return res.status(400).json({
                error: 'Self-loop not allowed',
                message: 'A node cannot connect to itself'
            });
        }

        // Fetch both nodes with their actions to validate type compatibility
        const sourceNode = await prisma.workflowNode.findFirst({
            where: {
                id: sourceNodeId,
                isDeleted: false
            },
            include: { action: true }
        });

        const targetNode = await prisma.workflowNode.findFirst({
            where: {
                id: targetNodeId,
                isDeleted: false
            },
            include: { action: true }
        });

        if (!sourceNode) {
            return res.status(404).json({ error: 'Source node not found or deleted' });
        }

        if (!targetNode) {
            return res.status(404).json({ error: 'Target node not found or deleted' });
        }

        // Validate type compatibility
        const sourceOutputType = sourceNode.action.outputType;
        const targetInputType = targetNode.action.inputType;

        // Check if source is a terminal node (no output)
        if (sourceOutputType === null) {
            return res.status(400).json({
                error: 'Terminal node cannot have outgoing connections',
                message: `"${sourceNode.action.name}" is a terminal node and cannot connect to other nodes`,
                sourceNode: {
                    id: sourceNode.id,
                    action: sourceNode.action.name,
                    outputType: sourceOutputType
                }
            });
        }

        // Parse comma-separated input types (e.g., "file,document")
        const acceptedInputTypes = targetInputType?.split(',').map((t: string) => t.trim()) || [];

        // Check type compatibility
        // Allow connection if:
        // 1. Target has no input requirement (null)
        // 2. Target accepts 'any' input type
        // 3. Source outputs 'any' (passthrough nodes)
        // 4. Source output matches one of target's accepted input types
        const isCompatible =
            targetInputType === null ||
            targetInputType === 'any' ||
            sourceOutputType === 'any' ||
            acceptedInputTypes.includes(sourceOutputType);

        if (!isCompatible) {
            return res.status(400).json({
                error: 'Incompatible node types',
                message: `Cannot connect: "${sourceNode.action.name}" outputs "${sourceOutputType}" but "${targetNode.action.name}" expects "${targetInputType}"`,
                sourceNode: {
                    id: sourceNode.id,
                    action: sourceNode.action.name,
                    outputType: sourceOutputType
                },
                targetNode: {
                    id: targetNode.id,
                    action: targetNode.action.name,
                    inputType: targetInputType
                }
            });
        }


        const edge = await prisma.workflowEdge.create({
            data: {
                workflowId,
                sourceNodeId,
                targetNodeId,
            },
        });

        // Touch workflow to update updatedAt
        await touchWorkflow(workflowId);

        res.status(201).json(edge);
    } catch (error) {
        console.error('Error adding edge:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Delete an edge (soft delete)
 */
export const deleteEdge = async (req: Request, res: Response) => {
    try {
        const { id: workflowId, edgeId } = req.params;

        // Check if edge exists and belongs to workflow
        const existingEdge = await prisma.workflowEdge.findFirst({
            where: {
                id: edgeId,
                workflowId,
                isDeleted: false
            }
        });

        if (!existingEdge) {
            return res.status(404).json({ error: 'Edge not found' });
        }

        // Soft delete edge
        await prisma.workflowEdge.update({
            where: { id: edgeId },
            data: { isDeleted: true }
        });

        // Touch workflow to update updatedAt
        await touchWorkflow(workflowId);

        res.status(200).json({ message: 'Edge deleted successfully' });
    } catch (error) {
        console.error('Error deleting edge:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
