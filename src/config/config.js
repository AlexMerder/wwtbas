require('dotenv').config();

const config = {
    token: process.env.TOKEN,
    db_name: process.env.DB_NAME,
    db_username: process.env.DB_USERNAME,
    db_password: process.env.DB_PASSWORD,
    db_host: process.env.DB_HOST
};
module.exports = config;