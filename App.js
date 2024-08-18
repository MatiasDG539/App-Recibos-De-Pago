const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./src/js/db');
const dotenv = require('dotenv');
const authRoutes = require('./backend/routes/authRoutes');
const authenticate = require('./backend/middlewares/authMiddleware');
const authController = require("./backend/controllers/authController");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);

app.use('/src/pages', authenticate, (req, res, next) => {
    express.static(path.join(__dirname, 'pages'))(req, res, next);
});

app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
});