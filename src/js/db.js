const dotenv = require('dotenv');
const { Sequelize } = require("sequelize");

dotenv.config({ path: './../../.env' });

const sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASS, { //data-base-name, user, password
    host: process.env.DATABASE_HOST,
    dialect: "mysql",
    dialectModule: require("mysql2")
});

module.exports = sequelize;