import mqttPattern from "mqtt-pattern";
import logger from "./logger";
import protocolPatterns from "./protocol-patterns.json";
import ipsoObjects from "./IPSO/ipso-objects.json";
import mySensorsApi from "./MySensors/mysensors-api.json";
import {mySensorsDecoder} from "./MySensors/mysensors";
import {aloesDecoder} from "./Aloes/aloes";
import {aloesClientDecoder} from "./Aloes/aloes-client";

//  const handlers = {};

exports.protocolPatterns = () => protocolPatterns;
exports.mySensorsApi = () => mySensorsApi;
exports.ipsoObjects = () => ipsoObjects;

const extractProtocol = (pattern, topic) =>
  new Promise((resolve, reject) => {
    const protocol = mqttPattern.exec(pattern, topic);
    if (protocol !== null) resolve(protocol);
    reject(protocol);
  });

exports.patternDetector = async (packet) => {
  try {
    const pattern = {name: "empty", value: null};
    logger.publish(2, "handlers", "patternDetector:req", packet.topic);
    if (packet.topic.split("/")[0] === "$SYS") return null;
    if (mqttPattern.matches(protocolPatterns.aloesClient.collectionPattern, packet.topic)) {
      logger.publish(2, "handlers", "patternDetector:res", "reading AloesClient API...");
      const aloesClientProtocol = await extractProtocol(protocolPatterns.aloesClient.collectionPattern, packet.topic);
      logger.publish(2, "handlers", "patternDetector:res", aloesClientProtocol);
      const collectionExists = protocolPatterns.aloesClient.validators.collectionName.some(
        (collection) => collection === aloesClientProtocol.collectionName,
      );
      const methodExists = protocolPatterns.aloesClient.validators.method.some(
        (meth) => meth === aloesClientProtocol.method,
      );
      if (methodExists && collectionExists && aloesClientProtocol.collectionName === "Account") {
        pattern.name = "aloesClient";
        pattern.subType = "web";
        pattern.value = aloesClientProtocol;
        return pattern;
      } else if (methodExists && collectionExists) {
        pattern.name = "aloesClient";
        pattern.subType = "iot";
        pattern.value = aloesClientProtocol;
        return pattern;
      }
    }
    if (mqttPattern.matches(protocolPatterns.aloesClient.instancePattern, packet.topic)) {
      logger.publish(2, "handlers", "patternDetector:res", "reading AloesClient API ...");
      const aloesClientProtocol = await extractProtocol(protocolPatterns.aloesClient.instancePattern, packet.topic);
      logger.publish(4, "handlers", "patternDetector:res", aloesClientProtocol);
      const methodExists = protocolPatterns.aloesClient.validators.method.some(
        (meth) => meth === aloesClientProtocol.method,
      );
      const collectionExists = protocolPatterns.aloesClient.validators.collectionName.some(
        (collection) => collection === aloesClientProtocol.collectionName,
      );
      if (methodExists && collectionExists && aloesClientProtocol.collectionName === "Account") {
        pattern.name = "aloesClient";
        pattern.subType = "web";
        pattern.value = aloesClientProtocol;
        return pattern;
      } else if (methodExists && collectionExists) {
        pattern.name = "aloesClient";
        pattern.subType = "iot";
        pattern.value = aloesClientProtocol;
        return pattern;
      }
    }
    if (mqttPattern.matches(protocolPatterns.mySensors.pattern, packet.topic)) {
      logger.publish(2, "handlers", "patternDetector:res", "reading MySensors API ...");
      const mysensorsProtocol = await extractProtocol(protocolPatterns.mySensors.pattern, packet.topic);
      logger.publish(4, "handlers", "patternDetector:res", mysensorsProtocol);
      let typeExists = false;
      const methodExists = protocolPatterns.mySensors.validators.method.some(
        (meth) => meth === mysensorsProtocol.method,
      );
      if (Number(mysensorsProtocol.method) === 0) {
        typeExists = mySensorsApi.labelsPresentation.some((type) => type.value === mysensorsProtocol.subType);
      } else if (Number(mysensorsProtocol.method) > 0 && Number(mysensorsProtocol.method) < 2) {
        typeExists = mySensorsApi.labelsSet.some((type) => type.value === mysensorsProtocol.subType);
      }
      if (methodExists && typeExists) {
        pattern.name = "mySensors";
        pattern.value = mysensorsProtocol;
        return pattern;
      }
    }
    if (mqttPattern.matches(protocolPatterns.aloes.pattern, packet.topic)) {
      logger.publish(2, "handlers", "patternDetector:res", "reading Aloes API ...");
      const aloesProtocol = await extractProtocol(protocolPatterns.aloes.pattern, packet.topic);
      logger.publish(4, "handlers", "patternDetector:res", aloesProtocol);
      const methodExists = protocolPatterns.aloes.validators.method.some((meth) => meth === aloesProtocol.method);
      const ipsoObjectIdExists = ipsoObjects.some((object) => object.value === aloesProtocol.ipsoObjectId);
      if (methodExists && ipsoObjectIdExists) {
        pattern.name = "aloes";
        pattern.value = aloesProtocol;
        return pattern;
      }
    }
    pattern.value = "topic doesn't match pattern";
    return pattern;
  } catch (error) {
    logger.publish(2, "handlers", "patternDetector:err", error);
    return error;
  }
};

exports.mySensorsDecoder = async (packet, protocol) => mySensorsDecoder(packet, protocol);

exports.aloesDecoder = async (packet, protocol) => aloesDecoder(packet, protocol);

exports.aloesClientDecoder = async (packet, protocol) => aloesClientDecoder(packet, protocol);

const isEmpty = (obj) => {
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  // null and undefined are "empty"
  if (obj == null) return true;
  if (obj.length > 0) return false;
  if (obj.length === 0) return true;
  for (let i = 0; i <= obj.length; i += 1) {
    const key = obj[i];
    if (hasOwnProperty.call(obj, key)) return false;
  }
  return true;
};

exports.publish = async (options) => {
  //  logger.publish(4, "pubsub", "publish:req", options);
  if (options && !isEmpty(options)) {
    let topic = null;
    const data = options.data;
    if (options.pattern.toLowerCase() === "mysensors") {
      const params = {
        prefixedDevEui: `${data.nativeGwId}${data.inPrefix}`,
        nodeId: data.nodeId,
        sensorId: data.sensorId,
        subType: data.nativeResource,
      };
      logger.publish(4, "pubsub", "publish", params);
      if (options.method === "POST") {
        params.ack = 0;
        params.method = 1;
        topic = mqttPattern.fill(protocolPatterns.mySensors.pattern, params);
        return {topic, payload: data.value};
      } else if (options.method === "GET") {
        params.ack = 0;
        params.method = 2;
        topic = mqttPattern.fill(protocolPatterns.mySensors.pattern, params);
        return {topic, payload: data.value};
      }
      return "Method not supported yet";
    } else if (options.pattern.toLowerCase() === "aloesclient") {
      const params = {
        userId: options.userId,
        collectionName: options.collectionName,
        modelId: options.modelId,
        method: options.method,
      };
      logger.publish(4, "pubsub", "publish", params);
      if (options.method === "POST") {
        topic = mqttPattern.fill(protocolPatterns.aloesClient.collectionPattern, params);
      } else if (options.method === "DELETE") {
        topic = mqttPattern.fill(protocolPatterns.aloesClient.collectionPattern, params);
      } else {
        topic = mqttPattern.fill(protocolPatterns.aloesClient.instancePattern, params);
      }
      return {topic, payload: JSON.stringify(data)};
    }
    return "Protocol not supported yet";
  }
  return new Error("Error: Option must be an object type");
};

exports.subscribe = async (socket, options) => {
  logger.publish(4, "pubsub", "subscribe:req", options);
  if (options && !isEmpty(options)) {
    let topic = null;
    if (options.pattern.toLowerCase() === "mysensors") {
      topic = null;
    } else if (options.pattern.toLowerCase() === "aloesclient") {
      const params = {
        userId: options.userId,
        collectionName: options.collectionName,
        modelId: options.modelId,
        method: options.method,
      };
      if (options.method === "POST") {
        topic = mqttPattern.fill(protocolPatterns.aloesClient.collectionPattern, params);
      } else if (options.method === "DELETE") {
        topic = mqttPattern.fill(protocolPatterns.aloesClient.collectionPattern, params);
      } else {
        topic = mqttPattern.fill(protocolPatterns.aloesClient.instancePattern, params);
      }
    }
    return topic;
  }
  return new Error("Error: Option must be an object type");
};

//  export default handlers;
