const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {User} = require("./../models");
const {secret, options} = require("../config/jwtConfig");

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
            password: hashedPassword,
        });

        res.status(201).json({message: 'Usuario registrado con éxito', user: newUser});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Error registrando el usuario'});
    }
};

//Inicio de sesión
const login = async (req, res) => {
    const {username, password} = req.body;
    try{
        //Buscar el usuario en la base de datos
        const user = await User.findOne({where: {username}});
        if(!user){
            return res.status(401).json({message: "Usuario o contraseña incorrectos"});
        }

        //Verificar contraseña
        const validPassword = await bcrypt.compare(password, user.pass);
        if(!validPassword) {
            return res.status(401).json({error: "Usuario o contraseña incorrectos"});
        }
        
        //Generar un token JWT
        const token = jwt.sign({id: user.id, username: user.username}, secret, {expiresIn: '1h'});
        res.json({token});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error en el servidor'});
    }
};

module.exports = { registerUser, login };