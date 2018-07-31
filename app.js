#!/usr/bin/env node

var express = require('express');
var cors = require('cors');
var schedules = require('./flightScheduleDB.json');
var rates = require('./premiumRatesDB.json');

var app = express();
app.use(cors());
const axios = require('axios');
/*
app.get('/', function (req, res) {
	let result = {};
	axios
		.get('http://openapi.airport.co.kr/service/rest/FlightStatusList/getFlightStatusList?schIOType=O&schAirCode=GMP&serviceKey=b6LQXkCfnIJWE3r7gxDVqaOYCS7ljw9Ycyc%2FaZ8A3gSWuZ9rf8WFSHY%2FHK5NBpjnTwUQsMfX5tGfzgQvciNyEg%3D%3D&schStTime=1000&schEdTime=1800&schLineType=D&numOfRows=17')
		.then(function (res1) {
			result = res1.data.response.body.items.item;
		})
		.catch(function (err) {
			console.log(err);
			res.send('err' + err);
		})
		.then(function () {
			res.send(result);
		});
});
*/
app.get('/flightScheduledOn', function (req, res) {
	let result = [];
	for (var flights in schedules) {
		var check = schedules[flights];
		if (check.date == req.query.date) {
			result.push(check);
		}
	}
	res.send(result);
});
app.get('/rewardRate', function (req, res) {
	let result = [];
	for (var i in rates) {
		var check = rates[i];
		if (check.flightNumber == req.query.flightNumber && check.date == req.query.date) {
			result.push(check);
		}
	}
	res.send(result);
});
app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});