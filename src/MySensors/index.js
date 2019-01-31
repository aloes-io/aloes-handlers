const mqttPattern = require('mqtt-pattern');
const {logger} = require('../logger');
const mySensorsApi = require('./mysensors-api.json');
const omaObjects = require('../OMA/oma-objects.json');
const omaResources = require('../OMA/oma-resources.json');
const omaViews = require('../OMA/oma-views.json');
const protocolPatterns = require('../protocol-patterns.json');

// device as argument ?
function merge(a, b, prop) {
  let reduced = a.filter(
    aitem => !b.find(bitem => aitem[prop] === bitem[prop]),
  );
  return reduced.concat(b);
}

const mySensorsToOmaObject = msg => {
  try {
    logger(2, 'handlers', 'mySensorsToOmaObject:req', msg);
    if (msg.sensorId === 255 || msg.type === null) {
      return null;
    }
    const foundOmaObject = omaObjects.find(object => object.value === msg.type);
    if (!foundOmaObject) return 'no OMA Object found';
    const foundOmaViews = omaViews.find(object => object.value === msg.type);

    const decoded = {
      ...msg,
      protocolName: 'mySensors',
      nativeResources: foundOmaObject.resources,
      name: foundOmaObject.name,
      icons: foundOmaViews.icons,
      colors: foundOmaViews.resources,
      resources: foundOmaObject.resources,
      frameCounter: 0,
    };
    logger(4, 'handlers', 'mySensorsToOmaObject:res', decoded);
    return decoded;
  } catch (error) {
    logger(2, 'handlers', 'mySensorsToOmaObject:err', error);
    throw error;
  }
};

// sensor as argument ?
const mySensorsToOmaResources = msg => {
  try {
    logger(2, 'handlers', 'mySensorsToOmaResources:req', msg);
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
    logger(4, 'handlers', 'mySensorsToOmaResources:res', decoded);
    return decoded;
  } catch (error) {
    logger(2, 'handlers', 'mySensorsToOmaResources:err', error);
    throw error;
  }
};

const mySensorsDecoder = (packet, protocol) => {
  const decoded = {};
  try {
    logger(4, 'handlers', 'mySensorsDecoder:req', protocol);
    const protocolKeys = Object.getOwnPropertyNames(protocol);
    if (protocolKeys.length === 6) {
      let decodedPayload;
      const gatewayIdParts = protocol.prefixedDevEui.split('-');
      const inPrefix = '-in';
      const outPrefix = '-out';
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
          decoded.type =
            mySensorsApi.labelsPresentation[Number(protocol.subType)].omaObject;
          decoded.nativeType = Number(protocol.subType);
          decoded.value = packet.payload.toString();
          decoded.method = 'HEAD';
          decodedPayload = mySensorsToOmaObject(decoded);
          break;
        case 1: // Set
          decoded.inputPath = mqttPattern.fill(
            protocolPatterns.mySensors.pattern,
            params,
          );
          params.prefixedDevEui = `${gatewayIdParts[0]}${outPrefix}`;
          decoded.outputPath = mqttPattern.fill(
            protocolPatterns.mySensors.pattern,
            params,
          );
          decoded.nativeNodeId = protocol.nodeId;
          decoded.nativeSensorId = protocol.sensorId;
          decoded.resources =
            mySensorsApi.labelsSet[Number(protocol.subType)].omaResources;
          decoded.nativeResource = Number(protocol.subType);
          decoded.value = packet.payload.toString();
          decoded.method = 'POST';
          decodedPayload = mySensorsToOmaResources(decoded);
          break;
        case 2: // Req
          decoded.nativeNodeId = protocol.nodeId;
          decoded.nativeSensorId = protocol.sensorId;
          decoded.resources =
            mySensorsApi.labelsSet[Number(protocol.subType)].omaResources;
          decoded.nativeResource = Number(protocol.subType);
          decoded.method = 'GET';
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
          decoded.method = 'STREAM';
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
  mySensorsToOmaObject,
  mySensorsToOmaResources,
  mySensorsDecoder,
};
