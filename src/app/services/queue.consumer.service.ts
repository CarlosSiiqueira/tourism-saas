import { consumeMessages } from '../../shared/kafka';
import { EmailService } from './mail.service';

export const processMailQueue = async () => {

  let mailService: EmailService = new EmailService()

  await consumeMessages(async (message) => {
    const { to, subject, text } = message;
    console.log('Processing email: ', to);
    await mailService.sendEmail(to, subject, text, 3);
  });
};
