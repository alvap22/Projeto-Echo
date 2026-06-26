const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  listarAdmins,
} = require("../controllers/adminController");

router.get(
  "/admins",
  authMiddleware,
  listarAdmins
);

module.exports = router;