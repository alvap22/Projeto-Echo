const pool = require("../config/db");

async function listarAdmins(req, res) {
  try {
    const result = await pool.query(`
      SELECT
        id_usuario,
        nome,
        email,
        tipo,
        ativo,
        data_criacao
      FROM usuario
      WHERE tipo = 'admin'
      ORDER BY nome
    `);

    res.json(result.rows);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Erro ao listar administradores"
    });
  }
}

async function listarUsuarios(req, res) {
  try {
    if (req.usuario.tipo !== "admin") {
      return res.status(403).json({
        message: "Acesso negado",
      });
    }

    const result = await pool.query(`
      SELECT
        id_usuario,
        nome,
        email,
        tipo,
        ativo,
        data_criacao
      FROM usuario
      ORDER BY nome
    `);

    res.json(result.rows);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Erro ao listar usuários",
    });
  }
}

async function toggleStatusUsuario(req, res) {
  try {
    if (req.usuario.tipo !== "admin") {
      return res.status(403).json({
        message: "Acesso negado",
      });
    }

    const { id } = req.params;

    if (Number(id) === Number(req.usuario.id)) {
      return res.status(400).json({
        message: "Você não pode alterar o status do seu próprio usuário",
      });
    }

    const result = await pool.query(`
      UPDATE usuario
      SET ativo = NOT ativo
      WHERE id_usuario = $1
      RETURNING id_usuario, nome, email, tipo, ativo, data_criacao
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    }

    const usuarioAtualizado = result.rows[0];
    res.json({
      message: `Usuário ${usuarioAtualizado.ativo ? 'ativado' : 'desativado'} com sucesso!`,
      usuario: usuarioAtualizado,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Erro ao alterar status do usuário",
    });
  }
}

module.exports = {
  listarAdmins,
  listarUsuarios,
  toggleStatusUsuario,
};