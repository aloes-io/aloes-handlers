import mqttPattern from 'mqtt-pattern';
import {logger} from '../../logger';
import protocolRef from './common';

/** @module aloesClientEncoder */

/**
 * Try to convert incoming route to AloesClient routing
 * collectionPattern - '+userId/+collectionName/+method'
 * instancePattern - '+userId/+collectionName/+method/+modelId'
 * @static
 * @param {object} options - Protocol paramters ( coming from patternDetector ).
 */

const aloesClientEncoder = options => {
  try {
    let topic;
    if (
      options &&
      options !== null &&
      options.pattern &&
      options.pattern.toLowerCase() === 'aloesclient'
    ) {
      const params = {
        userId: options.userId,
        collectionName: options.collectionName,
        modelId: options.modelId,
        method: options.method,
      };
      logger(4, 'handlers', 'aloesClientEncoder:req', params);
      if (options.method === 'POST') {
        topic = mqttPattern.fill(protocolRef.collectionPattern, params);
      } else if (options.method === 'HEAD') {
        topic = mqttPattern.fill(protocolRef.instancePattern, params);
      } else if (options.method === 'STREAM') {
        topic = mqttPattern.fill(protocolRef.instancePattern, params);
      } else if (options.method === 'DELETE') {
        topic = mqttPattern.fill(protocolRef.collectionPattern, params);
      } else if (options.method === 'PUT') {
        topic = mqttPattern.fill(protocolRef.collectionPattern, params);
      } else {
        topic = null;
      }
      if (!topic || topic === null) return 'Method not supported yet';
      logger(4, 'handlers', 'aloesClientEncoder:res', topic);
      return {topic, payload: options.data};
    }
    return new Error('Error: Wrong protocol input');
  } catch (error) {
    logger(4, 'handlers', 'aloesClientEncoder:err', error);
    return error;
  }
};

module.exports = {
  aloesClientEncoder,
};
