// lib/emailTemplates.ts
export const ForgotPasswordEmail = (name: string, url: string) => `
  <div style="background-color: #f4f4f7; padding: 20px; font-family: Arial, sans-serif;">
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);"
    >
      <tr>
        <td style="background-color: #2ecc71; padding: 30px 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">
            PixelIDE
          </h1>
        </td>
      </tr>
      <tr>
        <td style="padding: 30px 40px; color: #333333;">
          <h2 style="font-size: 22px; margin-bottom: 20px;">Hi ${name},</h2>
          <p style="font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
            We received a request to reset your password. Click the button below to set a new password.
            If you didn’t request this, you can safely ignore this email.
          </p>
          <div style="text-align: center; margin: 40px 0;">
            <a href="${url}" target="_blank" rel="noopener noreferrer"
              style="background-color: #2ecc71; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="font-size: 14px; color: #666666; line-height: 1.5;">
            If you're having trouble clicking the button, copy and paste this URL into your browser:
          </p>
          <p style="word-break: break-all; font-size: 14px; color: #2ecc71;">
            <a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #2ecc71;">${url}</a>
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px 40px; text-align: center; font-size: 12px; color: #888888; background-color: #f9fafb;">
          &copy; ${new Date().getFullYear()} PixelIDE. All rights reserved.
        </td>
      </tr>
    </table>
  </div>
`;
