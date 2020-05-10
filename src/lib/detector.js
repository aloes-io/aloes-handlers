/* Copyright 2020 Edouard Maleix, read LICENSE */

const mqttPattern = require('mqtt-pattern');
const logger = require('aloes-logger');
const protocolRef = require('./common');

/**
 * Check incoming MQTT packet against AloesClient API
 * 
 * collectionPattern - '+userId/+collection/+method'
 * 
 * instancePattern - '+userId/+collection/+method/+modelId'
 * 
 * @method aloesClientPatternDetector
 * @param {object} packet - The MQTT packet.
 * @returns {object | null} pattern
 */
const aloesClientPatternDetector = (packet) => {
  try {
    const pattern = {name: 'empty', params: {}};
    if (mqttPattern.matches(protocolRef.collectionPattern, packet.topic)) {
      logger(
        4,
        'aloes-handlers',
        'patternDetector:res',
        'reading collection API...',
      );
      const aloesClientProtocol = mqttPattern.exec(
        protocolRef.collectionPattern,
        packet.topic,
      );
      logger(2, 'aloes-handlers', 'patternDetector:res', aloesClientProtocol);
      const collectionExists = protocolRef.validators.collections.some(
        (collection) =>
          collection === aloesClientProtocol.collection.toLowerCase(),
      );
      const methodExists = protocolRef.validators.methods.some(
        (meth) => meth === aloesClientProtocol.method.toUpperCase(),
      );

      if (methodExists && collectionExists) {
        pattern.name = 'aloesClient';
        pattern.direction = 'rx';
        pattern.params = aloesClientProtocol;
        return pattern;
      }
    }
    if (mqttPattern.matches(protocolRef.instancePattern, packet.topic)) {
      logger(
        4,
        'aloes-handlers',
        'patternDetector:res',
        'reading instance API ...',
      );
      const aloesClientProtocol = mqttPattern.exec(
        protocolRef.instancePattern,
        packet.topic,
      );
      const methodExists = protocolRef.validators.methods.some(
        (meth) => meth === aloesClientProtocol.method.toUpperCase(),
      );
      const collectionExists = protocolRef.validators.collections.some(
        (collection) =>
          collection === aloesClientProtocol.collection.toLowerCase(),
      );
      // add another property to differentiate subtype, direction ?
      logger(3, 'aloes-handlers', 'patternDetector:res', aloesClientProtocol);

      if (methodExists && collectionExists) {
        pattern.name = 'aloesClient';
        pattern.direction = 'rx';
        pattern.params = aloesClientProtocol;
        return pattern;
      }
    }
    return pattern;
  } catch (error) {
    logger(2, 'aloes-handlers', 'patternDetector:err', error);
    return null;
  }
};

module.exports = {
  aloesClientPatternDetector,
};
