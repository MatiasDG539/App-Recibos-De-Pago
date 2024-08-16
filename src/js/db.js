const dotenv = require('dotenv');
const { Sequelize } = require("sequelize");

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASS, {
    host: process.env.DATABASE_HOST,
    dialect: "mysql",
    dialectModule: require("mysql2")
});

console.log('Database Config:', {
    database: process.env.DATABASE,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    host: process.env.DATABASE_HOST
});

module.exports = sequelize;