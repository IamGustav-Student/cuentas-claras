import { io, Socket } from "socket.io-client";
import { env } from "@/config/env";

// Conexión Socket.IO compartida por toda la app.
// Se usa para todo lo que debe reflejarse "al instante" en los demás dispositivos:
// reservas, conflictos de reserva simultánea (RF-08), cambios de estado de ítems, balance actualizado.
let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(env.socketUrl, { autoConnect: true, transports: ["websocket"] });
  }
  return socket;
}

export function joinSessionRoom(sessionId: string) {
  getSocket().emit("session:join", { sessionId });
}
