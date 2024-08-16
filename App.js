const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./src/js/db');
const authRoutes = require('./backend/routes/authRoutes');
const authController = require("./backend/controllers/authController");
const authMiddleware = require("./backend/middlewares/authMiddleware");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

app.get('/client', (req, res) => {
    const sql = "SELECT * FROM clients";
    db.query(sql, (err, results) => {
        if(err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});

app.get('/client/:name', (req, res) => {
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

app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Agregar las rutas de administración
// const adminRoutes = require('./backend/routes/admin');
// app.use('/admin', adminRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
});