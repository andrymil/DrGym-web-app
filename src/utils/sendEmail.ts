'use server';

import nodemailer, { TestAccount } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Eta } from 'eta';
import path from 'path';
import open from 'open';

interface EmailTemplateData {
  subject?: string;
  [key: string]: unknown;
}

interface SendEmailArgs {
  to: string;
  templateName: string;
  templateData: EmailTemplateData;
}

const eta = new Eta({
  views: path.join(process.cwd(), 'src', 'emails'),
});

const testAccount: TestAccount = await nodemailer.createTestAccount();

export default async function sendEmail({
  to,
  templateName,
  templateData,
}: SendEmailArgs): Promise<void> {
  const body = eta.render(`${templateName}/template.eta`, templateData) ?? '';
  const html = eta.render('layouts/base.eta', { ...templateData, body }) ?? '';
  const textBody =
    eta.render(`${templateName}/template.txt.eta`, templateData) ?? '';
  const text =
    eta.render('layouts/base.txt.eta', {
      ...templateData,
      body: textBody,
    }) ?? '';

  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const mailOptions = {
    from: '"DrGym" <support@drgym.com>',
    to,
    subject: templateData.subject,
    html,
    text,
  };

  const info: SMTPTransport.SentMessageInfo =
    await transporter.sendMail(mailOptions);

  console.log('Message sent:', info.messageId);

  const previewUrl = nodemailer.getTestMessageUrl(info);
  console.log('Preview URL: ' + previewUrl);
  if (previewUrl) {
    await open(previewUrl);
  }
}
