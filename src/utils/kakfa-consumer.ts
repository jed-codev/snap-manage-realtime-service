
import { Kafka } from "kafkajs";
import type { Server as SocketIo } from "socket.io";

export interface IKafkaMessageValue {
  source: string;
  groupId?: string;
  payload?: object;
}

export default async (kafkaURLStrings: string[], ws: SocketIo) => {
  console.log(kafkaURLStrings)
  const kafka = new Kafka({
    clientId: 'snap-manage',
    brokers: kafkaURLStrings,
  });
  const consumer = kafka.consumer({groupId: 'snap-manage'});
  await consumer.connect();
  await consumer.subscribe({
    topic: 'realtime',
    fromBeginning: true,
  });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const wsEvent = publishEvent(topic, message.value?.toString());
      if (wsEvent) {
        ws.emit(wsEvent.event, wsEvent.payload);
      }
    },
  });
};

interface IWsPayload {
  event: string;
  payload?: object;
}

export const publishEvent = (topic: string, stringMessage: string | undefined)
  : IWsPayload | void => {
  if (stringMessage) {
    try {
      const { source, groupId, payload }: IKafkaMessageValue = JSON.parse(stringMessage);
      if (!source) {
        console.warn("message value does not have a \"source\" property");
      }
      const event = `${topic}${source ? ":" + source : ''}${groupId ? ":" + groupId : ''}`;
      return { event, payload };
    } catch (e) {
      console.warn("unable to properly parse stringMessage");
    }
  }
};