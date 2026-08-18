import { Router } from "express";
import { itemsController } from "../controllers/items.controller";

export const itemsRouter = Router();

itemsRouter.post("/items/:itemId/purchase", itemsController.markPurchased);
itemsRouter.post("/items/:itemId/ticket", itemsController.attachTicket);
// Nota: /items/:itemId/reserve y /release también existen vía REST como respaldo,
// pero el flujo principal recomendado es a través de sockets (ver sockets/reservation.handlers.ts)
// para que la resolución de conflictos sea instantánea (<1s, criterio de aceptación EDT 1.2.2.4).
