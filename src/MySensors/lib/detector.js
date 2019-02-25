import mqttPattern from 'mqtt-pattern';
import {logger} from '../../logger';
import protocolRef from './common';

/** @module mySensorsPatternDetector */

/**
 * Check incoming MQTT packet against MySensors Serial API
 * pattern - "+prefixedDevEui/+nodeId/+sensorId/+method/+ack/+subType"
 * @param {object} packet - The MQTT packet.
 * @returns {object} found pattern.name and pattern.params
 */

const mySensorsPatternDetector = packet => {
  try {
    const pattern = {name: 'empty', params: {}};
    if (mqttPattern.matches(protocolRef.pattern, packet.topic)) {
      logger(2, 'handlers', 'mySensorsPatternDetector:res', 'reading API ...');
      const mysensorsProtocol = mqttPattern.exec(
        protocolRef.pattern,
        packet.topic,
      );
      logger(4, 'handlers', 'mySensorsPatternDetector:res', mysensorsProtocol);
      let typeExists = false;
      const methodExists = protocolRef.validators.methods.some(
        meth => meth === Number(mysensorsProtocol.method),
      );
      if (Number(mysensorsProtocol.method) === 0) {
        typeExists = protocolRef.labelsPresentation.some(
          label => label.value === Number(mysensorsProtocol.subType),
        );
      } else if (
        Number(mysensorsProtocol.method) > 0 &&
        Number(mysensorsProtocol.method) < 2
      ) {
        typeExists = protocolRef.labelsSet.some(
          label => label.value === Number(mysensorsProtocol.subType),
        );
      }
      logger(4, 'handlers', 'mySensorsPatternDetector:res', {
        methodExists,
        typeExists,
      });
      if (methodExists && typeExists) {
        pattern.name = 'mySensors';
        pattern.params = mysensorsProtocol;
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
  mySensorsPatternDetector,
};
