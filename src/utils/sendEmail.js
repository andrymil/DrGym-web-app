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
  const html = eta.render(`${templateName}.eta`, templateData);
  const text = eta.render(`${templateName}.txt.eta`, templateData);

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

// 'use server';

// import nodemailer from 'nodemailer';
// import { Eta } from 'eta';
// import path from 'path';

// const eta = new Eta({
//   views: path.join(process.cwd(), 'src', 'emails'),
// });

// export default async function sendEmail({ to, templateName, templateData }) {
//   const html = eta.render(`${templateName}.eta`, templateData);
//   const text = eta.render(`${templateName}.txt.eta`, templateData);

//   const transporter = nodemailer.createTransport({
//     host: testAccount.smtp.host,
//     port: testAccount.smtp.port,
//     secure: testAccount.smtp.secure,
//     auth: {
//       user: testAccount.user,
//       pass: testAccount.pass,
//     },
//   });

//   const mailOptions = {
//     from: '"DrGym" <support@drgym.com>',
//     to,
//     subject: templateData.subject,
//     html,
//     text,
//   };

//   transporter.sendMail(mailOptions, (err, info) => {
//     if (err) return console.error(err);
//     console.log('Message sent:', info.messageId);
//   });
// }
