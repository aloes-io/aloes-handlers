import mqttPattern from 'mqtt-pattern';
import {omaObjects} from 'oma-json';
import {logger} from '../../logger';
import protocolRef from './common';

/** @module aloesLightPatternDetector */

/**
 * Extract protocol paramters from incoming topic.
 *
 * @async
 * @function extractProtocol
 * @param {string} pattern - Name of the protocol pattern.
 * @param {string} topic - MQTT topic.
 * @return {Promise<object>} Extracted paramters.
 */
// const extractProtocol = (pattern, topic) =>
//   new Promise((resolve, reject) => {
//     const protocol = mqttPattern.exec(pattern, topic);
//     if (protocol !== null) resolve(protocol);
//     else reject(protocol);
//   });

/**
 * Check incoming MQTT packet against AloesLight API
 * pattern - '+prefixedDevEui/+method/+omaObjectId/+sensorId/+omaResourceId'
 * @param {object} packet - The MQTT packet.
 * @returns {object} found pattern.name and pattern.params
 */

const aloesLightPatternDetector = packet => {
  try {
    const pattern = {name: 'empty', params: {}};
    if (mqttPattern.matches(protocolRef.pattern, packet.topic)) {
      logger(2, 'handlers', 'aloesLightPatternDetector:res', 'reading API ...');
      //  const aloesProtocol = await extractProtocol(protocolRef.pattern, packet.topic);
      const aloesLightProtocol = mqttPattern.exec(
        protocolRef.pattern,
        packet.topic,
      );
      logger(
        4,
        'handlers',
        'aloesLightPatternDetector:res',
        aloesLightProtocol,
      );
      const methodExists = protocolRef.validators.methods.some(
        meth => meth === Number(aloesLightProtocol.method),
      );
      const omaObjectIdExists = omaObjects.some(
        object => object.value === Number(aloesLightProtocol.omaObjectId),
      );
      logger(4, 'handlers', 'aloesLightPatternDetector:res', {
        methodExists,
        omaObjectIdExists,
      });
      if (methodExists && omaObjectIdExists) {
        pattern.name = 'aloesLight';
        pattern.params = aloesLightProtocol;
        return pattern;
      }
    }
    return pattern;
  } catch (error) {
    let err = error;
    if (!err) {
      err = new Error('Error: invalid packet');
    }
    logger(2, 'handlers', 'cayennePatternDetector:err', err);
    return err;
  }
};

module.exports = {
  aloesLightPatternDetector,
};
