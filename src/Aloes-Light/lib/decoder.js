import mqttPattern from 'mqtt-pattern';
import {omaObjects, omaResources, omaViews} from 'oma-json';
import {logger} from '../../logger';
import protocolRef from './common';

const aloesLightToOmaObject = msg => {
  try {
    logger(4, 'handlers', 'aloesLightToOmaObject:req', msg);
    if (!msg || msg == null || !msg.type || msg.type === null) {
      return 'Wrong instance input';
    }
    const foundOmaObject = omaObjects.find(
      object => object.value === Number(msg.type),
    );
    if (!foundOmaObject) return 'no OMA Object found';
    const foundOmaViews = omaViews.find(
      view => view.value === Number(msg.type),
    );

    const decoded = {
      ...msg,
      protocolName: 'aloesLight',
      resources: foundOmaObject.resources,
      name: foundOmaObject.name,
      icons: foundOmaViews.icons,
      colors: foundOmaViews.resources,
      frameCounter: 0,
    };
    logger(4, 'handlers', 'aloesLightToOmaObject:res', decoded);
    return decoded;
  } catch (error) {
    logger(2, 'handlers', 'aloesLightToOmaObject:err', error);
    throw error;
  }
};

const aloesLightToOmaResources = msg => {
  try {
    logger(4, 'handlers', 'aloesLightToOmaResources:req', msg);
    if (
      !msg ||
      msg === null ||
      !msg.type ||
      msg.type === null ||
      !msg.resource
    ) {
      return 'Wrong instance input';
    }
    const aloesResource = omaResources.find(
      resource => resource.value === Number(msg.resource),
    );
    if (!aloesResource) return 'no OMA Object found';
    const decoded = {
      ...msg,
    };
    //  sensor.resources = aloesResource.resources;
    logger(4, 'handlers', 'aloesLightToOmaResources:res', decoded);
    return decoded;
  } catch (error) {
    logger(2, 'handlers', 'aloesLightToOmaResources:err', error);
    throw error;
  }
};

const aloesLightDecoder = (packet, protocol) => {
  try {
    logger(4, 'handlers', 'aloesLightDecoder:req', protocol);
    const protocolKeys = Object.getOwnPropertyNames(protocol);
    if (protocolKeys.length === 5) {
      const decoded = {};
      let decodedPayload;
      const gatewayIdParts = protocol.prefixedDevEui.split('-');
      const inPrefix = protocolRef.validators.directions[0];
      const outPrefix = protocolRef.validators.directions[1];
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
          decoded.type = Number(protocol.omaObjectId);
          decoded.nativeType = Number(protocol.omaObjectId);
          decoded.resource = Number(protocol.omaResourceId);
          decoded.nativeResource = Number(protocol.omaResourceId);
          decoded.value = packet.payload;
          decoded.inputPath = mqttPattern.fill(protocolRef.pattern, params);
          params.prefixedDevEui = `${gatewayIdParts[0]}${outPrefix}`;
          decoded.outputPath = mqttPattern.fill(protocolRef.pattern, params);
          decoded.method = 'HEAD';
          decodedPayload = aloesLightToOmaObject(decoded);
          break;
        case 1: // POST
          decoded.inputPath = mqttPattern.fill(protocolRef.pattern, params);
          params.prefixedDevEui = `${gatewayIdParts[0]}${outPrefix}`;
          decoded.outputPath = mqttPattern.fill(protocolRef.pattern, params);
          decoded.nativeSensorId = protocol.sensorId;
          decoded.type = Number(protocol.omaObjectId);
          decoded.nativeType = Number(protocol.omaObjectId);
          decoded.resource = Number(protocol.omaResourceId);
          decoded.nativeResource = Number(protocol.omaResourceId);
          decoded.value = packet.payload;
          decoded.method = 'POST';
          decodedPayload = aloesLightToOmaResources(decoded);
          break;
        case 2: // GET
          decoded.nativeSensorId = protocol.sensorId;
          decoded.type = Number(protocol.omaObjectId);
          decoded.resource = Number(protocol.omaResourceId);
          decoded.nativeResource = Number(protocol.omaResourceId);
          decoded.method = 'GET';
          decodedPayload = decoded;
          break;
        case 3: // Internal
          decoded.nativeSensorId = protocol.sensorId;
          decoded.value = packet.payload.toString();
          break;
        case 4: // STREAM
          decoded.nativeSensorId = protocol.sensorId;
          decoded.type = Number(protocol.omaObjectId);
          decoded.nativeType = Number(protocol.omaObjectId);
          decoded.resource = Number(protocol.omaResourceId);
          decoded.nativeResource = Number(protocol.omaResourceId);
          decoded.value = packet.payload;
          //  decoded.value = Uint8Array.from(packet.payload).buffer;
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
    logger(2, 'handlers', 'aloesLightDecoder:err', error);
    throw error;
  }
};

module.exports = {
  // aloesLightToOmaObject,
  // aloesLightToOmaResources,
  aloesLightDecoder,
};
