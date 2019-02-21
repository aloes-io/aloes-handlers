import {logger} from '../../logger';
import {aloesLightEncoder} from '../../Aloes-Light';
import {cayenneEncoder} from '../../CayenneLPP';
import {mySensorsEncoder} from '../../MySensors';

const aloesClientDecoder = (packet, protocol) => {
  try {
    logger(4, 'handlers', 'aloesClientDecoder:req', protocol);
    const instance = JSON.parse(packet.payload);
    const protocolKeys = Object.getOwnPropertyNames(protocol);
    logger(4, 'handlers', 'aloesClientDecoder:req', protocolKeys.length);
    if (protocolKeys.length === 3 || protocolKeys.length === 4) {
      let decodedPayload;
      logger(4, 'handlers', 'aloesClientDecoder:req', instance);
      switch (instance.protocolName) {
        case 'aloesLight':
          decodedPayload = aloesLightEncoder(instance, protocol);
          break;
        case 'mySensors':
          decodedPayload = mySensorsEncoder(instance, protocol);
          break;
        case 'cayenneLPP':
          decodedPayload = cayenneEncoder(instance, protocol);
          break;
        case 'nodeWebcam': // Req
          //  await clientToMySensors(app, newPayload);
          break;
        default:
          decodedPayload = 'Protocol not supported yet';
          break;
      }
      return decodedPayload;
    }
    return "topic doesn't match";
  } catch (error) {
    logger(4, 'handlers', 'aloesClientDecoder:err', error);
    throw error;
  }
};

module.exports = {
  aloesClientDecoder,
};
