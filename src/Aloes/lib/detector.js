import mqttPattern from 'mqtt-pattern';
import {logger} from '../../logger';
import protocolRef from './common';

const aloesClientPatternDetector = packet => {
  const pattern = {name: 'empty', params: {}};
  if (mqttPattern.matches(protocolRef.collectionPattern, packet.topic)) {
    logger(
      2,
      'handlers',
      'aloesClientPatternDetector:res',
      'reading collection API...',
    );
    //  const aloesClientProtocol = await extractProtocol(protocolRef.aloesClient.collectionPattern, packet.topic);
    const aloesClientProtocol = mqttPattern.exec(
      protocolRef.collectionPattern,
      packet.topic,
    );
    logger(2, 'handlers', 'patternDetector:res', aloesClientProtocol);
    const collectionExists = protocolRef.validators.collectionName.some(
      collection => collection === aloesClientProtocol.collectionName,
    );
    const methodExists = protocolRef.validators.methods.some(
      meth => meth === aloesClientProtocol.method,
    );
    // find a signal to check direction ( to app or device ?)
    // aloesClientProtocol.target && aloesClientProtocol.target === 'iot'
    if (methodExists && collectionExists) {
      pattern.name = 'aloesClient';
      pattern.subType = 'web';
      pattern.params = aloesClientProtocol;
      return pattern;
    }
  }
  if (mqttPattern.matches(protocolRef.instancePattern, packet.topic)) {
    logger(
      2,
      'handlers',
      'aloesClientPatternDetector:res',
      'reading instance API ...',
    );
    //  const aloesClientProtocol = await extractProtocol(protocolRef.aloesClient.instancePattern, packet.topic);
    const aloesClientProtocol = mqttPattern.exec(
      protocolRef.instancePattern,
      packet.topic,
    );
    logger(4, 'handlers', 'patternDetector:res', aloesClientProtocol);
    //  if (aloesClientProtocol === null) return null;
    const methodExists = protocolRef.validators.methods.some(
      meth => meth === aloesClientProtocol.method,
    );
    const collectionExists = protocolRef.validators.collectionName.some(
      collection => collection === aloesClientProtocol.collectionName,
    );
    // add amethod  to differentiate subtype
    if (
      methodExists &&
      collectionExists &&
      aloesClientProtocol.collectionName.toLowerCase() === 'iotagent'
    ) {
      pattern.name = 'aloesClient';
      pattern.subType = 'iot';
      pattern.params = aloesClientProtocol;
      return pattern;
    } else if (methodExists && collectionExists) {
      pattern.name = 'aloesClient';
      pattern.subType = 'web';
      pattern.params = aloesClientProtocol;
      return pattern;
    }
  }
  return pattern;
};

module.exports = {
  aloesClientPatternDetector,
};
