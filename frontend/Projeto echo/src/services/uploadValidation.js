/**
 * Utilitário de validação de uploads de imagem.
 * Reutilizável em qualquer parte do sistema que aceite upload de imagens.
 */

// ─── Constantes ───────────────────────────────────────────────────────────────

export const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_FILE_SIZE_LABEL = "5 MB";

// ─── Mensagens de erro ────────────────────────────────────────────────────────

export const UPLOAD_ERRORS = {
  INVALID_TYPE:
    "O arquivo selecionado não é uma imagem válida. Envie apenas arquivos JPG, JPEG, PNG ou WEBP.",
  FILE_TOO_LARGE: `A imagem deve ter no máximo ${MAX_FILE_SIZE_LABEL}.`,
};

// ─── Função principal ─────────────────────────────────────────────────────────

/**
 * Valida um arquivo de imagem pelo MIME type, extensão e tamanho.
 *
 * @param {File} file - Arquivo a ser validado.
 * @returns {{ valid: boolean; error: string | null }}
 */
export function validateImageFile(file) {
  if (!file) return { valid: false, error: UPLOAD_ERRORS.INVALID_TYPE };

  const extension = "." + file.name.split(".").pop().toLowerCase();
  const mimeType  = file.type.toLowerCase();

  const mimeOk = ALLOWED_MIME_TYPES.has(mimeType);
  const extOk  = ALLOWED_EXTENSIONS.has(extension);

  if (!mimeOk || !extOk) {
    return { valid: false, error: UPLOAD_ERRORS.INVALID_TYPE };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: UPLOAD_ERRORS.FILE_TOO_LARGE };
  }

  return { valid: true, error: null };
}
