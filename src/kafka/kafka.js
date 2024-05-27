// utils/kafka.js
import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'] // Replace with your Kafka broker address
});

export const admin = kafka.admin();
export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'test-group' });
