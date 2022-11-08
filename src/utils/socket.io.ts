import { Server as SocketIo } from "socket.io";
import { IncomingMessage, Server, ServerResponse } from "http";
import auth from "../middlewares/auth";

export default (server: Server<typeof IncomingMessage, typeof ServerResponse>) => {
  const io = new SocketIo(server, { 
    path: "/api/socket.io/",
    cors: {
      // origin: JSON.parse(process.env.WS_ALLOWED_ORIGINS || "[]"),
      /** for testing locally */
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST"],
    } 
  });
  
  io.use(auth);

  let webSocketClients: Array<string> = [];

  io.on("connection", (socket) => {
    // push socket id to memory Array
    webSocketClients.push(socket.id);
    // log client connections
    console.log(`*** ${webSocketClients.length} web socket client/s connected`);
    // listen to web sockets disconnect, remove socket id to memory Array
    socket.on("disconnect", () => {
      webSocketClients.splice(webSocketClients.indexOf(socket.id), 1);
    });
  });

  return io;
};