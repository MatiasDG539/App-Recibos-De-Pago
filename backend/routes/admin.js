// // const express = require('express');
// // const bcrypt = require('bcrypt');
// // const db = require('./../../src/js/db');
// // const router = express.Router();

// // router.post('/update-password', async (req, res) => {
// //     const { username, password } = req.body;

// //     try {
// //         // Verificar que el usuario existe
// //         const userCheckSql = "SELECT username FROM users WHERE username = ?";
// //         db.query(userCheckSql, [username], async (err, results) => {
// //             if (err) {
// //                 return res.status(500).send('Error al buscar el usuario');
// //             }
// //             if (results.length === 0) {
// //                 return res.status(404).send('Usuario no encontrado');
// //             }

// //             // Hashear la nueva contraseña
// //             const saltRounds = 10;
// //             const hashedPassword = await bcrypt.hash(password, saltRounds);

// //             // Actualizar la contraseña en la base de datos
// //             const updateSql = "UPDATE users SET pass = ? WHERE username = ?";
// //             db.query(updateSql, [hashedPassword, username], (err, results) => {
// //                 if (err) {
// //                     return res.status(500).send('Error al actualizar la contraseña');
// //                 } else {
// //                     res.send('Contraseña actualizada correctamente');
// //                 }
// //             });
// //         });
// //     } catch (error) {
// //         console.error(error); // Loguear el error para depuración
// //         res.status(500).send('Error al encriptar la contraseña');
// //     }
// // });

// // module.exports = router;