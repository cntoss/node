const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

const dboper = require('./operations');

MongoClient.connect(url, (err, client) => {

    assert.equal(err, null);

    console.log('Connected correctly to server');

    const db = client.db(dbname);

    dboper.insertDocument(db, { "name": "Tucker", "description": "tHe muji umesh" }, "dishes", (result) => {
        console.log("inserted documnets \n");
        console.log(result.ops);

        dboper.findDocument(db, 'dishes', (result) => {
            console.log("found result \n", result);
           
            dboper.updateDocument(db, { name: "Tucker" }, { description: "god is great" }, "dishes", (result) => {
                console.log("updated documents \n", result.result);
             
                dboper.findDocument(db, 'dishes', (result) => {
                    console.log("found result \n", result);
               
                    db.dropCollection('dishes', (err, result) => {
                        console.log("dropped collection", result);
                    });
                });
            })
        });
    });
});