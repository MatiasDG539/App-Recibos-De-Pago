const jwt = require("jsonwebtoken");
const {secret} = require("./../config/jwtConfig");

const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.redirect('/index.html');
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.redirect('/index.html');
        }

        req.userId = decoded.id;
        next();
    });
};

module.exports = authenticate;