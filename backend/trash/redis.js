const redis = require('redis');
const fetch = require("node-fetch");
const dotenv = require('dotenv').config();

let client = null;
let clientDefined = false;

const defineClient = () => {
    client = redis.createClient();

    client.connect();

    client.on("connect", () => {
        clientDefined = true;
        console.log("Redis connection successful...");
    })

    return client;
}

const getClient = () => {
    return client;
}


module.exports = {defineClient, getClient };
