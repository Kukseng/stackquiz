import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, message } = await request.json();

    // Validate input
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Get current time
    const now = new Date();
    const formattedTime = now.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    // Email HTML template
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4; padding: 40px 0;">
        <tr>
            <td align="center">
                <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                                📩 New Contact Form Submission
                            </h1>
                            <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">
                                You have received a new message from your website
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 40px 30px;">
                            
                            <p style="margin: 0 0 20px 0; color: #2c3e50; font-size: 16px; line-height: 1.6;">
                                Hello,
                            </p>
                            <p style="margin: 0 0 30px 0; color: #555555; font-size: 15px; line-height: 1.6;">
                                A new message has been received through your contact form. Please find the details below:
                            </p>

                            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8f9fa; border-radius: 8px; overflow: hidden; margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 25px;">
                                        
                                        <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                                            <tr>
                                                <td style="vertical-align: top; width: 60px;">
                                                    <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                                                        👤
                                                    </div>
                                                </td>
                                                <td style="vertical-align: top; padding-left: 15px;">
                                                    <div style="margin-bottom: 5px;">
                                                        <strong style="color: #2c3e50; font-size: 18px; font-weight: 600;">${firstName} ${lastName}</strong>
                                                    </div>
                                                    <div style="color: #7f8c8d; font-size: 14px; margin-bottom: 3px;">
                                                        📧 ${email}
                                                    </div>
                                                    <div style="color: #95a5a6; font-size: 13px;">
                                                        🕐 ${formattedTime}
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>

                                        <div style="height: 1px; background: linear-gradient(to right, transparent, #ddd, transparent); margin: 20px 0;"></div>

                                        <div style="margin-top: 20px;">
                                            <div style="color: #7f8c8d; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; font-weight: 600;">
                                                Message
                                            </div>
                                            <div style="color: #2c3e50; font-size: 15px; line-height: 1.7; padding: 15px; background-color: #ffffff; border-left: 4px solid #667eea; border-radius: 4px;">
                                                ${message.replace(/\n/g, '<br>')}
                                            </div>
                                        </div>

                                    </td>
                                </tr>
                            </table>

                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                                <tr>
                                    <td align="center">
                                        <a href="mailto:${email}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 600; box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);">
                                            Reply to ${firstName} ${lastName}
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 6px; margin-top: 25px;">
                                <tr>
                                    <td style="padding: 15px;">
                                        <div style="color: #856404; font-size: 13px; line-height: 1.5;">
                                            <strong>💡 Quick Tip:</strong> We recommend responding within 24 hours to maintain excellent customer service.
                                        </div>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0 0 10px 0; color: #6c757d; font-size: 13px;">
                                This email was sent from your website contact form
                            </p>
                            <p style="margin: 0; color: #adb5bd; font-size: 12px;">
                                © 2025 StackQuiz. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

    // Send email
    await transporter.sendMail({
      from: `"StackQuiz Contact Form" <${process.env.EMAIL_USER}>`,
      to: 'rothamom22@gmail.com',
      subject: `New Contact from ${firstName} ${lastName}`,
      text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nTime: ${formattedTime}\n\nMessage:\n${message}`,
      html: htmlTemplate,
      replyTo: email,
    });

    return NextResponse.json(
      { success: true, message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}