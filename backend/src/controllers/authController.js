const crypto = require("crypto");

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

async function forgotPassword(req, res) {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Informe um e-mail"
      });
    }

    const usuarioResult =
      await pool.query(
        `
        SELECT *
        FROM usuario
        WHERE email = $1
      `,
        [email]
      );

    if (
      usuarioResult.rows.length === 0
    ) {
      return res.status(404).json({
        message:
          "Usuário não encontrado"
      });
    }

    const usuario =
      usuarioResult.rows[0];

    const token =
      crypto.randomBytes(32)
        .toString("hex");

    const expiracao =
      new Date(
        Date.now() +
        1000 * 60 * 30
      ); // 30 minutos

    await pool.query(
      `
      INSERT INTO password_reset
      (
        id_usuario,
        token,
        expiracao
      )
      VALUES ($1,$2,$3)
    `,
      [
        usuario.id_usuario,
        token,
        expiracao
      ]
    );

    const link =
      `http://localhost:5173/reset-password/${token}`;

    res.json({
      message:
        "Link de recuperação gerado",
      link
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Erro ao recuperar senha"
    });
  }
}

async function resetPassword(
  req,
  res
) {
  try {

    const { token } =
      req.params;

    const { novaSenha } =
      req.body;

    if (!novaSenha) {
      return res.status(400).json({
        message:
          "Informe uma nova senha"
      });
    }

    const tokenResult =
      await pool.query(
        `
        SELECT *
        FROM password_reset
        WHERE token = $1
        AND usado = FALSE
      `,
        [token]
      );

    if (
      tokenResult.rows.length === 0
    ) {
      return res.status(400).json({
        message:
          "Token inválido"
      });
    }

    const reset =
      tokenResult.rows[0];

    if (
      new Date(reset.expiracao) <
      new Date()
    ) {
      return res.status(400).json({
        message:
          "Token expirado"
      });
    }

    const senhaHash =
      await bcrypt.hash(
        novaSenha,
        10
      );

    await pool.query(
      `
      UPDATE usuario
      SET senha = $1
      WHERE id_usuario = $2
    `,
      [
        senhaHash,
        reset.id_usuario
      ]
    );

    await pool.query(
      `
      UPDATE password_reset
      SET usado = TRUE
      WHERE id_reset = $1
    `,
      [reset.id_reset]
    );

    res.json({
      message:
        "Senha alterada com sucesso"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Erro ao redefinir senha"
    });
  }
}

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};