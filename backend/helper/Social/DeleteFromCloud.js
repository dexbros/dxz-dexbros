const { Storage } = require('@google-cloud/storage');

class Helper {
  constructor() {

  }
  async main(bucketName, filename) {
  
    // Imports the Google Cloud client library
  
    // Creates a client
    const storage = new Storage();
  
    async function deleteFile() {
      // Deletes the file from the bucket
      await storage.bucket(bucketName).file(filename).delete();
  
      console.log(`gs://${bucketName}/${filename} deleted.`);
    }
  
    deleteFile().catch(console.error);
    // [END storage_delete_file]
  }
}

module.exports = new Helper();
  