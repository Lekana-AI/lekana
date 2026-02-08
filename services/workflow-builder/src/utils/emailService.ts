import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

/**
 * Sends a feedback acknowledgment email to the user.
 */
export const sendFeedbackAcknowledgmentEmail = async (email: string) => {
    const LOGO_URL = process.env.LOGO_URL || 'https://lekana.dev/logo.svg';
    const mailOptions = {
        from: process.env.SUPPORT_EMAIL_FROM || process.env.SMTP_USER,
        to: email,
        subject: "Thank you for your feedback!",
        text: `Hi there,\n\nThank you for reaching out to us with your feedback. We appreciate your input and will look into it as soon as possible.\n\nBest regards,\nThe Lekana Support Team`,
        html: `
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
        <div style="font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 24px; display: flex; align-items: center; justify-content: center; gap: 10px;">
               <img src="${LOGO_URL}" alt="Lekana Logo" style="width: 25px; height: 25px; margin-right: 10px;">
               <h1 style="font-size: 26px; font-weight: 700; color: #111827; margin-bottom: 16px; margin-top: 0;">Lekana Support</h1>
            </div>
            <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 20px; padding: 40px; text-align: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                <h2 style="font-size: 26px; font-weight: 700; color: #111827; margin-bottom: 16px; margin-top: 0;">Feedback Received</h2>
                <p style="font-size: 16px; color: #4b5563; margin-bottom: 32px; max-width: 440px; margin-left: auto; margin-right: auto;">
                    We've received your feedback and we're on it! Your input helps us build a better Lekana.
                </p>
                <div style="border-top: 1px solid #f3f4f6; margin-top: 40px; padding-top: 24px;">
                    <p style="font-size: 14px; color: #6b7280; margin: 0;">
                        Best regards,<br>
                        <span style="font-weight: 700; color: #111827;">The Lekana Support Team</span>
                    </p>
                </div>
            </div>
        </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Feedback acknowledgment email sent to ${email}`);
    } catch (error) {
        console.error('Error sending feedback acknowledgment email:', error);
    }
};

/**
 * Sends an internal notification email with feedback details.
 */
export const sendInternalFeedbackNotification = async (feedback: any, userEmail?: string) => {
    const internalEmails = (process.env.INTERNAL_NOTIFICATION_EMAILS || '').split(',').map(email => email.trim()).filter(Boolean);

    if (internalEmails.length === 0) return;

    const mailOptions = {
        from: process.env.SUPPORT_EMAIL_FROM || process.env.SMTP_USER,
        to: internalEmails.join(','),
        subject: `New Feedback Received: ${feedback.type || 'General'}`,
        text: `New feedback has been submitted:\n\n` +
            `User Email: ${userEmail || 'Unknown'}\n` +
            `Comment: ${feedback.comment}\n` +
            `Workflow ID: ${feedback.workflowId || 'N/A'}\n` +
            `Execution ID: ${feedback.executionId || 'N/A'}\n` +
            `Error Details: ${feedback.errorDetails ? JSON.stringify(feedback.errorDetails, null, 2) : 'N/A'}`,
        html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
                <h2 style="color: #16a34a;">New Feedback Received</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>User Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${userEmail || 'Unknown'}</td></tr>
                    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Type:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${feedback.type || 'General'}</td></tr>
                    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Comment:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${feedback.comment}</td></tr>
                    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Workflow:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${feedback.workflowId || 'N/A'}</td></tr>
                    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Execution:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${feedback.executionId || 'N/A'}</td></tr>
                </table>
                ${feedback.errorDetails ? `
                <h3 style="margin-top: 20px;">Error Details</h3>
                <pre style="background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto;">${JSON.stringify(feedback.errorDetails, null, 2)}</pre>
                ` : ''}
                <p style="margin-top: 20px; font-size: 12px; color: #666;">This is an automated notification from the Lekana Workflow Builder system.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Internal feedback notification sent for ${userEmail || 'unknown'}`);
    } catch (error) {
        console.error('Error sending internal feedback notification:', error);
    }
};
