// app/api/contact/route.js
import { Resend } from 'resend';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Enhanced admin email template with beautiful styling
const getAdminEmailHTML = ({ name, email, service, message, timestamp }) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #1a1a1a;
                margin: 0;
                padding: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .email-wrapper {
                width: 100%;
                padding: 40px 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 24px;
                overflow: hidden;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                animation: slideIn 0.5s ease-out;
            }
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* Header with animated gradient */
            .header {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                padding: 40px 30px;
                text-align: center;
                position: relative;
                overflow: hidden;
            }
            .header::before {
                content: '';
                position: absolute;
                top: -50%;
                right: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(
                    45deg,
                    transparent 30%,
                    rgba(255, 255, 255, 0.1) 50%,
                    transparent 70%
                );
                animation: shimmer 3s infinite;
            }
            @keyframes shimmer {
                0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
                100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
            }
            .header-icon {
                width: 80px;
                height: 80px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                font-size: 40px;
                border: 3px solid rgba(255, 255, 255, 0.5);
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            .header h1 {
                margin: 0;
                color: white;
                font-size: 32px;
                font-weight: 800;
                letter-spacing: -0.5px;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header-badge {
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                padding: 8px 16px;
                border-radius: 100px;
                display: inline-block;
                margin-top: 15px;
                color: white;
                font-size: 14px;
                font-weight: 600;
                border: 1px solid rgba(255, 255, 255, 0.3);
            }
            
            /* Content area */
            .content {
                padding: 40px 30px;
                background: #ffffff;
            }
            
            /* Alert banner for priority */
            .priority-alert {
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                border-radius: 16px;
                padding: 20px;
                margin-bottom: 30px;
                display: flex;
                align-items: center;
                gap: 15px;
                border: 1px solid #fbbf24;
                animation: glow 2s infinite;
            }
            @keyframes glow {
                0% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4); }
                50% { box-shadow: 0 0 0 10px rgba(251, 191, 36, 0); }
                100% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0); }
            }
            .priority-icon {
                font-size: 32px;
            }
            .priority-text {
                flex: 1;
            }
            .priority-text strong {
                font-size: 18px;
                color: #92400e;
                display: block;
                margin-bottom: 5px;
            }
            .priority-text p {
                margin: 0;
                color: #b45309;
                font-size: 14px;
            }
            
            /* Contact information cards */
            .contact-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
                margin-bottom: 30px;
            }
            .contact-card {
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                border-radius: 16px;
                padding: 20px;
                border: 1px solid #e2e8f0;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            .contact-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
                border-color: #10b981;
            }
            .contact-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #10b981, #059669);
            }
            .card-icon {
                font-size: 24px;
                margin-bottom: 10px;
            }
            .card-label {
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: #64748b;
                margin-bottom: 5px;
            }
            .card-value {
                font-size: 18px;
                font-weight: 600;
                color: #0f172a;
                word-break: break-word;
            }
            .card-badge {
                display: inline-block;
                padding: 4px 12px;
                background: #10b981;
                color: white;
                border-radius: 100px;
                font-size: 12px;
                font-weight: 600;
                margin-top: 10px;
            }
            
            /* Message box */
            .message-box {
                background: white;
                border-radius: 16px;
                margin-bottom: 30px;
                border: 1px solid #e2e8f0;
                overflow: hidden;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .message-header {
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                padding: 15px 20px;
                border-bottom: 1px solid #e2e8f0;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .message-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
                color: #0f172a;
            }
            .message-badge {
                background: #10b981;
                color: white;
                padding: 2px 8px;
                border-radius: 100px;
                font-size: 11px;
                font-weight: 600;
                margin-left: auto;
            }
            .message-content {
                padding: 25px 20px;
                background: #ffffff;
                font-size: 16px;
                line-height: 1.8;
                color: #334155;
                white-space: pre-wrap;
            }
            .message-content::before {
                content: '"';
                font-size: 60px;
                color: #10b981;
                opacity: 0.2;
                position: absolute;
                margin-top: -20px;
                margin-left: -10px;
                font-family: serif;
            }
            
            /* Metadata section */
            .metadata {
                display: flex;
                gap: 15px;
                flex-wrap: wrap;
                margin-bottom: 30px;
                padding: 15px;
                background: #f8fafc;
                border-radius: 12px;
            }
            .meta-item {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 13px;
                color: #64748b;
            }
            .meta-item strong {
                color: #0f172a;
                font-weight: 600;
            }
            .dot {
                width: 6px;
                height: 6px;
                background: #10b981;
                border-radius: 50%;
                display: inline-block;
                margin: 0 8px;
            }
            
            /* Action buttons */
            .actions {
                display: flex;
                gap: 15px;
                justify-content: center;
                margin: 30px 0;
                flex-wrap: wrap;
            }
            .button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                padding: 14px 28px;
                border-radius: 12px;
                font-weight: 600;
                text-decoration: none;
                transition: all 0.3s ease;
                flex: 1;
                min-width: 160px;
                border: none;
                cursor: pointer;
                font-size: 15px;
            }
            .button-primary {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);
            }
            .button-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.4);
            }
            .button-secondary {
                background: white;
                color: #1e293b;
                border: 2px solid #e2e8f0;
            }
            .button-secondary:hover {
                border-color: #10b981;
                background: #f0fdf4;
                transform: translateY(-2px);
            }
            
            /* Quick response section */
            .quick-response {
                background: #f0fdf4;
                border-radius: 16px;
                padding: 20px;
                margin: 30px 0;
                border: 1px solid #86efac;
            }
            .quick-response h4 {
                margin: 0 0 15px 0;
                color: #166534;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 16px;
            }
            .response-templates {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }
            .template-chip {
                background: white;
                padding: 8px 16px;
                border-radius: 100px;
                font-size: 13px;
                color: #166534;
                border: 1px solid #86efac;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .template-chip:hover {
                background: #10b981;
                color: white;
                border-color: #10b981;
            }
            
            /* Footer */
            .footer {
                background: #1e293b;
                padding: 30px;
                text-align: center;
            }
            .footer-logo {
                font-size: 24px;
                font-weight: 800;
                color: white;
                margin-bottom: 15px;
                letter-spacing: -0.5px;
            }
            .footer-logo span {
                color: #10b981;
            }
            .footer-text {
                color: #94a3b8;
                font-size: 13px;
                line-height: 1.8;
                margin: 0;
            }
            .social-links {
                display: flex;
                gap: 15px;
                justify-content: center;
                margin: 20px 0;
            }
            .social-link {
                color: #64748b;
                text-decoration: none;
                font-size: 20px;
                transition: all 0.2s ease;
            }
            .social-link:hover {
                color: #10b981;
                transform: translateY(-2px);
            }
            
            /* Responsive */
            @media (max-width: 600px) {
                .container { margin: 10px; }
                .content { padding: 20px; }
                .contact-grid { grid-template-columns: 1fr; }
                .actions { flex-direction: column; }
                .button { width: 100%; }
                .header h1 { font-size: 24px; }
            }
            
            /* Print styles */
            @media print {
                body { background: white; padding: 0; }
                .actions, .quick-response, .footer { display: none; }
                .container { box-shadow: none; }
            }
        </style>
    </head>
    <body>
        <div class="email-wrapper">
            <div class="container">
                <!-- Animated Header -->
                <div class="header">
                    <div class="header-icon">
                        📬
                    </div>
                    <h1>New Contact Message</h1>
                    <div class="header-badge">
                        ⚡ Priority: High
                    </div>
                </div>
                
                <div class="content">
                    <!-- Priority Alert -->
                    <div class="priority-alert">
                        <div class="priority-icon">⏰</div>
                        <div class="priority-text">
                            <strong>New message requires attention!</strong>
                            <p>This contact form was submitted and needs a response within 24 hours</p>
                        </div>
                    </div>
                    
                    <!-- Contact Information Cards -->
                    <div class="contact-grid">
                        <div class="contact-card">
                            <div class="card-icon">👤</div>
                            <div class="card-label">Contact Name</div>
                            <div class="card-value">${name}</div>
                            ${service ? `<div class="card-badge">Interested in: ${service}</div>` : ''}
                        </div>
                        
                        <div class="contact-card">
                            <div class="card-icon">📧</div>
                            <div class="card-label">Email Address</div>
                            <div class="card-value">${email}</div>
                            <div class="card-badge">${email.includes('gmail') ? '📧 Gmail' : '📧 Business'}</div>
                        </div>
                        
                        ${service ? `
                        <div class="contact-card">
                            <div class="card-icon">🔧</div>
                            <div class="card-label">Service Interest</div>
                            <div class="card-value">${service}</div>
                            <div class="card-badge">Service Inquiry</div>
                        </div>
                        ` : ''}
                        
                        <div class="contact-card">
                            <div class="card-icon">📱</div>
                            <div class="card-label">Response Priority</div>
                            <div class="card-value">Within 24h</div>
                            <div class="card-badge">⏳ Urgent</div>
                        </div>
                    </div>
                    
                    <!-- Message Box -->
                    <div class="message-box">
                        <div class="message-header">
                            <span>💬</span>
                            <h3>Message Details</h3>
                            <span class="message-badge">New</span>
                        </div>
                        <div class="message-content">
                            ${message.replace(/\n/g, '<br>')}
                        </div>
                    </div>
                    
                    <!-- Metadata -->
                    <div class="metadata">
                        <div class="meta-item">
                            <span>📅</span>
                            <strong>Received:</strong> ${new Date(timestamp).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}
                        </div>
                        <span class="dot"></span>
                        <div class="meta-item">
                            <span>🔢</span>
                            <strong>Message ID:</strong> #${Math.random().toString(36).substr(2, 9).toUpperCase()}
                        </div>
                    </div>
                    
                    <!-- Quick Response Templates -->
                    <div class="quick-response">
                        <h4>
                            <span>⚡</span>
                            Quick Response Templates
                        </h4>
                        <div class="response-templates">
                            <span class="template-chip" onclick="copyTemplate('thanks')">🙏 Thank you</span>
                            <span class="template-chip" onclick="copyTemplate('meeting')">📅 Schedule call</span>
                            <span class="template-chip" onclick="copyTemplate('info')">ℹ️ More info</span>
                            <span class="template-chip" onclick="copyTemplate('quote')">💰 Send quote</span>
                            <span class="template-chip" onclick="copyTemplate('team')">👥 Team intro</span>
                        </div>
                        <p style="font-size:12px; color:#166534; margin:15px 0 5px; opacity:0.7;">
                            💡 Click any template to copy (requires JavaScript in email client)
                        </p>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="actions">
                        <a href="mailto:${email}?subject=Re%3A%20Contact%20Form%20Inquiry&body=Hi%20${encodeURIComponent(name)}%2C%0A%0AThanks%20for%20reaching%20out%20to%20us.%20I%27d%20be%20happy%20to%20help%20with%20your%20inquiry%20regarding%20${service ? encodeURIComponent(service) : 'our%20services'}.%0A%0A" class="button button-primary">
                            <span>📧</span>
                            Reply via Email
                        </a>
                        <a href="#" class="button button-secondary">
                            <span>📋</span>
                            View in CRM
                        </a>
                    </div>
                    
                    <!-- Additional Actions -->
                    <div style="display: flex; gap: 10px; justify-content: center; margin-top: 15px;">
                        <span style="color: #94a3b8; font-size: 12px; display: flex; align-items: center; gap: 5px;">
                            <span>✅</span> Mark as read
                        </span>
                        <span style="color: #94a3b8;">•</span>
                        <span style="color: #94a3b8; font-size: 12px; display: flex; align-items: center; gap: 5px;">
                            <span>⭐</span> Add to starred
                        </span>
                        <span style="color: #94a3b8;">•</span>
                        <span style="color: #94a3b8; font-size: 12px; display: flex; align-items: center; gap: 5px;">
                            <span>🚫</span> Mark as spam
                        </span>
                    </div>
                </div>
                
                <!-- Footer -->
                <div class="footer">
                    <div class="footer-logo">
                        Algo<span>X</span>
                    </div>
                    <div class="social-links">
                        <a href="#" class="social-link">📱</a>
                        <a href="#" class="social-link">🐦</a>
                        <a href="#" class="social-link">💼</a>
                        <a href="#" class="social-link">📷</a>
                    </div>
                    <p class="footer-text">
                        This is an automated notification from your contact form.<br>
                        Response time: Within 24 hours
                    </p>
                    <p class="footer-text" style="margin-top: 15px; font-size: 11px;">
                        © ${new Date().getFullYear()} Algo X Technologies. All rights reserved.<br>
                        Nairobi, Kenya | nicholusmush@gmail.com | +254 703576876
                    </p>
                </div>
            </div>
        </div>
        
        <!-- Hidden template data for email clients that support JavaScript -->
        <script>
            function copyTemplate(type) {
                const templates = {
                    thanks: "Thank you for reaching out to Algo X. We appreciate your interest and will get back to you shortly.",
                    meeting: "I'd love to schedule a call to discuss your needs further. What time works best for you this week?",
                    info: "Could you provide more details about your project requirements? This will help us give you a more accurate response.",
                    quote: "Based on your inquiry, I'd like to prepare a custom quote for you. Do you have a budget range in mind?",
                    team: "I'd like to introduce you to our team lead who specializes in this area. They'll be in touch shortly."
                };
                
                // Attempt to copy to clipboard (may not work in all email clients)
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(templates[type]);
                    alert('Template copied!');
                }
            }
        </script>
    </body>
    </html>
    `;
};

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

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return Response.json(
                { error: 'Please provide a valid email address' },
                { status: 400 }
            );
        }

        // Validate message length
        if (message.length < 10) {
            return Response.json(
                { error: 'Message must be at least 10 characters long' },
                { status: 400 }
            );
        }

        // Send enhanced email using Resend
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: ['nicholusmush@gmail.com'],
            subject: `📬 New Contact: ${name} ${service ? `- ${service}` : ''}`,
            reply_to: email,
            html: getAdminEmailHTML({
                name,
                email,
                service: service || 'General Inquiry',
                message,
                timestamp: new Date().toISOString()
            })
        });

        // Check for errors from Resend
        if (error) {
            console.error('Resend error:', error);
            return Response.json(
                { error: 'Failed to send email. Please try again.' },
                { status: 500 }
            );
        }

        // Success response with helpful data
        return Response.json({
            success: true,
            message: 'Your message has been sent successfully! We\'ll respond within 24 hours.',
            id: data?.id,
            timestamp: new Date().toISOString(),
            recipient: email
        });

    } catch (error) {
        console.error('API error:', error);

        // Handle JSON parse errors
        if (error instanceof SyntaxError) {
            return Response.json(
                { error: 'Invalid request format. Please check your data.' },
                { status: 400 }
            );
        }

        return Response.json(
            { error: 'Something went wrong. Please try again later.' },
            { status: 500 }
        );
    }
}

// GET endpoint to test if API is working
export async function GET() {
    return Response.json({
        status: 'online',
        message: 'Contact API is ready',
        version: '2.0.0',
        features: [
            'Enhanced email templates',
            'Reply-to functionality',
            'Service interest tracking',
            'Auto-response ready',
            'Priority indicators'
        ],
        endpoints: {
            POST: '/api/contact - Send contact form with enhanced styling',
            GET: '/api/contact - Check API status'
        }
    });
}