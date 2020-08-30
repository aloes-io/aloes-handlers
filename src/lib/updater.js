/* Copyright 2020 Edouard Maleix, read LICENSE */

const {omaObjects, omaResources} = require('oma-json');
const logger = require('aloes-logger');

// /**
//  * Parse incoming sensor value to get an object instance from it
//  * @method parseValue
//  * @param {any} value - new value to update sensor with
//  * @returns {any} updated sensor value
//  */
// const parseValue = (value) => {
//   if (typeof value === 'object') {
//     if (value.type && value.type === 'Buffer') {
//       value = Buffer.from(value.data);
//       // value = value.toString('utf-8');
//     } else if (value instanceof String) {
//       if (value.toString() === 'true') {
//         value = Boolean(true);
//       } else if (value.toString() === 'false') {
//         value = Boolean(false);
//       } else {
//         value = value.toString();
//       }
//     } else if (value instanceof Number) {
//       value = Number(value);
//     }
//   }
//   //  else if (Buffer.isBuffer(value)) {
//   //   value = value;
//   // }
//   if (typeof value === 'string') {
//     if (value === 'true') {
//       value = Boolean(true);
//     } else if (value === 'false') {
//       value = Boolean(false);
//     }
//   }
//   return value;
// };

/**
 * References of OMAResources types
 *
 * used to cast incoming sensor value to the correct type
 *
 * @namespace
 * @property {function} Float - convert value to number
 * @property {function} Integer - convert value to number
 * @property {function} String - convert value to string
 * @property {function} Boolean - convert value to boolean
 * @property {function} Time - convert value to number
 * @property {function} Opaque - convert value to buffer
 * @property {function} null - convert value to null
 */
const convertValueFromResourceTypes = {
  Float: (value) => Number(value),
  Integer: (value) => Number(value),
  String: (value) => value !== null && value !== undefined ? value.toString() : '',
  Boolean: (value) => {
    if (typeof value === 'string') {
      if (value === 'false') {
        return Boolean(false);
      } else if (value === '0') {
        return Boolean(false);
      }
    }
    return Boolean(value);
  },
  Time: (value) => Number(value),
  Opaque: (value) =>
    typeof value === 'number' || typeof value === 'boolean'
      ? Buffer.from(value.toString()).toJSON()
      : Buffer.from(value).toJSON(),
  // null: () => null,
  null: (value) => value !== null && value !== undefined ? value.toString() : null,
};

/**
 * Cast incoming sensor value based on its OMAResource type
 * @method setResourceValue
 * @param {any} value - value to cast
 * @returns {any}
 */
const setResourceValue = (resourceType, value) =>
  convertValueFromResourceTypes[resourceType]
    ? convertValueFromResourceTypes[resourceType](value)
    : null;

/**
 * Update and validate AloesClient Sensor instance
 * @method updateAloesSensors
 * @param {object} sensor - sensor instance formatted as AloesClient protocol
 * @param {number} resource - [OMA Resources]{@link /aloes/#omaresources}  ID to update
 * @param {string} value - new value to update sensor with
 * @returns {object | null} sensor
 */
const updateAloesSensors = (sensor, resource, value) => {
  try {
    logger(4, 'aloes-handlers', 'updateAloesSensors:req', {
      omaObjectId: sensor.type,
      omaResourceId: resource,
    });
    const omaObject = omaObjects.find((res) => res.value === sensor.type);
    const resourceIds = omaObject.resourceIds
      .split(',')
      .map((ids) => Number(ids.trim()));
    const resourceExists = resourceIds.some((id) => id === resource);
    if (!resourceExists) return sensor;

    const omaResource = omaResources.find((res) => res.value === resource);

    const parsedValue = setResourceValue(omaResource.type, value);
    sensor.resource = resource;
    sensor.resources[resource] = parsedValue;
    sensor.value =
      !parsedValue && parsedValue !== false && parsedValue !== 0
        ? null
        : parsedValue.toString();

    switch (Number(sensor.type)) {
      case 3200: // digital input
        if (resource === 5500) {
          if (parsedValue) sensor.resources['5501'] += 1;
          else sensor.resources['5501'] = 0;
        } else if (resource === 5505) {
          // Input Counter Reset
          sensor.resources['5501'] = 0;
        }
        break;
      case 3201: // digital output
        break;
      case 3202: // analog input
        if (resource === 5600) {
          if (parsedValue < sensor.resources['5601']) {
            sensor.resources['5601'] = parsedValue;
          } else if (parsedValue > sensor.resources['5602']) {
            sensor.resources['5602'] = parsedValue;
          }
        } else if (resource === 5605) {
          sensor.resources['5601'] = 0;
          sensor.resources['5602'] = 0;
          sensor.resources[resource] = parsedValue; //  reset min/max event
        }
        break;
      case 3203: // analog output
        break;
      case 3300: // generic sensor
        if (resource === 5700) {
          if (
            (!sensor.resources['5601'] && sensor.resources['5601'] !== 0) ||
            parsedValue < sensor.resources['5601']
          ) {
            sensor.resources['5601'] = parsedValue;
          } else if (parsedValue > sensor.resources['5602']) {
            sensor.resources['5602'] = parsedValue;
          }
        } else if (resource === 5605) {
          sensor.resources['5601'] = 0;
          sensor.resources['5602'] = 0;
          sensor.resources[resource] = parsedValue; //  reset min/max event
        }
        break;
      case 3301: // illuminance sensor
        if (resource === 5700) {
          if (
            (!sensor.resources['5601'] && sensor.resources['5601'] !== 0) ||
            parsedValue < sensor.resources['5601']
          ) {
            sensor.resources['5601'] = parsedValue;
          } else if (parsedValue > sensor.resources['5602']) {
            sensor.resources['5602'] = parsedValue;
          }
        } else if (resource === 5605) {
          sensor.resources['5601'] = 0; //  reset min/max event
          sensor.resources['5602'] = 0;
        }
        break;
      case 3302: // presence sensor
        if (resource === 5500) {
          if (parsedValue) sensor.resources['5501'] += 1;
          else sensor.resources['5501'] = 0;
        } else if (resource === 5505) {
          sensor.resources[resource] = parsedValue; // Input Counter Reset
          sensor.resources['5501'] = 0;
        }
        break;
      case 3303: // temperature sensor
        if (resource === 5700) {
          if (
            (!sensor.resources['5601'] && sensor.resources['5601'] !== 0) ||
            parsedValue < sensor.resources['5601']
          ) {
            sensor.resources['5601'] = parsedValue;
          } else if (parsedValue > sensor.resources['5602']) {
            sensor.resources['5602'] = parsedValue;
          }
        } else if (resource === 5605) {
          sensor.resources['5601'] = 0; //  reset min/max event
          sensor.resources['5602'] = 0;
          sensor.resources[resource] = parsedValue;
        }
        break;
      case 3304: // humidity sensor
        if (resource === 5700) {
          if (
            (!sensor.resources['5601'] && sensor.resources['5601'] !== 0) ||
            parsedValue < sensor.resources['5601']
          ) {
            sensor.resources['5601'] = parsedValue;
          } else if (parsedValue > sensor.resources['5602']) {
            sensor.resources['5602'] = parsedValue;
          }
        } else if (resource === 5605) {
          sensor.resources['5601'] = 0; //  reset min/max event
          sensor.resources['5602'] = 0;
        }
        break;
      case 3305: // power measurement
        if (resource === 5822) {
          // reset cumulative energy
          sensor.resources['5805'] = 0;
          sensor.resources['5815'] = 0;
        } else if (resource === 5605) {
          // reset min/max measured
          sensor.resources['5801'] = 0;
          sensor.resources['5802'] = 0;
          sensor.resources['5811'] = 0;
          sensor.resources['5812'] = 0;
        }
        break;
      case 3306: // actuation
        if (resource === 5851) {
          if (sensor.resources['5851'] === 0) {
            sensor.resources['5850'] = false;
          }
        } else if (resource === 5850) {
          if (parsedValue) {
            if (sensor.resources['5852'] === 0) {
              sensor.resources['5852'] = new Date().getTime();
            } else {
              sensor.resources['5852'] -= new Date().getTime();
            }
          } else {
            sensor.resources['5852'] = 0;
          }
        }
        break;
      case 3308: // set point
        break;
      case 3310: // load control
        break;
      case 3311: // light control
        if (resource === 5851) {
          if (sensor.resources['5851'] === 0) {
            sensor.resources['5850'] = 0;
          }
        } else if (resource === 5850) {
          if (parsedValue) {
            if (sensor.resources['5852'] === 0) {
              sensor.resources['5852'] = new Date().getTime();
            } else {
              sensor.resources['5852'] -= new Date().getTime();
            }
          } else {
            sensor.resources['5852'] = 0;
          }
        }
        break;
      case 3312: // power control
        if (resource === 5851) {
          if (sensor.resources['5851'] === 0) {
            sensor.resources['5850'] = 0;
          }
        } else if (resource === 5850) {
          if (parsedValue) {
            if (sensor.resources['5852'] === 0) {
              sensor.resources['5852'] = new Date().getTime();
            } else {
              sensor.resources['5852'] -= new Date().getTime();
            }
          } else {
            sensor.resources['5852'] = 0;
          }
        }
        break;
      case 3313: // accelerometer
        if (resource === 5702 || resource === 5703 || resource === 5704) {
          sensor.value = {
            x: sensor.resources['5702'],
            y: sensor.resources['5703'],
            z: sensor.resources['5704'],
          };
        }
        break;
      case 3314: // magnetometer
        if (resource === 5702 || resource === 5703 || resource === 5704) {
          sensor.value = {
            x: sensor.resources['5702'],
            y: sensor.resources['5703'],
            z: sensor.resources['5704'],
          };
        }
        break;
      case 3315: // barometer
        if (resource === 5700) {
          if (
            (!sensor.resources['5601'] && sensor.resources['5601'] !== 0) ||
            parsedValue < sensor.resources['5601']
          ) {
            sensor.resources['5601'] = parsedValue;
          } else if (parsedValue > sensor.resources['5602']) {
            sensor.resources['5602'] = parsedValue;
          }
        } else if (resource === 5605) {
          sensor.resources['5601'] = 0; //  reset min/max event
          sensor.resources['5602'] = 0;
        }
        break;
      case 3331: // energy
        if (resource === 5822) {
          // reset cumulative energy
          sensor.resources['5805'] = 0;
        }
        break;
      case 3332: // direction
        if (resource === 5705) {
          if (
            (!sensor.resources['5601'] && sensor.resources['5601'] !== 0) ||
            parsedValue < sensor.resources['5601']
          ) {
            sensor.resources['5601'] = parsedValue;
          } else if (parsedValue > sensor.resources['5602']) {
            sensor.resources['5602'] = parsedValue;
          }
        } else if (resource === 5605) {
          sensor.resources['5601'] = 0; // reset min/max event
          sensor.resources['5602'] = 0;
        }
        break;
      case 3333: // time
        if (resource === 5506) {
          if (!value) {
            sensor.resources[resource] = new Date().getTime(); // current time
          }
        }
        break;
      case 3334: // gyrometer
        if (resource === 5702 || resource === 5703 || resource === 5704) {
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
        } else if (resource === 5605) {
          // reset min/max event
          sensor.resources['5508'] = 0;
          sensor.resources['5509'] = 0;
          sensor.resources['5510'] = 0;
          sensor.resources['5511'] = 0;
          sensor.resources['5512'] = 0;
          sensor.resources['5513'] = 0;
        }
        break;
      case 3335: // color sensor
        break;
      case 3336: // location
        if (resource === 5514 || resource === 5515) {
          sensor.value = {
            latitude: sensor.resources['5514'],
            longitude: sensor.resources['5515'],
          };
          // sensor.resources['5518'] = new Date().getTime(); // timestamp
        }
        break;
      case 3337: // positioner
        if (resource === 5536) {
          // if (Number(parsedValue) < sensor.resources['5519']) {
          //   sensor.resources[resource] = Number(parsedValue);
          //   sensor.parsedValue = parsedValue.toString();
          // } else if ((parsedValue) > sensor.resources['5520']) {
          //   sensor.resources[resource] = Number(parsedValue);
          //   sensor.parsedValue = value.toString();
          // }
          if (
            (!sensor.resources['5601'] && sensor.resources['5601'] !== 0) ||
            parsedValue < sensor.resources['5601']
          ) {
            sensor.resources['5601'] = parsedValue;
          } else if (parsedValue > sensor.resources['5602']) {
            sensor.resources['5602'] = parsedValue;
          }
        } else if (resource === 5605) {
          // reset min/max event
          sensor.resources['5601'] = 0;
          sensor.resources['5602'] = 0;
        }
        break;
      case 3339: // audio clip
        break;
      case 3340: // timer
        break;
      case 3341: // text display
        if (resource === 5530) {
          sensor.resources['5527'] = ''; // clear display event
        }
        break;
      case 3342: // switch
        if (resource === 5500) {
          if (parsedValue) {
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
        }
        break;
      case 3343: // dimmer
        if (resource === 5548) {
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
        }
        break;
      case 3344: // up/down control
        if (resource === 5532) {
          // increase input state
          sensor.resources['5542'] <= 0 ? 0 : -1;
          sensor.resources['5541'] += 1;
        } else if (resource === 5533) {
          // decrease input state
          sensor.resources['5541'] <= 0 ? 0 : -1;
          sensor.resources['5542'] += 1;
        }
        break;
      case 3345: // joystick
        if (resource === 5702 || resource === 5703 || resource === 5704) {
          sensor.value = {
            x: sensor.resources['5702'],
            y: sensor.resources['5703'],
            z: sensor.resources['5704'],
          };
        } else if (resource === 5500) {
          if (parsedValue) {
            sensor.resources['5501'] += 1; // counter
          } else {
            sensor.resources['5501'] = 0; // counter
          }
        }
        break;
      case 3347: // push button
        if (resource === 5500) {
          // input value
          if (parsedValue) {
            sensor.resources['5501'] += 1; // counter
          } else {
            sensor.resources['5501'] = 0;
          }
        }
        break;
      case 3349: // bitmap
        // if (resource === 5911) {
        //   sensor.resources[resource] = Boolean(value); // bitmap input reset
        // }
        if (resource === 5910) {
          // if (!value.length) {
          //   return sensor;
          // }
          // if (typeof value === 'string') {
          //   sensor.resources[resource] = Buffer.from(value, 'binary').toJSON();
          // } else {
          //   sensor.resources[resource] = Buffer.from(value).toJSON();
          // }
          sensor.resources[resource] =
            typeof value === 'string'
              ? Buffer.from(value, 'binary').toJSON()
              : typeof value === 'number'
              ? Buffer.from(value.toString()).toJSON()
              : Buffer.from(value).toJSON();
        }
        break;
      case 3350: // stopwatch
        if (resource === 5850) {
          if (parsedValue) {
            sensor.resources['5501'] += 1;
          } else {
            sensor.resources['5501'] = 0;
          }
        }
        break;
      default:
        // CATCH 3301 until 3305 - 3315 - 3316 until 3330 - 3346
        if (resource === 5700) {
          if (
            (!sensor.resources['5601'] && sensor.resources['5601'] !== 0) ||
            parsedValue < sensor.resources['5601']
          ) {
            sensor.resources['5601'] = parsedValue;
          } else if (parsedValue > sensor.resources['5602']) {
            sensor.resources['5602'] = parsedValue;
          }
        } else if (resource === 5605) {
          // reset min/max event
          sensor.resources['5601'] = 0;
          sensor.resources['5602'] = 0;
        }
    }
    return sensor;
  } catch (error) {
    logger(2, 'aloes-handlers', 'updateAloesSensors:err', error);
    return null;
  }
};

module.exports = {
  updateAloesSensors,
};
