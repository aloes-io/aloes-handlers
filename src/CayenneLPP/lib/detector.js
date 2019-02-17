import mqttPattern from 'mqtt-pattern';
import {logger} from '../../logger';
import protocolRef from './common';

//  pattern: '+appEui/+type/+method/+gatewayId/#device',

const cayennePatternDetector = packet => {
  const pattern = {name: 'empty', params: {}};
  if (mqttPattern.matches(protocolRef.pattern, packet.topic)) {
    logger(2, 'handlers', 'cayennePatternDetector:res', 'reading API ...');
    const cayenneLPP = mqttPattern.exec(protocolRef.pattern, packet.topic);
    logger(4, 'handlers', 'cayennePatternDetector:res', cayenneLPP);
    if (cayenneLPP.device && cayenneLPP.device.length > 0) {
      const device = cayenneLPP.device;
      if (device[0].length === Number(protocolRef.validators.devAddrLength)) {
        cayenneLPP.devAddr = device[0];
      } else if (
        device[0].length === Number(protocolRef.validators.devEuiLength)
      ) {
        // validate devEui => https://github.com/AdamMagaluk/eui64
        cayenneLPP.devEui = device[0];
      } else return pattern;
      const methodExists = protocolRef.validators.methods.some(
        meth => meth === cayenneLPP.method,
      );
      const typeExists = protocolRef.validators.types.some(
        type => type === cayenneLPP.type,
      );
      logger(4, 'handlers', 'cayennePatternDetector:res', {
        methodExists,
        typeExists,
      });
      if (methodExists && typeExists) {
        delete cayenneLPP.device;
        pattern.name = 'cayenneLPP';
        pattern.params = cayenneLPP;
        return pattern
      }
      return pattern;
    }
    return pattern;
  }
  return pattern;
};

module.exports = {
  cayennePatternDetector,
};
