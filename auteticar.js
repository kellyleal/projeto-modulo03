const jwt = require('jsonwebtoken');
require('dotenv').config();

const autenticar = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ mensagem: 'Token de autenticação não fornecido' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ mensagem: 'Falha ao autenticar o token' });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

module.exports = autenticar;
