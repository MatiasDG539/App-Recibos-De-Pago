const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./js/db');
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/datos', (req, res) => {
    const sql = "SELECT * FROM clients";
    db.query(sql, (err, results) => {
        if(err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});

app.get('/datos/:name', (req, res) => {
    const name = req.params.name;
    const sql = "SELECT * FROM clients WHERE client_name = ?";
    db.query(sql, [name], (err, results) => {
        if(err) {
            res.status(500).send(err);
        } else if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send('Cliente no encontrado');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
});