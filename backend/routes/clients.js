const express = require('express');
const router = express.Router();
const { Client } = require('../models');

router.get('/clients', async (req, res) => {
    try {
        const clients = await Client.findAll({ attributes: ['id', 'client_name', 'client_address', 'client_data'] });
        res.json(clients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los clientes' });
    }
});

router.get('/clients/:id', async (req, res) => {
    try {
        const client = await Client.findByPk(req.params.id, { attributes: ['client_address', 'client_data']});
        if(!client) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json(client);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el cliente' });
    }
});

module.exports = router;
