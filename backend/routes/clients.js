const express = require('express');
const { Client } = require('./../models');

const router = express.Router();

//Obtener todos los clientes
router.get('/client', async (req, res) => {
    try {
        const clients = await Client.findAll();
        res.json(clients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la lista de clientes'});
    }
});

//Obtener información de un cliente especifico por nombre
router.get('/client:name', async (req, res) => {
    try {
        const client = await Client.findOne({ where: { client_name: req.params.name } });
        if (!client) {
            return res.status(404).json({ error: 'Cliente no encontrado '});
        }
        res.json({
            client_address: client.client_address,
            client_data: client.client_data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la información del cliente'})
    }
});

module.exports = router;