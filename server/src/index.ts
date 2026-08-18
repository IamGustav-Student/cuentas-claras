import { createServer } from "node:http";
import { app } from "./app";
import { createSocketServer } from "./sockets";
import { config } from "./config/env";
import "./db/connection"; // aplica schema.sql al arrancar

const httpServer = createServer(app);
createSocketServer(httpServer);

httpServer.listen(config.port, () => {
  console.log(`CuentasClaras backend escuchando en http://localhost:${config.port}`);
});
