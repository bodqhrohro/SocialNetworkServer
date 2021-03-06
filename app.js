var express = require('express');
var bodyParser = require('body-parser');
GLOBAL._ = require('underscore');
var app = express();
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/socialNetwork';
MongoClient.connect(url, function(err, db) {
    console.log(err ? err : "Connected correctly to server");
    GLOBAL.DB  =  db;
    app.listen(100)
});

app.use(express.static('public'))

var auth = require('./auth')

router.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
});
router.use(bodyParser.json())
router.use(function (req, res, next) {
    console.log(req.originalUrl)
    if(req.originalUrl =='/api/register'){
        next(null);
        return;
    }
    if (!req.headers['authorization']) {
        res.status(401).send({message: "No auth"});
        return;
    }
    var parts = req.headers['authorization'].split(":")
    var nick = parts[0];
    var pwd = auth.encodePassword(parts[1]);
    DB.collection('users').find({nick:nick,pwd:pwd}).toArray(function(err,data){

        if (data.length>0) {
            req.currentUser =data[0];
            next(null);
            return;
        }
        res.status(401).send({message: "invalid user or password"})

    })


})
require('./controllers/user')(router)
require('./controllers/post')(router)
require('./controllers/following')(router)
app.use('/api',router);
