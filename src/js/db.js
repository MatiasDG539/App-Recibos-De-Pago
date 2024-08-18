const dotenv = require('dotenv');
const { Sequelize } = require("sequelize");

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASS, {
    host: process.env.DATABASE_HOST,
    dialect: "mysql",
    dialectModule: require("mysql2")
});

module.exports = sequelize;