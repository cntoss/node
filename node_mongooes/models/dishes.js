const mongooes = require('mongoose');

const Schema = mongooes.Schema;

const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        require: true
    },
    comment: {
        type: String,
        require: true
    },
    auther: {
        type: String,
        require: true
    }
},
    {
        timestamps: true
    });

const dishSchema = new Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
    description: {
        type: String,
        require: true
    },
    comments: [commentSchema]
}, {
    timestamps: true
});

var Dishes = mongooes.model('Dish', dishSchema);

module.exports = Dishes;