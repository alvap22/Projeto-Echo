const pool = require("../config/db");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

async function register(req, res) {
  try {
    const { nome, email, senha } = req.body;

    const usuarioExiste = await pool.query(
      `
      SELECT * FROM usuario
      WHERE email = $1
    `,
      [email]
    );

    if (usuarioExiste.rows.length > 0) {
      return res.status(400).json({
        message: "Email já cadastrado",
      });
    }

    const senhaCriptografada =
      await bcrypt.hash(senha, 10);

    const result = await pool.query(
      `
      INSERT INTO usuario
      (
        nome,
        email,
        senha,
        tipo
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
      [
        nome,
        email,
        senhaCriptografada,
        "USER",
      ]
    );

    res.status(201).json({
      message:
        "Usuário criado com sucesso!",
      usuario: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message:
        "Erro ao criar usuário",
    });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    const result = await pool.query(
      `
      SELECT * FROM usuario
      WHERE email = $1
    `,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message:
          "Usuário não encontrado",
      });
    }

    const usuario = result.rows[0];

    const senhaCorreta =
      await bcrypt.compare(
        senha,
        usuario.senha
      );

    if (!senhaCorreta) {
      return res.status(401).json({
        message: "Senha inválida",
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        tipo: usuario.tipo,
      },
      "segredo_echo",
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login realizado!",
      token,
      usuario: {
        id: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Erro no login",
    });
  }
}

module.exports = {
  register,
  login,
};