import nodemailer from "nodemailer";

function createTransporter() {
  const host = process.env.EMAIL_HOST;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: process.env.EMAIL_SECURE === "true",
    auth: { user, pass },
  });
}

export async function sendVerificationCode(to: string, code: string): Promise<void> {
  const from = process.env.EMAIL_FROM || "Franquia Avalia <no-reply@franquiaavalia.com.br>";
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`[DEV] Verification code for ${to}: ${code}`);
    return;
  }

  await transporter.sendMail({
    from,
    to,
    subject: "Seu código de verificação — Franquia Avalia",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1B4D3E;">Código de verificação</h2>
        <p>Use o código abaixo para verificar seu cadastro no Franquia Avalia:</p>
        <div style="background: #F8F9FA; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1B4D3E;">${code}</span>
        </div>
        <p style="color: #6B7280; font-size: 14px;">O código expira em 10 minutos. Se você não solicitou este código, ignore este e-mail.</p>
      </div>
    `,
  });
}
