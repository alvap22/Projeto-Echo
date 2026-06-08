const jwt = require("jsonwebtoken");

function authMiddleware(
  req,
  res,
  next
) {
  const authHeader =
    req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Token não enviado",
    });
  }

  const token =
    authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      "segredo_echo"
    );

    req.usuario = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido",
    });
  }
}

module.exports = authMiddleware;