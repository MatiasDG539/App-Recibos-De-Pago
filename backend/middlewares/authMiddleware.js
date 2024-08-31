const jwt = require("jsonwebtoken");
const { User } = require("./../models");


const authenticate = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    try {
        // Verificar el token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ where: { id: decoded.id, jwtToken: token } });

        if (!user) {
            return res.status(401).json({ message: 'Token no válido' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error en el middleware de autenticación:', error);
        res.status(401).json({ message: 'Token no válido' });
    }
};

module.exports = authenticate;