// kafka/admin.js
import { admin } from './kafka';

const createTopic = async (topic) => {
  await admin.connect();
  await admin.createTopics({
    topics: [{ topic }]
  });
  await admin.disconnect();
};

export default createTopic;
