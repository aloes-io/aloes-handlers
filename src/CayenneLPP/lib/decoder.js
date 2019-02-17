import {
  ANALOG_INPUT,
  DIGITAL_INPUT,
  TEMPERATURE,
  LUMINOSITY,
  HUMIDITY,
} from './common';

export class Decoder {
  constructor(buffer) {
    this.maxsize = 51;
    this.buffer = buffer;
    this.cursor = 0;
    this.channels = {};
    this.current = null; // current channel
  }

  /**
   * Try to decode a Cayenne LPP payload in buffer
   */
  decode() {
    while (this.cursor < this.buffer.length) {
      if (this.current !== null) {
        // channel part is defined
        switch (this.buffer[this.cursor]) {
          case ANALOG_INPUT:
            this.channels[this.current][
              `${ANALOG_INPUT + 3200}`
            ] = this.getAnalogInput();
            break;

          case DIGITAL_INPUT:
            this.channels[this.current][
              `${DIGITAL_INPUT + 3200}`
            ] = this.getDigitalInput();
            break;

          case TEMPERATURE:
            this.channels[this.current][
              `${TEMPERATURE + 3200}`
            ] = this.getTemperature();
            break;

          case LUMINOSITY:
            this.channels[this.current][
              `${LUMINOSITY + 3200}`
            ] = this.getLuminosity();
            break;

          case HUMIDITY:
            this.channels[this.current][
              `${HUMIDITY + 3200}`
            ] = this.getRelativeHumidity();
            break;

          default:
            /* eslint-disable-next-line no-console */
            console.log(`Unsupported data type: ${this.buffer[this.cursor]}`);
            break;
        }
        this.cursor += 1;
        this.current = null;
      } else {
        // new channel detection
        this.current = this.buffer[(this.cursor += 1)];
        // create the channel if not already declared
        if (!this.channels[this.current]) {
          this.channels[this.current] = {};
          //    console.log(`Declared channel #${this.current}`)
        }
      }
    }
  }

  /**
   * Return all parsed channels
   * @return object
   */
  getChannels() {
    return this.channels;
  }

  /**
   * Return the given channel data or false if it doesn't exist
   * @param {integer} key
   * @returns object|boolean
   */
  getChannel(key) {
    return this.channels[key] || false;
  }

  /**
   * Return a float value and
   * increment the buffer cursor
   * @return float
   */
  getAnalogInput() {
    //  const value = this.buffer.readInt16BE(++this.cursor);
    const value = this.buffer.readInt16BE((this.cursor += 1));
    this.cursor+=1;
    return value / 100;
  }

  /**
   * Return an integer value
   * @return integer
   */
  getDigitalInput() {
    const buffer = this.buffer[(this.cursor += 1)];
    return buffer
  }

  /**
   * Return a temperature and
   * increment the buffer cursor
   * @return float
   */
  getTemperature() {
    const value = this.buffer.readInt16BE((this.cursor += 1));
    this.cursor += 1;
    return value / 10;
  }

  /**
   * Return a luminosity in Lux and
   * increment the buffer cursor
   * @return integer
   */
  getLuminosity() {
    const value = this.buffer.readInt16BE((this.cursor += 1));
    this.cursor += 1;
    return value;
  }

  /**
   * Return a relative humidity value in percents and
   * increment the buffer cursor
   * @returns float
   */
  getRelativeHumidity() {
    // const value = this.buffer[(this.cursor += 1)] / 2;
    const value = this.buffer[(this.cursor += 1)] / 2;
    this.cursor += 1;
    return value;
  }
}

export default Decoder;
