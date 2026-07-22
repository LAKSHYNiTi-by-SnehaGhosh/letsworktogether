import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Use verified domain or Resend onboarding email default
const defaultFrom = process.env.EMAIL_FROM || "Let's Work Together <onboarding@resend.dev>";

export interface SendTeamInvitationParams {
  to: string;
  organizationName: string;
  inviterName: string;
  roleName: string;
  inviteLink: string;
}

export interface SendProjectInvitationParams {
  to: string;
  projectName: string;
  inviterName: string;
  roleName: string;
  inviteLink: string;
  message?: string;
}

export async function sendTeamInvitationEmail({
  to,
  organizationName,
  inviterName,
  roleName,
  inviteLink,
}: SendTeamInvitationParams) {
  if (!to || !to.includes("@")) {
    return { success: false, error: "Invalid recipient email address." };
  }

  if (!resend) {
    console.error("[Email Delivery Error] RESEND_API_KEY environment variable is not configured.");
    return {
      success: false,
      error: "Email service is not configured (RESEND_API_KEY missing). Please contact system administrator.",
    };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>You've been invited to join ${organizationName}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0B0F17; color: #F3F4F6; margin: 0; padding: 40px 20px;">
        <div style="max-width: 560px; margin: 0 auto; background: #111827; border: 1px solid #1F2937; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; padding: 8px 16px; background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); border-radius: 8px; color: #FFFFFF; font-weight: bold; font-size: 16px;">
              Let's Work Together (LWT)
            </div>
          </div>

          <h2 style="color: #F9FAFB; font-size: 22px; font-weight: 700; text-align: center; margin-top: 0; margin-bottom: 12px;">
            Team Invitation
          </h2>

          <p style="color: #9CA3AF; font-size: 15px; line-height: 1.6; text-align: center; margin-bottom: 28px;">
            <strong style="color: #F3F4F6;">${inviterName}</strong> has invited you to join <strong style="color: #60A5FA;">${organizationName}</strong> as a <span style="background: rgba(59, 130, 246, 0.2); color: #93C5FD; padding: 2px 8px; border-radius: 4px; font-weight: 600;">${roleName}</span> on Let's Work Together.
          </p>

          <div style="text-align: center; margin-bottom: 32px;">
            <a href="${inviteLink}" style="display: inline-block; background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%); color: #FFFFFF; text-decoration: none; font-weight: 600; font-size: 15px; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);">
              Accept Invitation
            </a>
          </div>

          <p style="color: #6B7280; font-size: 13px; line-height: 1.5; text-align: center; margin-bottom: 24px;">
            Or copy and paste this secure link into your browser:<br>
            <a href="${inviteLink}" style="color: #60A5FA; word-break: break-all;">${inviteLink}</a>
          </p>

          <div style="border-top: 1px solid #1F2937; padding-top: 20px; text-align: center; font-size: 12px; color: #4B5563;">
            This invitation link is intended for ${to}. If you were not expecting this invitation, you can safely ignore this email.
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const res = await resend.emails.send({
      from: defaultFrom,
      to: [to],
      subject: `${inviterName} invited you to join ${organizationName} on Let's Work Together`,
      html: htmlContent,
    });

    if (res.error) {
      console.error("[Resend Error Response]:", res.error);
      return {
        success: false,
        error: `Email delivery failed: ${res.error.message || "Resend API error"}`,
      };
    }

    console.log("[Resend Email Delivered]:", res.data?.id);
    return { success: true, data: res.data };
  } catch (error: any) {
    console.error("[Resend Exception]:", error);
    return {
      success: false,
      error: `Email delivery failed: ${error.message || "Network error while connecting to email provider"}`,
    };
  }
}

export async function sendProjectInvitationEmail({
  to,
  projectName,
  inviterName,
  roleName,
  inviteLink,
  message,
}: SendProjectInvitationParams) {
  if (!to || !to.includes("@")) {
    return { success: false, error: "Invalid recipient email address." };
  }

  if (!resend) {
    console.error("[Email Delivery Error] RESEND_API_KEY environment variable is not configured.");
    return {
      success: false,
      error: "Email service is not configured (RESEND_API_KEY missing). Please contact system administrator.",
    };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>You've been invited to join project ${projectName}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0B0F17; color: #F3F4F6; margin: 0; padding: 40px 20px;">
        <div style="max-width: 560px; margin: 0 auto; background: #111827; border: 1px solid #1F2937; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; padding: 8px 16px; background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); border-radius: 8px; color: #FFFFFF; font-weight: bold; font-size: 16px;">
              Let's Work Together (LWT)
            </div>
          </div>

          <h2 style="color: #F9FAFB; font-size: 22px; font-weight: 700; text-align: center; margin-top: 0; margin-bottom: 12px;">
            Project Invitation
          </h2>

          <p style="color: #9CA3AF; font-size: 15px; line-height: 1.6; text-align: center; margin-bottom: 20px;">
            <strong style="color: #F3F4F6;">${inviterName}</strong> has invited you to collaborate on the project <strong style="color: #60A5FA;">${projectName}</strong> as a <span style="background: rgba(59, 130, 246, 0.2); color: #93C5FD; padding: 2px 8px; border-radius: 4px; font-weight: 600;">${roleName}</span>.
          </p>

          ${
            message
              ? `<div style="background: #1F2937; border-left: 4px solid #3B82F6; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px; color: #D1D5DB; font-style: italic; font-size: 14px;">"${message}"</div>`
              : ""
          }

          <div style="text-align: center; margin-bottom: 32px;">
            <a href="${inviteLink}" style="display: inline-block; background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%); color: #FFFFFF; text-decoration: none; font-weight: 600; font-size: 15px; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);">
              Accept Project Invitation
            </a>
          </div>

          <p style="color: #6B7280; font-size: 13px; line-height: 1.5; text-align: center; margin-bottom: 24px;">
            Or copy and paste this secure link into your browser:<br>
            <a href="${inviteLink}" style="color: #60A5FA; word-break: break-all;">${inviteLink}</a>
          </p>

          <div style="border-top: 1px solid #1F2937; padding-top: 20px; text-align: center; font-size: 12px; color: #4B5563;">
            This project invitation is intended for ${to}. If you were not expecting this, you can safely ignore this email.
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const res = await resend.emails.send({
      from: defaultFrom,
      to: [to],
      subject: `${inviterName} invited you to join project "${projectName}" on Let's Work Together`,
      html: htmlContent,
    });

    if (res.error) {
      console.error("[Resend Project Email Error]:", res.error);
      return {
        success: false,
        error: `Email delivery failed: ${res.error.message || "Resend API error"}`,
      };
    }

    console.log("[Resend Project Email Delivered]:", res.data?.id);
    return { success: true, data: res.data };
  } catch (error: any) {
    console.error("[Resend Project Email Exception]:", error);
    return {
      success: false,
      error: `Email delivery failed: ${error.message || "Network error while connecting to email provider"}`,
    };
  }
}
