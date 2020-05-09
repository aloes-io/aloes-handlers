/* Copyright 2019 Edouard Maleix, read LICENSE */

const mqttPattern = require('mqtt-pattern');
const logger = require('aloes-logger');
const protocolRef = require('./common');

/**
 * Try to convert incoming route to AloesClient routing
 *
 * collectionPattern - '+userId/+collection/+method'
 * instancePattern - '+userId/+collection/+method/+modelId'
 * @module aloesClientEncoder
 * @method
 * @param {object} options - Protocol parameters ( coming from patternDetector ).
 * @throws {Error} 'Wrong protocol input'
 * @returns {object | null} MQTT topic and payload to send
 */
const aloesClientEncoder = (options) => {
  let topic;
  if (
    !options ||
    !options.pattern ||
    options.pattern.toLowerCase() !== 'aloesclient'
  ) {
    throw new Error('Wrong protocol input');
  }
  try {
    const params = {
      userId: options.userId,
      collection: options.collection,
      modelId: options.modelId,
      method: options.method,
    };
    let pattern;
    logger(4, 'aloes-handlers', 'encoder:req', params);

    if (params.modelId && params.modelId !== null) {
      pattern = protocolRef.instancePattern;
    } else if (options.data && options.data !== null) {
      pattern = protocolRef.collectionPattern;
    } else {
      params.modelId = `#`;
      pattern = protocolRef.instancePattern;
    }
    logger(4, 'aloes-handlers', 'encoder:req', pattern);

    if (options.method === 'POST') {
      topic = `${mqttPattern.fill(pattern, params)}`;
    } else if (options.method === 'HEAD') {
      topic = `${mqttPattern.fill(pattern, params)}`;
    } else if (options.method === 'STREAM') {
      topic = `${mqttPattern.fill(pattern, params)}`;
    } else if (options.method === 'DELETE') {
      topic = `${mqttPattern.fill(pattern, params)}`;
    } else if (options.method === 'PUT') {
      topic = `${mqttPattern.fill(pattern, params)}`;
    } else {
      topic = null;
    }
    if (!topic || topic === null) throw new Error('Method not supported yet');
    logger(3, 'aloes-handlers', 'encoder:res', topic);
    if (options.data && options.data !== null) {
      return {topic, payload: options.data};
    }
    return {topic};
  } catch (error) {
    logger(2, 'aloes-handlers', 'encoder:err', error);
    return null;
  }
};

/**
 * Parse incoming sensor value to get an object instance from it
 * @method parseValue
 * @param {any} value - new value to update sensor with
 * @returns {any} updated sensor value
 */
const parseValue = (value) => {
  if (typeof value === 'object') {
    if (value.type && value.type === 'Buffer') {
      value = Buffer.from(value.data);
      // value = value.toString('utf-8');
    } else if (value instanceof String) {
      if (value.toString() === 'true') {
        value = Boolean(true);
      } else if (value.toString() === 'false') {
        value = Boolean(false);
      } else {
        value = value.toString();
      }
    } else if (value instanceof Number) {
      value = Number(value);
    }
  }
  //  else if (Buffer.isBuffer(value)) {
  //   value = value;
  // }
  if (typeof value === 'string') {
    if (value === 'true') {
      value = Boolean(true);
    } else if (value === 'false') {
      value = Boolean(false);
    }
  }
  return value;
};

/**
 * Update and validate AloesClient Sensor instance
 * @method updateAloesSensors
 * @param {object} sensor - sensor instance formatted as AloesClient protocol
 * @param {number} resource - [OMA Resources]{@link /aloes/#omaresources}  ID to update
 * @param {string} value - new value to update sensor with
 * @returns {object | null} updated sensor instance
 */
const updateAloesSensors = (sensor, resource, value) => {
  try {
    value = parseValue(value);
    logger(4, 'aloes-handlers', 'updateAloesSensors:req', {
      resource,
    });
    switch (Number(sensor.type)) {
      case 3200: // digital input
        if (resource === 5500) {
          //  value = Boolean(value);
          sensor.resources[resource] = Boolean(value);
          sensor.value = value.toString();
          if (value) sensor.resources['5501'] += 1;
          else sensor.resources['5501'] = 0;
        } else if (resource === 5502) {
          sensor.resources[resource] = value;
        } else if (resource === 5503) {
          sensor.resources[resource] = Number(value); // debounce
        } else if (resource === 5504) {
          sensor.resources[resource] = Number(value); // edge selection ( 1 falling, 2 rising, 3 both )
        } else if (resource === 5750 || resource === 5751) {
          sensor.resources[resource] = value.toString(); // app_name || sensor type
        }
        break;
      case 3201: // digital output
        if (resource === 5550) {
          //  value = Boolean(value);
          sensor.resources[resource] = Boolean(value);
          sensor.value = value.toString();
        } else if (resource === 5551) {
          sensor.value = value.toString();
          sensor.resources[resource] = Boolean(value); // polarity
        } else if (resource === 5750) {
          sensor.resources[resource] = value.toString(); // app_name
        }
        break;
      case 3202: // analog input
        if (resource === 5600) {
          sensor.resources[resource] = Number(value);
          sensor.value = value.toString();
          if (Number(value) < sensor.resources['5601']) {
            sensor.resources['5601'] = Number(value);
          } else if (Number(value) > sensor.resources['5602']) {
            sensor.resources['5602'] = Number(value);
          }
        } else if (resource === 5601 || resource === 5602) {
          sensor.resources[resource] = Number(value); // min || max measured range
        } else if (resource === 5603 || resource === 5604) {
          sensor.resources[resource] = Number(value); // min || max range
        } else if (resource === 5605) {
          sensor.resources[resource] = value.toString(); //  reset min/max event
        } else if (resource === 5750 || resource === 5751) {
          sensor.resources[resource] = value.toString(); // app_name || sensor type
        }
        break;
      case 3203: // analog output
        if (resource === 5650) {
          sensor.resources[resource] = Number(value);
          sensor.value = value.toString();
        } else if (resource === 5603 || resource === 5604) {
          sensor.value = value.toString();
          sensor.resources[resource] = Number(value); // min || max range
        } else if (resource === 5750) {
          sensor.resources[resource] = value.toString(); // app_name
        }
        break;
      case 3300: // generic sensor
        if (resource === 5700) {
          sensor.resources[resource] = Number(value);
          sensor.value = value.toString();
          if (
            sensor.resources['5601'] === undefined ||
            Number(value) < sensor.resources['5601']
          ) {
            sensor.resources['5601'] = Number(value);
          } else if (Number(value) > sensor.resources['5602']) {
            sensor.resources['5602'] = Number(value);
          }
        } else if (resource === 5701) {
          sensor.resources[resource] = value.toString(); // units
        } else if (resource === 5601 || resource === 5602) {
          sensor.resources[resource] = Number(value); // min || max measured range
        } else if (resource === 5603 || resource === 5604) {
          sensor.value = value.toString();
          sensor.resources[resource] = Number(value); // min || max range
        } else if (resource === 5605) {
          sensor.value = value.toString();
          sensor.resources[resource] = value; //  reset min/max event
        } else if (resource === 5750 || resource === 5751) {
          sensor.resources[resource] = value.toString(); // app_name || sensor type
        }
        break;
      case 3301: // illuminance sensor
        if (resource === 5700) {
          sensor.resources[resource] = Number(value);
          sensor.value = value.toString();
          if (
            sensor.resources['5601'] === undefined ||
            Number(value) < sensor.resources['5601']
          ) {
            sensor.resources['5601'] = Number(value);
          } else if (Number(value) > sensor.resources['5602']) {
            sensor.resources['5602'] = Number(value);
          }
        } else if (resource === 5701) {
          sensor.resources[resource] = value.toString(); // units
        } else if (resource === 5601 || resource === 5602) {
          sensor.resources[resource] = Number(value); // min || max measured range
        } else if (resource === 5603 || resource === 5604) {
          sensor.resources[resource] = Number(value); // min || max range
        } else if (resource === 5605) {
          sensor.resources[resource] = value; //  reset min/max event
        }
        break;
      case 3302: // presence sensor
        if (resource === 5500) {
          sensor.resources[resource] = Number(value);
          sensor.value = value.toString();
          if (value) sensor.resources['5501'] += 1;
          else sensor.resources['5501'] = 0;
        } else if (resource === 5903 || resource === 5904) {
          sensor.resources[resource] = Number(value); // busy to clear delay || clear to busy dealy
        } else if (resource === 5505) {
          sensor.resources[resource] = value.toString(); //  reset counter event
        } else if (resource === 5751) {
          sensor.resources[resource] = value.toString(); // sensor type
        }
        break;
      case 3303: // temperature sensor
        if (resource === 5700) {
          sensor.resources[resource] = Number(value);
          sensor.value = value.toString();
          if (
            sensor.resources['5601'] === undefined ||
            Number(value) < sensor.resources['5601']
          ) {
            sensor.resources['5601'] = Number(value);
          } else if (Number(value) > sensor.resources['5602']) {
            sensor.resources['5602'] = Number(value);
          }
        } else if (resource === 5701) {
          sensor.resources[resource] = value.toString(); // units
        } else if (resource === 5601 || resource === 5602) {
          sensor.resources[resource] = Number(value); // min || max measured range
        } else if (resource === 5603 || resource === 5604) {
          sensor.resources[resource] = Number(value); // min || max range
        } else if (resource === 5605) {
          sensor.resources[resource] = value.toString(); //  reset min/max event
        }
        break;
      case 3304: // humidity sensor
        if (resource === 5700) {
          sensor.resources[resource] = Number(value);
          sensor.value = value.toString();
          if (
            sensor.resources['5601'] === undefined ||
            Number(value) < sensor.resources['5601']
          ) {
            sensor.resources['5601'] = Number(value);
          } else if (Number(value) > sensor.resources['5602']) {
            sensor.resources['5602'] = Number(value);
          }
        } else if (resource === 5701) {
          sensor.resources[resource] = value.toString(); // units
        } else if (resource === 5601 || resource === 5602) {
          sensor.resources[resource] = Number(value); // min || max measured range
        } else if (resource === 5603 || resource === 5604) {
          sensor.resources[resource] = Number(value); // min || max range
        } else if (resource === 5605) {
          sensor.resources[resource] = value.toString(); //  reset min/max event
        }
        break;
      case 3305: // power measurement todod
        break;
      case 3306: // actuation
        if (resource === 5851) {
          sensor.resources[resource] = Number(value); // dimmer
          sensor.value = value.toString();
          if (sensor.resources['5851'] === 0) {
            sensor.resources['5850'] = false;
          }
        } else if (resource === 5850) {
          sensor.resources[resource] = value; // switch
          sensor.value = value.toString();
          if (value) {
            if (sensor.resources['5852'] === 0) {
              sensor.resources['5852'] = new Date().getTime();
            } else {
              sensor.resources['5852'] -= new Date().getTime();
            }
          } else {
            sensor.resources['5852'] = 0;
          }
        } else if (resource === 5853) {
          sensor.resources[resource] = value.toString(); // multi state output
        } else if (resource === 5750) {
          sensor.resources[resource] = value.toString(); // app_name || sensor type
        }
        break;
      case 3308: // set point
        if (resource === 5900) {
          sensor.resources[resource] = Number(value); // set point value
          sensor.value = value.toString();
        } else if (resource === 5701) {
          sensor.resources[resource] = value.toString(); // unit
        } else if (resource === 5706) {
          sensor.resources[resource] = value.toString(); // color
        } else if (resource === 5750) {
          sensor.resources[resource] = value.toString(); // app_name || sensor type
        }
        break;
      case 3310: // load control
        value = value.toString();
        sensor.resources['5824'] = new Date();
        sensor.resources['5826'] = 'event';
        sensor.value = value;
        //  sensor.value = sensor.resources["5550"];
        break;
      case 3311: // light control
        if (resource === 5851) {
          sensor.resources[resource] = Number(value);
          sensor.value = value.toString();
          if (sensor.resources['5851'] === 0) {
            sensor.resources['5850'] = 0;
          }
        } else if (resource === 5850) {
          sensor.resources[resource] = value;
          sensor.value = value.toString();
          if (value) {
            if (sensor.resources['5852'] === 0) {
              sensor.resources['5852'] = new Date().getTime();
            } else {
              sensor.resources['5852'] -= new Date().getTime();
            }
          } else {
            sensor.resources['5852'] = 0;
          }
        } else if (resource === 5701) {
          sensor.resources[resource] = value.toString(); // unit
        } else if (resource === 5750) {
          sensor.resources[resource] = value.toString(); // app_name
        }
        break;
      case 3312: // power control
        if (resource === 5851) {
          sensor.value = value.toString();
          sensor.resources[resource] = Number(value);
          if (sensor.resources['5851'] === 0) {
            sensor.resources['5850'] = 0;
          }
        } else if (resource === 5850) {
          sensor.resources[resource] = value;
          sensor.value = value.toString();
          if (value) {
            if (sensor.resources['5852'] === 0) {
              sensor.resources['5852'] = new Date().getTime();
            } else {
              sensor.resources['5852'] -= new Date().getTime();
            }
          } else {
            sensor.resources['5852'] = 0;
          }
        } else if (resource === 5701) {
          sensor.resources[resource] = value.toString(); // unit
        } else if (resource === 5706) {
          sensor.resources[resource] = value.toString(); // color
        } else if (resource === 5750) {
          sensor.resources[resource] = value.toString(); // app_name || sensor type
        }
        break;
      case 3313: // accelerometer
        if (resource === 5702 || resource === 5703 || resource === 5704) {
          sensor.resources[resource] = Number(value); // X || Y || Z
          sensor.value = {
            x: sensor.resources['5702'],
            y: sensor.resources['5703'],
            z: sensor.resources['5704'],
          };
        } else if (resource === 5603 || resource === 5604) {
          sensor.resources[resource] = Number(value); // min / max range
        } else if (resource === 5701) {
          sensor.resources[resource] = value.toString(); // unit
        }
        break;
      case 3314: // magnetometer
        if (resource === 5702 || resource === 5703 || resource === 5704) {
          sensor.resources[resource] = Number(value); // X || Y || Z
          sensor.value = {
            x: sensor.resources['5702'],
            y: sensor.resources['5703'],
            z: sensor.resources['5704'],
          };
        } else if (resource === 5705) {
          sensor.resources[resource] = value.toString(); // compass direction
        } else if (resource === 5701) {
          sensor.resources[resource] = value.toString(); // unit
        }
        break;
      case 3315: // barometer
        if (resource === 5700) {
          sensor.resources[resource] = Number(value);
          sensor.value = value.toString();
          if (
            sensor.resources['5601'] === undefined ||
            Number(value) < sensor.resources['5601']
          ) {
            sensor.resources['5601'] = Number(value);
          } else if (Number(value) > sensor.resources['5602']) {
            sensor.resources['5602'] = Number(value);
          }
        } else if (resource === 5701) {
          sensor.resources[resource] = value.toString(); // units
        } else if (resource === 5601 || resource === 5602) {
          sensor.resources[resource] = Number(value); // min || max measured range
        } else if (resource === 5603 || resource === 5604) {
          sensor.resources[resource] = Number(value); // min || max range
        } else if (resource === 5605) {
          sensor.resources[resource] = value.toString(); //  reset min/max event
        }
        break;
      case 3331: // energy
        if (resource === 5700) {
          sensor.resources[resource] = Number(value); // value
          sensor.value = value.toString();
        } else if (resource === 5822) {
          sensor.resources[resource] = value.toString(); // reset cumulative enery
        } else if (resource === 5701) {
          sensor.resources[resource] = value.toString(); // unit
        } else if (resource === 5750) {
          sensor.resources[resource] = value.toString(); // app_name || sensor type
        }
        break;
      case 3332: // direction
        if (resource === 5705) {
          sensor.resources[resource] = Number(value);
          sensor.value = value.toString();
          if (
            sensor.resources['5601'] === undefined ||
            Number(value) < sensor.resources['5601']
          ) {
            sensor.resources['5601'] = Number(value);
          } else if (Number(value) > sensor.resources['5602']) {
            sensor.resources['5602'] = Number(value);
          }
        } else if (resource === 5601 || resource === 5602) {
          sensor.resources[resource] = Number(value); // min || max measured value
        } else if (resource === 5605) {
          sensor.resources[resource] = value.toString(); // reset min/max event
        } else if (resource === 5750) {
          sensor.resources[resource] = value.toString(); // app name
        }
        break;
      case 3333: // time
        if (resource === 5506) {
          if (value) {
            sensor.resources[resource] = value; // current time
          } else if (!value) {
            sensor.resources[resource] = new Date(); // current time
          }
          sensor.value = value.toString();
        } else if (resource === 5507) {
          sensor.resources[resource] = Number(value); // fraactionnal time s
        } else if (resource === 5750) {
          sensor.resources[resource] = value.toString(); // app_name
        }
        break;
      case 3334: // gyrometer
        if (resource === 5702 || resource === 5703 || resource === 5704) {
          sensor.resources[resource] = Number(value); // X || Y || Z value
          // if (Number(value) < sensor.resources['5603']) {
          //   sensor.resources[resource] = Number(value);
          //   sensor.value = value.toString();
          // } else if (Number(value) > sensor.resources['5604']) {
          //   sensor.resources[resource] = Number(value);
          //   sensor.value = value.toString();
          // }
          sensor.value = {
            x: sensor.resources['5702'],
            y: sensor.resources['5703'],
            z: sensor.resources['5704'],
          };
        } else if (resource === 5537 || resource === 5538) {
          sensor.resources[resource] = Number(value); // transition / remaining time in s
        } else if (resource === 5603 || resource === 5604) {
          sensor.resources[resource] = Number(value); // min || max range
        } else if (resource === 5605) {
          sensor.resources[resource] = value.toString(); // reset min/max event
        } else if (
          resource === 5508 ||
          resource === 5509 ||
          resource === 5510 ||
          resource === 5511 ||
          resource === 5512 ||
          resource === 5512
        ) {
          sensor.resources[resource] = Number(value); // min || max - X || Y || Z
        } else if (resource === 5701) {
          sensor.resources[resource] = value.toString(); // unit
        } else if (resource === 5750) {
          sensor.resources[resource] = value.toString(); // app_name
        }
        break;
      case 3335: // color sensor
        if (resource === 5706) {
          sensor.resources[resource] = value; // color
          sensor.value = value.toString();
        } else if (resource === 5701) {
          sensor.resources[resource] = value.toString(); // unit
        } else if (resource === 5750) {
          sensor.resources[resource] = value.toString(); // app_name
        }
        break;
      case 3336: // location
        if (resource === 5514 || resource === 5515) {
          sensor.resources[resource] = value.toString(); // lat || lng
          sensor.value = {
            latitude: sensor.resources['5514'],
            longitude: sensor.resources['5515'],
          };
          // sensor.resources['5518'] = new Date().getTime(); // timestamp
        } else if (resource === 5516) {
          sensor.resources[resource] = value.toString(); // uncertainity in meters
        } else if (resource === 5705) {
          sensor.resources[resource] = Number(value); // compass direction 0  -360°
        } else if (resource === 5518) {
          sensor.resources[resource] = value.toString(); // timestamp
        } else if (resource === 5750) {
          sensor.resources[resource] = value.toString(); // app_name
        }
        break;
      case 3337: // positioner
        if (resource === 5536) {
          // if (Number(value) < sensor.resources['5519']) {
          //   sensor.resources[resource] = Number(value);
          //   sensor.value = value.toString();
          // } else if (Number(value) > sensor.resources['5520']) {
          //   sensor.resources[resource] = Number(value);
          //   sensor.value = value.toString();
          // }
          sensor.resources[resource] = Number(value); // current position 0-100 %
          sensor.value = value.toString();
          if (
            sensor.resources['5601'] === undefined ||
            Number(value) < sensor.resources['5601']
          ) {
            sensor.resources['5601'] = Number(value);
          } else if (Number(value) > sensor.resources['5602']) {
            sensor.resources['5602'] = Number(value);
          }
        } else if (resource === 5537 || resource === 5538) {
          sensor.resources[resource] = Number(value); // transition / remaining time in s
        } else if (resource === 5601 || resource === 5602) {
          sensor.resources[resource] = Number(value); // min || max measured value
        } else if (resource === 5605) {
          sensor.resources[resource] = value.toString(); // reset min/max event
        } else if (resource === 5519 || resource === 5520) {
          sensor.resources[resource] = Number(value); // min || max measuring limit
        } else if (resource === 5750) {
          sensor.resources[resource] = value.toString(); // app_name
        }
        break;
      case 3339: // audio clip
        if (resource === 5522) {
          if (!value.length) {
            return sensor;
          }
          //  sensor.value = value; // buffer input
          if (typeof value === 'string') {
            sensor.resources[resource] = Buffer.from(value, 'binary').toJSON();
          } else {
            sensor.resources[resource] = Buffer.from(value).toJSON();
          }
        } else if (resource === 5523) {
          sensor.resources[resource] = value.toString(); // Trigger
        } else if (resource === 5548) {
          sensor.resources[resource] = Number(value); // volume %
        } else if (resource === 5524) {
          sensor.resources[resource] = Number(value); // duration s
        } else if (resource === 5750) {
          sensor.resources[resource] = value.toString(); // app_name || sensor type
        }
        break;
      case 3340: // timer
        if (resource === 5526) {
          sensor.resources[resource] = Number(value); // timer mode 0-4
        } else if (
          resource === 5521 ||
          resource === 5525 ||
          resource === 5538
        ) {
          sensor.resources[resource] = Number(value); // delay duration seconds || miniumum offtime seconds || time left
        } else if (resource === 5523) {
          sensor.resources[resource] = value.toString(); // event trigger
        } else if (resource === 5534) {
          sensor.resources[resource] = Number(value); // timer counter
        } else if (resource === 5850 || resource === 5543) {
          sensor.value = value.toString();
          sensor.resources[resource] = Number(value);
        } else if (resource === 5750) {
          sensor.resources[resource] = value.toString(); // app_name
        }
        // if (sensor.resources["5826"] > 0) {
        //   sensor.resources["5521"] = "15"; // delay duration seconds
        // } // timer mode
        // if (sensor.resources["5826"] > 1) {
        //   sensor.resources["5525"] = "15"; //  miniumum offtime seconds
        // }
        break;
      case 3341: // text display
        if (resource === 5527) {
          sensor.resources[resource] = value.toString();
          sensor.value = value.toString();
        } else if (resource === 5528) {
          sensor.resources[resource] = Number(value); // X
        } else if (resource === 5529) {
          sensor.resources[resource] = Number(value); // Y
        } else if (resource === 5545) {
          sensor.resources[resource] = Number(value); //  Max X
        } else if (resource === 5546) {
          sensor.resources[resource] = Number(value); // Max Y
        } else if (resource === 5530) {
          sensor.resources[resource] = value.toString(); // clear display event
        } else if (resource === 5548 || resource === 5531) {
          sensor.resources[resource] = Number(value); // brightness || contrast level
        } else if (resource === 5750) {
          sensor.resources[resource] = value.toString(); // app_name
        }
        break;
      case 3342: // switch
        if (resource === 5500) {
          sensor.value = value.toString();
          if (value) {
            sensor.resources['5501'] += 1; // counter
            if (sensor.resources['5852'] === 0) {
              sensor.resources['5852'] = new Date().getTime();
            } else {
              sensor.resources['5852'] -= new Date().getTime();
            }
          } else {
            sensor.resources['5501'] = 0;
            if (sensor.resources['5854'] === 0) {
              sensor.resources['5854'] = new Date().getTime();
            } else {
              sensor.resources['5854'] -= new Date().getTime();
            }
          }
          sensor.resources['5500'] = Boolean(value);
        } else if (resource === 5750) {
          sensor.resources[resource] = value.toString(); // app_name
        }
        break;
      case 3343: // dimmer
        if (resource === 5548) {
          sensor.resources['5548'] = Number(value);
          if (sensor.resources['5548'] > 0) {
            if (sensor.resources['5852'] === 0) {
              sensor.resources['5852'] = new Date().getTime();
            } else {
              sensor.resources['5852'] -= new Date().getTime();
            }
          } else if (sensor.resources['5548'] === 0) {
            if (sensor.resources['5854'] === 0) {
              sensor.resources['5854'] = new Date().getTime();
            } else {
              sensor.resources['5854'] -= new Date().getTime();
            }
          }
          sensor.value = value.toString();
        }
        break;
      case 3344: // up/down control
        if (resource === 5532) {
          //  todo check resource type
          sensor.resources['5542'] = 0;
          sensor.resources['5541'] += 1;
          sensor.value = sensor.resources['5541'];
        } else if (resource === 5533) {
          sensor.resources['5541'] = 0;
          sensor.resources['5542'] += 1;
          sensor.value = -sensor.resources['5542'];
        } else if (resource === 5750) {
          sensor.resources[resource] = value.toString(); // app_name || sensor type
        }
        break;
      case 3345: // joystick
        if (resource === 5702 || resource === 5703 || resource === 5704) {
          sensor.resources[resource] = Number(value); // X || Y || Z
          sensor.value = {
            x: sensor.resources['5702'],
            y: sensor.resources['5703'],
            z: sensor.resources['5704'],
          };
          // sensor.value = value.toString();
        } else if (resource === 5500) {
          // sensor.value = value.toString();
          sensor.resources[resource] = Boolean(value); // input state
          if (value) {
            sensor.resources['5501'] += 1; // counter
          } else {
            sensor.resources['5501'] = 0; // counter
          }
        } else if (resource === 5501) {
          sensor.resources[resource] = Number(value); // counter
        } else if (resource === 5750) {
          sensor.resources[resource] = value.toString(); // app_name
        }
        break;
      case 3347: // push button
        if (resource === 5500) {
          sensor.value = value.toString();
          sensor.resources['5500'] = Boolean(value); // input value
          if (value) {
            sensor.resources['5501'] += 1; // counter
          } else {
            sensor.resources['5501'] = 0;
          }
        } else if (resource === 5750) {
          sensor.resources[resource] = value.toString(); // app_name
        }
        break;
      case 3349: // bitmap
        if (resource === 5911) {
          // sensor.value = value.toString();
          sensor.resources[resource] = Boolean(value); // bitmap input reset
        } else if (resource === 5912) {
          sensor.resources[resource] = value.toString(); // element description
        } else if (resource === 5910) {
          if (!value.length) {
            return sensor;
          }
          if (typeof value === 'string') {
            sensor.resources[resource] = Buffer.from(value, 'binary').toJSON();
          } else {
            sensor.resources[resource] = Buffer.from(value).toJSON();
          }
          //  sensor.value = value; // buffer input
        } else if (resource === 5750) {
          sensor.resources[resource] = value.toString(); // app_name
        }
        break;
      case 3350: // stopwatch
        if (resource === 5544) {
          sensor.resources[resource] = Number(value); // cumulative time in s- 0  = reset
          sensor.value = value.toString();
        } else if (resource === 5850) {
          sensor.resources[resource] = Boolean(value);
          sensor.value = value.toString();
          if (value) {
            sensor.resources['5501'] += 1;
          } else {
            sensor.resources['5501'] = 0;
          }
        } else if (resource === 5750) {
          sensor.resources[resource] = value.toString(); // app_name
        }
        break;
      default:
        // CATCH 3301 until 3305 - 3315 - 3316 until 3330 - 3346
        if (resource === 5700) {
          sensor.resources[resource] = Number(value);
          sensor.value = value.toString();
          if (
            sensor.resources['5601'] === undefined ||
            Number(value) < sensor.resources['5601']
          ) {
            sensor.resources['5601'] = Number(value);
          } else if (Number(value) > sensor.resources['5602']) {
            sensor.resources['5602'] = Number(value);
          }
        } else if (resource === 5701) {
          sensor.resources[resource] = value.toString(); // units
        } else if (resource === 5601 || resource === 5602) {
          sensor.resources[resource] = Number(value); // min || max measured range
        } else if (resource === 5603 || resource === 5604) {
          sensor.resources[resource] = Number(value); // min || max range
        } else if (resource === 5605) {
          sensor.resources[resource] = value.toString(); //  reset min/max event
        } else if (resource === 5821) {
          sensor.value = value.toString();
          sensor.resources[resource] = Number(value); // current calibration
        } else if (resource === 5750 || resource === 5751) {
          sensor.resources[resource] = value.toString(); // app_name || sensor type
        } else {
          //  sensor.value = sensor.resources["5700"];
          sensor.resources[resource] = value;
        }
    }
    sensor.resource = resource;
    logger(4, 'aloes-handlers', 'updateAloesSensors:res', {
      resource: sensor.resource,
    });
    return sensor;
  } catch (error) {
    return null;
  }
};

module.exports = {
  aloesClientEncoder,
  updateAloesSensors,
};
