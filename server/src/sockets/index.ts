import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "node:http";
import { registerReservationHandlers } from "./reservation.handlers";

export function createSocketServer(httpServer: HttpServer) {
  const io = new SocketServer(httpServer, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    registerReservationHandlers(io, socket);
  });

  return io;
}
