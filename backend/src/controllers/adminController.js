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

module.exports = {
  listarAdmins,
};