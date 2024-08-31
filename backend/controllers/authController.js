const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
const {User} = require("./../models");

//Registro de usuario
const registerUser = async (req, res) => {
    const {username, email, password} = req.body;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: "El nombre de usuario ya existe" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email,
            pass: hashedPassword,
        });

        res.status(201).json({message: 'Usuario registrado con éxito', user: newUser});
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({message: 'Error registrando el usuario', error: error.message});
    }
};

//Inicio de sesión
const login = async (req, res) => {
    const {username, password} = req.body;
    try{
        //Buscar el usuario en la base de datos
        const user = await User.findOne({ where: { username }});
        if(!user){
            return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
        }

        //Verificar contraseña
        const validPassword = await bcrypt.compare(password, user.pass);
        if(!validPassword) {
            return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
        }
        
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        await User.update({ jwtToken: token }, { where: { id: user.id } });

        res.json({ token });
    } catch (err) {
        console.error('Error en el inicio de sesión:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

const logout = async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(400).json({ message: 'Token no proporcionado' });
        }

        // Decodificar el token para obtener el ID del usuario
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Actualizar el token en la base de datos a null
        const result = await User.update({ jwtToken: null }, { where: { id: userId, jwtToken: token } });

        if (result[0] > 0) {
            res.status(200).json({ message: 'Cierre de sesión exitoso' });
        } else {
            res.status(400).json({ message: 'Token no encontrado o usuario inválido' });
        }
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        //Busca al usuario en la base de datos
        const user = await User.findOne({ where: {email} });
        if(!user) {
            return res.status(404).json({ message: "Correo electrónico no registrado"});
        }

        //Genera token de restablecimiento
        const resetToken = crypto.randomBytes(20).toString('hex');

        //Guardar token y su expiración en la DB
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 600000;
        await user.save();

        //Configuración nodemailer para enviar el correo electrónico con el token
        const transporter = nodemailer.createTransport ({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: 'gutierrezhnoselectricidad@gmail.com',
            to: user.email,
            subject: 'Restablecer contraseña',
            html: `<p style="font-size: 16px";>Recibiste este correo porque tú (u otra persona) solicitaste el restablecimiento de la contraseña de tu cuenta.</p>
           <p style="font-size: 16px">Por favor, haz clic en el siguiente enlace o pégalo en tu navegador para completar el proceso dentro de 10 minutos de haber recibido este correo:</p>
           <p style="font-size: 16px"><a href="http://${req.headers.host}/reset-password/${resetToken}">Restablecer contraseña</a></p>
           <p style="font-size: 16px">Si no solicitaste este correo, simplemente ignóralo y tu contraseña no cambiará.</p>
           <br>
           <p style="font-size: 16px">Saludos cordiales,</p>
           <p style="font-size: 16px">El equipo de soporte</p>
           <p style="font-size: 16px"><strong>Gutierrez Hnos Electricidad</strong></p><
           <br>
           <!-- Firma HTML -->
            <div dir="ltr">
               <p style="font-size: 18px; color: #333;"><strong>Gracias por confiar en nuestro servicio!</strong></p>
               <img src="https://ci3.googleusercontent.com/mail-sig/AIorK4xG6u2vvUqCXSpXAGWAmQod9SRIu86A0Iok9kFjDs8_INfv7fDgUcsETkLe_gguaX6uWmwyGbj4xBA1" alt="Firma" style="max-width: 400px; height: auto;">
           </div>`
        };

        //Envía el correo electrónico
        await transporter.sendMail(mailOptions);

        res.json({ message: 'Correo de restablecimiento de contraseña enviado, verifique su casilla de correo' });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Error en el servidor '});
    }
}

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try{
        //Buscar al usuario con el token y controlar que aun no haya expirado el mismo
        const user = await User.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { [Op.gt]: Date.now() }
            }
        });
        if(!user) {
            return res.status(400).json({ message: 'Token invalido o expirado '});
        }

        //Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        //Actualizar contraseña y eliminar token junto con la expiración
        user.pass = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.json({ message: 'Contraseña restablecida con éxito '});
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Error en el servidor '});
    }
}

const userInfo = async (req, res) => {
    try {  
        const user = await User.findOne({ where: { id: req.user.id }});

        if(!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        res.json({ username: user.username });
    }catch(err) {
        console.error('Error al obtener la información del usuario', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = { registerUser, login, logout, forgotPassword, resetPassword, userInfo, };