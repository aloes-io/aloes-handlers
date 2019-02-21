import mqttPattern from 'mqtt-pattern';
import {logger} from '../../logger';
import protocolRef from './common';

const mySensorsEncoder = (instance, protocol) => {
  //  "+prefixedDevEui/+nodeId/+sensorId/+method/+ack/+subType",
  try {
    if (
      instance &&
      instance.protocolName &&
      instance.protocolName.toLowerCase() === 'mysensors'
    ) {
      let topic = null;
      const params = {
        prefixedDevEui: `${instance.devEui}${instance.inPrefix}`,
        nodeId: instance.nativeNodeId,
        sensorId: instance.nativeSensorId,
        subType: instance.nativeResource,
      };
      logger(4, 'handlers', 'mySensorsEncoder:req', params);
      if (protocol.method === 'HEAD') {
        params.method = 0;
        params.ack = 0;
        topic = mqttPattern.fill(protocolRef.pattern, params);
      } else if (protocol.method === 'POST' || protocol.method === 'PUT') {
        params.method = 1;
        params.ack = 0;
        topic = mqttPattern.fill(protocolRef.pattern, params);
      } else if (protocol.method === 'GET') {
        params.method = 2;
        params.ack = 0;
        topic = mqttPattern.fill(protocolRef.pattern, params);
      }
      if (!topic || topic === null) return 'Method not supported yet';
      logger(4, 'handlers', 'mySensorsEncoder:res', topic);
      return {topic, payload: instance.value};
    }
    return new Error('Error: Wrong protocol input');
  } catch (error) {
    logger(4, 'handlers', 'mySensorsEncoder:err', error);
    return error;
  }
};

module.exports = {
  mySensorsEncoder,
};
