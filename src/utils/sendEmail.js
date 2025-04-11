'use server';

import nodemailer from 'nodemailer';
import { Eta } from 'eta';
import path from 'path';

const eta = new Eta({
  views: path.join(process.cwd(), 'src', 'emails'),
});

export default async function sendEmail({
  to,
  subject,
  templateName,
  templateData,
}) {
  const html = eta.render(`${templateName}.eta`, templateData);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: '"DrGym" <support@drgym.com>',
    to,
    subject,
    html,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) return console.error(err);
    console.log('Message sent:', info.messageId);
  });
}
