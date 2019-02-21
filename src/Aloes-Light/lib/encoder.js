import mqttPattern from 'mqtt-pattern';
import {logger} from '../../logger';
import protocolRef from './common';

const aloesLightEncoder = (instance, protocol) => {
  // "+prefixedDevEui/+method/+omaObjectId/+sensorId/+omaResourceId",
  try {
    if (
      instance &&
      instance.protocolName &&
      instance.protocolName.toLowerCase() === 'aloeslight'
    ) {
      let topic = null;
      const params = {
        prefixedDevEui: `${instance.devEui}${instance.inPrefix}`,
        omaObjectId: instance.type,
        sensorId: instance.nativeSensorId,
        omaResourceId: instance.resource,
      };
      logger(4, 'handlers', 'aloesLightEncoder:req', params);
      if (protocol.method === 'HEAD') {
        params.method = 0;
        topic = mqttPattern.fill(protocolRef.pattern, params);
      } else if (protocol.method === 'POST' || protocol.method === 'PUT') {
        params.method = 1;
        topic = mqttPattern.fill(protocolRef.pattern, params);
      } else if (protocol.method === 'GET') {
        params.method = 2;
        topic = mqttPattern.fill(protocolRef.pattern, params);
      }
      if (!topic || topic === null) return 'Method not supported yet';
      logger(4, 'handlers', 'aloesLightEncoder:res', topic);
      return {topic, payload: instance.value};
    }
    return new Error('Error: Wrong protocol input');
  } catch (error) {
    logger(4, 'handlers', 'aloesLightEncoder:err', error);
    return error;
  }
};

module.exports = {
  aloesLightEncoder,
};
