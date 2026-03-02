import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Email templates
const getClientEmailHTML = (quoteData) => {
    const { services, complexity, timeline, teamSize, estimatedPrice, clientInfo } = quoteData

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Algo X Quote Request</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background: white;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #00ff9d 0%, #00b8ff 100%);
                padding: 40px 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                color: white;
                font-size: 28px;
                font-weight: bold;
            }
            .header p {
                margin: 10px 0 0;
                color: rgba(255, 255, 255, 0.9);
                font-size: 16px;
            }
            .content {
                padding: 40px 30px;
            }
            .section {
                margin-bottom: 30px;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 12px;
                border-left: 4px solid #00ff9d;
            }
            .section h2 {
                margin: 0 0 15px;
                font-size: 18px;
                color: #1a1a1a;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .price-tag {
                background: linear-gradient(135deg, #00ff9d 0%, #00b8ff 100%);
                color: #1a1a1a;
                padding: 20px;
                border-radius: 12px;
                text-align: center;
                margin-bottom: 30px;
            }
            .price-tag .label {
                font-size: 14px;
                opacity: 0.8;
                margin-bottom: 5px;
            }
            .price-tag .amount {
                font-size: 42px;
                font-weight: bold;
                letter-spacing: 2px;
            }
            .grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
                margin: 20px 0;
            }
            .info-item {
                padding: 15px;
                background: white;
                border-radius: 8px;
                border: 1px solid #eaeaea;
            }
            .info-item .label {
                font-size: 12px;
                color: #666;
                margin-bottom: 5px;
            }
            .info-item .value {
                font-size: 16px;
                font-weight: 600;
                color: #1a1a1a;
            }
            .services-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            .services-list li {
                padding: 10px 0;
                border-bottom: 1px solid #eaeaea;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .services-list li:last-child {
                border-bottom: none;
            }
            .dot {
                width: 8px;
                height: 8px;
                background: #00ff9d;
                border-radius: 50%;
                display: inline-block;
            }
            .footer {
                padding: 30px;
                text-align: center;
                background: #f8f9fa;
                border-top: 1px solid #eaeaea;
            }
            .button {
                display: inline-block;
                padding: 12px 30px;
                background: linear-gradient(135deg, #00ff9d 0%, #00b8ff 100%);
                color: #1a1a1a;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                margin: 10px 5px;
            }
            .button-secondary {
                background: #1a1a1a;
                color: white;
            }
            .note {
                font-size: 12px;
                color: #666;
                margin-top: 20px;
                padding: 15px;
                background: #fff3cd;
                border-radius: 8px;
                border-left: 4px solid #ffc107;
            }
            @media (max-width: 600px) {
                .container { margin: 10px; }
                .content { padding: 20px; }
                .grid { grid-template-columns: 1fr; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎯 Quote Request Received!</h1>
                <p>Thank you for choosing Algo X</p>
            </div>
            
            <div class="content">
                <div class="price-tag">
                    <div class="label">Estimated Project Cost</div>
                    <div class="amount">$${estimatedPrice.toLocaleString()}</div>
                </div>

                <div class="section">
                    <h2>📋 Project Summary</h2>
                    <div class="grid">
                        <div class="info-item">
                            <div class="label">Complexity</div>
                            <div class="value">${complexity.toUpperCase()}</div>
                        </div>
                        <div class="info-item">
                            <div class="label">Timeline</div>
                            <div class="value">${timeline.toUpperCase()}</div>
                        </div>
                        <div class="info-item">
                            <div class="label">Team Size</div>
                            <div class="value">${teamSize.toUpperCase().replace('_', ' ')}</div>
                        </div>
                        <div class="info-item">
                            <div class="label">Quote Valid Until</div>
                            <div class="value">${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h2>⚡ Selected Services</h2>
                    <ul class="services-list">
                        ${services.map(service => `
                            <li>
                                <span class="dot"></span>
                                ${service}
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div class="section">
                    <h2>👤 Your Information</h2>
                    <p><strong>Name:</strong> ${clientInfo.name}</p>
                    <p><strong>Email:</strong> ${clientInfo.email}</p>
                    ${clientInfo.company ? `<p><strong>Company:</strong> ${clientInfo.company}</p>` : ''}
                    ${clientInfo.description ? `<p><strong>Project Description:</strong><br>${clientInfo.description}</p>` : ''}
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="mailto:contact@algo-x.com?subject=Quote%20Inquiry%20-%20${clientInfo.name}" class="button">
                        📧 Reply to this email
                    </a>
                    <a href="tel:+254700000000" class="button button-secondary">
                        📞 Call us
                    </a>
                </div>

                <div class="note">
                    <strong>📝 Note:</strong> This is an initial estimate based on your selections. 
                    Our team will contact you within 24 hours to discuss your project in detail 
                    and provide a final quote.
                </div>
            </div>

            <div class="footer">
                <p style="margin: 0 0 10px; color: #666;">Algo X Technologies</p>
                <p style="margin: 0; font-size: 12px; color: #999;">
                    📍 Nairobi, Kenya<br>
                    📧 contact@algo-x.com | 📞 +254 700 000 000<br>
                    🕒 Mon-Fri: 9AM - 6PM EAT
                </p>
            </div>
        </div>
    </body>
    </html>
    `
}

const getAdminEmailHTML = (quoteData) => {
    const { services, complexity, timeline, teamSize, estimatedPrice, clientInfo, timestamp } = quoteData

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>New Quote Request - Algo X</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                background: #f4f4f4;
                margin: 0;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #00ff9d 0%, #00b8ff 100%);
                padding: 30px;
                color: #1a1a1a;
            }
            .content {
                padding: 30px;
            }
            .field {
                margin-bottom: 20px;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 8px;
            }
            .label {
                font-size: 12px;
                color: #666;
                margin-bottom: 5px;
            }
            .value {
                font-size: 16px;
                font-weight: 600;
                color: #1a1a1a;
            }
            .badge {
                display: inline-block;
                padding: 4px 8px;
                background: #00ff9d;
                color: #1a1a1a;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 600;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2 style="margin:0;">🚀 New Quote Request</h2>
                <p style="margin:5px 0 0; opacity:0.8;">${new Date(timestamp).toLocaleString()}</p>
            </div>
            
            <div class="content">
                <div style="background:#00ff9d20; padding:20px; border-radius:8px; margin-bottom:20px;">
                    <div style="font-size:12px; color:#666;">Estimated Value</div>
                    <div style="font-size:32px; font-weight:bold; color:#1a1a1a;">$${estimatedPrice.toLocaleString()}</div>
                </div>

                <div class="field">
                    <div class="label">Client Information</div>
                    <div class="value">${clientInfo.name}</div>
                    <div class="value" style="font-weight:normal;">${clientInfo.email}</div>
                    ${clientInfo.company ? `<div class="value" style="font-weight:normal;">🏢 ${clientInfo.company}</div>` : ''}
                </div>

                ${clientInfo.description ? `
                <div class="field">
                    <div class="label">Project Description</div>
                    <div class="value">${clientInfo.description}</div>
                </div>
                ` : ''}

                <div class="field">
                    <div class="label">Project Details</div>
                    <div><span class="badge">${complexity.toUpperCase()} COMPLEXITY</span></div>
                    <div><span class="badge">${timeline.toUpperCase()} TIMELINE</span></div>
                    <div><span class="badge">${teamSize.toUpperCase().replace('_', ' ')} TEAM</span></div>
                </div>

                <div class="field">
                    <div class="label">Selected Services</div>
                    <ul style="margin:10px 0 0; padding-left:20px;">
                        ${services.map(service => `<li>${service}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    </body>
    </html>
    `
}

// POST handler for quote requests
export async function POST(request) {
    try {
        const quoteData = await request.json()

        // Validate required fields
        if (!quoteData.clientInfo?.name || !quoteData.clientInfo?.email) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Name and email are required'
                },
                { status: 400 }
            )
        }

        // Send email to client
        const clientEmail = await resend.emails.send({
            from: 'Algo X Quotes <quotes@yourdomain.com>', // Update with your domain
            to: [quoteData.clientInfo.email],
            subject: '🎯 Your Algo X Quote Request - Thank You!',
            html: getClientEmailHTML(quoteData)
        })

        // Send email to admin
        const adminEmail = await resend.emails.send({
            from: 'Algo X System <system@yourdomain.com>', // Update with your domain
            to: ['contact@algo-x.com', 'sales@algo-x.com'], // Add your admin emails
            subject: `🚀 New Quote Request from ${quoteData.clientInfo.name}`,
            html: getAdminEmailHTML({
                ...quoteData,
                timestamp: new Date().toISOString()
            })
        })

        // Log the quote request (you could also save to database)
        console.log('Quote request received:', {
            ...quoteData,
            timestamp: new Date().toISOString(),
            emailIds: {
                client: clientEmail.id,
                admin: adminEmail.id
            }
        })

        // Return success response
        return NextResponse.json({
            success: true,
            message: 'Quote request sent successfully',
            data: {
                estimatedPrice: quoteData.estimatedPrice,
                emailId: clientEmail.id
            }
        }, { status: 200 })

    } catch (error) {
        console.error('Quote request error:', error)

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to send quote request. Please try again.'
            },
            { status: 500 }
        )
    }
}

// GET handler to fetch quotes (optional - for admin dashboard)
export async function GET(request) {
    try {
        // You would typically fetch from a database here
        // This is a placeholder
        return NextResponse.json({
            success: true,
            message: 'Quotes endpoint ready',
            data: []
        })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch quotes' },
            { status: 500 }
        )
    }
}