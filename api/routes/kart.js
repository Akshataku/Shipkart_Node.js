const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Kart = require('../models/kart');

router.get('/',(req, res, next) => {
    Kart.find()
    .exec()
    .then(docs => {
        console.log(docs);
        res.status(200).json(docs);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/:userId',(req, res, next) => {
    const id = req.params.userId;
    Kart.find({"userid": id })
    .exec()
    .then(doc => {
        console.log("From Database",doc);
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(404).json({
                message: 'No valid entry found with that id'
            });
        }
       
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });
});

router.post('/',(req, res, next) => {
    const product = new Kart({
        _id: new mongoose.Types.ObjectId(),
        productid: req.body.productid,
        userid: req.body.userid,
        item: req.body.item,
        price: req.body.price,
        brand: req.body.brand,
        imageUrl : req.body.imageUrl
    });
    product
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Handling POST requests to /kart',
            createdProduct: result
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:productId',(req, res, next) => {
    const id = req.params.productId;
    Kart.deleteOne({_id:id})
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});

module.exports = router;