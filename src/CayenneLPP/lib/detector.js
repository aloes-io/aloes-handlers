import loraPacket from 'lora-packet';
import {logger} from '../../logger';
import protocolRef from './common';

/** @module cayennePatternDetector */

/**
 * Check incoming MQTT packet.payload against CayenneLPP
 * pattern '+appEui/+type/+method/+gatewayId/#device'
 * @param {object} packet - The MQTT packet, including LoraWan PHYPayload.
 * @returns {object} found pattern.name and pattern.params
 */

const cayennePatternDetector = payload => {
  try {
    const pattern = {name: 'empty', params: {}};
    const packet = loraPacket.fromWire(payload);
    if (!packet || packet === null || !packet.getBuffers()) {
      return new Error('Error: Missing packet');
    }
    const method = packet.getMType().toString('hex');
    if (!method || method === null) {
      return new Error('Error: Invalid packet');
    }
    const methodExists = protocolRef.validators.methods.some(
      meth => meth === method,
    );
    let deviceIsValid = false;

    if (
      packet.getBuffers().DevAddr &&
      packet.getBuffers().DevAddr.toString('hex').length ===
        Number(protocolRef.validators.devAddrLength)
    ) {
      deviceIsValid = true;
      pattern.params.devAddr = packet.getBuffers().DevAddr.toString('hex');
      pattern.params.frameCounter = packet.getFCnt();
    } else if (
      packet.getBuffers().DevEUI &&
      packet.getBuffers().DevEUI.toString('hex').length ===
        Number(protocolRef.validators.devEuiLength)
    ) {
      // validate devEui => https://github.com/AdamMagaluk/eui64
      deviceIsValid = true;
      pattern.params.devEui = packet.getBuffers().DevEUI.toString('hex');
      pattern.params.appEui = packet.getBuffers().AppEUI.toString('hex');
      pattern.params.devNonce = packet.getBuffers().DevNonce.toString('hex');
    } else {
      return new Error('Error: Missing device');
    }

    if (methodExists && deviceIsValid) {
      pattern.name = 'cayenneLPP';
      pattern.params.method = method;
      pattern.params.packet = packet;
      return pattern;
    }

    return new Error('Error: Invalid packet');
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
  cayennePatternDetector,
};
