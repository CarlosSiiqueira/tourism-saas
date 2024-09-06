import { Kafka } from 'kafkajs';
import { IEmail } from '../../app/interfaces/Helper';

const kafka = new Kafka({
  clientId: 'mail-service',
  brokers: ['kafka:9092'],
  connectionTimeout: 30000,
  requestTimeout: 60000,

})

const admin = kafka.admin()

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'mail-consumer-group' });

export const connectKafka = async () => {
  await producer.connect();
  await consumer.connect();
}

export const sendMailMessage = async (message: IEmail) => {
  await producer.send({
    topic: 'mail-queue',
    messages: [{ value: JSON.stringify(message) }],
  });
}

export const consumeMessages = async (callback: (message: any) => void) => {
  await consumer.subscribe({ topic: 'mail-queue', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const mailData = JSON.parse(message.value?.toString() || '{}');
      callback(mailData);
    },
  });
}

export const createTopic = async () => {

  try {
    await admin.createTopics({
      topics: [{
        topic: 'mail-queue',
        numPartitions: 3,
        replicationFactor: 1
      }]
    })

  } catch (error) {
    console.log(`error creating topic: `, error)
  }
}

export const listTopics = async (): Promise<string[]> => {

  try {
    const topics = await admin.listTopics();

    return topics
  } catch (error) {
    console.log(`error listing topics: `, error)
    return ['topic not found']
  }
}

export const createDefaultMailTopic = async (): Promise<string> => {

  await admin.connect()

  const topics = await listTopics()

  if (!topics.find((topic) => topic == 'mail-queue')) {
    await createTopic()
  }

  await admin.disconnect()

  return 'Topic created or already exists'
}
