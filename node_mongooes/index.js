const mongoose = require('mongoose');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';

const connect = mongoose.connect(url, { useUnifiedTopology: true , useFindAndModify: true});

connect.then((db) => {
    console.log('Connected to mongoDB successfully');

    Dishes.create({
        name: "Santosh Adk 3",
        description: "Mongo db test under conFusion Database"
    })
    .then((dish) => {
        console.log(dish);
        return Dishes.findByIdAndUpdate(dish._id, {
                $set: { description: "Mongo is interesting" }
            }, { new: true }).exec();
    })
    .then((dish) => {
        console.log(dish);

        dish.comments.push({
            rating: 3,
            Comment: "not very bad",
            auther: "Dear Santu"
        });

        return dish.save();
    })
    .then((dishes) => {
        console.log(dishes);

        return Dishes.remove({});
    })
    .then(() => {
        return mongoose.connection.close();
    }).catch((err) => console.log(err));
});