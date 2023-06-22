const redis = require('redis');
const Aerospike = require("aerospike");

let client = null;
let clientDefined = false;

//localhost:3010
//34.106.49.135:3010

const defineAerospikeClient = async () => {
    try{
        const defaults = {
            socketTimeout: 3000,
            totalTimeout: 6000,
            maxRetries: 10,
            compress:true,
        }
        
        const config = new Aerospike.Client({
            hosts: "localhost:3010",
            maxConnsPerNode: 1000,
            modlua:{
                userPath: './clientUdf',
                systemPath: "/opt/aerospike/usr/udf/",
            },
            policies:{
                read: new Aerospike.ReadPolicy({
                    socketTimeout: 20000,
                    totalTimeout: 60000,
                    maxRetries:2
                }),
        
                write: new Aerospike.WritePolicy({
                    socketTimeout: 20000,
                    totalTimeout: 60000,
                    maxRetries:1
                })
            }
        });
    
        var c = await config.connect();
        console.log("Aerospike connected....");
        client = c;
        clientDefined = true;
        
        return client;
    } catch(error){
        console.error('Errorx: %s [%i]', error.message, error.code);
        if (error.config) {
            error.config.close();
        }
        process.exit(1)
    }
}

const getAerospikeClient = async () => {
    if(clientDefined){
        return client;
    } else{
        try{
            var config = await defineAerospikeClient();
            return config;
        } catch(error){
            console.error('Errorx: %s [%i]', error.message, error.code);
            if (error.config) {
                error.config.close();
            }
            process.exit(1)
        }
    }
    
}


module.exports = {defineAerospikeClient,getAerospikeClient};
