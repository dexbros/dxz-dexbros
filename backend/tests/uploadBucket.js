/** @format */

const { Storage } = require("@google-cloud/storage");
const fs = require("fs");

const storage = new Storage({
  keyFilename: "bucket-key.json",
});

const bucket = storage.bucket("nft_dexbros");
/* YOU CAN CREATE BUCKET PROGRAMMATICALLY*/
async function createBucket(bucketName) {
  const [bucket] = await storage.createBucket(bucketName);
  console.log(`Bucket ${bucket.name} was created.`);
}

// createBucket("nft_dexbros");

async function uploadImage(folder, filename) {
  const file = bucket.file(`${folder}/${filename}`);
  const buffer = await fs.promises.readFile(filename);

  await file
    .save(buffer, {
      metadata: {
        contentType: "image/jpg",
      },
    })
    .then(() => {
      console.log(`Bucket: ${JSON.stringify(file.metadata.bucket)}`);
      console.log(`Name: ${JSON.stringify(file.metadata.name)}`);

      console.log(
        "---------------------------------------------------------------------"
      );

      console.log(`Metadata: ${JSON.stringify(file.metadata)}`);
    })
    .catch((err) => {
      console.error(err);
    });
}

uploadImage("ab/posts", "pizza.png");

/**
 * @jayDev GET SIGNED URL

async function getSignedUrl(folder, filename) {
    const file = bucket.file(`${folder}/${filename}`);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-17-2025'
    });
    return url;
  }
  
  getSignedUrl("nftsProfiler", "gcb.jpg").then((url) => {
      console.log(`Signed URL: ${url}`);
    }).catch((err) => {
      console.error(err);
    });
  */
