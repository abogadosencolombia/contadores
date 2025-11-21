import nodemailer from 'nodemailer';

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

// Configuración del transportador SMTP para Hostinger (o cualquier SMTP seguro)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true, // true para puerto 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Envía un correo electrónico utilizando la configuración SMTP definida.
 */
export const sendEmail = async ({ to, subject, html }: EmailPayload) => {
  try {
    const from = process.env.SMTP_FROM || '"Notificaciones" <no-reply@tudominio.com>';
    
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    console.log('Email enviado: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error al enviar email:', error);
    throw error;
  }
};
