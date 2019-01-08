const mqttPattern = require("mqtt-pattern");
const logger = require("../logger");
const protocolPatterns = require("../protocol-patterns.json");

const clientToAloesIoT = async (instance, protocol) => {
  // "+prefixedDevEui/+method/+ipsoObjectId/+sensorId/+ipsoResourcesId",
  let params;
  let payload = null;
  if (protocol.collectionName === "Sensor") {
    const resourcesKeys = Object.getOwnPropertyNames(instance.resources);
    params = {
      prefixedDevEui: `${instance.devEui}-in`,
      method: 1,
      ipsoObjectId: instance.type,
      sensorId: instance.nativeSensorId,
      ipsoResourcesId: resourcesKeys[0],
    };
    payload = instance.resources[resourcesKeys[0]];
  } else if (protocol.collectionName === "Device") {
    params = {
      prefixedDevEui: `${instance.devEui}-in`,
      method: 1,
      ipsoObjectId: instance.type,
      sensorId: 0,
      ipsoResourcesId: 5700,
    };
    payload = instance.config[0] || 0;
  }
  if (payload === null || !params) return null;
  const topic = mqttPattern.fill(protocolPatterns.aloes.pattern, params);
  logger.publish(4, "handlers", "clientToAloesIoT:res", {topic, payload});
  return {topic, payload};
};

const clientToMySensors = async (instance, protocol) => {
  //  "+prefixedDevEui/+nodeId/+sensorId/+method/+ack/+subType",
  let params;
  let payload = null;
  if (protocol.collectionName === "Sensor") {
    const resourcesKeys = Object.getOwnPropertyNames(instance.resources);
    params = {
      prefixedDevEui: `${instance.devEui}-in`,
      method: 1,
      ack: 0,
      nodeId: instance.nativeNodeId,
      sensorId: instance.nativeSensorId,
      subType: instance.nativeResource,
    };
    payload = instance.resources[resourcesKeys[0]];
  } else if (protocol.collectionName === "Device") {
    params = {
      prefixedDevEui: `${instance.devEui}-in`,
      method: 1,
      ack: 0,
      nodeId: 0,
      sensorId: 200,
      subType: instance.config || 0,
    };
    payload = instance.config || 0;
  }
  if (payload === null || !params) return null;
  const topic = mqttPattern.fill(protocolPatterns.mySensors.pattern, params);
  logger.publish(4, "handlers", "clientToMySensors:res", {topic, payload});
  return {topic, payload: instance.value};
};

const aloesClientDecoder = async (packet, protocol) => {
  try {
    logger.publish(4, "handlers", "aloesClientDecoder:req", protocol);
    const instance = JSON.parse(packet.payload);
    let decodedPayload;
    logger.publish(4, "handlers", "aloesClientDecoder:req", instance);
    switch (instance.protocolName) {
      case "aloes":
        decodedPayload = await clientToAloesIoT(instance, protocol);
        break;
      case "mySensors":
        decodedPayload = await clientToMySensors(instance, protocol);
        break;
      case "nodeWebcam": // Req
        //  await clientToMySensors(app, newPayload);
        break;
      default:
        break;
    }
    return decodedPayload;
  } catch (error) {
    logger.publish(4, "handlers", "aloesClientDecoder:err", error);
    throw error;
  }
};

module.exports = {
  clientToAloesIoT,
  clientToMySensors,
  aloesClientDecoder,
};
