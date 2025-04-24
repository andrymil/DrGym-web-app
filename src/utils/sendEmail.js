'use server';

import nodemailer from 'nodemailer';
import { Eta } from 'eta';
import path from 'path';
import open from 'open';

const eta = new Eta({
  views: path.join(process.cwd(), 'src', 'emails'),
});

const testAccount = await nodemailer.createTestAccount();

export default async function sendEmail({ to, templateName, templateData }) {
  const body = eta.render(`${templateName}/template.eta`, templateData);
  const html = eta.render('layouts/base.eta', { ...templateData, body });
  const textBody = eta.render(`${templateName}/template.txt.eta`, templateData);
  const text = eta.render('layouts/base.txt.eta', {
    ...templateData,
    body: textBody,
  });

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

  const info = await transporter.sendMail(mailOptions);

  console.log('Message sent:', info.messageId);

  const previewUrl = nodemailer.getTestMessageUrl(info);
  console.log('Preview URL: ' + previewUrl);
  if (previewUrl) {
    await open(previewUrl);
  }
}

//   const transporter = nodemailer.createTransport({
//     host: testAccount.smtp.host,
//     port: testAccount.smtp.port,
//     secure: testAccount.smtp.secure,
//     auth: {
//       user: testAccount.user,
//       pass: testAccount.pass,
//     },
//   });
