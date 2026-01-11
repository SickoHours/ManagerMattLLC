import { action } from "./_generated/server";
import { v } from "convex/values";

// Send contact form email via SendGrid
export const sendContactEmail = action({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    if (!sendgridApiKey) {
      console.error("SENDGRID_API_KEY not configured");
      return { success: false, error: "Email service not configured" };
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const toEmail = process.env.CONTACT_EMAIL || "hello@managermatt.com";

    // Build email HTML for internal notification
    const internalEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 32px;">
    <h1 style="font-size: 24px; font-weight: 600; margin: 0;">New Contact Form Submission</h1>
    <p style="color: #666; margin: 8px 0 0;">Manager Matt LLC Website</p>
  </div>

  <div style="background: #f8f8f8; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <p style="margin: 0 0 16px;"><strong>From:</strong> ${args.name}</p>
    <p style="margin: 0 0 16px;"><strong>Email:</strong> <a href="mailto:${args.email}">${args.email}</a></p>
    <p style="margin: 0 0 16px;"><strong>Subject:</strong> ${args.subject}</p>
  </div>

  <div style="background: #ffffff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <p style="margin: 0 0 8px; font-weight: 600;">Message:</p>
    <p style="margin: 0; white-space: pre-wrap;">${args.message}</p>
  </div>

  <div style="text-align: center;">
    <a href="mailto:${args.email}?subject=Re: ${encodeURIComponent(args.subject)}" style="display: inline-block; background: #1a1a1a; color: white; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 500;">
      Reply to ${args.name}
    </a>
  </div>

  <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;">

  <p style="color: #999; font-size: 12px; text-align: center;">
    This message was sent via the contact form on <a href="${appUrl}" style="color: #666;">managermatt.com</a>
  </p>
</body>
</html>
    `.trim();

    // Build confirmation email for the sender
    const confirmationEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 32px;">
    <h1 style="font-size: 24px; font-weight: 600; margin: 0;">Manager Matt LLC</h1>
    <p style="color: #666; margin: 8px 0 0;">We received your message</p>
  </div>

  <p>Hi ${args.name},</p>

  <p>Thank you for reaching out! We've received your message and will get back to you within one business day.</p>

  <div style="background: #f8f8f8; border-radius: 12px; padding: 24px; margin: 24px 0;">
    <p style="margin: 0 0 8px; font-weight: 600;">Your message:</p>
    <p style="margin: 0 0 16px; color: #666;"><strong>Subject:</strong> ${args.subject}</p>
    <p style="margin: 0; color: #666; white-space: pre-wrap;">${args.message}</p>
  </div>

  <p>In the meantime, you might want to:</p>
  <ul style="color: #666;">
    <li><a href="${appUrl}/estimate" style="color: #1a1a1a;">Get an instant project estimate</a></li>
    <li><a href="${appUrl}/work" style="color: #1a1a1a;">Check out our recent work</a></li>
    <li><a href="${appUrl}/process" style="color: #1a1a1a;">Learn about our process</a></li>
  </ul>

  <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;">

  <p style="color: #999; font-size: 12px; text-align: center;">
    Manager Matt LLC<br>
    <a href="${appUrl}" style="color: #666;">managermatt.com</a>
  </p>
</body>
</html>
    `.trim();

    try {
      // Send notification to team
      const notificationResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sendgridApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: toEmail }] }],
          from: {
            email: process.env.SENDGRID_FROM_EMAIL || "noreply@managermatt.com",
            name: "Manager Matt Website",
          },
          reply_to: {
            email: args.email,
            name: args.name,
          },
          subject: `[Contact] ${args.subject}`,
          content: [
            {
              type: "text/html",
              value: internalEmailHtml,
            },
          ],
        }),
      });

      if (!notificationResponse.ok) {
        const errorText = await notificationResponse.text();
        console.error("SendGrid notification error:", errorText);
        return { success: false, error: "Failed to send message" };
      }

      // Send confirmation to sender
      const confirmationResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sendgridApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: args.email }] }],
          from: {
            email: process.env.SENDGRID_FROM_EMAIL || "noreply@managermatt.com",
            name: "Manager Matt LLC",
          },
          subject: `We received your message: ${args.subject}`,
          content: [
            {
              type: "text/html",
              value: confirmationEmailHtml,
            },
          ],
        }),
      });

      if (!confirmationResponse.ok) {
        // Non-critical - notification was sent, just log the error
        console.error("SendGrid confirmation error:", await confirmationResponse.text());
      }

      return { success: true };
    } catch (error) {
      console.error("Contact email send error:", error);
      return { success: false, error: "Failed to send message" };
    }
  },
});
