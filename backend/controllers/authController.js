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
        
        //Generar un token JWT
        const token = jwt.sign({id: user.id, username: user.username}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.json({ token });

        console.log('token');
        console.log(token);

    } catch (err) {
        console.error('Error en el inicio de sesión:', err);
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
            text: `Recibiste este correo porque tú (u otra persona) solicitaste el restablecimiento de la contraseña de tu cuenta.\n\n` +
                `Por favor, haz clic en el siguiente enlace o pégalo en tu navegador para completar el proceso dentro de 10 minutos de haber recibido este correo:\n\n` +
                `http://${req.headers.host}/reset-password/${resetToken}\n\n` +
                `Si no solicitaste este correo, simplemente ignóralo y tu contraseña no cambiará.\n`
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

module.exports = { registerUser, login, forgotPassword, resetPassword, };