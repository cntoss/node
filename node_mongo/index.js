const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

const dboper = require('./operations');

MongoClient.connect(url, { useUnifiedTopology: true }).then((client) => {

    console.log('Connected correctly to server');
    const db = client.db(dbname);

    dboper.insertDocument(db, { "name": "Tucker", "description": "tHe muji umesh" }, "dishes")
        .then((result) => {
            console.log("inserted documnets \n");
            console.log(result.ops);

            return dboper.findDocument(db, 'dishes')
        })
        .then((result) => {
            console.log("found result \n", result);

            return dboper.updateDocument(db, { name: "Tucker" }, { description: "god is great" }, "dishes")
        })
        .then((result) => {
            console.log("updated documents \n", result.result);

            return dboper.findDocument(db, 'dishes')
        })
        .then((result) => {
            console.log("found result \n", result);

            return db.dropCollection('dishes')
        })
        .then((result) => {
            console.log("dropped collection", result);
            return client.close();
        }).catch((err) => console.log(err));
   
}).
catch((err) => console.log(err));