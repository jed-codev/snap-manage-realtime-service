import express, { Application, Request, Response, NextFunction } from "express";
import kafkaConsumer from "./utils/kakfa-consumer";
import type { Server as SocketIo } from "socket.io";
import socketIo from "./utils/socket.io";

class Main {
  private app: Application
  private port: number | string
  private kafkaURLStrings: string[]
  private io: SocketIo

  constructor() {
    this.app = express();
    this.port = process.env.PORT  || 4000
    const server = this.listen();
    this.io = socketIo(server);

    this.kafkaURLStrings = JSON.parse(process.env.KAFKA_URL_STRING || '["localhost:9092"]');
    kafkaConsumer(this.kafkaURLStrings, this.io);
  }

  public listen() {
    return this.app.listen(this.port, () => {
      console.log(`*** server is listening at port ${this.port}`);
    });
  }
}

new Main();
