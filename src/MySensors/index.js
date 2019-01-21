const mqttPattern = require("mqtt-pattern");
const {logger} = require("../logger");
const mySensorsApi = require("./mysensors-api.json");
const ipsoObjects = require("../IPSO/ipso-objects.json");
const protocolPatterns = require("../protocol-patterns.json");

// device as argument ?
const mySensorsToIpsoObject = (msg) => {
  try {
    logger(2, "handlers", "mySensorsToIpsoObject:req", msg);
    if (msg.sensorId === 255 || msg.type === null) {
      return null;
    }
    const foundIpsoObject = ipsoObjects.find((object) => object.value === msg.type);
    if (!foundIpsoObject) return "no IPSO Object found";
    const decoded = {
      ...msg,
      protocolName: "mySensors",
      nativeResources: foundIpsoObject.resources,
      name: foundIpsoObject.name,
      icons: foundIpsoObject.icons,
      colors: foundIpsoObject.colors,
      frameCounter: 0,
    };
    logger(2, "handlers", "mySensorsToIpsoObject:res", decoded);
    return decoded;
  } catch (error) {
    logger(2, "handlers", "mySensorsToIpsoObject:err", error);
    throw error;
  }
};

// sensor as argument ?
const mySensorsToIpsoResources = (msg) => {
  try {
    logger(2, "handlers", "mySensorsToIpsoResources:req", msg);
    if (msg.sensorId === 255 || !msg.resources) {
      return null;
    }
    const resourcesKeys = Object.getOwnPropertyNames(msg.resources);
    if (Object.prototype.hasOwnProperty.call(msg.resources, resourcesKeys[0])) {
      //  msg.resources[resourcesKeys[0]] = msg.value;
      msg.resource = resourcesKeys[0];
      //  msg.mainResourceId = resourcesKeys[0];
    }
    const decoded = {
      ...msg,
    };
    logger(4, "handlers", "mySensorsToIpsoResources:res", decoded);
    return decoded;
  } catch (error) {
    logger(2, "handlers", "mySensorsToIpsoResources:err", error);
    throw error;
  }
};

const mySensorsDecoder = (packet, protocol) => {
  const decoded = {};
  try {
    logger(4, "handlers", "mySensorsDecoder:req", protocol);
    const protocolKeys = Object.getOwnPropertyNames(protocol);
    if (protocolKeys.length === 6) {
      let decodedPayload;
      const gatewayIdParts = protocol.prefixedDevEui.split("-");
      const inPrefix = "-in";
      const outPrefix = "-out";
      const params = {
        ...protocol,
        prefixedDevEui: `${gatewayIdParts[0]}${inPrefix}`,
      };
      decoded.inPrefix = inPrefix;
      decoded.outPrefix = outPrefix;
      decoded.prefix = gatewayIdParts[1];
      decoded.devEui = gatewayIdParts[0];
      decoded.lastSignal = new Date();

      switch (Number(protocol.method)) {
        case 0: // Presentation
          decoded.nativeNodeId = protocol.nodeId;
          decoded.nativeSensorId = protocol.sensorId;
          decoded.type = mySensorsApi.labelsPresentation[Number(protocol.subType)].ipsoObject;
          decoded.nativeType = Number(protocol.subType);
          decoded.value = packet.payload.toString();
          decoded.method = "HEAD";
          decodedPayload = mySensorsToIpsoObject(decoded);
          break;
        case 1: // Set
          decoded.inputPath = mqttPattern.fill(protocolPatterns.mySensors.pattern, params);
          params.prefixedDevEui = `${gatewayIdParts[0]}${outPrefix}`;
          decoded.outputPath = mqttPattern.fill(protocolPatterns.mySensors.pattern, params);
          decoded.nativeNodeId = protocol.nodeId;
          decoded.nativeSensorId = protocol.sensorId;
          decoded.resources = mySensorsApi.labelsSet[Number(protocol.subType)].ipsoResources;
          decoded.nativeResource = Number(protocol.subType);
          decoded.value = packet.payload.toString();
          decoded.method = "POST";
          decodedPayload = mySensorsToIpsoResources(decoded);
          break;
        case 2: // Req
          decoded.nativeNodeId = protocol.nodeId;
          decoded.nativeSensorId = protocol.sensorId;
          decoded.resources = mySensorsApi.labelsSet[Number(protocol.subType)].ipsoResources;
          decoded.nativeResource = Number(protocol.subType);
          decoded.method = "GET";
          decodedPayload = decoded;
          break;
        case 3: // Internal
          decoded.nativeNodeId = protocol.nodeId;
          decoded.nativeSensorId = protocol.sensorId;
          decoded.type = Number(protocol.subType);
          decoded.value = packet.payload.toString();
          break;
        case 4: // Stream - OTA firmware update
          decoded.nativeNodeId = protocol.nodeId;
          decoded.nativeSensorId = protocol.sensorId;
          decoded.nativeResource = Number(protocol.subType);
          decoded.value = packet.payload;
          decoded.method = "STREAM";
          decodedPayload = decoded;
          break;
        default:
          break;
      }
      return decodedPayload;
    }
    return "topic doesn't match";
  } catch (error) {
    throw error;
  }
};

module.exports = {
  mySensorsToIpsoObject,
  mySensorsToIpsoResources,
  mySensorsDecoder,
};
