import { Router } from "express";
import { v4 as uuid } from "uuid";
import { db } from "../db/connection";

export const usersRouter = Router();

// RF-02: registrar el nombre del usuario al ingresar por el link.
usersRouter.post("/sessions/:sessionId/participants", (req, res) => {
  const { sessionId } = req.params;
  const { name } = req.body as { name: string };

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ error: "El nombre es obligatorio" });
  }

  const id = uuid();
  const joinedAt = new Date().toISOString();
  db.prepare(
    `INSERT INTO participants (id, session_id, name, is_host, joined_at) VALUES (?, ?, ?, 0, ?)`,
  ).run(id, sessionId, name.trim(), joinedAt);

  res.status(201).json({ id, sessionId, name: name.trim(), isHost: false, joinedAt });
});

usersRouter.get("/sessions/:sessionId/participants", (req, res) => {
  const rows = db.prepare("SELECT * FROM participants WHERE session_id = ?").all(req.params.sessionId);
  res.json(rows);
});
