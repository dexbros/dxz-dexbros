const { Kafka } = require("kafkajs");
const Chance = require("chance");
const fetch = require("node-fetch");
const { getAerospikeClient } = require("../aerospike");
const Aerospike = require("aerospike");
// const conn = require('./mysql.js');
const dotenv = require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const chance = new Chance();
const producer = require("./producerK");
// const kafkaConsumer = require("./consumer");
const kafkaConsumer = require("./kafka/consumerK")
// const { connectSocket } = require("./Socket.js");
//const server = require("../app.js");

// const kafka = new Kafka({
//   clientId: 'my-consumer',
//   brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094']
// })

//'34.106.49.135:9092'

const kafka = new Kafka({
  clientId: "my-consumer",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: chance.character() });
//const topic = 'newSlips';

// "KafkaJS v2.0.0 switched default partitioner. To retain the same partitioning behavior as in previous versions, create the producer with the option \"createPartitioner: Partitioners.LegacyPartitioner\"

const run = async () => {
  const aeroClient = await getAerospikeClient();

  // Producing
  await consumer.connect();
  console.log("Consumer connected successfully...........");
  await consumer.subscribe({
    topics: [
      "posts_room"
    ],
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (topic === 'posts_room') {
        var data = JSON.parse(message.value.toString());
        console.log("*** Consumer ***");
        console.log(data)
      }
    },
  });
};


run();


