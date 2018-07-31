#!/usr/bin/env node

const request = require('request');
var schedule = require('node-schedule');
const EventEmitter = require('events');
var config = require("./dbconfig.json");
var serviceKey = null;
var url = 'http://openapi.airport.co.kr/service/rest/FlightStatusList/getFlightStatusList?schIOType=O&schAirCode=GMP&serviceKey=' + serviceKey + '&schStTime=1000&schEdTime=1800&schLineType=D&numOfRows=5';
//numOfRows may need adjustments. 

var MongoClient = require('mongodb').MongoClient;
var mongoDbUrl = "mongodb://localhost:27017/";
var dbHandler;
const colName = 'GimpoJejuFlightStatus';
//class Sampler extends EventEmitter{ }
const sampler = new EventEmitter();

sampler.on('data-updated', function (records) {
    dbHandler.collection(colName, function (err, col) {
        if (err) {
            throw err;
        } else {
            dbHandler.collection(colName).remove({});
            console.log('collection reset!');
        }
        dataInserter(records);
    });
});

createCollection(mongoDbUrl);

function dataInserter(records) {
    if (dbHandler) {
        dbHandler.collection(colName).insertMany(records, function (err, res) {
            if (err) {
                throw err;
            } else {
                console.log(records);
                console.log("----- inserted------");
                dbHandler.collection(colName).count(function (err, count) {
                    if (err) {
                        throw err;
                    } else {
                        console.log(`Collection now contains ${count} flights\n`);
                    }

                });
            }
        });
    }
}

sampler.on('collection ready', function () {
    schedule.scheduleJob('0,10,20,30,40,50 * * * * *', collector);
});

function collector() {
    request(url, {
        json: true
    }, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        var item = body.response.body.items.item,
            bucket = [];
        for (var key in item) {
            with(item[key]) {

                if (arrivedEng === 'JEJU') {
                    var deltime = (Math.floor(etd / 100) - Math.floor(std / 100)) * 60 + (etd % 100 - std % 100);
                    bucket.push({
                        "from": boardingEng,
                        "destination": arrivedEng,
                        "airFln": airFln,
                        "planTime": std,
                        "delayedMin": deltime,
                        "status": rmkEng
                    });
                }
            }
        }
        sampler.emit("data-updated", bucket);
    });
}

function createCollection(dbUrl) {
    MongoClient.connect(dbUrl, function (err, db) {
        if (err) throw err;
        dbHandler = db.db(config.dbname);
        dbHandler.createCollection(colName, function (err, res) {
            if (err) {
                throw err;
            } else {
                console.log("collection created");
                sampler.emit('collection ready');
            }
        });
    });
}