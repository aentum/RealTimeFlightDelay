#!/usr/bin/env node
var express = require('express');
var app = express();
var config = require("./dbconfig.json");

// Retrieve
var MongoClient = require('mongodb').MongoClient;
// Connect to the db
var url = "mongodb://localhost:27017/";
var gCollection;

MongoClient.connect(url, function(err, db) {
	if (err) throw err;
    var dbase = db.db(config.dbname);
	dbase.createCollection('test', function(err, collection){   //make collection
		if (err) throw err;
		console.log("Collection created!");
		gCollection = collection;

		// dbo.collection('test').insertMany(myobj, function(err, res) {
		// if (err) throw err;
		// console.log("Number of documents inserted: " + res.insertedCount);
		// db.close();

	});
});


/*
app.get('/', function (req, res) {
	console.log('bruce');
	res.send('Hello World!');
});
app.get('/hello',function(req, res){
	console.log('bruce!!!');
	res.send('Hello Hi');
});
*/

//app.listen(3000, function () {
//		  console.log('Example app listening on port 3000!');
//});