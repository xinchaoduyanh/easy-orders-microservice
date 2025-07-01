const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'test-consumer',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'test-consumer-group' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'payment_results', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      });
    },
  });
};

run().catch(console.error);
