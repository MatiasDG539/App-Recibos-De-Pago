const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require('./../../src/js/db');
const crypto = require('crypto');

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
        },

        resetPasswordToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        resetPasswordExpires: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        timestamps: false
    }
);

module.exports = User;