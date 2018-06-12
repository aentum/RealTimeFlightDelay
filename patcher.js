#!/usr/bin/env node
var express = require('express');
var app = express();
const request = require('request');
var schedule = require('node-schedule');
const EventEmitter = require('events');
var config = require("./dbconfig.json")

var url = 'http://openapi.airport.co.kr/service/rest/FlightStatusList/getFlightStatusList?schIOType=O&schAirCode=GMP&serviceKey=b6LQXkCfnIJWE3r7gxDVqaOYCS7ljw9Ycyc%2FaZ8A3gSWuZ9rf8WFSHY%2FHK5NBpjnTwUQsMfX5tGfzgQvciNyEg%3D%3D&schStTime=1000&schEdTime=1800&schLineType=D&totalCount=5';


var MongoClient = require('mongodb').MongoClient;
var mongoDbUrl = "mongodb://localhost:27017/";
var dbHandler;

class Sampler extends EventEmitter{ }
const sampler = new Sampler();
sampler.on("data-updated", function(records) {
    if( dbHandler ) {
        dbHandler.collection("test").insertMany( records, function(err, res){
            if(err) {
                throw err;
            } else {
                console.log( records );
                console.log("----- inserted------\n");
            }
        });
    }
});

createCollection(mongoDbUrl);

schedule.scheduleJob('0,15,30,45 * * * * *', triggering);

function triggering() {
    request(url, {json:true}, (err, res, body) => {
        if (err) { return console.log(err); }
        var item = body.response.body.items.item, bucket = [];
        for (var key in item) {
            with (item[key]) {
                var deltime = (Math.floor(etd/100)-Math.floor(std/100))*60 + (etd%100 - std%100);
                bucket.push( { "airFln":airFln, "delayedMin":deltime, "status":rmkEng }  );
            }
        }
        sampler.emit("data-updated", bucket );
    });
}

function createCollection(dbUrl) {
    MongoClient.connect(dbUrl, function(err, db) {
        if (err) throw err;
        dbHandler = db.db(config.dbname);
        dbHandler.createCollection("test", function(err, res) {
            if( err ) {
                throw err;
            } else {
                console.log("collection created")
            }

        });
    });
}
