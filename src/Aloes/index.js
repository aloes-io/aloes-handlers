const mqttPattern = require("mqtt-pattern");
const {logger} = require("../logger");
const protocolPatterns = require("../protocol-patterns.json");

const clientToAloesLight = (instance, protocol) => {
  // "+prefixedDevEui/+method/+omaObjectId/+sensorId/+omaResourceId",
  let topic = null;
  const params = {
    prefixedDevEui: `${instance.devEui}${instance.inPrefix}`,
    omaObjectId: instance.type,
    sensorId: instance.nativeSensorId,
    omaResourceId: instance.resource,
  };
  logger(4, "handlers", "clientToAloesLight", params);
  if (protocol.method === "POST" || protocol.method === "PUT") {
    params.method = 1;
    topic = mqttPattern.fill(protocolPatterns.aloesLight.pattern, params);
    return {topic, payload: instance.value};
  } else if (protocol.method === "GET") {
    params.method = 2;
    topic = mqttPattern.fill(protocolPatterns.aloesLight.pattern, params);
    return {topic, payload: instance.value};
  }
  return "Method not supported yet";
};

const clientToMySensors = (instance, protocol) => {
  //  "+prefixedDevEui/+nodeId/+sensorId/+method/+ack/+subType",
  let topic = null;
  const params = {
    prefixedDevEui: `${instance.devEui}${instance.inPrefix}`,
    nodeId: instance.nativeNodeId,
    sensorId: instance.nativeSensorId,
    subType: instance.nativeResource,
  };
  logger(4, "handlers", "clientToMySensors", params);
  if (protocol.method === "POST" || protocol.method === "PUT") {
    params.method = 2;
    params.ack = 0;
    topic = mqttPattern.fill(protocolPatterns.mySensors.pattern, params);
    return {topic, payload: instance.value};
  } else if (protocol.method === "GET") {
    params.method = 2;
    params.ack = 0;
    topic = mqttPattern.fill(protocolPatterns.mySensors.pattern, params);
    return {topic, payload: instance.value};
  }
  return "Method not supported yet";
};

const aloesClientDecoder = (packet, protocol) => {
  try {
    logger(4, "handlers", "aloesClientDecoder:req", protocol);
    const instance = JSON.parse(packet.payload);
    const protocolKeys = Object.getOwnPropertyNames(protocol);
    logger(4, "handlers", "aloesClientDecoder:req", protocolKeys.length);
    if (protocolKeys.length === 3  || protocolKeys.length === 4) {
      let decodedPayload;
      logger(4, "handlers", "aloesClientDecoder:req", instance);
      switch (instance.protocolName) {
        case "aloesLight":
          decodedPayload = clientToAloesLight(instance, protocol);
          break;
        case "mySensors":
          decodedPayload = clientToMySensors(instance, protocol);
          break;
        case "nodeWebcam": // Req
          //  await clientToMySensors(app, newPayload);
          break;
        default:
          decodedPayload = "Protocol not supported yet";
          break;
      }
      return decodedPayload;
    }
    return "topic doesn't match";
  } catch (error) {
    logger(4, "handlers", "aloesClientDecoder:err", error);
    throw error;
  }
};

module.exports = {
  clientToAloesLight,
  clientToMySensors,
  aloesClientDecoder,
};
