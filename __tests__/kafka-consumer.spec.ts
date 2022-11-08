import { publishEvent } from "../src/utils/kakfa-consumer";

describe ("Testing Even Emitter", () => {
  it("should return correct property values", () => {
    const topic = "realtime";
    const testPayload = {
      source: "registration",
      groupId: "12345",
      payload: {
        firstName: "dudeson",
        lastName: "betsafe",
      },
    };
    const payloadToPublish = publishEvent(topic, JSON.stringify(testPayload));
    expect(payloadToPublish?.event)
      .toEqual(`${topic}:${testPayload.source}:${testPayload.groupId}`);
    expect(payloadToPublish?.payload).toEqual(testPayload.payload);
  });

  it("should return correct property values - without groupId", () => {
    const topic = "realtime";
    const testPayload = {
      source: "registration",
      payload: {
        firstName: "dudeson",
        lastName: "betsafe",
      },
    };
    const payloadToPublish = publishEvent(topic, JSON.stringify(testPayload));
    expect(payloadToPublish?.event).toEqual(`${topic}:${testPayload.source}`);
    expect(payloadToPublish?.payload).toEqual(testPayload.payload);
  });

  it("should return correct property values - without source and groupId", () => {
    const topic = "realtime";
    const testPayload = {
      payload: {
        firstName: "dudeson",
        lastName: "betsafe",
      },
    };
    const payloadToPublish = publishEvent(topic, JSON.stringify(testPayload));
    expect(payloadToPublish?.event).toEqual(topic);
    expect(payloadToPublish?.payload).toEqual(testPayload.payload);
  });

  it("should return correct property values - without payload", () => {
    const topic = "realtime";
    const testPayload = {
      source: "registration",
      groupId: "12345",
    };
    const payloadToPublish = publishEvent(topic, JSON.stringify(testPayload));
    expect(payloadToPublish?.event).toEqual(`${topic}:${testPayload.source}:${testPayload.groupId}`);
    expect(payloadToPublish?.payload).toBeUndefined();
  });

  it("should not return anything if stringMessage is not parsable", () => {
    const payloadToPublish = publishEvent("realtime", "23-094lk;sdf-09324wserwer][]");
    expect(payloadToPublish).toBeUndefined();
  });

});
