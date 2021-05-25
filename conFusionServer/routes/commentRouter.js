const express = require('express');
const bodyParser = require('body-parser');

const cors = require('./cors');
const Comments = require('../models/comments');

const commentRouter = express.Router();

var authenticate = require('../authenticate');

commentRouter.use(bodyParser.json());

commentRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Comments.find(req.query)
            .populate('author')
            .then((comments) => {
                res.statusCode = 200;
                res.contentType('content-type', 'application-json');
                res.json(comments);
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        if (req.body != null) {
            if (req.body != null) {
                req.body.author = req.user._id;
                Comments.create(req.body)
                .then((comment) => {
                    Comments.findById(comment._id)
                    .populate('author')
                    .then((comment) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(comment);
                    })
                }, (err) => next(err))
                .catch((err) => next(err));
            }
        } else {
            err = new Error('Comment not found in request body');
            err.status = 404;
            return next(err);
        }
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 401;
        res.end('Put operation did not supported on /comments');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Comments.remove({})
            .then((response) => {
                res.statusCode = 200;
                res.contentType('content-type', 'application-json');
                res.json(response);
            }, (err) => next(err))
            .catch((err) => next(err))
    });

//for single comment
commentRouter.route('/:commentId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Comments.findById(req.params.commentId)
            .populate('author')
            .then((comment) => {
                res.statusCode = 200;
                res.type('application/json');
                res.json(comment);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 401;
        res.end('POST operation did not supported on /comment/' + req.params.dishId + '/comments/' +
            req.params.commentId);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Comments.findById(req.params.dishId)
            .then((comment) => {
                if (comment != null) {
                    if (!comment.author.equals(req.user._id)) {
                        err = new Error('You are not authorized to access this comments');
                        res.statusCode = 403;
                        return next(err);
                    }
                    req.body.author = req.user._id;
                    Comments.findByIdAndUpdate(req.params.commentId, {
                        $set: req.body
                    }, { new: true })
                        .then((comment) => {
                            Comments.findById(comment._id)
                                .populate('author')
                                .then((comment) => {
                                    res.statusCode = 200;
                                    res.type('application/json');
                                    res.json(response);
                                });
                        }, (err) => next(err));
                } else {
                    err = new Error('Comments ' + req.params.commentId + ' not found');
                    res.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Comments.findById(req.params.commentId)
            .then((comment) => {
                if (comment != null) {
                    if (!comment.author.equals(req.user._id)) {
                        err = new Error('You are not authorized to delete this comments');
                        res.statusCode = 403;
                        return next(err);
                    }
                    Comments.findByIdAndDelete(req.params.commentId)
                        .then((resp) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(resp);
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    });


module.exports = commentRouter;