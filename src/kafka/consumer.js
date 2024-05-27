// kafka/consumer.js
import { consumer } from './kafka';

const runConsumer = async (topic) => {
  await consumer.connect();
  await consumer.subscribe({ topics: [topic], fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic,
        partition,
        message: message.value.toString()
      });
    }
  });
};

export default runConsumer;