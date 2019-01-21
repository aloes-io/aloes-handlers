const mqttPattern = require("mqtt-pattern");
const {logger} = require("../logger");
const ipsoObjects = require("../IPSO/ipso-objects.json");
const protocolPatterns = require("../protocol-patterns.json");

const aloesLightToIpsoObject = (msg) => {
  try {
    logger(4, "handlers", "aloesLightToIpsoObject:req", msg);
    const foundIpsoObject = ipsoObjects.find((object) => object.value === Number(msg.type));
    if (!foundIpsoObject) return "no IPSO Object found";
    const decoded = {
      ...msg,
      protocolName: "aloesLight",
      resources: foundIpsoObject.resources,
      name: foundIpsoObject.name,
      icons: foundIpsoObject.icons,
      colors: foundIpsoObject.colors,
      frameCounter: 0,
    };
    logger(4, "handlers", "aloesLightToIpsoObject:res", decoded);
    return decoded;
  } catch (error) {
    logger(2, "handlers", "aloesLightToIpsoObject:err", error);
    throw error;
  }
};

const aloesLightToIpsoResources = (msg) => {
  try {
    logger(4, "handlers", "aloesLightToIpsoResources:req", msg);
    const aloesResource = ipsoObjects.find((object) => object.value === Number(msg.type));
    if (!aloesResource) return "no IPSO Object found";
    //  msg.resources[msg.resource.toString()] = msg.value;
    const decoded = {
      ...msg,
      icons: aloesResource.icons,
      colors: aloesResource.colors,
    };
    //  sensor.resources = aloesResource.resources;
    logger(4, "handlers", "aloesLightToIpsoResources:res", decoded);
    return decoded;
  } catch (error) {
    logger(2, "handlers", "aloesLightToIpsoResources:err", error);
    throw error;
  }
};

const aloesLightDecoder = (packet, protocol) => {
  try {
    logger(4, "handlers", "aloesLightDecoder:req", protocol);
    const protocolKeys = Object.getOwnPropertyNames(protocol);
    if (protocolKeys.length === 5) {
      const decoded = {};
      let decodedPayload;
      decoded.devEui = protocol.devEui;
      const gatewayIdParts = protocol.prefixedDevEui.split("-");
      const inPrefix = "-in";
      const outPrefix = "-out";
      const params = {
        ...protocol,
        prefixedDevEui: `${gatewayIdParts[0]}${inPrefix}`,
      };
      decoded.inPrefix = inPrefix;
      decoded.outPrefix = outPrefix;
      decoded.devEui = gatewayIdParts[0];
      decoded.prefix = gatewayIdParts[1];
      decoded.lastSignal = new Date();

      switch (Number(protocol.method)) {
        case 0: // HEAD
          decoded.nativeSensorId = protocol.sensorId;
          decoded.type = Number(protocol.ipsoObjectId);
          decoded.resource = Number(protocol.ipsoResourcesId);
          decoded.value = packet.payload.toString();
          decoded.inputPath = mqttPattern.fill(protocolPatterns.aloesLight.pattern, params);
          params.prefixedDevEui = `${gatewayIdParts[0]}${outPrefix}`;
          decoded.outputPath = mqttPattern.fill(protocolPatterns.aloesLight.pattern, params);
          decoded.method = "HEAD";
          decodedPayload = aloesLightToIpsoObject(decoded);
          break;
        case 1: // POST
          decoded.inputPath = mqttPattern.fill(protocolPatterns.aloesLight.pattern, params);
          params.prefixedDevEui = `${gatewayIdParts[0]}${outPrefix}`;
          decoded.outputPath = mqttPattern.fill(protocolPatterns.aloesLight.pattern, params);
          decoded.nativeSensorId = protocol.sensorId;
          decoded.type = Number(protocol.ipsoObjectId);
          decoded.resource = Number(protocol.ipsoResourcesId);
          // todo : format payload base on type ?
          //  decoded.value = packet.payload;
          decoded.value = packet.payload.toString();
          decoded.method = "POST";
          decodedPayload = aloesLightToIpsoResources(decoded);
          break;
        case 2: // GET
          decoded.nativeSensorId = protocol.sensorId;
          decoded.type = Number(protocol.ipsoObjectId);
          decoded.resource = Number(protocol.ipsoResourcesId);
          decoded.method = "GET";
          decodedPayload = decoded;
          break;
        case 3: // Internal
          decoded.nativeSensorId = protocol.sensorId;
          decoded.value = packet.payload.toString();
          break;
        case 4: // STREAM
          decoded.nativeSensorId = protocol.sensorId;
          decoded.type = Number(protocol.ipsoObjectId);
          decoded.resource = Number(protocol.ipsoResourcesId);
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
  aloesLightToIpsoObject,
  aloesLightToIpsoResources,
  aloesLightDecoder,
};
