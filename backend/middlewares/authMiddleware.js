const jwt = require("jsonwebtoken");
const {secret} = require("./../config/jwtConfig");

exports.authenticate = (req, res, next) => {
    const token = req.headers["authorization"]?.split(' ')[1];
    if(!token) {
        return res.status(401).json({message: "Token no proporcionado"});
    }

    jwt.verify(token, secret, (err, decoded) => {
        if(err) {
            return res.status(401).json({message: "Token invalido"});
        }
        req.userId = decoded.id;
        next();
    });
};