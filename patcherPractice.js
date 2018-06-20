#!/usr/bin/env node
var express = require('express');
var app = express();
const request = require('request');
var schedule = require('node-schedule');
const EventEmitter = require('events');
var config = require("./dbconfig.json");

var url = 'http://openapi.airport.co.kr/service/rest/FlightStatusList/getFlightStatusList?schIOType=O&schAirCode=GMP&serviceKey=b6LQXkCfnIJWE3r7gxDVqaOYCS7ljw9Ycyc%2FaZ8A3gSWuZ9rf8WFSHY%2FHK5NBpjnTwUQsMfX5tGfzgQvciNyEg%3D%3D&schStTime=1000&schEdTime=1800&schLineType=D&numOfRows=5';


var Server = require('mongodb').Server,
    MongoClient = require('mongodb').MongoClient,
    Db = require('mongodb').Db,
    dbTest = new Db('dataBin', new Server('localhost', 27017));

var mongoDbUrl = "mongodb://localhost:27017/";
var dbHandler;
var messenger = new EventEmitter();

collectionCreater(mongoDbUrl);


function subscribeCron() {
    messenger.on('collection ready', function(){
        schedule.scheduleJob('0,15,30,45 * * * * *', collector );
    });
}

function collectionCreater(mongoDbUrl) {
    MongoClient.connect(mongoDbUrl, function(err, client) {
        if (err) throw err;
        dbHandler = client.db(config.db2);
        dbHandler.createCollection("dataBin", function(err, res) {           //cb in cb?? 
            if (err) throw err;
            console.log('collection created!');
            subscribeCron();
            messenger.emit('collection ready');
        });
    });
}

function collector(){
    request(url,{json: true}, function (err, res, body) {
    if (err) {return console.log(err);}
    var rawData = [].push(body.response.body.items);
    attachEvent();
    messenger.emit('timeToInsert', rawData);
    });
}

function attachEvent() {
    messenger.on('timeToInsert', function(rawData){
        dbHandler.collection('dataBin').insertOne(rawData, function(err, res){
        if (err) { return console.log(err); }
        console.log(rawData);
        console.log('Data inserted!');
        });
    });
}

/*
function deleteIfExist( cb ) {
    dbTest.collectionNames('dataBin', function(err, names) {
        if(names.length > 0) {
            db.dataBin.drop();
        }
        if( cb ) cb();
    });
}
*/