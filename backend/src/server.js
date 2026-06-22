const authRoutes = require(
  "./routes/authRoutes"
);

const authMiddleware = require(
  "./middleware/authMiddleware"
);

const upload = require(
  "./multerConfig"
);

const pool = require(
  "./config/db"
);

const express = require(
  "express"
);

const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.use(
  "/uploads",
  express.static("src/uploads")
);

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send(
    "API do Echo funcionando!"
  );
});

// =========================
// BUSCAR TODAS AS REVIEWS
// =========================

app.get(
  "/reviews",
  async (req, res) => {
    try {
      const result =
        await pool.query(`
      SELECT
  review.id_review AS id,
  review.titulo,
  review.descricao,
  review.imagem,
  review.nota,
  genero.nome AS genero,
  usuario.nome AS autor,

  COUNT(DISTINCT curtida.id_curtida) AS curtidas,
  COUNT(DISTINCT denuncia.id_denuncia) AS denuncias

FROM review

JOIN usuario
  ON review.id_usuario = usuario.id_usuario

JOIN genero
  ON review.id_genero = genero.id_genero

LEFT JOIN curtida
  ON review.id_review = curtida.id_review

LEFT JOIN denuncia
  ON review.id_review = denuncia.id_review

WHERE review.ativo = TRUE

GROUP BY
  review.id_review,
  genero.nome,
  usuario.nome

ORDER BY review.data_postagem DESC;
      `);

      res.json(result.rows);

    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Erro ao buscar reviews",
      });
    }
  }
);

// =========================
// BUSCAR REVIEW + COMENTÁRIOS
// =========================

app.get(
  "/reviews/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const id = Number(
        req.params.id
      );

      const reviewResult =
        await pool.query(
          `
          SELECT
            review.id_review AS id,
            review.titulo,
            review.descricao,
            review.imagem,
            review.nota,
            genero.nome AS genero,
            usuario.nome AS autor
          FROM review
          JOIN usuario
            ON review.id_usuario = usuario.id_usuario
          JOIN genero
            ON review.id_genero = genero.id_genero
          WHERE review.id_review = $1
          AND review.ativo = TRUE
        `,
          [id]
        );

      if (  
        reviewResult.rows.length === 0
      ) {
        return res
          .status(404)
          .json({
            message:
              "Review não encontrada",
          });
      }

      const comentariosResult =
        await pool.query(
          `
          SELECT
            comentario.id_comentario,
            comentario.texto,
            comentario.data_comentario,
            comentario.id_comentario_pai,
            usuario.nome AS autor
          FROM comentario
          JOIN usuario
            ON comentario.id_usuario = usuario.id_usuario
          WHERE comentario.id_review = $1
          AND comentario.ativo = TRUE
          ORDER BY comentario.data_comentario DESC
        `,
          [id]
        );

      const curtidasResult =
        await pool.query(
          `
          SELECT COUNT(*) AS total
          FROM curtida
          WHERE id_review = $1
        `,
          [id]
        );

      const denunciasResult =
        await pool.query(
          `
          SELECT COUNT(*) AS total
          FROM denuncia
          WHERE id_review = $1
        `,
          [id]
        );

      const usuarioCurtiu =
        await pool.query(
          `
          SELECT *
          FROM curtida
          WHERE id_usuario = $1
          AND id_review = $2
        `,
          [
            req.usuario.id,
            id,
          ]
        );

      res.json({
        review:
          reviewResult.rows[0],

        comentarios:
          comentariosResult.rows,

        curtidas: Number(
          curtidasResult.rows[0]
            .total
        ),

        denuncias: Number(
          denunciasResult.rows[0]
            .total
        ),

        curtido:
          usuarioCurtiu.rows
            .length > 0,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Erro ao buscar review",
      });
    }
  }
);

// =========================
// CRIAR REVIEW
// =========================
app.post(
  "/reviews",
  authMiddleware,
  upload.single("imagem"),
  async (req, res) => {
    try {
      const { titulo, descricao, nota, genero } = req.body;

     

      if (!titulo || titulo.trim() === "") {
        return res.status(400).json({ message: "Título obrigatório" });
      }

      if (titulo.length > 90) {
        return res.status(400).json({ message: "Título deve ter no máximo 90 caracteres" });
      }

      if (!descricao || descricao.trim() === "") {
        return res.status(400).json({ message: "Descrição obrigatória" });
      }

      if (descricao.length > 500) {
        return res.status(400).json({ message: "Descrição deve ter no máximo 500 caracteres" });
      }

      if (!nota) {
        return res.status(400).json({ message: "Nota obrigatória" });
      }

      if (!genero) {
        return res.status(400).json({ message: "Gênero obrigatório" });
      }

      // =========================
      // IMAGEM
      // =========================

      const imagem = req.file
        ? `http://localhost:3000/uploads/${req.file.filename}`
        : null;

      const idUsuario = req.usuario.id;

      // =========================
      // BUSCA GÊNERO
      // =========================

      const generoResult = await pool.query(
        `
        SELECT id_genero
        FROM genero
        WHERE nome = $1
        `,
        [genero]
      );

      if (generoResult.rows.length === 0) {
        return res.status(404).json({
          message: "Gênero não encontrado",
        });
      }

      const idGenero = generoResult.rows[0].id_genero;

      const result = await pool.query(
        `
        INSERT INTO review
        (
          titulo,
          descricao,
          imagem,
          nota,
          id_usuario,
          id_genero
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
        [titulo, descricao, imagem, nota, idUsuario, idGenero]
      );

      return res.status(201).json({
        message: "Review criada com sucesso!",
        review: result.rows[0],
      });

    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: "Erro ao criar review",
      });
    }
  }
);

// =========================
// PERFIL DO USUÁRIO
// =========================

app.get(
  "/profile",
  authMiddleware,
  async (req, res) => {
    try {
      const idUsuario =
        req.usuario.id;

      const usuarioResult =
        await pool.query(
          `
          SELECT
            id_usuario,
            nome,
            email,
            tipo
          FROM usuario
          WHERE id_usuario = $1
        `,
          [idUsuario]
        );

      const reviewsResult =
        await pool.query(
          `
          SELECT
            review.id_review AS id,
            review.titulo,
            review.descricao,
            review.imagem,
            review.nota,
            genero.nome AS genero
          FROM review
          JOIN genero
            ON review.id_genero = genero.id_genero
          WHERE review.id_usuario = $1
          AND review.ativo = TRUE
          ORDER BY review.data_postagem DESC
        `,
          [idUsuario]
        );

      res.json({
        usuario:
          usuarioResult.rows[0],

        reviews:
          reviewsResult.rows,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Erro ao carregar perfil",
      });
    }
  }
);

// =========================
// PERFIL PÚBLICO
// =========================

app.get(
  "/profile/:id",
  authMiddleware,
  async (req, res) => {
    try {

      const idPerfil =
        req.params.id;

      const idLogado =
        req.usuario.id;

      const usuarioResult =
        await pool.query(
          `
          SELECT
            id_usuario,
            nome,
            email
          FROM usuario
          WHERE id_usuario = $1
        `,
          [idPerfil]
        );

      if (
        usuarioResult.rows.length === 0
      ) {
        return res
          .status(404)
          .json({
            message:
              "Usuário não encontrado",
          });
      }

      const reviewsResult =
        await pool.query(
          `
          SELECT
            review.id_review AS id,
            review.titulo,
            review.descricao,
            review.imagem,
            review.nota,
            genero.nome AS genero
          FROM review
          JOIN genero
            ON review.id_genero = genero.id_genero
          WHERE review.id_usuario = $1
          AND review.ativo = TRUE
          ORDER BY review.data_postagem DESC
        `,
          [idPerfil]
        );

      const seguidoresResult =
        await pool.query(
          `
          SELECT COUNT(*) AS total
          FROM seguidores
          WHERE id_seguido = $1
        `,
          [idPerfil]
        );

      const seguindoResult =
        await pool.query(
          `
          SELECT COUNT(*) AS total
          FROM seguidores
          WHERE id_seguidor = $1
        `,
          [idPerfil]
        );

      const segueResult =
        await pool.query(
          `
          SELECT *
          FROM seguidores
          WHERE id_seguidor = $1
          AND id_seguido = $2
        `,
          [
            idLogado,
            idPerfil,
          ]
        );

res.json({
  usuario:
    usuarioResult.rows[0],

  reviews:
    reviewsResult.rows,

  seguidores: Number(
    seguidoresResult.rows[0]
      .total
  ),

  seguindo: Number(
    seguindoResult.rows[0]
      .total
  ),

  segueUsuario:
    segueResult.rows
      .length > 0,

  usuarioLogado:
    Number(idLogado),
});

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Erro ao carregar perfil",
      });
    }
  }
);

// =========================
//  SEGUIR
// =========================

app.post(
  "/usuarios/:id/seguir",
  authMiddleware,
  async (req, res) => {
    try {

      const idSeguidor =
        req.usuario.id;

      const idSeguido =
        req.params.id;

      if (
        Number(idSeguidor) ===
        Number(idSeguido)
      ) {
        return res
          .status(400)
          .json({
            message:
              "Você não pode seguir a si mesmo",
          });
      }

      const existe =
        await pool.query(
          `
          SELECT *
          FROM seguidores
          WHERE id_seguidor = $1
          AND id_seguido = $2
        `,
          [
            idSeguidor,
            idSeguido,
          ]
        );

      if (
        existe.rows.length > 0
      ) {
        return res
          .status(400)
          .json({
            message:
              "Você já segue este usuário",
          });
      }

      await pool.query(
        `
        INSERT INTO seguidores
        (
          id_seguidor,
          id_seguido
        )
        VALUES ($1,$2)
      `,
        [
          idSeguidor,
          idSeguido,
        ]
      );

      res.json({
        message:
          "Usuário seguido com sucesso",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Erro ao seguir usuário",
      });
    }
  }
);

// =========================
// DEIXAR DE SEGUIR
// =========================

app.delete(
  "/usuarios/:id/seguir",
  authMiddleware,
  async (req, res) => {
    try {

      const idSeguidor =
        req.usuario.id;

      const idSeguido =
        req.params.id;

      await pool.query(
        `
        DELETE FROM seguidores
        WHERE id_seguidor = $1
        AND id_seguido = $2
      `,
        [
          idSeguidor,
          idSeguido
        ]
      );

      res.json({
        message:
          "Usuário removido dos seguidos"
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Erro ao deixar de seguir"
      });
    }
  }
);

// =========================
// EXCLUIR REVIEW (SOFT DELETE)
// =========================

app.delete(
  "/reviews/:id",
  authMiddleware,
  async (req, res) => {
    try {

      const idReview =
        req.params.id;

      const idUsuario =
        req.usuario.id;

      if (
        req.usuario.tipo !== "admin"
      ) {

        const reviewResult =
          await pool.query(
            `
            SELECT *
            FROM review
            WHERE id_review = $1
            AND id_usuario = $2
            AND ativo = TRUE
          `,
            [
              idReview,
              idUsuario,
            ]
          );

        if (
          reviewResult.rows.length === 0
        ) {
          return res
            .status(404)
            .json({
              message:
                "Review não encontrada",
            });
        }
      }

      // INATIVA TODOS OS COMENTÁRIOS DA REVIEW

      await pool.query(
        `
        UPDATE comentario
        SET ativo = FALSE
        WHERE id_review = $1
      `,
        [idReview]
      );

      // INATIVA A REVIEW

      await pool.query(
        `
        UPDATE review
        SET ativo = FALSE
        WHERE id_review = $1
      `,
        [idReview]
      );

      res.json({
        message:
          "Review removida com sucesso!",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Erro ao remover review",
      });
    }
  }
);

// =========================
// EDITAR REVIEW
// =========================

app.put(
  "/reviews/:id",
  authMiddleware,
  upload.single("imagem"),
  async (req, res) => {
    try {
      const idReview =
        req.params.id;

      const idUsuario =
        req.usuario.id;

      const {
        titulo,
        descricao,
        nota,
        genero,
      } = req.body;
      if (!titulo?.trim()) {
  return res.status(400).json({
    message:
      "O título é obrigatório",
  });
}

if (!descricao?.trim()) {
  return res.status(400).json({
    message:
      "A descrição é obrigatória",
  });
}

if (!genero) {
  return res.status(400).json({
    message:
      "Selecione um gênero",
  });
}

if (
  !nota ||
  Number(nota) < 1 ||
  Number(nota) > 5
) {
  return res.status(400).json({
    message:
      "Selecione uma nota válida",
  });
}

if (titulo.length > 90) {
  return res.status(400).json({
    message:
      "O título deve ter no máximo 90 caracteres",
  });
}

if (descricao.length > 500) {
  return res.status(400).json({
    message:
      "A descrição deve ter no máximo 500 caracteres",
  });
}

      const imagem = req.file
        ? `http://localhost:3000/uploads/${req.file.filename}`
        : null;

      const generoResult =
        await pool.query(
          `
          SELECT id_genero
          FROM genero
          WHERE nome = $1
        `,
          [genero]
        );

      if (
        generoResult.rows.length === 0
      ) {
        return res
          .status(404)
          .json({
            message:
              "Gênero não encontrado",
          });
      }

      const idGenero =
        generoResult.rows[0]
          .id_genero;

      const result =
        await pool.query(
          `
          UPDATE review
          SET
            titulo = $1,
            descricao = $2,
            imagem = COALESCE($3, imagem),
            nota = $4,
            id_genero = $5
          WHERE id_review = $6
          AND id_usuario = $7
          RETURNING *
        `,
          [
            titulo,
            descricao,
            imagem,
            nota,
            idGenero,
            idReview,
            idUsuario,
          ]
        );

      if (
        result.rows.length === 0
      ) {
        return res
          .status(404)
          .json({
            message:
              "Review não encontrada",
          });
      }

      res.json({
        message:
          "Review atualizada!",
        review: result.rows[0],
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Erro ao atualizar review",
      });
    }
  }
);

// =========================
// CRIAR COMENTÁRIO
// =========================

app.post(
  "/reviews/:id/comentarios",
  authMiddleware,
  async (req, res) => {
    try {
      const idReview =
        req.params.id;

      const idUsuario =
        req.usuario.id;

      const texto =
      req.body.texto?.trim();

const idComentarioPai =
  req.body.id_comentario_pai || null;

      if (!texto) {
        return res
          .status(400)
          .json({
            message:
              "O comentário não pode estar vazio",
          });
      }

      const result =
      await pool.query(
        `
        INSERT INTO comentario
        (
          texto,
          id_usuario,
          id_review,
          id_comentario_pai
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
        [
          texto,
          idUsuario,
          idReview,
          idComentarioPai,
        ]
      );
      res.status(201).json({
        message:
          "Comentário criado!",
        comentario:
          result.rows[0],
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Erro ao comentar",
      });
    }
  }
);

// =========================
// CURTIR / DESCURTIR
// =========================

app.post(
  "/reviews/:id/curtir",
  authMiddleware,
  async (req, res) => {
    try {
      const idReview =
        req.params.id;

      const idUsuario =
        req.usuario.id;

      const curtidaExistente =
        await pool.query(
          `
          SELECT *
          FROM curtida
          WHERE id_usuario = $1
          AND id_review = $2
        `,
          [
            idUsuario,
            idReview,
          ]
        );

      if (
        curtidaExistente.rows.length >
        0
      ) {
        await pool.query(
          `
          DELETE FROM curtida
          WHERE id_usuario = $1
          AND id_review = $2
        `,
          [
            idUsuario,
            idReview,
          ]
        );

        return res.json({
          curtido: false,
          message:
            "Curtida removida",
        });
      }

      await pool.query(
        `
        INSERT INTO curtida
        (
          id_usuario,
          id_review
        )
        VALUES ($1, $2)
      `,
        [
          idUsuario,
          idReview,
        ]
      );

      res.json({
        curtido: true,
        message:
          "Review curtida!",
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Erro ao curtir",
      });
    }
  }
);

// =========================
// DENUNCIAR REVIEW
// =========================

app.post(
  "/reviews/:id/denunciar",
  authMiddleware,
  async (req, res) => {
    try {
      const idReview =
        req.params.id;

      const idUsuario =
        req.usuario.id;

      const denunciaExistente =
        await pool.query(
          `
          SELECT *
          FROM denuncia
          WHERE id_usuario = $1
          AND id_review = $2
        `,
          [
            idUsuario,
            idReview,
          ]
        );

      if (
        denunciaExistente.rows.length >
        0
      ) {
        return res
          .status(400)
          .json({
            message:
              "Você já denunciou esta review",
          });
      }

      await pool.query(
        `
        INSERT INTO denuncia
        (
          motivo,
          status,
          id_usuario,
          id_review
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4
        )
      `,
        [
          "Denúncia do usuário",
          "PENDENTE",
          idUsuario,
          idReview,
        ]
      );

      res.status(201).json({
        message:
          "Review denunciada!",
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Erro ao denunciar",
      });
    }
  }
);

// =========================
// LISTAR DENÚNCIAS (ADM)
// =========================

app.get(
  "/admin/denuncias",
  authMiddleware,
  async (req, res) => {
    try {

      // VERIFICA SE É ADM

      if (
        req.usuario.tipo !== "admin"
      ) {
        return res
          .status(403)
          .json({
            message:
              "Acesso negado",
          });
      }

      const result =
        await pool.query(`
        SELECT
  review.id_review,
  review.titulo,
  usuario.nome AS autor,
  usuario.id_usuario AS id_autor,
  COUNT(denuncia.id_denuncia) AS denuncias

FROM denuncia

JOIN review
  ON denuncia.id_review = review.id_review

JOIN usuario
  ON review.id_usuario = usuario.id_usuario

WHERE review.ativo = TRUE

GROUP BY
  review.id_review,
  review.titulo,
  usuario.nome

ORDER BY denuncias DESC;
        `);

      res.json(
        result.rows
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Erro ao buscar denúncias",
      });
    }
  }
);


// =========================
// MIDDLEWARE ADM
// =========================

function adminMiddleware(
  req,
  res,
  next
) {

  if (
    req.usuario.tipo !== "admin"
  ) {
    return res
      .status(403)
      .json({
        message:
          "Acesso negado",
      });
  }

  next();
}


// =========================
// LIMPAR DENÚNCIAS
// =========================

app.delete(
  "/admin/denuncias/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {

    try {

      const idReview =
        req.params.id;

      await pool.query(
        `
        DELETE FROM denuncia
        WHERE id_review = $1
      `,
        [idReview]
      );

      res.json({
        message:
          "Denúncias removidas",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Erro ao limpar denúncias",
      });
    }
  }
);

// =========================
// CRIAR NOVO ADM
// =========================

const bcrypt = require(
  "bcrypt"
);

app.post(
  "/admin/criar-admin",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {

    try {

      const {
        nome,
        email,
        senha,
      } = req.body;

      const usuarioExistente =
        await pool.query(
          `
          SELECT *
          FROM usuario
          WHERE email = $1
        `,
          [email]
        );

      if (
        usuarioExistente.rows.length > 0
      ) {
        return res
          .status(400)
          .json({
            message:
              "E-mail já cadastrado",
          });
      }

      const senhaHash =
        await bcrypt.hash(
          senha,
          10
        );

      await pool.query(
        `
        INSERT INTO usuario
        (
          nome,
          email,
          senha,
          tipo
        )
        VALUES
        (
          $1,
          $2,
          $3,
          'admin'
        )
      `,
        [
          nome,
          email,
          senhaHash,
        ]
      );

      res.status(201).json({
        message:
          "Administrador criado com sucesso!",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Erro ao criar administrador",
      });
    }
  }
);
// =========================
// INICIAR SERVIDOR
// =========================

pool
  .connect()
  .then(() => {
    console.log(
      "Conectado ao PostgreSQL!"
    );
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log(
    "Servidor rodando na porta 3000"
  );
});