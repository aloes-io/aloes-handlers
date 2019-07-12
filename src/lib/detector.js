import mqttPattern from 'mqtt-pattern';
import logger from 'aloes-logger';
import protocolRef from './common';

/**
 * Check incoming MQTT packet against AloesClient API
 * collectionPattern - '+userId/+collection/+method'
 * instancePattern - '+userId/+collection/+method/+modelId'
 * @method aloesClientPatternDetector
 * @param {object} packet - The MQTT packet.
 * @returns {object} found pattern.name and pattern.params
 */
const aloesClientPatternDetector = packet => {
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
        collection => collection === aloesClientProtocol.collection.toLowerCase(),
      );
      const methodExists = protocolRef.validators.methods.some(
        meth => meth === aloesClientProtocol.method.toUpperCase(),
      );

      if (
        methodExists &&
        collectionExists &&
        aloesClientProtocol.collection.toLowerCase() === 'iotagent'
      ) {
        pattern.name = 'aloesClient';
        pattern.subType = 'iot';
        pattern.direction = 'tx';
        pattern.params = aloesClientProtocol;
        return pattern;
      } else if (methodExists && collectionExists) {
        pattern.name = 'aloesClient';
        pattern.subType = 'web';
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
        meth => meth === aloesClientProtocol.method.toUpperCase(),
      );
      const collectionExists = protocolRef.validators.collections.some(
        collection => collection === aloesClientProtocol.collection.toLowerCase(),
      );
      // add another property to differentiate subtype, direction ?
      logger(3, 'aloes-handlers', 'patternDetector:res', aloesClientProtocol);

      if (
        methodExists &&
        collectionExists &&
        aloesClientProtocol.collection.toLowerCase() === 'iotagent'
      ) {
        pattern.name = 'aloesClient';
        pattern.subType = 'iot';
        pattern.direction = 'tx';
        pattern.params = aloesClientProtocol;
        return pattern;
      } else if (methodExists && collectionExists) {
        pattern.name = 'aloesClient';
        pattern.subType = 'web';
        pattern.direction = 'rx';
        pattern.params = aloesClientProtocol;
        return pattern;
      }
    }
    return pattern;
  } catch (error) {
    let err = error;
    if (!err) {
      err = new Error('Error: invalid packet');
    }
    logger(2, 'aloes-handlers', 'patternDetector:err', err);
    return err;
  }
};

module.exports = {
  aloesClientPatternDetector,
};
