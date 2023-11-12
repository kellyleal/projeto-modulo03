const query = require('../conexao');
const bcrypt = require('bcrypt');

const validarUsuario = async (req, res, next) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'Nome, email e senha são obrigatórios' });
    }
    const emailExistente = await query('SELECT * FROM usuario WHERE email = $1', [email]);
    if (emailExistente.rowCount > 0) {
        return res.status(400).json({ mensagem: "Já existe usuário cadastrado com o e-mail informado." });
    }
    next();
};

const validarLogin = async (req, res, next) => {
    const { email, senha } = req.body;
    const resultado = await query('SELECT * FROM usuario WHERE email = $1', [email]);
    if (resultado.rowCount < 1) {
        return res.status(404).json({ mensagem: 'O usuario com o email informado não existe.' });
    }
    if (resultado.rowCount < 1) return res.status(401).json({ mensagem: "Usuario ou Senha Invalida" });
    const senhaHash = await bcrypt.compare(senha, resultado.rows[0].senha);
    if (!senhaHash) return res.status(401).json({ mensagem: "Usuario ou senha Invalido" });
    next();
};

module.exports = {
    validarUsuario,
    validarLogin
};
