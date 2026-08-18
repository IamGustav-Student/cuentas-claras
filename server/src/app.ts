import express from "express";
import cors from "cors";
import path from "node:path";
import { config } from "./config/env";
import { sessionsRouter } from "./routes/sessions.routes";
import { itemsRouter } from "./routes/items.routes";
import { usersRouter } from "./routes/users.routes";
import { uploadsRouter } from "./routes/uploads.routes";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use("/uploads", express.static(path.resolve(config.uploadsDir)));

app.use(sessionsRouter);
app.use(itemsRouter);
app.use(usersRouter);
app.use(uploadsRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use(errorHandler);
