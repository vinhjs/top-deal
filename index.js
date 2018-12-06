const express = require('express');
const request = require('request');
const async = require('async');
const _ = require('lodash');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({limit: '2mb', extended: true}));
app.use(bodyParser.json({limit: '2mb'}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
    next();
});
const port = process.env.PORT || 8001;
var TiKi = require('./libs/tiki');
app.get('/tiki', function(req, res){
  var tiki = new TiKi();
  tiki.deals(function(data){
    res.send(data);
  })
})
http.listen(port, function () {
    console.log('App is running on ' + port);
});