const { db_name, db_username, db_password, db_host } = require("./config.js");
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(db_name, db_username, db_password, {
    host: db_host,
    port: 5431,
    dialect: 'postgres'
});

module.exports = sequelize;