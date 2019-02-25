import floor from 'lodash.floor';
import {
  ANALOG_INPUT,
  ANALOG_INPUT_SIZE,
  DIGITAL_INPUT,
  DIGITAL_INPUT_SIZE,
  TEMPERATURE,
  TEMPERATURE_SIZE,
  LUMINOSITY,
  LUMINOSITY_SIZE,
  PRESENCE,
  PRESENCE_SIZE,
  HUMIDITY,
  HUMIDITY_SIZE,
  ACCELEROMETER,
  ACCELEROMETER_SIZE,
  BAROMETER,
  BAROMETER_SIZE,
  UNIXTIME,
  UNIXTIME_SIZE,
  GYROMETER,
  GYROMETER_SIZE,
  LOCATION,
  LOCATION_SIZE,
} from './common';
import {logger} from '../../logger';

/** @module cayenneEncoder */

// Data ID + Data Type + Data Size
const maxSize = 13;
const maxChannelValue = 99;

/**
 * @description Validate chosen channel
 * @static
 * @param {int} channel The channel selected
 */
const validate = channel => {
  if (channel > maxChannelValue) {
    throw new Error('Channels above 100 are reserved.');
  }
};

/**
 * @description Creates a payload with type ANALOG_INPUT.
 * unit = UNIT.UNDEFINED
 * @static
 * @param {object} buffer - Empty buffer.
 * @param {int} cursor - Writing position.
 * @param {int} channel The channel for this sensor.
 * @param {float} value A floating point number accurate to two decimal place. lodash.floor(value, 2)
 */
const addAnalogInput = (buffer, cursor, channel, value) => {
  validate(channel, value);
  if (cursor + ANALOG_INPUT_SIZE > maxSize) {
    return 0;
  }
  const floorVal = floor(value, 2) * 100;
  // buffer.writeUInt8(channel, this.cursor++);
  // buffer[this.cursor++] = ANALOG_INPUT;
  buffer.writeUInt8(channel, (cursor += 1));
  buffer[(cursor += 1)] = ANALOG_INPUT;
  buffer.writeInt16BE(floorVal, cursor);
  cursor += 2;
  return cursor;
};

/**
 * @description Creates a payload with type DIGITAL_INPUT.
 * unit = UNIT.UNDEFINED
 * @static
 * @param {object} buffer - Empty buffer.
 * @param {int} cursor - Writing position.
 * @param {int} channel The channel for this sensor.
 * @param {int} value The value, unsigned int8, should be 0 or 1.
 */
const addDigitalInput = (buffer, cursor, channel, value) => {
  validate(channel, value);
  if (cursor + DIGITAL_INPUT_SIZE > maxSize) {
    return 0;
  }
  buffer.writeUInt8(channel, (cursor += 1));
  buffer[(cursor += 1)] = DIGITAL_INPUT;
  buffer.writeUInt8(value, (cursor += 1));
  return cursor;
};

/**
 * @description Creates a payload with type LUMINOSITY.
 * unit = UNIT.LUX
 * @static
 * @param {object} buffer - Empty buffer.
 * @param {int} cursor - Writing position.
 * @param {int} channel The channel for this sensor.
 * @param {float} value An unsigned int16 value. 0-65535.
 */
const addLuminosity = (buffer, cursor, channel, value) => {
  validate(channel, value);
  if (cursor + LUMINOSITY_SIZE > maxSize) {
    return 0;
  }
  buffer.writeUInt8(channel, (cursor += 1));
  buffer[(cursor += 1)] = LUMINOSITY;
  buffer.writeUInt16BE(value, cursor);
  cursor += 2;
  return cursor;
};

const addPresence = (buffer, cursor, channel, value) => {
  validate(channel, value);
  if (cursor + PRESENCE_SIZE > maxSize) {
    return 0;
  }
  buffer.writeUInt8(channel, (cursor += 1));
  buffer[(cursor += 1)] = PRESENCE;
  buffer.writeUInt8(value, (cursor += 1));
  return cursor;
};

/**
 * @description Creates a payload with type TEMPERATURE.
 * unit = UNIT.CELSIUS
 * @static
 * @param {object} buffer - Empty buffer.
 * @param {int} cursor - Writing position.
 * @param {int} channel The channel for this sensor.
 * @param {float} value A floating point number accurate to one decimal place. lodash.floor(value, 1)
 */
const addTemperature = (buffer, cursor, channel, value) => {
  validate(channel, value);
  if (cursor + TEMPERATURE_SIZE > maxSize) {
    return 0;
  }
  const floorVal = floor(value, 1) * 10;
  buffer.writeUInt8(channel, (cursor += 1));
  buffer[(cursor += 1)] = TEMPERATURE;
  buffer.writeInt16BE(floorVal, cursor);
  cursor += 2;
  return cursor;
};

/**
 * @description Creates a payload with type HUMIDITY.
 * unit = UNIT.PERCENT
 * @static
 * @param {object} buffer - Empty buffer.
 * @param {int} cursor - Writing position.
 * @param {int} channel The channel for this sensor.
 * @param {float} value A floating point number (%) accurate to one decimal place in 0.5 increments. Math.floor10(value, -1)
 */
const addRelativeHumidity = (buffer, cursor, channel, value) => {
  validate(channel, value);
  if (cursor + HUMIDITY_SIZE > maxSize) {
    return 0;
  }
  //  Multiply by 2 because codec resolution is set to 0.5 and precision 1
  const floorVal = floor(value * 2);
  buffer.writeUInt8(channel, (cursor += 1));
  buffer[(cursor += 1)] = HUMIDITY;
  buffer.writeUInt8(floorVal, (cursor += 1));
  return cursor;
};

/**
 * @description Creates a payload with type ACCELEROMETER.
 * unit = UNIT.UNDEFINED
 * @static
 * @param {object} buffer - Empty buffer.
 * @param {int} cursor - Writing position.
 * @param {int} channel The channel for this sensor.
 * @param {object} value Object containing X, Y, Z value
 */
const addAccelerometer = (buffer, cursor, channel, value) => {
  validate(channel, value);
  if (cursor + ACCELEROMETER_SIZE > maxSize) {
    return 0;
  }
  const x = value.x * 1000;
  const y = value.y * 1000;
  const z = value.z * 1000;
  buffer.writeUInt8(channel, (cursor += 1));
  buffer[(cursor += 1)] = ACCELEROMETER;
  buffer.writeUInt8(x, (cursor += 1));
  buffer.writeUInt8(y, (cursor += 1));
  buffer.writeUInt8(z, (cursor += 1));
  return cursor;
};

/**
 * @description Creates a payload with type BAROMETER.
 * unit = UNIT.PRESSURE
 * @static
 * @param {object} buffer - Empty buffer.
 * @param {int} cursor - Writing position.
 * @param {int} channel The channel for this sensor.
 * @param {float} value A floating point number accurate to one decimal place. lodash.floor(value, 1)
 */
const addBarometer = (buffer, cursor, channel, value) => {
  validate(channel, value);
  if (cursor + BAROMETER_SIZE > maxSize) {
    return 0;
  }
  const floorVal = floor(value, 1) * 10;
  buffer.writeUInt8(channel, (cursor += 1));
  buffer[(cursor += 1)] = BAROMETER;
  buffer.writeInt16BE(floorVal, cursor);
  cursor += 2;
  return cursor;
};

/**
 * @description Creates a payload with type UNIXTIME.
 * unit = UNIT.UNDEFINED
 * @static
 * @param {object} buffer - Empty buffer.
 * @param {int} cursor - Writing position.
 * @param {int} channel The channel for this sensor.
 * @param {object} value Date() object
 */
const addUnixTime = (buffer, cursor, channel, value) => {
  validate(channel, value);
  if (cursor + UNIXTIME_SIZE > maxSize) {
    return 0;
  }
  const timestamp = value || new Date();
  buffer.writeUInt8(channel, (cursor += 1));
  buffer[(cursor += 1)] = UNIXTIME;
  buffer.writeInt32BE(timestamp, cursor);
  cursor += 4;
  return cursor;
};

/**
 * @description Creates a payload with type GYROMETER.
 * unit = UNIT.UNDEFINED
 * @static
 * @param {object} buffer - Empty buffer.
 * @param {int} cursor - Writing position.
 * @param {int} channel The channel for this sensor.
 * @param {object} value Object containing X, Y, Z value
 */
const addGyrometer = (buffer, cursor, channel, value) => {
  validate(channel, value);
  if (cursor + GYROMETER_SIZE > maxSize) {
    return 0;
  }
  const x = value.x * 100;
  const y = value.y * 100;
  const z = value.z * 100;
  buffer.writeUInt8(channel, (cursor += 1));
  buffer[(cursor += 1)] = GYROMETER;
  buffer.writeUInt8(x, (cursor += 1));
  buffer.writeUInt8(y, (cursor += 1));
  buffer.writeUInt8(z, (cursor += 1));
  return cursor;
};

/**
 * @description Creates a payload with type LOCATION.
 * unit = UNIT.UNDEFINED
 * @static
 * @param {object} buffer - Empty buffer.
 * @param {int} cursor - Writing position.
 * @param {int} channel The channel for this sensor.
 * @param {object} value Object containing latitude and longitude value
 */
const addLocation = (buffer, cursor, channel, value) => {
  validate(channel, value);
  if (cursor + LOCATION_SIZE > maxSize) {
    return 0;
  }
  const lat = value.latitude * 10000;
  const lng = value.longitude * 10000;
  const alt = value.meters * 100;
  buffer.writeUInt8(channel, (cursor += 1));
  buffer[(cursor += 1)] = LOCATION;
  buffer.writeInt16BE(lat, cursor);
  cursor += 2;
  //  buffer.writeUInt8(x, (cursor += 1));
  buffer.writeInt16BE(lng, cursor);
  cursor += 2;
  buffer.writeInt16BE(alt, cursor);
  cursor += 2;
  return cursor;
};

/**
 * @description Reading the composed buffer from 0 to the cursor position.
 * @static
 * @param {object} buffer - Empty buffer.
 * @param {int} cursor - Writing position.
 */
const getPayload = (buffer, cursor) => {
  const buff = buffer.slice(0, cursor);
  return buff;
};

/**
 * Filling the buffer with desired sensor parameters and value
 * @static
 * @param {object} buffer - Empty buffer.
 * @param {int} type - CayenneLPP type.
 * @param {int} channel - CayenneLPP Channel ( max value: 99 ).
 * @param {float} value - sensor value.
 */

const cayenneBufferEncoder = (buffer, type, channel, value) => {
  try {
    let cursor = 0;
    logger(4, 'handlers', 'cayenneBufferEncoder:req', {
      buffer,
      type,
      channel,
      value,
    });
    switch (Number(type)) {
      case DIGITAL_INPUT:
        cursor = addDigitalInput(buffer, cursor, channel, value);
        break;
      case ANALOG_INPUT:
        cursor = addAnalogInput(buffer, cursor, channel, value);
        break;
      case LUMINOSITY:
        cursor = addLuminosity(buffer, cursor, channel, value);
        break;
      case PRESENCE:
        cursor = addPresence(buffer, cursor, channel, value);
        break;
      case TEMPERATURE:
        cursor = addTemperature(buffer, cursor, channel, value);
        break;
      case HUMIDITY:
        cursor = addRelativeHumidity(buffer, cursor, channel, value);
        break;
      case ACCELEROMETER:
        cursor = addAccelerometer(buffer, cursor, channel, value);
        break;
      case BAROMETER:
        cursor = addBarometer(buffer, cursor, channel, value);
        break;
      case UNIXTIME:
        cursor = addUnixTime(buffer, cursor, channel, value);
        break;
      case GYROMETER:
        cursor = addGyrometer(buffer, cursor, channel, value);
        break;
      case LOCATION:
        cursor = addLocation(buffer, cursor, channel, value);
        break;
      default:
        logger(2, 'handlers', 'Unsupported data type', type);
        break;
    }
    const payload = getPayload(buffer, cursor);
    logger(5, 'handlers', 'cayenneBufferEncoder:res', {
      cursor,
      buffer,
      payload,
    });
    return payload;
  } catch (error) {
    logger(2, 'handlers', 'cayenneBufferEncoder:err', error);
    return error;
  }
};

/**
 * Convert incoming Aloes Client data to CayenneLPP
 * pattern - '+appEui/+type/+method/+gatewayId/#device'
 * @static
 * @param {object} packet - Sensor instance.
 */

const cayenneEncoder = instance => {
  try {
    if (
      instance &&
      instance.protocolName &&
      instance.protocolName.toLowerCase() === 'cayennelpp'
    ) {
      logger(4, 'handlers', 'cayenneEncoder:req', instance);
      const buffer = Buffer.alloc(maxSize);
      const channel = Number(instance.nativeSensorId);
      const type = Number(instance.nativeType);
      const value = Number(instance.value);
      const payload = cayenneBufferEncoder(buffer, type, channel, value);
      logger(4, 'handlers', 'cayenneEncoder:res', payload);
      if (!payload || payload === null) {
        return 'Type not supported yet';
      }
      return payload;
    }
    return new Error('Error: Invalid instance');
  } catch (error) {
    logger(4, 'handlers', 'cayenneEncoder:err', error);
    return error;
  }
};

module.exports = {
  cayenneBufferEncoder,
  cayenneEncoder,
};
