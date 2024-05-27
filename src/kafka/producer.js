// kafka/producer.js
import { producer } from './kafka';

export const produceMessage = async (topic, message) => {
  await producer.connect();
  await producer.send({
    topic,
    messages: [{ value: message }]
  });
  await producer.disconnect();
};
