const express = require('express');
const path = require('path');
const authenticate = require('./../middlewares/authMiddleware');
const router = express.Router();

router.get('/public', (req, res) => {
    res.send('Ruta publica');
});

router.get('/private/:page', authenticate, (req, res) => {
    const page = req.params.page;
    const filePath = path.join(__dirname, `./../../src/private/${page}`);
    
    // Asegurarse de que el archivo solicitado exista y sea un archivo HTML
    if (filePath.endsWith('.html')) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Archivo no encontrado');
    }
});
module.exports = router;