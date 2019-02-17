import mqttPattern from 'mqtt-pattern';
import {logger} from '../../logger';
import protocolRef from './common';

const mySensorsPatternDetector = packet => {
  const pattern = {name: 'empty', params: {}};
  if (mqttPattern.matches(protocolRef.pattern, packet.topic)) {
    logger(2, 'handlers', 'mySensorsPatternDetector:res', 'reading API ...');
    //  const mysensorsProtocol = await extractProtocol(protocolRef.pattern, packet.topic);
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
};

module.exports = {
  mySensorsPatternDetector,
};
