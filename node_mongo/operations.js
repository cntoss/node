const assert = require("assert");

exports.insertDocument = (db, document, collection, callback) => {
    const call = db.collection(collection);
    return call.insertOne(document);
};

exports.findDocument = (db, collection, callback) => {
    const call = db.collection(collection);
    return call.find({}).toArray();
};

exports.removeDocument = (db, document, collection, callback) => {
    const call = db.collection(collection);
    return call.deleteOne(document);
};

exports.updateDocument = (db, document, update, collection, callback) => {
    const call = db.collection(collection);
    return call.updateOne(document, { $set : update }, null);
};
