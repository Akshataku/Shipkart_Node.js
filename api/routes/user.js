const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//for security of passwords
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

//for google auth sign up
router.post('/', (req, res, next) => {
    User.find({email:req.body.email})
    .exec()
    .then(user => {
        if(user.length > 0){
            return res.status(409).json({
                message:'E-mail already exists'
            });
        }
        else{
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                firstname: req.body.firstName,
                lastname: req.body.lastName,
                email: req.body.email
            });
            user.save()
            .then(result =>{
                console.log(result);
                res.status(201).json({
                    message: 'User Created'
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
        }
    })
});

//manually sign up
router.post('/signup', (req, res, next) => {
    User.find({email:req.body.email})
    .exec()
    .then(user => {
        if(user.length > 0){
            return res.status(409).json({
                message:'E-mail already exists'
            });
        } 
        else{
            bcrypt.hash(req.body.password,10, (err, hash) => {
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                } else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        password: hash
                    });
                    user.save()
                    .then(result =>{
                        console.log(result);
                        //res.json({userID: user._id});
                        res.status(201).json({
                            message: 'User Created',
                            userID: user._id

                        });
                        //res.json({userId:user._id});
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            });
        }
    });
});

//google login
router.post('/googlelogin', (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        //array of users 
        if(user.length < 1){
            return res.status(401).json({
                message: 'Auth Failed! User doesnt exists'
            });
        } else{           
                
                //json web token
            const token = jwt.sign({email: user[0].email, userId: user[0]._id }, process.env.JWT_KEY, {expiresIn:"1h"});

            return res.status(200).json({
                message: 'Auth Successful',
                token: token
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

//manually login
router.post('/login', (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        //array of users 
        if(user.length < 1){
            return res.status(401).json({
                message: 'Auth Failed! User doesnt exists'
            });
        } else{            //user texted      //hashed password when sign in
            bcrypt.compare(req.body.password, user[0].password, (err,result) => {
                if(err){
                    return res.status(401).json({
                        message: 'Auth Failed!'
                    });
                }
                if(result){
                    //json web token
                    const token = jwt.sign({email: user[0].email, userId: user[0]._id }, process.env.JWT_KEY, {expiresIn:"1h"});

                    return res.status(200).json({
                        message: 'Auth Successful',
                        token: token
                    });
                }
                return res.status(401).json({
                    message: 'Auth Failed! Incorrect Password'
                });
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.deleteOne({_id:id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User Deleted'
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;