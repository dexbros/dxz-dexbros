//The require(‘mongoose’) call above returns a Singleton object. 
//It means that the first time you call require(‘mongoose’), it 
//is creating an instance of the Mongoose class and returning it. 
//On subsequent calls, it will return the same instance that was 
//created and returned to you the first time because of how module 
//import/export works in ES6.
const mongoose = require("mongoose");

class Database {

    constructor() {
        this.connect();
    }

    connect() {
        // mongodb+srv://anikesh:anikesh05@cluster0.sijte.mongodb.net/twitterDatabase?retryWrites=true&w=majority
        // 
        mongoose.connect("mongodb+srv://greymirror:greymirror@cluster0.8qzxljs.mongodb.net/?retryWrites=true&w=majority")
        .then(() => {
            console.log("Database connection successful...");
        })
        .catch((err) => {
            console.log("Database connection error " + err);
        })
    }
}

module.exports = new Database();