/* Copyright 2020 Edouard Maleix, read LICENSE */

const mqttPattern = require('mqtt-pattern');
const logger = require('aloes-logger');
const protocolRef = require('./common');

/**
 * Try to convert incoming route to AloesClient routing
 *
 * collectionPattern - '+userId/+collection/+method'
 *
 * instancePattern - '+userId/+collection/+method/+modelId'
 *
 * @module aloesClientEncoder
 * @method
 * @param {object} options - Protocol parameters ( coming from patternDetector ).
 * @throws {Error} 'Wrong protocol input'
 * @returns {object | null} MQTT topic and payload to send
 */
const aloesClientEncoder = (options) => {
  let topic;
  if (
    !options ||
    !options.pattern ||
    options.pattern.toLowerCase() !== 'aloesclient'
  ) {
    throw new Error('Wrong protocol input');
  }
  try {
    const params = {
      userId: options.userId,
      collection: options.collection,
      modelId: options.modelId,
      method: options.method,
    };
    let pattern;
    logger(4, 'aloes-handlers', 'encoder:req', params);

    if (params.modelId && params.modelId !== null) {
      pattern = protocolRef.instancePattern;
    } else if (options.data && options.data !== null) {
      pattern = protocolRef.collectionPattern;
    } else {
      params.modelId = `#`;
      pattern = protocolRef.instancePattern;
    }

    if (protocolRef.validators.methods.includes(options.method.toUpperCase())) {
      topic = `${mqttPattern.fill(pattern, params)}`;
    } else {
      throw new Error('Method not supported yet');
    }
    logger(3, 'aloes-handlers', 'encoder:res', topic);
    if (options.data && options.data !== null) {
      return {topic, payload: options.data};
    }
    return {topic};
  } catch (error) {
    logger(2, 'aloes-handlers', 'encoder:err', error);
    return null;
  }
};

module.exports = {
  aloesClientEncoder,
};
