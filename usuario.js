
const jwt = require('jsonwebtoken');
const query = require('../conexao');
const bcrypt = require('bcrypt');
const validar = require('./validar');
const autenticar = require('./autenticar');

require('dotenv').config();

const cadastrarUsuarios = async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        const emailExistente = await query('SELECT * FROM usuario WHERE email = $1', [email]);
        if (emailExistente.rowCount > 0) {
            return res.status(400).json({ mensagem: "Já existe usuário cadastrado com o e-mail informado." });
        }
        const senhaHash = await bcrypt.hash(senha, 10);
        const { rows } = await query('INSERT INTO usuario (nome, email, senha) VALUES ($1, $2, $3) RETURNING *', [nome, email, senhaHash]);
        const { senha: __, ...dadosUsuario } = rows[0];
        res.status(201).json(dadosUsuario);
    } catch (error) {
        return res.status(500).json('Erro interno servidor');
    }
};

const login = async (req, res) => {
    const { email, senha } = req.body;
    try {
        const resultado = await query('SELECT * FROM usuario WHERE email = $1', [email]);
        if (resultado.rowCount < 1) {
            return res.status(404).json({ mensagem: 'O usuario com o email informado não existe.' });
        }
        if (resultado.rowCount < 1) return res.status(401).json({ mensagem: "Usuario ou Senha Invalida" });
        const senhaHash = await bcrypt.compare(senha, resultado.rows[0].senha);
        if (!senhaHash) return res.status(401).json({ mensagem: "Usuario ou senha Invalido" });

        const { senha: __, ...usuario } = resultado.rows[0];
        const token = jwt.sign({ usuario }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ usuario, token });
    } catch (error) {
        return res.status(500).json({ mensagem: "Login error" });
    }
};

const detalharUsuario = async (req, res) => {
    try {
        const { id, nome, email } = req.usuario;
        res.status(200).json({ id, nome, email });
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
};

const editarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        const senhaCriptografada = await bcrypt.hash(senha, 10);
        const emailJaExistente = await query('SELECT * FROM usuario WHERE email = $1 and nome != $2', [email, nome]);
        if (emailJaExistente.rowCount > 0) {
            return res.status(400).json({ mensagem: 'O e-mail informado já está sendo utilizado por outro usuário.' });
        }
        await query('UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4', [nome, email, senhaCriptografada, req.usuario.id]);
        res.status(204).json();
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro servidor interno" });
    }
};

module.exports = {
    cadastrarUsuarios,
    login,
    detalharUsuario,
    editarUsuario
};
