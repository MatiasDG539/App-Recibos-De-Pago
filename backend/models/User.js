const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require('./../../src/js/db');

const User = sequelize.define(
    "User",
    {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        pass: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        timestamps: false
    }
);

module.exports = User;