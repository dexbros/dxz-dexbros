/** @format */

const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-social-app",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "post-metadata-updates" });

const startProducer = async (postUpdates) => {
  await producer.connect();

  // Batch the updates into a single message
  const messageValue = Buffer.from(JSON.stringify(postUpdates));

  await producer.send({
    topic: "post-updates",
    messages: [{ value: messageValue }],
  });

  await producer.disconnect();
};

let updatesBatch = [];
let batchTimer = null;

function addToBatch(update) {
  updatesBatch.push(update);

  // If this is the first update in the batch, start the timer
  if (updatesBatch.length === 1) {
    batchTimer = setTimeout(sendBatch, 10000); // Send the batch every 10 seconds
  }
}

async function sendBatch() {
  if (updatesBatch.length > 0) {
    await startProducer(updatesBatch);
    updatesBatch = []; // Clear the batch
  }

  // Stop the timer until the next batch starts
  clearTimeout(batchTimer);
  batchTimer = null;
}

async function likePost(postId, userId) {
  // Update the post in the database
  const post = await updatePostInDatabase(postId, userId);

  // Now create an update message for this post
  const postUpdate = {
    postId: post.id,
    likes: post.likes,
    comments: post.comments,
  };

  // Add this update to the batch
  addToBatch(postUpdate);
}

// Replace this function with your actual implementation to update a post in the database
async function updatePostInDatabase(postId, userId) {
  // Simulate updating a post in the database and returning the updated post
  return {
    id: postId,
    likes: Math.floor(Math.random() * 100),
    comments: Math.floor(Math.random() * 50),
  };
}

// Simulate users liking a post
setInterval(() => {
  const postId = Math.floor(Math.random() * 3) + 1;
  const userId = Math.floor(Math.random() * 1000) + 1;
  //update to database function likePost
  likePost(postId, userId);
}, 1000);
