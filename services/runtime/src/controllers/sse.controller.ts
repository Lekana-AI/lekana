/**
 * SSE Controller
 * Handles Server-Sent Events endpoint for real-time workflow monitoring
 */

import { Request, Response, Router } from 'express';
import { addWorkflowClient, removeWorkflowClient } from '../services/sse.service';

const router = Router();

/**
 * SSE endpoint for workflow events
 * GET /api/v1/workflows/:workflowId/events
 */
router.get('/workflows/:workflowId/events', (req: Request, res: Response) => {
    const { workflowId } = req.params;

    console.log(`[SSE] New connection request for workflow ${workflowId}`);

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
    res.flushHeaders();

    // Send initial connection event
    res.write(`event: connected\ndata: ${JSON.stringify({ workflowId, message: 'Connected to workflow events' })}\n\n`);

    // Add client to the workflow's client list
    addWorkflowClient(workflowId, res);

    // Send heartbeat every 30 seconds to keep connection alive
    const heartbeatInterval = setInterval(() => {
        try {
            res.write(`event: heartbeat\ndata: ${JSON.stringify({ timestamp: new Date().toISOString() })}\n\n`);
        } catch (error) {
            clearInterval(heartbeatInterval);
        }
    }, 30000);

    // Handle client disconnect
    req.on('close', () => {
        console.log(`[SSE] Client disconnected from workflow ${workflowId}`);
        clearInterval(heartbeatInterval);
        removeWorkflowClient(workflowId, res);
    });

    req.on('error', (error) => {
        console.error(`[SSE] Connection error for workflow ${workflowId}:`, error);
        clearInterval(heartbeatInterval);
        removeWorkflowClient(workflowId, res);
    });
});

export default router;
