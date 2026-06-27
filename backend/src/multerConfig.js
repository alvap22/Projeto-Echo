const multer = require("multer");
const path   = require("path");
const crypto = require("crypto");

// ─── Constantes de validação ────────────────────────────────────────────────

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

// ─── Storage ─────────────────────────────────────────────────────────────────
// Usa caminho absoluto para garantir que a pasta seja encontrada independente
// de onde o processo Node.js seja iniciado.
// __dirname aqui é: backend/src/
// Portanto: backend/src/uploads/

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },

  filename: (_req, file, cb) => {
    const ext      = path.extname(file.originalname).toLowerCase();
    const uniqueId = crypto.randomBytes(16).toString("hex");
    cb(null, `${Date.now()}-${uniqueId}${ext}`);
  },
});

// ─── File filter ─────────────────────────────────────────────────────────────
// Valida MIME type E extensão antes de aceitar o arquivo.

function fileFilter(_req, file, cb) {
  const ext  = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype.toLowerCase();

  const mimeOk = ALLOWED_MIME_TYPES.has(mime);
  const extOk  = ALLOWED_EXTENSIONS.has(ext);

  if (!mimeOk || !extOk) {
    const err = new Error(
      "Arquivo inválido. São aceitas apenas imagens JPG, JPEG, PNG ou WEBP."
    );
    err.code   = "INVALID_FILE_TYPE";
    err.status = 415;
    return cb(err, false);
  }

  cb(null, true);
}

// ─── Instância do multer ──────────────────────────────────────────────────────

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_SIZE_BYTES,
  },
});

module.exports = upload;