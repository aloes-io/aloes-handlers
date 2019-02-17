import {omaObjects, omaViews} from 'oma-json';
import protocolRef, {
  ANALOG_INPUT,
  DIGITAL_INPUT,
  PRESENCE,
  LUMINOSITY,
  TEMPERATURE,
  HUMIDITY,
  ACCELEROMETER,
  BAROMETER,
  UNIXTIME,
  GYROMETER,
  LOCATION,
} from './common';
import {logger} from '../../logger';

//  pattern: '+appEui/+type/+method/+gatewayId/#device',

/**
 * Return a float value and
 * increment the buffer cursor
 * @return float
 */
const getAnalogInput = (buffer, cursor) => {
  //  const value = this.buffer.readInt16BE(++this.cursor);
  const value = buffer.readInt16BE((cursor += 1));
  cursor += 1;
  return {'5600': value / 100};
};

/**
 * Return an integer value
 * @return integer
 */
const getDigitalInput = (buffer, cursor) => {
  const value = buffer[(cursor += 1)];
  return {'5500': value};
};

/**
 * Return a luminosity in Lux and
 * increment the buffer cursor
 * @return integer
 */
const getLuminosity = (buffer, cursor) => {
  const value = buffer.readInt16BE((cursor += 1));
  cursor += 1;
  return {'5700': value};
};

/**
 * Return an integer value
 * @return integer
 */
const getPresence = (buffer, cursor) => {
  const value = buffer[(cursor += 1)];
  return {'5500': value};
};

/**
 * Return a temperature and
 * increment the buffer cursor
 * @return float
 */
const getTemperature = (buffer, cursor) => {
  const value = buffer.readInt16BE((cursor += 1));
  cursor += 1;
  return {'5700': value / 10};
};

/**
 * Return a relative humidity value in percents and
 * increment the buffer cursor
 * @returns float
 */
const getRelativeHumidity = (buffer, cursor) => {
  // const value = this.buffer[(this.cursor += 1)] / 2;
  const value = buffer[(cursor += 1)] / 2;
  cursor += 1;
  return {'5700': value};
};

const getAccelerometer = (buffer, cursor) => {
  const x = buffer.readInt16BE((cursor += 1));
  const y = buffer.readInt16BE((cursor += 1));
  const z = buffer.readInt16BE((cursor += 1));
  return {
    '5702': x,
    '5703': y,
    '5704': z,
  };
};

const getBarometer = (buffer, cursor) => {
  const value = buffer.readInt16BE((cursor += 1));
  return {'5700': value};
};

const getUnixTime = (buffer, cursor) => {
  const value = buffer.readInt32BE((cursor += 1));
  return {'5506': value};
};

const getGyrometer = (buffer, cursor) => {
  const x = buffer.readInt16BE((cursor += 1));
  const y = buffer.readInt16BE((cursor += 1));
  const z = buffer.readInt16BE((cursor += 1));
  return {
    '5702': x,
    '5703': y,
    '5704': z,
  };
};

const getLocation = (buffer, cursor) => {
  const latitude = buffer.readInt16BE((cursor += 1));
  const longitude = buffer.readInt16BE((cursor += 1));
  const meters = buffer.readInt16BE((cursor += 1));
  return {
    '5514': latitude,
    '5515': longitude,
    '5516': meters,
    '5518': new Date(),
  };
};

const parseBuffer = buffer => {
  try {
    const channels = {};
    let cursor = 0;
    let current = null;
    logger(2, 'handlers', 'parseBuffer:req', {buffer, cursor});
    while (cursor < buffer.length) {
      if (current !== null) {
        // channel part is defined
        switch (buffer[cursor]) {
          case DIGITAL_INPUT:
            channels[`${DIGITAL_INPUT}`] = getDigitalInput(buffer, cursor);
            break;
          case ANALOG_INPUT:
            channels[`${ANALOG_INPUT}`] = getAnalogInput(buffer, cursor);
            break;
          case LUMINOSITY:
            channels[`${LUMINOSITY}`] = getLuminosity(buffer, cursor);
            break;
          case PRESENCE:
            channels[`${PRESENCE}`] = getPresence(buffer, cursor);
            break;
          case TEMPERATURE:
            channels[`${TEMPERATURE}`] = getTemperature(buffer, cursor);
            break;
          case HUMIDITY:
            channels[`${HUMIDITY}`] = getRelativeHumidity(buffer, cursor);
            break;
          case ACCELEROMETER:
            channels[`${ACCELEROMETER}`] = getAccelerometer(buffer, cursor);
            break;
          case BAROMETER:
            channels[`${BAROMETER}`] = getBarometer(buffer, cursor);
            break;
          case UNIXTIME:
            channels[`${UNIXTIME}`] = getUnixTime(buffer, cursor);
            break;
          case GYROMETER:
            channels[`${GYROMETER}`] = getGyrometer(buffer, cursor);
            break;
          case LOCATION:
            channels[`${LOCATION}`] = getLocation(buffer, cursor);
            break;
          default:
            delete channels[buffer[cursor]];
            logger(2, 'handlers', 'Unsupported data type', `${buffer[cursor]}`);
            break;
        }
        cursor += 1;
        current = null;
      } else {
        // new channel detection
        current = buffer[(cursor += 1)];
        // create the channel if not already declared
        if (current && !channels[current]) {
          channels[current] = {};
        }
      }
    }
    logger(2, 'handlers', 'parseBuffer:res', {channels});
    if (!channels) return 'Unsupported data type';
    return channels;
  } catch (error) {
    logger(2, 'handlers', 'parseBuffer:err', error);
    return error;
  }
};
const cayenneToOmaObject = msg => {
  try {
    logger(2, 'handlers', 'cayenneToOmaObject:req', msg);
    if (!msg || msg == null || msg.type === null) {
      return 'Wrong instance input';
    }

    //  const maxsize = 51;
    const buffer = msg.payload;
    const channels = parseBuffer(buffer);
    const nativeTypes = Object.getOwnPropertyNames(channels);
    const decoded = nativeTypes.map((nativeType, index) => {
      const nativeResource = Object.keys(channels[nativeType])[0];
      const omaObject = omaObjects.find(
        object => object.value === Number(nativeType) + 3200,
      );
      if (!omaObject) return {};
      const omaView = omaViews.find(
        object => object.value === Number(nativeType) + 3200,
      );
      const resources = {
        ...omaObject.resources,
        ...channels[nativeType],
      };

      return {
        ...msg,
        protocolName: 'cayenneLPP',
        name: omaObject.name,
        icons: omaView.icons,
        colors: omaView.resources,
        nativeType,
        nativeResource,
        nativeSensorId: index,
        type: Number(nativeType) + 3200,
        resources,
        resource: nativeResource,
        value: channels[nativeType][nativeResource],
        frameCounter: 0,
      };
    });

    logger(4, 'handlers', 'cayenneToOmaObject:res', decoded);
    return decoded;
  } catch (error) {
    logger(2, 'handlers', 'cayenneToOmaObject:err', error);
    throw error;
  }
};

const cayenneToOmaResources = msg => {
  try {
    logger(2, 'handlers', 'cayenneToOmaResources:req', msg);
    if (!msg || msg == null || !msg.payload) {
      return 'Wrong instance input';
    }
    //  const maxsize = 51;
    const buffer = msg.payload;
    const channels = parseBuffer(buffer);
    const nativeTypes = Object.getOwnPropertyNames(channels);
    const decoded = nativeTypes.map((nativeType, index) => {
      const nativeResource = Object.keys(channels[nativeType])[0];
      const omaObject = omaObjects.find(
        object => object.value === Number(nativeType) + 3200,
      );
      if (!omaObject) return {};
      const resources = {
        ...omaObject.resources,
        ...channels[nativeType],
      };
      return {
        ...msg,
        nativeType,
        nativeResource,
        nativeSensorId: index,
        type: Number(nativeType) + 3200,
        resources,
        resource: nativeResource,
        value: channels[nativeType][nativeResource],
      };
    });

    logger(4, 'handlers', 'cayenneToOmaResources:res', decoded);
    return decoded;
  } catch (error) {
    logger(2, 'handlers', 'cayenneToOmaResources:err', error);
    throw error;
  }
};

const cayenneDecoder = (packet, protocol) => {
  let decoded = {};
  try {
    logger(4, 'handlers', 'cayenneDecoder:req', protocol);
    const protocolKeys = Object.getOwnPropertyNames(protocol);
    if (protocolKeys.length === 5 || protocolKeys.length === 6) {
      decoded = {
        ...protocol,
        inPrefix: protocolRef.validators.directions[1],
        outPrefix: protocolRef.validators.directions[0],
        payload: packet.payload,
        lastSignal: new Date(),
      };
      if (
        (decoded.devAddr || decoded.devEui) &&
        decoded.type.toLowerCase() === 'decoded'
      ) {
        if (
          decoded.method === 'Unconfirmed Data Up' ||
          decoded.method === 'Confirmed Data Up'
        ) {
          return cayenneToOmaResources(decoded);
        }
        if (decoded.method === 'Presentation') {
          // check loraWan fCnt to register object or resources ?
          return cayenneToOmaObject(decoded);
        }
      }

      return decoded;
    }
    return "topic doesn't match";
  } catch (error) {
    logger(2, 'handlers', 'cayenneDecoder:err', error);
    throw error;
  }
};

module.exports = {
  // cayenneToOmaObject,
  // cayenneToOmaResources,
  cayenneDecoder,
};
