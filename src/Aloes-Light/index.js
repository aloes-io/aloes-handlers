const mqttPattern = require("mqtt-pattern");
const {logger} = require("../logger");
const ipsoObjects = require("../IPSO/ipso-objects.json");
const protocolPatterns = require("../protocol-patterns.json");

const aloesLightToIpsoObject = (msg) => {
  try {
    logger(4, "handlers", "aloesLightToIpsoObject:req", msg);
    const foundIpsoObject = ipsoObjects.find((object) => object.value === Number(msg.ipsoObject));
    if (!foundIpsoObject) return "no IPSO Object found";
    const sensor = {
      devEui: msg.devEui,
      protocolName: "aloesLight",
      //  protocolPattern: protocolPatterns.aloes.pattern,
      name: foundIpsoObject.name,
      type: msg.ipsoObject,
      resources: foundIpsoObject.resources,
      icons: foundIpsoObject.icons,
      colors: foundIpsoObject.colors,
      nativeSensorId: msg.sensorId,
      nativeResource: msg.resource,
      nativeType: msg.ipsoObject,
      inPrefix: msg.inPrefix,
      outPrefix: msg.outPrefix,
      frameCounter: 0,
    };
    logger(4, "handlers", "aloesLightToIpsoObject:res", sensor);
    return sensor;
  } catch (error) {
    logger(2, "handlers", "aloesLightToIpsoObject:err", error);
    throw error;
  }
};

const aloesLightToIpsoResources = (msg) => {
  try {
    logger(4, "handlers", "aloesLightToIpsoResources:req", msg);
    const aloesResource = ipsoObjects.find((object) => object.value === Number(msg.ipsoObject));
    if (!aloesResource) return "no IPSO Object found";
    const sensor = {};
    sensor.devEui = msg.devEui;
    sensor.resources = aloesResource.resources;
    sensor.resources[msg.resource.toString()] = msg.value;
    sensor.icons = aloesResource.icons;
    sensor.colors = aloesResource.colors;
    sensor.inputPath = msg.inputPath;
    sensor.outputPath = msg.outputPath;
    sensor.inPrefix = msg.inPrefix;
    sensor.outPrefix = msg.outPrefix;
    sensor.value = msg.value;
    sensor.mainResourceId = msg.resource;
    sensor.lastSignal = msg.timestamp;
    logger(4, "handlers", "aloesLightToIpsoResources:res", sensor);
    return sensor;
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
      decoded.timestamp = new Date();

      switch (Number(protocol.method)) {
        case 0: // HEAD
          decoded.sensorId = protocol.sensorId;
          decoded.ipsoObject = protocol.ipsoObjectId;
          decoded.resource = protocol.ipsoResourcesId;
          decoded.value = packet.payload.toString();
          decoded.inputPath = mqttPattern.fill(protocolPatterns.aloesLight.pattern, params);
          params.prefixedDevEui = `${gatewayIdParts[0]}${outPrefix}`;
          decoded.outputPath = mqttPattern.fill(protocolPatterns.aloesLight.pattern, params);
          decodedPayload = aloesLightToIpsoObject(decoded);
          break;
        case 1: // POST
          decoded.inputPath = mqttPattern.fill(protocolPatterns.aloesLight.pattern, params);
          params.prefixedDevEui = `${gatewayIdParts[0]}${outPrefix}`;
          decoded.outputPath = mqttPattern.fill(protocolPatterns.aloesLight.pattern, params);
          decoded.sensorId = protocol.sensorId;
          decoded.ipsoObject = protocol.ipsoObjectId;
          decoded.resource = protocol.ipsoResourcesId;
          //  decoded.value = packet.payload;
          decoded.value = packet.payload.toString();
          decodedPayload = aloesLightToIpsoResources(decoded);
          break;
        case 2: // GET
          decoded.ipsoObject = protocol.ipsoObjectId;
          decoded.sensorId = protocol.sensorId;
          decoded.resource = protocol.ipsoResourcesId;
          break;
        case 3: // Internal
          decoded.sensorId = protocol.sensorId;
          decoded.value = packet.payload.toString();
          break;
        case 4: // STREAM
          decoded.sensorId = protocol.sensorId;
          decoded.value = packet.payload;
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
