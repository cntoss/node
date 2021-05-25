const express = require('express');
const bodyParser = require('body-parser');

const cors = require('./cors');
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');
const { json } = require('express');

const dishRouter = express.Router();

var authenticate = require('../authenticate');

dishRouter.use(bodyParser.json());

dishRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Dishes.find(req.query)
            .then((dishes) => {
                res.statusCode = 200;
                res.contentType('content-type', 'application-json');
                res.json(dishes);
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Dishes.create(req.body)
            .then((dish) => {
                console.log('Dish created', dish);
                res.statusCode = 200;
                res.contentType('content-type', 'application-json');
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .put(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 401;
        res.end('Put operation did not supported on /dishes');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Dishes.remove({})
            .then((response) => {
                res.statusCode = 200;
                res.contentType('content-type', 'application-json');
                res.json(response);
            }, (err) => next(err))
            .catch((err) => next(err))
    });

//for single id
dishRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                res.statusCode = 200;
                res.contentType('content-type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 401;
        res.end('Post operation did not supported on /dishes/' +
            req.params.dishId);
    })
    .put((req, res, next) => {
        Dishes.findByIdAndUpdate(req.params.dishId, {
            $set: req.body
        }, { new: true })
            .then((dish) => {
                res.statusCode = 200;
                res.type('application/json');
                res.json(dish)
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .delete((req, res, next) => {
        Dishes.findByIdAndDelete(req.params.dishId)
            .then((response) => {
                console.log('Deleted data', response);
                res.statusCode = 200;
                res.type('application/json');
                res.json(response);
            }, (err) => next(err))
            .catch((err) => next(err))
    });

//for comment
dishRouter.route('/:dishId/comments')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    res.statusCode = 200;
                    res.contentType('content-type', 'application-json');
                    res.json(dish.comments);
                } else {
                    err = new Error('Dish ' + req.params.dishId + 'not found');
                    res.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    dish.comments.push(req.body);
                    dish.save().then((dish) => {
                        if (dish != null)
                            res.statusCode = 200;
                        res.type('application-json');
                        res.json(dish.comments);
                    })
                } else {
                    err = new Error('Dish ' + req.params.dishId + 'not found');
                    res.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .put((req, res, next) => {
        res.statusCode = 401;
        res.end('Put operation did not supported on /dishes ' + req.params.dishId + ' /comments');
    })
    .delete((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    for (var i = (dish.comments.length - 1); i >= 0; i--) {
                        dish.comments.id(dish.comments[i]._id).remove();
                    }
                    dish.save().then((dish) => {
                        res.statusCode = 200;
                        res.contentType('content-type', 'application-json');
                        res.json(dish);
                    })
                } else {
                    err = new Error('Dish ' + req.params.dishId + 'not found');
                    res.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    });

//for single comment
dishRouter.route('/:dishId/comments/:commentId')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    res.statusCode = 200;
                    res.type('application/json');
                    res.json(dish.comments.id(req.params.commentId));
                }
                else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 401;
        res.end('POST operation did not supported on /dish/' + req.params.dishId + '/comments/' +
            req.params.commentId);
    })
    .put((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    if (req.body.rating) {
                        dish.comments.id(req.params.commentId).rating = req.params.rating;
                    }

                    if (req.body.comment) {
                        dish.comments.id(req.params.commentId).comment = req.params.comments;
                    }

                    dish.save()
                        .then((response) => {
                            res.statusCode = 200;
                            res.type('application/json');
                            res.json(response);
                        }, (err) => next(err));
                } else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + 'not found');
                    res.statusCode = 404;
                    return next(err);
                } else {
                    err = new Error('Comments ' + req.params.commentId + ' not found');
                    res.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .delete((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    dish.comments.id(req.params.commentId).remove();
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (err) => next(err));
                }
                else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    });


module.exports = dishRouter;