import { consumeMessages } from '../../shared/kafka';
import { sendEmail } from './mail.service';

export const processMailQueue = async () => {
  await consumeMessages(async (message) => {
    const { to, subject, text } = message;
    console.log('Processing email: ', to);
    await sendEmail(to, subject, text);
  });
};
