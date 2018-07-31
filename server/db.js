#!/usr/bin/env node

const sqlite = require('sqlite3');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',
    operatorsAliases: false,
    // the storage engine for sqlite
    // - default ':memory:'
    storage: './fuzzy.db'
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
//Models/tables
db.flightOnDate = require('./modelflightdb.js')(sequelize, Sequelize);

module.exports = db;