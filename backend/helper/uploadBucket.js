/** @format */

const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");
const fs = require("fs");
const storage = new Storage({
  keyFilename: "bucket-key.json",
});

const bucket = storage.bucket("nft_dexbros");

// const storage = new Storage({
//   projectId: "quiztasy",
//   credentials: {
//     client_email: "dexbros-upload@quiztasy.iam.gserviceaccount.com",
//     private_key:
//       "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCxtcYo4lgaK7gh\nV1z3UFRkV2HT28rUjuFKrQrfjEEKkzgZWgwu8V6SzPXPYmGWAFpLtYqgUP28QXoq\nXWCWLYlMcQA2OalnjNiilRy8Yq2Yjj75LPy2rKT8W14Cyr07inZxEWsrs5rS3Ycp\nw3nZnub5dxPXqewrjHPQUx0a5a6UiBDD7YdE1fHAniaxZz18yy9f6nOVWac0m5P2\ntHNgrB+CalwQIf51TCvJrfsPw0hFHHYlTWhA8ATZfPJxAXNLklo/roFr/LmfUnq0\nl1nFPQqTMj5jCOQ8DO5j0zFJvgZ/d0ePN0IOyUxhVH9Qq9oQRh7YqdDcr27Vos4H\nmXkoA36JAgMBAAECggEARyDBUqXdq4PqK/YisJ5HWO4cqsZjNZaGl/QQ0Q77DXeF\nUahYDgXv24QLstjmxDoZ6gmclbQ1Cr+OXRyIxzMsrBrigdGse1TFdLWIDeLVJqVw\nkR0vfRI26wbK5wUsnoM6CuF06sX1ZwbhzZZ+09qlCh5eI8jQTVHnHO/XS2e465uq\nIxMWwGBEy5ZVksWV+/OA+YvQMSMxar0AMvCTf2McoUGw/flxXrg4gnl/brI7p4El\nokYb6MVI38VvlQ87MshosDA4bxSj0IyHXzXHC3vJ4E1Ph1CjbHjtV4YVlLy0qH3K\n41UOEa5OPNSG5rvPAz/oQDjyFw2nuDVGpKRlqGteTQKBgQDy3xvXN7jyVr74r42V\n8H2BtyachzYtESrpLnoM4bHEZ3hzjnGrLSQUMFBleajcs+yCqcvzruW7mG5SNYNU\na7NrzncnGC1SOX5ej4oOOW8/K/cYbpqDP6f3NkKh7Xkb+xcbwuPvB+Sbl1sUNRfB\nyY5iVjr3x7GBo0g62AN52/+bvwKBgQC7UPOX/VoAmIpKXfzR9RX43/JsqIJ9WZdY\nK0ToMwskV2bN71T2u0D0/ryh6R7MeyIF5PgAZSyTFXLrlwm/GFzBXgew/4Hiud0g\n4W/h7UXpCDOWGq/Cik2VbshsCvDiJr05Q9SYEVyOj6702ZkEHNc5p1Jgao4xYKSV\nD3yZqfMXtwKBgAvG+eij0RofTr9sc+czdEKYCQ1KGTxyOqx4Dn8VarNleRfRbn2o\ngLlh5mQlVCTvrKZhaXx1nLpOF/twkN/FITw3FNwWdgwosZIQT9eEvXpIvYC3zFJV\nAeYhAXYst9S9hk9YUglDTrikzEvcjzxcc8Uc/VsKmfb5XgVMeE6udmStAoGAe+4z\nPHwC8CH8XPeSLddZki+Y1QsoSobb+xmlnXsoBANPoTCXpiZ985oWc4kpN2DAQeYb\nrydBNo8aWYS0jhowRD9SF2j1JmySQQ7mVzQE7QjgGI/PeYbHjfad493ZQccfqqOW\nJIZYFno55wWQl4f9Xce2WNQm/8RRH83/QiuPCkECgYEAz9WgZuz9tOF2Nl3qkW4I\naW7ViTE8XiFHMFZIh5LXyER98YUxVVRdNBOJtvlop6KXAIN9g8VzrOHvT34jd057\nEwAO4HDmE71PsdqrwgMCJEYGHhkv/ZXU2Hey0bqV0/ajvkcVN5mHm81j68fdqzB0\niBUDWp6KQ0+9BYstzxlNdbw=\n-----END PRIVATE KEY-----\n",
//   },
// });
// const multer = Multer({
//   storage: Multer.memoryStorage(),
//   limits: {
//     fileSize: 75 * 1024 * 1024,
//   },
// });
// const bucket = storage.bucket("dexbros_files");

class UploadBucket {
  constructor() {}

  // *** Upload images in bucket
  // upload image function

  async uploadImage(file) {
    // console.log(`${folder}/${filename}`);

    /******
     *
     */
    const newImageName = "-" + file.originalname;
    console.log("New image name: ", newImageName);
    const blob = bucket.file(newImageName);
    console.log("Blob name: ", blob.name);
    const blobStream = blob.createWriteStream();

    blobStream.on("error", (err) => {
      console.log(err);
      //   throw createError.BadRequest(err.message);
    });

    blobStream.on("finish", async () => {
      console.log("Finish");
    });

    blobStream.end(file.buffer);
  }
}

module.exports = new UploadBucket();

// uploadImage("ab/posts", "pizza.png");
