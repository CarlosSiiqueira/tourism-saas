import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 587,
  secure: false,
  auth: {
    user: '5bf966ea7b84da',
    pass: '28766bb5c3ccbe',
  },
});

export const sendEmail = async (to: string, subject: string, text: string, retries = 3) => {
  try {
    const info = await transporter.sendMail({
      from: 'carlooos.siqueira@gmail.com',
      to,
      subject,
      text,
    });

    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);

    if (retries > 0) {
      console.log(`Retrying... attempts left: ${retries}`);
      await sendEmail(to, subject, text, retries - 1);  
    } else {
      console.log('All retry attempts failed.');
    }
  }
}
