const jwt = require('jsonwebtoken');
const path = require('path');

const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendFile(path.join(__dirname, './../../index.html'));
            }

            req.userId = user.id;
            next();
        });
    } else {
        return res.sendFile(path.join(__dirname, './../../index.html'));
    }
};

module.exports = authenticate;