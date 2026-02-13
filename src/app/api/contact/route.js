// app/api/contact/route.js
import { Resend } from 'resend';

// Initialize Resend with your API key
const resend = new Resend('re_WVFpmY2g_A51TZJPkHGLrRTp2q1XWd9FQ');

export async function POST(req) {
    try {
        // Parse the request body
        const body = await req.json();
        const { name, email, service, message } = body;

        // Validate required fields
        if (!name || !email || !message) {
            return Response.json(
                { error: 'Name, email, and message are required' },
                { status: 400 }
            );
        }

        // Send email using Resend
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: ['nicholusmush@gmail.com'],
            subject: `New Contact Form Submission from ${name}`,
            reply_to: email,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px;">
            New Contact Form Message
          </h2>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong style="color: #10b981;">Name:</strong> ${name}</p>
            <p><strong style="color: #10b981;">Email:</strong> ${email}</p>
            ${service ? `<p><strong style="color: #10b981;">Service:</strong> ${service}</p>` : ''}
            <p><strong style="color: #10b981;">Message:</strong></p>
            <p style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #10b981;">
              ${message}
            </p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            Reply to this email to respond directly to ${name}
          </p>
        </div>
      `,
        });

        // Check for errors from Resend
        if (error) {
            console.error('Resend error:', error);
            return Response.json(
                { error: 'Failed to send email' },
                { status: 500 }
            );
        }

        // Success response
        return Response.json({
            success: true,
            message: 'Your message has been sent successfully!',
            id: data?.id
        });

    } catch (error) {
        console.error('API error:', error);

        // Handle JSON parse errors
        if (error instanceof SyntaxError) {
            return Response.json(
                { error: 'Invalid request format' },
                { status: 400 }
            );
        }

        return Response.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}

// GET endpoint to test if API is working
export async function GET() {
    return Response.json({
        status: 'online',
        message: 'Contact API is ready',
        endpoints: {
            POST: '/api/contact - Send contact form'
        }
    });
}