const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./src/js/db');
const dotenv = require('dotenv');
const authRoutes = require('./backend/routes/authRoutes');
const protectedRoutes = require('./backend/routes/protectedRoutes');
const clientRoutes = require('./backend/routes/clients')
const authController = require("./backend/controllers/authController");
const User = require('./backend/models/User');
const authenticate = require('./backend/middlewares/authMiddleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/api', clientRoutes);


app.use(express.static(path.join(__dirname, 'src')));

app.use('/', protectedRoutes);

app.use((err, req, res, next) => {
    if (err.status === 401) {
        res.redirect('./index.html');
    } else {
        res.status(err.status || 500).json({ message: err.message });
    }
});

app.use(express.static(path.join(__dirname)));

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