import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export default (socket: Socket<DefaultEventsMap>
    , next: (err?: ExtendedError) => void) => {
  const { token } = socket.handshake.auth;
  if (token !== process.env.WS_TOKEN) {
    next(new Error("connection unauthorized"));
  }
  next();
}