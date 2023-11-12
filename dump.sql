-- Cria a tabela de usuários
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL
);

-- Cria a tabela de categorias
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(100) NOT NULL UNIQUE
);

-- Cria a tabela de transações
CREATE TABLE transacoes (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(100) NOT NULL,
    valor INTEGER NOT NULL CHECK (valor >= 0),
    data TIMESTAMP NOT NULL,
    categoria_id INTEGER REFERENCES categorias(id),
    usuario_id INTEGER REFERENCES usuarios(id),
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('entrada', 'saida'))
);
