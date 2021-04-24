const assert = require("assert");

exports.insertDocument = (db, document, collection, callback) => {
    const call = db.collection(collection);
    call.insert(document, (err, result) => {
        assert.strictEqual(err, null, "got error on insert");
        console.log("Inserted " + result.result.n +
            "Documents into the collection " + collection);
        callback(result);
    });

};

exports.findDocument = (db, collection, callback) => {
    const call = db.collection(collection);
    call.find({}).toArray((err, docs) => {
        assert.strictEqual(err, null, "error on find");
        callback(docs);
    });
};

exports.removeDocument = (db, document, collection, callback) => {
    const call = db.collection(collection);
    call.deleteOne(document, (err, res) =>{
        assert.strictEqual(err, null, "document delete error");
        console.log("remove", document);
    })

};

exports.updateDocument = (db, document, update, collection, callback) => {
    const call = db.collection(collection);
    call.updateOne(document, { $set : update }, null, (err, res) => {
        assert.strictEqual(err, null, "Error on update");
        console.log("updated documents with ", update);
        callback(res);
    });

};
