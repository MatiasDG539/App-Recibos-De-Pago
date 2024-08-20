const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./src/js/db');
const dotenv = require('dotenv');
const authRoutes = require('./backend/routes/authRoutes');
const protectedRoutes = require('./backend/routes/protectedRoutes');
const authController = require("./backend/controllers/authController");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);

app.use(express.static(path.join(__dirname, 'src')));

app.use('/', protectedRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/private/:file', (req, res) => {
    const file = req.params.file;
    res.sendFile(path.join(__dirname, 'src', 'private', file));
});

app.get('/public/:file', (req, res) => {
    const file = req.params.file;
    res.sendFile(path.join(__dirname, 'src', 'public', file));
});

app.get('/js/:file', (req, res) => {
    const file = req.params.file;
    res.sendFile(path.join(__dirname, 'src', 'js', file));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
});