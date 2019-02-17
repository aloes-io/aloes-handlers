import {logger} from './logger';
import {
  aloesClientDecoder,
  aloesClientEncoder,
  aloesClientPatternDetector,
} from './Aloes';
import {
  aloesLightDecoder,
  aloesLightEncoder,
  aloesLightPatternDetector,
} from './Aloes-Light';
import {
  mySensorsDecoder,
  mySensorsEncoder,
  mySensorsPatternDetector,
} from './MySensors';

// const isEmpty = obj => {
//   const hasOwnProperty = Object.prototype.hasOwnProperty;
//   // null and undefined are "empty"
//   if (obj == null) return true;
//   if (obj.length > 0) return false;
//   if (obj.length === 0) return true;
//   for (let i = 0; i <= obj.length; i += 1) {
//     const key = obj[i];
//     if (hasOwnProperty.call(obj, key)) return false;
//   }
//   return true;
// };

const patternDetector = packet => {
  try {
    if (packet.payload && packet.topic) {
      let pattern = {name: 'empty', params: {}};
      if (packet.topic.split('/')[0] === '$SYS') return null;
      logger(2, 'handlers', 'patternDetector:req', packet.topic);
      pattern = aloesClientPatternDetector(packet);
      logger(2, 'handlers', 'patternDetector:res1', pattern);

      if (pattern.name === 'empty') {
        pattern = mySensorsPatternDetector(packet);
      }
      logger(2, 'handlers', 'patternDetector:res2', pattern);

      if (pattern.name === 'empty') {
        pattern = aloesLightPatternDetector(packet);
      }
      logger(2, 'handlers', 'patternDetector:res3', pattern);

      if (pattern.name === 'empty') {
        pattern.params = "topic doesn't match pattern";
      }
      logger(2, 'handlers', 'patternDetector:res', pattern);
      return pattern;
    }
    return new Error('Error: Missing payload or topic inside packet');
  } catch (error) {
    logger(2, 'handlers', 'patternDetector:err', error);
    return error;
  }
};

const publish = options => {
  logger(4, 'handlers', 'publish:req', options);
  if (options && options.data) {
    if (options.pattern.toLowerCase() === 'mysensors') {
      return mySensorsEncoder(options.data, options);
    } else if (options.pattern.toLowerCase() === 'aloeslight') {
      return aloesLightEncoder(options.data, options);
    } else if (options.pattern.toLowerCase() === 'aloesclient') {
      return aloesClientEncoder(options);
    }
    return 'Protocol not supported yet';
  }
  return new Error('Error: Option must be an object type');
};

// const subscribe = (socket, options) => {
//   logger(4, 'handlers', 'subscribe:req', options);
//   if (options && !isEmpty(options)) {
//     let topic = null;
//     if (options.pattern.toLowerCase() === 'mysensors') {
//       topic = null;
//     } else if (options.pattern.toLowerCase() === 'aloesclient') {
//       const params = {
//         userId: options.userId,
//         collectionName: options.collectionName,
//         modelId: options.modelId,
//         method: options.method,
//       };
//       if (options.method === 'POST') {
//         topic = mqttPattern.fill(
//           protocolPatterns.aloesClient.collectionPattern,
//           params,
//         );
//       } else if (options.method === 'DELETE') {
//         topic = mqttPattern.fill(
//           protocolPatterns.aloesClient.collectionPattern,
//           params,
//         );
//       } else {
//         topic = mqttPattern.fill(
//           protocolPatterns.aloesClient.instancePattern,
//           params,
//         );
//       }
//     }
//     return topic;
//   }
//   return new Error('Error: Option must be an object type');
// };

// const parseValue = value => {
//   if (typeof value === 'object') {
//     if (value.type && value.type === 'Buffer') {
//       value = Buffer(value);
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
//   } else if (typeof value === 'string') {
//     if (value === 'true' || value === '1') {
//       value = Boolean(true);
//     } else if (value === 'false' || value === '0') {
//       value = Boolean(false);
//     }
//     //  sensor.value = {[resource]: sensor.value};
//   } else if (typeof value === 'number') {
//     value = Number(value);
//   } else if (typeof value === 'boolean') {
//     value = Boolean(value);
//   }
//   return value;
// };x

const updateAloesSensors = (sensor, resource, value) => {
  logger(4, 'handlers', 'updateAloesSensors:req', {
    sensor,
    resource,
    value,
  });
  // value = parseValue(value);
  // console.log('new sensor value:', value);

  switch (Number(sensor.type)) {
    case 3200: // digital input
      value = value.toString();
      if (resource === 5500) {
        value = Boolean(value);
        sensor.resources[resource] = value;
        sensor.value = Number(sensor.resources[resource]);
        if (value) sensor.resources['5501'] += 1;
        else sensor.resources['5501'] = 0;
      } else if (resource === 5502) {
        sensor.resources[resource] = Boolean(value); // polarity
      } else if (resource === 5503) {
        sensor.resources[resource] = Number(value); // debounce
      } else if (resource === 5504) {
        sensor.resources[resource] = Number(value); // edge selection ( 1 falling, 2 rising, 3 both )
      } else if (resource === 5750 || resource === 5751) {
        sensor.resources[resource] = value; // app_name || sensor type
      }
      break;
    case 3201: // digital output
      value = value.toString();
      if (resource === 5550) {
        value = Boolean(value);
        sensor.resources[resource] = value;
        sensor.value = Number(sensor.resources[resource]);
      } else if (resource === 5551) {
        sensor.resources[resource] = Boolean(value); // polarity
      } else if (resource === 5750) {
        sensor.resources[resource] = value; // app_name
      }
      break;
    case 3202: // analog input
      value = value.toString();
      if (resource === 5600) {
        sensor.resources[resource] = Number(value);
        sensor.value = sensor.resources[resource];
      } else if (resource === 5601 || resource === 5602) {
        sensor.resources[resource] = Number(value); // min || max measured range
      } else if (resource === 5603 || resource === 5604) {
        sensor.resources[resource] = Number(value); // min || max range
      } else if (resource === 5605) {
        sensor.resources[resource] = value; //  reset min/max event
      } else if (resource === 5750 || resource === 5751) {
        sensor.resources[resource] = value; // app_name || sensor type
      }
      break;
    case 3203: // analog output
      value = value.toString();
      if (resource === 5650) {
        sensor.resources[resource] = Number(value);
        sensor.value = sensor.resources[resource];
      } else if (resource === 5603 || resource === 5604) {
        sensor.resources[resource] = Number(value); // min || max range
      } else if (resource === 5750) {
        sensor.resources[resource] = value; // app_name
      }
      break;
    case 3300: // generic sensor
      value = value.toString();
      if (resource === 5700) {
        sensor.resources[resource] = Number(value);
        sensor.value = sensor.resources[resource];
      } else if (resource === 5701) {
        sensor.resources[resource] = value; // units
      } else if (resource === 5601 || resource === 5602) {
        sensor.resources[resource] = Number(value); // min || max measured range
      } else if (resource === 5603 || resource === 5604) {
        sensor.resources[resource] = Number(value); // min || max range
      } else if (resource === 5605) {
        sensor.resources[resource] = value; //  reset min/max event
      } else if (resource === 5750 || resource === 5751) {
        sensor.resources[resource] = value; // app_name || sensor type
      }
      break;
    case 3301: // illuminance sensor
      value = value.toString();
      if (resource === 5700) {
        sensor.resources[resource] = Number(value);
        sensor.value = sensor.resources[resource];
      } else if (resource === 5701) {
        sensor.resources[resource] = value; // units
      } else if (resource === 5601 || resource === 5602) {
        sensor.resources[resource] = Number(value); // min || max measured range
      } else if (resource === 5603 || resource === 5604) {
        sensor.resources[resource] = Number(value); // min || max range
      } else if (resource === 5605) {
        sensor.resources[resource] = value; //  reset min/max event
      } else if (resource === 5750 || resource === 5751) {
        sensor.resources[resource] = value; // app_name || sensor type
      }
      break;

    case 3302: // presence sensor
      value = value.toString();
      if (resource === 5500) {
        value = Boolean(value);
        sensor.resources[resource] = Number(value);
        sensor.value = sensor.resources[resource];
        if (value) sensor.resources['5501'] += 1;
        else sensor.resources['5501'] = 0;
      } else if (resource === 5903 || resource === 5904) {
        sensor.resources[resource] = Number(value); // busy to clear delay || clear to busy dealy
      } else if (resource === 5505) {
        sensor.resources[resource] = value; //  reset counter event
      } else if (resource === 5751) {
        sensor.resources[resource] = value; // sensor type
      }
      break;
    case 3303: // temperature sensor
      value = value.toString();
      if (resource === 5700) {
        sensor.resources[resource] = Number(value);
        sensor.value = sensor.resources[resource];
      } else if (resource === 5701) {
        sensor.resources[resource] = value; // units
      } else if (resource === 5601 || resource === 5602) {
        sensor.resources[resource] = Number(value); // min || max measured range
      } else if (resource === 5603 || resource === 5604) {
        sensor.resources[resource] = Number(value); // min || max range
      } else if (resource === 5605) {
        sensor.resources[resource] = value; //  reset min/max event
      } else if (resource === 5750 || resource === 5751) {
        sensor.resources[resource] = value; // app_name || sensor type
      }
      break;
    case 3304: // humidity sensor
      value = value.toString();
      if (resource === 5700) {
        sensor.resources[resource] = Number(value);
        sensor.value = sensor.resources[resource];
      } else if (resource === 5701) {
        sensor.resources[resource] = value; // units
      } else if (resource === 5601 || resource === 5602) {
        sensor.resources[resource] = Number(value); // min || max measured range
      } else if (resource === 5603 || resource === 5604) {
        sensor.resources[resource] = Number(value); // min || max range
      } else if (resource === 5605) {
        sensor.resources[resource] = value; //  reset min/max event
      } else if (resource === 5750 || resource === 5751) {
        sensor.resources[resource] = value; // app_name || sensor type
      }
      break;
    case 3306: // actuation
      value = value.toString();
      if (resource === 5851) {
        sensor.resources[resource] = Number(value); // dimmer
        sensor.value = sensor.resources[resource];
        if (sensor.resources['5851'] === 0) {
          sensor.resources['5850'] = false;
        }
      } else if (resource === 5850) {
        sensor.resources[resource] = Boolean(value); // switch
        sensor.value = Number(sensor.resources[resource]);
        if (value) {
          if (sensor.resources['5852'] === 0) {
            sensor.resources['5852'] = new Date();
          } else {
            sensor.resources['5852'] -= new Date();
          }
        } else {
          sensor.resources['5852'] = 0;
        }
      } else if (resource === 5853) {
        sensor.resources[resource] = value; // multi state output
      } else if (resource === 5750) {
        sensor.resources[resource] = value; // app_name
      }
      break;
    case 3308: // set point
      value = value.toString();
      if (resource === 5900) {
        sensor.resources[resource] = Number(value); // set point value
        sensor.value = sensor.resources[resource];
      } else if (resource === 5701) {
        sensor.resources[resource] = value; // unit
      } else if (resource === 5706) {
        sensor.resources[resource] = value; // color
      } else if (resource === 5750) {
        sensor.resources[resource] = value; // app_name
      }
      break;
    case 3310: // load control
      value = value.toString();
      sensor.resources['5824'] = new Date();
      sensor.resources['5826'] = 'event';
      //  sensor.value = sensor.resources["5550"];
      break;
    case 3311: // light control
      value = value.toString();
      if (resource === 5851) {
        sensor.resources[resource] = Number(value);
        sensor.value = sensor.resources[resource];
        if (sensor.resources['5851'] === 0) {
          sensor.resources['5850'] = 0;
        }
      } else if (resource === 5850) {
        value = Boolean(value);
        sensor.resources[resource] = Number(value);
        sensor.value = sensor.resources[resource];
        if (value) {
          if (sensor.resources['5852'] === 0) {
            sensor.resources['5852'] = new Date();
          } else {
            sensor.resources['5852'] -= new Date();
          }
        } else {
          sensor.resources['5852'] = 0;
        }
      } else if (resource === 5701) {
        sensor.resources[resource] = value; // unit
      } else if (resource === 5750) {
        sensor.resources[resource] = value; // app_name
      }
      break;
    case 3312: // power control
      value = value.toString();
      if (resource === 5851) {
        sensor.value = value;
        sensor.resources[resource] = Number(value);
        if (sensor.resources['5851'] === 0) {
          sensor.resources['5850'] = 0;
        }
      } else if (resource === 5850) {
        value = Boolean(value);
        sensor.resources[resource] = Number(value);
        if (value) {
          sensor.value = value;
          if (sensor.resources['5852'] === 0) {
            sensor.resources['5852'] = new Date();
          } else {
            sensor.resources['5852'] -= new Date();
          }
        } else {
          sensor.resources['5852'] = 0;
        }
      } else if (resource === 5701) {
        sensor.resources[resource] = value; // unit
      } else if (resource === 5706) {
        sensor.resources[resource] = value; // color
      } else if (resource === 5750) {
        sensor.resources[resource] = value; // app_name
      }
      break;
    case 3313: // accelerometer
      value = value.toString();
      if (resource === 5702 || resource === 5703 || resource === 5704) {
        sensor.resources[resource] = Number(value); // X || Y || Z
        sensor.value = sensor.resources[resource];
      } else if (resource === 5603 || resource === 5604) {
        sensor.resources[resource] = Number(value); // min / max range
      } else if (resource === 5701) {
        sensor.resources[resource] = value; // unit
      }
      break;
    case 3314: // magnetometer
      value = value.toString();
      if (resource === 5702 || resource === 5703 || resource === 5704) {
        sensor.resources[resource] = Number(value); // X || Y || Z
        sensor.value = sensor.resources[resource];
      } else if (resource === 5705) {
        sensor.resources[resource] = value; // compass direction
      } else if (resource === 5701) {
        sensor.resources[resource] = value; // unit
      }
      break;
    case 3315: // barometer
      value = value.toString();
      if (resource === 5700) {
        sensor.resources[resource] = Number(value);
        sensor.value = sensor.resources[resource];
      } else if (resource === 5701) {
        sensor.resources[resource] = value; // units
      } else if (resource === 5601 || resource === 5602) {
        sensor.resources[resource] = Number(value); // min || max measured range
      } else if (resource === 5603 || resource === 5604) {
        sensor.resources[resource] = Number(value); // min || max range
      } else if (resource === 5605) {
        sensor.resources[resource] = value; //  reset min/max event
      } else if (resource === 5750 || resource === 5751) {
        sensor.resources[resource] = value; // app_name || sensor type
      }
      break;
    case 3331: // energy
      value = value.toString();
      if (resource === 5700) {
        sensor.resources[resource] = value; // value
        sensor.value = sensor.resources[resource];
      } else if (resource === 5822) {
        sensor.resources[resource] = value; // reset cumulative enery
      } else if (resource === 5701) {
        sensor.resources[resource] = value; // unit
      } else if (resource === 5750) {
        sensor.resources[resource] = value; // app_name
      }
      break;
    case 3332: // direction
      value = value.toString();
      if (resource === 5601 || resource === 5602) {
        sensor.resources[resource] = Number(value); // min || max measured value
      } else if (resource === 5705) {
        sensor.resources[resource] = value; // compass direction
        sensor.value = sensor.resources[resource];
      } else if (resource === 5605) {
        sensor.resources[resource] = value; // reset min/max event
      } else if (resource === 5750) {
        sensor.resources[resource] = value; // app name
      }
      break;
    case 3333: // time
      value = value.toString();
      if (resource === 5506) {
        if (value) {
          sensor.resources[resource] = value; // current time
        } else if (!value) {
          sensor.resources[resource] = new Date(); // current time
        }
        sensor.value = sensor.resources[resource];
      } else if (resource === 5507) {
        sensor.resources[resource] = Number(value); // fraactionnal time s
      } else if (resource === 5750) {
        sensor.resources[resource] = value; // app_name
      }
      break;
    case 3334: // gyrometer
      value = value.toString();
      if (resource === 5702 || resource === 5703 || resource === 5704) {
        sensor.resources[resource] = Number(value); // X || Y || Z value
        sensor.value = sensor.resources[resource];
      } else if (resource === 5537 || resource === 5538) {
        sensor.resources[resource] = Number(value); // transition / remaining time in s
      } else if (resource === 5603 || resource === 5604) {
        sensor.resources[resource] = Number(value); // min || max range
      } else if (resource === 5605) {
        sensor.resources[resource] = value; // reset min/max event
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
        sensor.resources[resource] = value; // unit
      } else if (resource === 5750) {
        sensor.resources[resource] = value; // app name
      }
      break;
    case 3335: // color sensor
      value = value.toString();
      if (resource === 5706) {
        sensor.resources[resource] = value; // color
      } else if (resource === 5701) {
        sensor.resources[resource] = value; // unit
      } else if (resource === 5750) {
        sensor.resources[resource] = value; // app_name
      }
      sensor.value = sensor.resources['5706'];
      break;
    case 3336: // location
      value = value.toString();
      if (resource === 5514 || resource === 5515) {
        sensor.resources[resource] = value; // lat || lng
      } else if (resource === 5516) {
        sensor.resources[resource] = value; // uncertainity in meters
      } else if (resource === 5705) {
        sensor.resources[resource] = Number(value); // compass direction 0  -360°
      } else if (resource === 5518) {
        sensor.resources[resource] = new Date(); // timestamp
      } else if (resource === 5750) {
        sensor.resources[resource] = value; // app_name
      }
      sensor.value = [sensor.resources['5514'], sensor.resources['5515']];
      break;
    case 3337: // positioner
      value = value.toString();
      if (resource === 5536) {
        sensor.resources[resource] = Number(value); // current position 0-100 %
        sensor.value = sensor.resources[resource];
      } else if (resource === 5537 || resource === 5538) {
        sensor.resources[resource] = Number(value); // transition / remaining time in s
      } else if (resource === 5601 || resource === 5602) {
        sensor.resources[resource] = Number(value); // min || max measured value
      } else if (resource === 5605) {
        sensor.resources[resource] = value; // reset min/max event
      } else if (resource === 5519 || resource === 5520) {
        sensor.resources[resource] = Number(value); // min || max measuring limit
      } else if (resource === 5750) {
        sensor.resources[resource] = value; // app name
      }
      break;
    case 3339: // audio clip
      value = value.toString();
      if (resource === 5522) {
        sensor.resources[resource] = Buffer.from(value);
        sensor.value = sensor.resources[resource];
      } else if (resource === 5523) {
        sensor.resources[resource] = value; // Trigger
      } else if (resource === 5548) {
        sensor.resources[resource] = Number(value); // volume %
      } else if (resource === 5524) {
        sensor.resources[resource] = Number(value); // duration s
      } else if (resource === 5750) {
        sensor.resources[resource] = value; // app_name
      }
      break;
    case 3340: // timer
      value = value.toString();
      if (resource === 5826) {
        sensor.value = value;
        sensor.resources[resource] = Number(value); // timer mode 0-4
      } else if (resource === 5521 || resource === 5525) {
        sensor.resources[resource] = Number(value); // delay duration seconds || miniumum offtime seconds
      } else if (resource === 5523) {
        sensor.resources[resource] = value; // event trigger
      } else if (resource === 5534) {
        sensor.resources[resource] = Number(value); // timer counter
      } else if (resource === 5850) {
        sensor.resources[resource] = Number(value);
      } else if (resource === 5750) {
        sensor.resources[resource] = value; // app_name
      }
      // if (sensor.resources["5826"] > 0) {
      //   sensor.resources["5521"] = "15"; // delay duration seconds
      // } // timer mode
      // if (sensor.resources["5826"] > 1) {
      //   sensor.resources["5525"] = "15"; //  miniumum offtime seconds
      // }
      break;
    case 3341: // text display
      value = value.toString();
      if (resource === 5527) {
        sensor.resources[resource] = value;
      } else if (resource === 5528) {
        sensor.resources[resource] = Number(value); // X
      } else if (resource === 5529) {
        sensor.resources[resource] = Number(value); // Y
      } else if (resource === 5545) {
        sensor.resources[resource] = Number(value); //  Max X
      } else if (resource === 5546) {
        sensor.resources[resource] = Number(value); // Max Y
      } else if (resource === 5530) {
        sensor.resources[resource] = value; // clear display event
      } else if (resource === 5548 || resource === 5531) {
        sensor.resources[resource] = Number(value); // brightness || contrast level
      } else if (resource === 5750) {
        sensor.resources[resource] = value; // app_name
      }
      sensor.value = sensor.resources[resource];
      break;
    case 3342: // switch
      value = Boolean(value.toString());
      if (resource === 5500) {
        if (value) {
          sensor.resources['5501'] += 1; // counter
          if (sensor.resources['5852'] === 0) {
            sensor.resources['5852'] = new Date();
          } else {
            sensor.resources['5852'] -= new Date();
          }
        } else {
          sensor.resources['5501'] = 0;
          if (sensor.resources['5854'] === 0) {
            sensor.resources['5854'] = new Date();
          } else {
            sensor.resources['5854'] -= new Date();
          }
        }
        sensor.resources['5500'] = Boolean(value);
        sensor.value = Number(sensor.resources['5500']);
      } else if (resource === 5750) {
        sensor.resources[resource] = value; // app_name
      }
      break;
    case 3343: // dimmer
      if (resource === 5548) {
        value = Number(value.toString());
        sensor.resources['5548'] = value;
        if (sensor.resources['5548'] > 0) {
          if (sensor.resources['5852'] === 0) {
            sensor.resources['5852'] = new Date();
          } else {
            sensor.resources['5852'] -= new Date();
          }
        } else if (sensor.resources['5548'] === 0) {
          if (sensor.resources['5854'] === 0)
            sensor.resources['5854'] = new Date();
          else sensor.resources['5854'] -= new Date();
        }
        sensor.value = sensor.resources['5548'];
      }
      break;
    case 3344: // up/down control
      value = value.toString();
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
        sensor.resources[resource] = value; // app_name
      }
      break;
    case 3345: // joystick
      value = value.toString();
      if (resource === 5702 || resource === 5703 || resource === 5704) {
        sensor.resources[resource] = Number(value); // X || Y || Z
        sensor.value = sensor.resources[resource];
      } else if (resource === 5500) {
        value = Boolean(value);
        sensor.resources[resource] = value; // input state
        if (value) {
          sensor.resources['5501'] += 1; // counter
        } else {
          sensor.resources['5501'] = 0; // counter
        }
      } else if (resource === 5501) {
        sensor.resources[resource] = Number(value); // counter
      } else if (resource === 5750) {
        sensor.resources[resource] = value; // app name
      }
      break;
    case 3347: // push button
      value = value.toString();
      if (resource === 5500) {
        value = Boolean(value);
        sensor.value = value;
        sensor.resources['5500'] = value; // input value
        if (value) {
          sensor.resources['5501'] += 1; // counter
        } else {
          sensor.resources['5501'] = 0;
        }
      } else if (resource === 5750) {
        sensor.resources[resource] = value; // app name
      }
      break;
    case 3349: // bitmap
      if (resource === 5911) {
        value = Boolean(value.toString());
        sensor.value = value;
        sensor.resources[resource] = value; // bitmap input reset
      } else if (resource === 5912) {
        value = value.toString();
        //  sensor.value = value;
        sensor.resources[resource] = value; // element description
      } else if (resource === 5910) {
        if (!value.length) {
          return false;
        }
        sensor.resources[resource] = value; // buffer input
        sensor.value = value; // buffer input
        //  sensor.value = Uint8Array.from(value).buffer;
      } else if (resource === 5750) {
        value = value.toString();
        sensor.resources[resource] = value; // app name
      }
      break;
    case 3350: // stopwatch
      value = value.toString();
      if (resource === 5544) {
        sensor.resources[resource] = Number(value); // cumulative time in s- 0  = reset
        sensor.value = sensor.resources[resource];
      } else if (resource === 5850) {
        value = Boolean(value);
        sensor.resources[resource] = value;
        if (value) {
          sensor.resources['5501'] += 1;
        } else {
          sensor.resources['5501'] = 0;
        }
      } else if (resource === 5750) {
        sensor.resources[resource] = value; // app name
      }
      break;
    default:
      // CATCH 3301 until 3305 - 3315 - 3316 until 3330 - 3346
      value = value.toString();
      if (resource === 5700) {
        sensor.resources[resource] = Number(value);
        sensor.value = sensor.resources[resource];
      } else if (resource === 5701) {
        sensor.resources[resource] = value; // units
      } else if (resource === 5601 || resource === 5602) {
        sensor.resources[resource] = Number(value); // min || max measured range
      } else if (resource === 5603 || resource === 5604) {
        sensor.resources[resource] = Number(value); // min || max range
      } else if (resource === 5605) {
        sensor.resources[resource] = value; //  reset min/max event
      } else if (resource === 5821) {
        sensor.resources[resource] = Number(value); // current calibration
      } else if (resource === 5750 || resource === 5751) {
        sensor.resources[resource] = value; // app_name || sensor type
      } else {
        //  console.log('READ ONLY');
        //  sensor.value = sensor.resources["5700"];
        // sensor.resources[resource] = value;
      }
  }
  sensor.resource = resource;
  logger(4, 'handlers', 'updateAloesSensors:res', {
    sensor,
  });
  return sensor;
};

module.exports = {
  patternDetector,
  mySensorsDecoder,
  aloesLightDecoder,
  aloesClientDecoder,
  publish,
  //  subscribe,
  updateAloesSensors,
};
