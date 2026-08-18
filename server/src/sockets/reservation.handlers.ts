import { Server as SocketServer, Socket } from "socket.io";
import { createReservationQueueService } from "../services/reservationQueue.service";

// Wiring de los eventos en tiempo real (RF-08, CU-02, CU-02a).
export function registerReservationHandlers(io: SocketServer, socket: Socket) {
  const queue = createReservationQueueService(io);

  socket.on("session:join", ({ sessionId }: { sessionId: string }) => {
    socket.join(`session:${sessionId}`);
  });

  socket.on("reserve:attempt", ({ itemId, participantId, participantName }) => {
    queue.attempt(itemId, participantId, participantName ?? "otro usuario");
  });

  socket.on("reserve:respond", ({ itemId, participantId, insist }) => {
    queue.respond(itemId, participantId, insist);
  });

  socket.on("item:release", ({ itemId }) => {
    queue.release(itemId);
  });
}
