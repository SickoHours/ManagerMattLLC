import { mutation, query, action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// Generate a short unique ID for sharing
function generateShareId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Create a quote from an estimate
export const create = mutation({
  args: {
    estimateId: v.id("estimates"),
    email: v.string(),
    assumptionsConfirmed: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Get the estimate
    const estimate = await ctx.db.get(args.estimateId);
    if (!estimate) {
      throw new Error("Estimate not found");
    }

    // Create snapshot of estimate
    const snapshot = {
      platform: estimate.platform,
      authLevel: estimate.authLevel,
      modules: estimate.modules,
      quality: estimate.quality,
      priceMin: estimate.priceMin,
      priceMax: estimate.priceMax,
      priceMid: estimate.priceMid,
      confidence: estimate.confidence,
      hoursMin: estimate.hoursMin,
      hoursMax: estimate.hoursMax,
      daysMin: estimate.daysMin,
      daysMax: estimate.daysMax,
      // Token-based pricing
      tokensIn: estimate.tokensIn,
      tokensOut: estimate.tokensOut,
      materialsCost: estimate.materialsCost,
      laborCost: estimate.laborCost,
      riskBuffer: estimate.riskBuffer,
      // Degraded mode
      degradedMode: estimate.degradedMode,
      degradedReason: estimate.degradedReason,
      // Architect review
      needsReview: estimate.needsReview,
      reviewTriggerModules: estimate.reviewTriggerModules,
      costDrivers: estimate.costDrivers,
      assumptions: estimate.assumptions,
    };

    // Generate share ID
    const shareId = generateShareId();

    // Create quote
    const quoteId = await ctx.db.insert("quotes", {
      estimateId: args.estimateId,
      email: args.email,
      snapshot,
      shareId,
      status: "sent",
      assumptionsConfirmed: args.assumptionsConfirmed,
      createdAt: Date.now(),
    });

    // Update estimate status
    await ctx.db.patch(args.estimateId, { status: "quoted" });

    return { quoteId, shareId };
  },
});

// Get quote by share ID (public)
export const getByShareId = query({
  args: { shareId: v.string() },
  handler: async (ctx, args) => {
    const quotes = await ctx.db
      .query("quotes")
      .withIndex("by_shareId", (q) => q.eq("shareId", args.shareId))
      .collect();

    if (quotes.length === 0) {
      return null;
    }

    const quote = quotes[0];

    // Get module details
    const moduleCatalog = await ctx.db.query("moduleCatalog").collect();
    const moduleMap = new Map(moduleCatalog.map((m) => [m.moduleId, m]));

    const moduleDetails = quote.snapshot.modules
      .map((id) => moduleMap.get(id))
      .filter(Boolean)
      .map((m) => ({
        id: m!.moduleId,
        name: m!.name,
        category: m!.category,
      }));

    return {
      ...quote,
      moduleDetails,
    };
  },
});

// Mark quote as viewed
export const markViewed = mutation({
  args: { shareId: v.string() },
  handler: async (ctx, args) => {
    const quotes = await ctx.db
      .query("quotes")
      .withIndex("by_shareId", (q) => q.eq("shareId", args.shareId))
      .collect();

    if (quotes.length === 0) {
      return { success: false };
    }

    const quote = quotes[0];

    // Only update if not already viewed
    if (quote.status === "sent") {
      await ctx.db.patch(quote._id, {
        status: "viewed",
        viewedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// Internal function to format price
function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Send quote email via SendGrid
export const sendEmail = action({
  args: {
    quoteId: v.id("quotes"),
    email: v.string(),
    shareId: v.string(),
    priceMin: v.number(),
    priceMax: v.number(),
    confidence: v.number(),
  },
  handler: async (ctx, args) => {
    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    if (!sendgridApiKey) {
      console.error("SENDGRID_API_KEY not configured");
      return { success: false, error: "Email service not configured" };
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const quoteUrl = `${appUrl}/q/${args.shareId}`;

    // Build email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 32px;">
    <h1 style="font-size: 24px; font-weight: 600; margin: 0;">Manager Matt LLC</h1>
    <p style="color: #666; margin: 8px 0 0;">Your Project Estimate</p>
  </div>

  <div style="background: #f8f8f8; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <p style="text-align: center; color: #666; margin: 0 0 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Estimated Cost Range</p>
    <p style="text-align: center; font-size: 32px; font-weight: 600; margin: 0;">
      ${formatPrice(args.priceMin)} - ${formatPrice(args.priceMax)}
    </p>
    <p style="text-align: center; color: #666; margin: 8px 0 0;">
      Confidence: ${args.confidence}%
    </p>
  </div>

  <p style="margin-bottom: 24px;">
    Thank you for using our estimate tool! Your detailed project quote is ready for review.
  </p>

  <div style="text-align: center; margin-bottom: 32px;">
    <a href="${quoteUrl}" style="display: inline-block; background: #1a1a1a; color: white; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 500;">
      View Full Quote
    </a>
  </div>

  <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;">

  <p style="color: #666; font-size: 14px; margin-bottom: 16px;">
    <strong>What's next?</strong>
  </p>
  <ul style="color: #666; font-size: 14px; padding-left: 20px;">
    <li>Review the detailed breakdown and assumptions</li>
    <li>Schedule a discovery call to refine the scope</li>
    <li>Get a finalized quote with fixed pricing</li>
  </ul>

  <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;">

  <p style="color: #999; font-size: 12px; text-align: center;">
    This estimate was generated by Manager Matt LLC's AI-powered estimation tool.<br>
    Questions? Reply to this email or visit <a href="${appUrl}" style="color: #666;">managermatt.com</a>
  </p>
</body>
</html>
    `.trim();

    // Send via SendGrid
    try {
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
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
          subject: `Your Project Estimate: ${formatPrice(args.priceMin)} - ${formatPrice(args.priceMax)}`,
          content: [
            {
              type: "text/html",
              value: emailHtml,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("SendGrid error:", errorText);
        return { success: false, error: "Failed to send email" };
      }

      return { success: true };
    } catch (error) {
      console.error("Email send error:", error);
      return { success: false, error: "Failed to send email" };
    }
  },
});

// Combined mutation to create quote and send email
export const createAndSend = mutation({
  args: {
    estimateId: v.id("estimates"),
    email: v.string(),
    assumptionsConfirmed: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Get the estimate
    const estimate = await ctx.db.get(args.estimateId);
    if (!estimate) {
      throw new Error("Estimate not found");
    }

    // Idempotency check: if estimate already quoted, return existing quote
    if (estimate.status === "quoted") {
      const existingQuotes = await ctx.db
        .query("quotes")
        .filter((q) => q.eq(q.field("estimateId"), args.estimateId))
        .collect();

      if (existingQuotes.length > 0) {
        const existing = existingQuotes[0];
        return { quoteId: existing._id, shareId: existing.shareId };
      }
    }

    // Create snapshot of estimate
    const snapshot = {
      platform: estimate.platform,
      authLevel: estimate.authLevel,
      modules: estimate.modules,
      quality: estimate.quality,
      priceMin: estimate.priceMin,
      priceMax: estimate.priceMax,
      priceMid: estimate.priceMid,
      confidence: estimate.confidence,
      hoursMin: estimate.hoursMin,
      hoursMax: estimate.hoursMax,
      daysMin: estimate.daysMin,
      daysMax: estimate.daysMax,
      // Token-based pricing
      tokensIn: estimate.tokensIn,
      tokensOut: estimate.tokensOut,
      materialsCost: estimate.materialsCost,
      laborCost: estimate.laborCost,
      riskBuffer: estimate.riskBuffer,
      // Degraded mode
      degradedMode: estimate.degradedMode,
      degradedReason: estimate.degradedReason,
      // Architect review
      needsReview: estimate.needsReview,
      reviewTriggerModules: estimate.reviewTriggerModules,
      costDrivers: estimate.costDrivers,
      assumptions: estimate.assumptions,
    };

    // Generate share ID
    const shareId = generateShareId();

    // Create quote
    const quoteId = await ctx.db.insert("quotes", {
      estimateId: args.estimateId,
      email: args.email,
      snapshot,
      shareId,
      status: "sent",
      assumptionsConfirmed: args.assumptionsConfirmed,
      createdAt: Date.now(),
    });

    // Update estimate status
    await ctx.db.patch(args.estimateId, { status: "quoted" });

    // Schedule email sending
    await ctx.scheduler.runAfter(0, internal.quotes.sendEmailInternal, {
      quoteId,
      email: args.email,
      shareId,
      priceMin: estimate.priceMin,
      priceMax: estimate.priceMax,
      confidence: estimate.confidence,
    });

    return { quoteId, shareId };
  },
});

// Internal action for sending email (called by scheduler)
export const sendEmailInternal = internalAction({
  args: {
    quoteId: v.id("quotes"),
    email: v.string(),
    shareId: v.string(),
    priceMin: v.number(),
    priceMax: v.number(),
    confidence: v.number(),
  },
  handler: async (ctx, args) => {
    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    if (!sendgridApiKey) {
      console.error("SENDGRID_API_KEY not configured");
      return { success: false, error: "Email service not configured" };
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const quoteUrl = `${appUrl}/q/${args.shareId}`;

    // Build email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 32px;">
    <h1 style="font-size: 24px; font-weight: 600; margin: 0;">Manager Matt LLC</h1>
    <p style="color: #666; margin: 8px 0 0;">Your Project Estimate</p>
  </div>

  <div style="background: #f8f8f8; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <p style="text-align: center; color: #666; margin: 0 0 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Estimated Cost Range</p>
    <p style="text-align: center; font-size: 32px; font-weight: 600; margin: 0;">
      ${formatPrice(args.priceMin)} - ${formatPrice(args.priceMax)}
    </p>
    <p style="text-align: center; color: #666; margin: 8px 0 0;">
      Confidence: ${args.confidence}%
    </p>
  </div>

  <p style="margin-bottom: 24px;">
    Thank you for using our estimate tool! Your detailed project quote is ready for review.
  </p>

  <div style="text-align: center; margin-bottom: 32px;">
    <a href="${quoteUrl}" style="display: inline-block; background: #1a1a1a; color: white; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 500;">
      View Full Quote
    </a>
  </div>

  <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;">

  <p style="color: #666; font-size: 14px; margin-bottom: 16px;">
    <strong>What's next?</strong>
  </p>
  <ul style="color: #666; font-size: 14px; padding-left: 20px;">
    <li>Review the detailed breakdown and assumptions</li>
    <li>Schedule a discovery call to refine the scope</li>
    <li>Get a finalized quote with fixed pricing</li>
  </ul>

  <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;">

  <p style="color: #999; font-size: 12px; text-align: center;">
    This estimate was generated by Manager Matt LLC's AI-powered estimation tool.<br>
    Questions? Reply to this email or visit <a href="${appUrl}" style="color: #666;">managermatt.com</a>
  </p>
</body>
</html>
    `.trim();

    // Send via SendGrid
    try {
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
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
          subject: `Your Project Estimate: ${formatPrice(args.priceMin)} - ${formatPrice(args.priceMax)}`,
          content: [
            {
              type: "text/html",
              value: emailHtml,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("SendGrid error:", errorText);
        return { success: false, error: "Failed to send email" };
      }

      return { success: true };
    } catch (error) {
      console.error("Email send error:", error);
      return { success: false, error: "Failed to send email" };
    }
  },
});
