import { Router } from "express";
import multer from "multer";
import path from "node:path";
import { config } from "../config/env";
import { db } from "../db/connection";

// RF-12 / EDT 1.1.5.1: subida y almacenamiento de fotos de tickets.
// Para este proyecto académico se guarda en disco local; en producción real se recomienda
// migrar a un bucket externo (S3, Cloudinary) sin cambiar el contrato del endpoint (ver docs/09-despliegue.md).
const storage = multer.diskStorage({
  destination: config.uploadsDir,
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 8 * 1024 * 1024 } });

export const uploadsRouter = Router();

uploadsRouter.post("/items/:itemId/ticket-upload", upload.single("ticket"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Falta el archivo 'ticket'" });

  const url = `/uploads/${path.basename(req.file.path)}`;
  db.prepare("UPDATE items SET ticket_image_uri = ?, updated_at = ? WHERE id = ?").run(
    url,
    new Date().toISOString(),
    req.params.itemId,
  );

  res.json({ url });
});
