const transformarData = (date) => {
    const momento = new Date(date).toLocaleString();

    let registro = momento.split(",");
    let data = registro[0].split("/");
    let hora = registro[1].trim();

    return dataformatada = `${data[0]}-${data[1]}-${data[2]} ${hora}`;
};

const listarCategorias = async (req, res) => {
    try {
        const { rows } = await query('SELECT * FROM categorias');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

const listarTransacoes = async (req, res) => {
    try {
        const { rows } = await query('SELECT * FROM transacoes WHERE usuario_id = $1', [req.usuario.id]);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

const detalharTransacoes = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await query('SELECT * FROM transacoes WHERE id = $1 AND usuario_id = $2', [id, req.usuario.id]);
        if (rows.length === 0) {
            return res.status(404).json({ mensagem: 'Transação não encontrada' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

const cadastrarTransacoes = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body;
    const dataFormatada = transformarData(data);
    try {
        const { rows } = await query('INSERT INTO transacoes (descricao, valor, data, categoria_id, usuario_id, tipo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [descricao, valor, dataFormatada, categoria_id, req.usuario.id, tipo]);
        res.status(201).json(rows[0]);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

const editarTransacoes = async (req, res) => {
    const { id } = req.params;
    const { descricao, valor, data, categoria_id, tipo } = req.body;
    const dataFormatada = transformarData(data);
    try {
        const { rowCount } = await query('UPDATE transacoes SET descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 WHERE id = $6 AND usuario_id = $7', [descricao, valor, dataFormatada, categoria_id, tipo, id, req.usuario.id]);
        if (rowCount === 0) {
            return res.status(404).json({ mensagem: 'Transação não encontrada' });
        }
        res.status(204).json();
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

const removerTransacoes = async (req, res) => {
    const { id } = req.params;
    try {
        const { rowCount } = await query('DELETE FROM transacoes WHERE id = $1 AND usuario_id = $2', [id, req.usuario.id]);
        if (rowCount === 0) {
            return res.status(404).json({ mensagem: 'Transação não encontrada' });
        }
        res.status(204).json();
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

const obterExtrato = async (req, res) => {
    try {
        const { rows } = await query('SELECT * FROM transacoes WHERE usuario_id = $1 ORDER BY data DESC', [req.usuario.id]);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

module.exports = {
    transformarData,
    listarCategorias,
    listarTransacoes,
    detalharTransacoes,
    cadastrarTransacoes,
    editarTransacoes,
    removerTransacoes,
    obterExtrato
};
