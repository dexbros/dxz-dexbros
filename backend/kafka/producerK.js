const { Kafka, Partitioners, CompressionTypes } = require('kafkajs');
//const Chance = require('chance');

//const chance = new Chance();

//'34.106.49.135:9092'

const kafka = new Kafka({
	clientId: 'my-producer',
	brokers: ['localhost:9092'],
});

const producer = kafka.producer({
	createPartitioner: Partitioners.LegacyPartitioner,
});

//const topic = 'aerospike';

// "KafkaJS v2.0.0 switched default partitioner. To retain the same partitioning behavior as in previous versions, create the producer with the option \"createPartitioner: Partitioners.LegacyPartitioner\"

const produceMessage = async (value, topic = 'aerospike') => {
	try {
		await producer.send({
			topic,
			compression: CompressionTypes.GZIP,
			messages: [{ value }],
		});
	} catch (err) {
		console.log(err);
	}
};

const run = async () => {
	// Producing
	await producer.connect();
	console.log('Kafka producer successfully connected................');
	//setInterval(produceMessage, 1000)
};

run().catch(err => {
	console.log(err);
	process.exit(1);
});

module.exports = produceMessage;