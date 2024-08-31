const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../src/js/db');

const Client = sequelize.define(
    'Client', 
    {

        client_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        client_address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        client_email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        client_data: {
            type: DataTypes.STRING,
            allowNull: false,
        }
},

{
    timestamps: false
}
);

module.exports = Client;