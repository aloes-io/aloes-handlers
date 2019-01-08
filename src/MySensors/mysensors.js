const mqttPattern = require("mqtt-pattern");
const {logger} = require("../logger");
const mySensorsApi = require("./mysensors-api.json");
const ipsoObjects = require("../IPSO/ipso-objects.json");
const protocolPatterns = require("../protocol-patterns.json");

// device as argument ?
const mySensorsToIpsoObject = (msg) => {
  try {
    logger(2, "handlers", "mySensorsToIpsoObject:req", msg);
    if (msg.sensorId === 255 || msg.ipsoObject === null) {
      return null;
    }
    const foundIpsoObject = ipsoObjects.find((object) => object.value === msg.ipsoObject);
    if (!foundIpsoObject) return "no IPSO Object found";
    const sensor = {
      devEui: msg.devEui,
      protocolName: "mySensors",
      name: foundIpsoObject.name,
      type: msg.ipsoObject,
      resources: foundIpsoObject.resources,
      icons: foundIpsoObject.icons,
      colors: foundIpsoObject.colors,
      nativeType: msg.type,
      nativeNodeId: msg.nodeId,
      nativeSensorId: msg.sensorId,
      frameCounter: 0,
    };
    logger(2, "handlers", "mySensorsToIpsoObject:res", sensor);
    return sensor;
  } catch (error) {
    logger(2, "handlers", "mySensorsToIpsoObject:err", error);
    throw error;
  }
};

// sensor as argument ?
const mySensorsToIpsoResources = (msg) => {
  try {
    logger(2, "handlers", "mySensorsToIpsoResources:req", msg);
    if (msg.sensorId === 255) {
      return null;
    }
    const mySensorsResource = mySensorsApi.labelsSet.find((label) => label.value === msg.type);
    if (!mySensorsResource) return "no IPSO Object found";
    //  logger(4, "handlers", "mySensorsToIpsoResources:req", mySensorsResource);
    const sensor = {};
    sensor.devEui = msg.devEui;
    sensor.resources = mySensorsResource.ipsoResources;
    sensor.nativeResource = msg.type;
    sensor.nativeNodeId = msg.nodeId;
    sensor.nativeSensorId = msg.sensorId;
    sensor.inputPath = msg.inputPath;
    sensor.outputPath = msg.outputPath;
    sensor.value = msg.value;
    sensor.lastSignal = msg.timestamp;
    const resourcesKeys = Object.getOwnPropertyNames(mySensorsResource.ipsoResources);
    if (Object.prototype.hasOwnProperty.call(mySensorsResource.ipsoResources, resourcesKeys[0])) {
      sensor.resources[resourcesKeys[0]] = msg.value;
      sensor.mainResourceId = resourcesKeys[0];
    }
    logger(4, "handlers", "mySensorsToIpsoResources:res", sensor);
    return sensor;
  } catch (error) {
    logger(2, "handlers", "mySensorsToIpsoResources:err", error);
    throw error;
  }
};

const mySensorsDecoder = (packet, protocol) => {
  const decoded = {};
  try {
    logger(4, "handlers", "mySensorsDecoder:req", protocol);
    let decodedPayload;
    const gatewayIdParts = protocol.prefixedDevEui.split("-");
    const inPrefix = "-in";
    const outPrefix = "-out";
    const params = {
      ...protocol,
      prefixedDevEui: `${gatewayIdParts[0]}${inPrefix}`,
    };
    decoded.devEui = gatewayIdParts[0];
    decoded.timestamp = new Date();

    switch (Number(protocol.method)) {
      case 0: // Presentation
        decoded.nodeId = protocol.nodeId;
        decoded.sensorId = protocol.sensorId;
        decoded.ipsoObject = mySensorsApi.labelsPresentation[Number(protocol.subType)].ipsoObject;
        decoded.type = Number(protocol.subType);
        decoded.value = packet.payload.toString();
        decodedPayload = mySensorsToIpsoObject(decoded);
        break;
      case 1: // Set
        decoded.inputPath = mqttPattern.fill(protocolPatterns.mySensors.pattern, params);
        params.prefixedDevEui = `${gatewayIdParts[0]}${outPrefix}`;
        decoded.outputPath = mqttPattern.fill(protocolPatterns.mySensors.pattern, params);
        decoded.nodeId = protocol.nodeId;
        decoded.sensorId = protocol.sensorId;
        decoded.ipsoResources = mySensorsApi.labelsSet[Number(protocol.subType)].ipsoResources;
        decoded.type = Number(protocol.subType);
        decoded.value = packet.payload.toString();
        decodedPayload = mySensorsToIpsoResources(decoded);
        break;
      case 2: // Req
        decoded.nodeId = protocol.nodeId;
        decoded.sensorId = protocol.sensorId;
        decoded.ipsoResources = mySensorsApi.labelsSet[Number(protocol.subType)].ipsoResources;
        decoded.type = Number(protocol.subType);
        break;
      case 3: // Internal
        decoded.nodeId = protocol.nodeId;
        decoded.sensorId = protocol.sensorId;
        decoded.type = Number(protocol.subType);
        decoded.value = packet.payload.toString();
        break;
      case 4: // Stream - OTA firmware update
        decoded.nodeId = protocol.nodeId;
        decoded.method = "stream";
        break;
      default:
        break;
    }
    return decodedPayload;
    //  return "topic doesn't match";
  } catch (error) {
    throw error;
  }
};

module.exports = {
  mySensorsToIpsoObject,
  mySensorsToIpsoResources,
  mySensorsDecoder,
};
