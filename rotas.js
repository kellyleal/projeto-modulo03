const express = require('express');
const router = express.Router();
const controladoresUsuario = require('./usuario');
const controladoresTransacao = require('./transaction');
const autenticar = require('./autenticar');
const validar = require('./validar');

router.post('/usuario', validar.validarUsuario, controladoresUsuario.cadastrarUsuario);
router.post('/login', validar.validarLogin, controladoresUsuario.login);
router.get('/perfil', autenticar, controladoresUsuario.detalharPerfil);
router.put('/perfil', autenticar, validar.validarUsuario, controladoresUsuario.editarPerfil);

router.get('/categorias', autenticar, controladoresTransacao.listarCategorias);
router.get('/extrato', autenticar, controladoresTransacao.obterExtrato);
router.get('/transacoes', autenticar, controladoresTransacao.listarTransacoes);
router.get('/transacoes/:id', autenticar, controladoresTransacao.detalharTransacao);
router.post('/transacoes', autenticar, validar.validarTransacao, controladoresTransacao.cadastrarTransacao);
router.put('/transacoes/:id', autenticar, validar.validarTransacao, controladoresTransacao.editarTransacao);
router.delete('/transacoes/:id', autenticar, controladoresTransacao.removerTransacao);

module.exports = router;
