import { NextFunction, Request, Response } from "express";

// Validación mínima reutilizable (mantener simple: para un proyecto de esta escala no hace
// falta una librería de esquemas; si crece, migrar a zod).
export function requireFields(fields: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const missing = fields.filter((f) => req.body[f] === undefined || req.body[f] === null);
    if (missing.length > 0) {
      return res.status(400).json({ error: `Faltan campos: ${missing.join(", ")}` });
    }
    next();
  };
}
