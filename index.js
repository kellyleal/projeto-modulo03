
const express = require('express');
const app = express();
const rotasUsuario = require('./src/usuario');
const rotasTransacao = require('./src/transaction');

app.use(express.json());
app.use('/usuario', rotasUsuario);
app.use('/transacao', rotasTransacao);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
