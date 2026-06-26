const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  listarAdmins,
  listarUsuarios,
  toggleStatusUsuario,
} = require("../controllers/adminController");

router.get(
  "/admins",
  authMiddleware,
  listarAdmins
);

router.get(
  "/usuarios",
  authMiddleware,
  listarUsuarios
);

router.put(
  "/usuarios/:id/toggle",
  authMiddleware,
  toggleStatusUsuario
);

module.exports = router;