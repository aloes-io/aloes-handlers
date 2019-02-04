const mqttPattern = require('mqtt-pattern');
const {logger} = require('./logger');
const protocolPatterns = require('./protocol-patterns.json');
const omaObjects = require('./OMA/oma-objects.json');
const omaResources = require('./OMA/oma-resources.json');
const omaViews = require('./OMA/oma-views.json');
const mySensorsApi = require('./MySensors/mysensors-api.json');
const {mySensorsDecoder} = require('./MySensors');
const {aloesLightDecoder} = require('./Aloes-Light');
const {aloesClientDecoder} = require('./Aloes');

// const extractProtocol = (pattern, topic) =>
//   new Promise((resolve, reject) => {
//     const protocol = mqttPattern.exec(pattern, topic);
//     if (protocol !== null) resolve(protocol);
//     else reject(protocol);
//   });

const patternDetector = packet => {
  try {
    const pattern = {name: 'empty', params: null};
    logger(2, 'handlers', 'patternDetector:req', packet.topic);
    if (packet.topic.split('/')[0] === '$SYS') return null;
    if (
      mqttPattern.matches(
        protocolPatterns.aloesClient.collectionPattern,
        packet.topic,
      )
    ) {
      logger(
        2,
        'handlers',
        'patternDetector:res',
        'reading AloesClient collection API...',
      );
      //  const aloesClientProtocol = await extractProtocol(protocolPatterns.aloesClient.collectionPattern, packet.topic);
      const aloesClientProtocol = mqttPattern.exec(
        protocolPatterns.aloesClient.collectionPattern,
        packet.topic,
      );
      logger(2, 'handlers', 'patternDetector:res', aloesClientProtocol);
      const collectionExists = protocolPatterns.aloesClient.validators.collectionName.some(
        collection => collection === aloesClientProtocol.collectionName,
      );
      const methodExists = protocolPatterns.aloesClient.validators.methods.some(
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
    if (
      mqttPattern.matches(
        protocolPatterns.aloesClient.instancePattern,
        packet.topic,
      )
    ) {
      logger(
        2,
        'handlers',
        'patternDetector:res',
        'reading AloesClient instance API ...',
      );
      //  const aloesClientProtocol = await extractProtocol(protocolPatterns.aloesClient.instancePattern, packet.topic);
      const aloesClientProtocol = mqttPattern.exec(
        protocolPatterns.aloesClient.instancePattern,
        packet.topic,
      );
      logger(4, 'handlers', 'patternDetector:res', aloesClientProtocol);
      //  if (aloesClientProtocol === null) return null;
      const methodExists = protocolPatterns.aloesClient.validators.methods.some(
        meth => meth === aloesClientProtocol.method,
      );
      const collectionExists = protocolPatterns.aloesClient.validators.collectionName.some(
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
    if (mqttPattern.matches(protocolPatterns.mySensors.pattern, packet.topic)) {
      logger(2, 'handlers', 'patternDetector:res', 'reading MySensors API ...');
      //  const mysensorsProtocol = await extractProtocol(protocolPatterns.mySensors.pattern, packet.topic);
      const mysensorsProtocol = mqttPattern.exec(
        protocolPatterns.mySensors.pattern,
        packet.topic,
      );
      logger(4, 'handlers', 'patternDetector:res', mysensorsProtocol);
      let typeExists = false;
      const methodExists = protocolPatterns.mySensors.validators.methods.some(
        meth => meth === Number(mysensorsProtocol.method),
      );
      if (Number(mysensorsProtocol.method) === 0) {
        typeExists = mySensorsApi.labelsPresentation.some(
          label => label.value === Number(mysensorsProtocol.subType),
        );
      } else if (
        Number(mysensorsProtocol.method) > 0 &&
        Number(mysensorsProtocol.method) < 2
      ) {
        typeExists = mySensorsApi.labelsSet.some(
          label => label.value === Number(mysensorsProtocol.subType),
        );
      }
      logger(4, 'handlers', 'patternDetector:res', {methodExists, typeExists});
      if (methodExists && typeExists) {
        pattern.name = 'mySensors';
        pattern.params = mysensorsProtocol;
        return pattern;
      }
    }
    if (
      mqttPattern.matches(protocolPatterns.aloesLight.pattern, packet.topic)
    ) {
      logger(
        2,
        'handlers',
        'patternDetector:res',
        'reading Aloes Light API ...',
      );
      //  const aloesProtocol = await extractProtocol(protocolPatterns.aloesLight.pattern, packet.topic);
      const aloesProtocol = mqttPattern.exec(
        protocolPatterns.aloesLight.pattern,
        packet.topic,
      );
      logger(4, 'handlers', 'patternDetector:res', aloesProtocol);
      const methodExists = protocolPatterns.aloesLight.validators.methods.some(
        meth => meth === Number(aloesProtocol.method),
      );
      const omaObjectIdExists = omaObjects.some(
        object => object.value === Number(aloesProtocol.omaObjectId),
      );
      logger(4, 'handlers', 'patternDetector:res', {
        methodExists,
        omaObjectIdExists,
      });
      if (methodExists && omaObjectIdExists) {
        pattern.name = 'aloesLight';
        pattern.params = aloesProtocol;
        return pattern;
      }
    }
    pattern.params = "topic doesn't match pattern";
    return pattern;
  } catch (error) {
    logger(2, 'handlers', 'patternDetector:err', error);
    return error;
  }
};

const isEmpty = obj => {
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  // null and undefined are "empty"
  if (obj == null) return true;
  if (obj.length > 0) return false;
  if (obj.length === 0) return true;
  for (let i = 0; i <= obj.length; i += 1) {
    const key = obj[i];
    if (hasOwnProperty.call(obj, key)) return false;
  }
  return true;
};

const publish = options => {
  //  logger(4, "pubsub", "publish:req", options);
  //  if (options && !isEmpty(options)) {
  if (options && options.data) {
    let topic = null;
    const data = options.data;
    if (options.pattern.toLowerCase() === 'mysensors') {
      const params = {
        prefixedDevEui: `${data.devEui}${data.inPrefix}`,
        nodeId: data.nativeNodeId,
        sensorId: data.nativeSensorId,
        subType: data.nativeResource,
      };
      logger(4, 'handlers', 'publish', params);
      if (options.method === 'POST') {
        params.method = 2;
        params.ack = 0;
        topic = mqttPattern.fill(protocolPatterns.mySensors.pattern, params);
        return {topic, payload: data.value};
      } else if (options.method === 'GET') {
        params.method = 2;
        params.ack = 0;
        topic = mqttPattern.fill(protocolPatterns.mySensors.pattern, params);
        return {topic, payload: data.value};
      }
      return 'Method not supported yet';
    } else if (options.pattern.toLowerCase() === 'aloeslight') {
      const params = {
        prefixedDevEui: `${data.devEui}${data.inPrefix}`,
        omaObjectId: data.type,
        sensorId: data.nativeSensorId,
        omaResourceId: data.resource,
      };
      logger(4, 'handlers', 'publish', params);
      if (options.method === 'POST') {
        params.method = 1;
        topic = mqttPattern.fill(protocolPatterns.aloesLight.pattern, params);
        return {topic, payload: data.value};
      } else if (options.method === 'GET') {
        params.method = 2;
        topic = mqttPattern.fill(protocolPatterns.aloesLight.pattern, params);
        return {topic, payload: data.value};
      }
      return 'Method not supported yet';
    } else if (options.pattern.toLowerCase() === 'aloesclient') {
      const params = {
        userId: options.userId,
        collectionName: options.collectionName,
        modelId: options.modelId,
        method: options.method,
      };
      logger(4, 'handlers', 'publish', params);
      if (options.method === 'POST') {
        topic = mqttPattern.fill(
          protocolPatterns.aloesClient.collectionPattern,
          params,
        );
      } else if (options.method === 'DELETE') {
        topic = mqttPattern.fill(
          protocolPatterns.aloesClient.collectionPattern,
          params,
        );
      } else if (options.method === 'PUT') {
        topic = mqttPattern.fill(
          protocolPatterns.aloesClient.collectionPattern,
          params,
        );
      } else {
        topic = mqttPattern.fill(
          protocolPatterns.aloesClient.instancePattern,
          params,
        );
      }
      return {topic, payload: data};
    }
    return 'Protocol not supported yet';
  }
  return new Error('Error: Option must be an object type');
};

const subscribe = (socket, options) => {
  logger(4, 'handlers', 'subscribe:req', options);
  if (options && !isEmpty(options)) {
    let topic = null;
    if (options.pattern.toLowerCase() === 'mysensors') {
      topic = null;
    } else if (options.pattern.toLowerCase() === 'aloesclient') {
      const params = {
        userId: options.userId,
        collectionName: options.collectionName,
        modelId: options.modelId,
        method: options.method,
      };
      if (options.method === 'POST') {
        topic = mqttPattern.fill(
          protocolPatterns.aloesClient.collectionPattern,
          params,
        );
      } else if (options.method === 'DELETE') {
        topic = mqttPattern.fill(
          protocolPatterns.aloesClient.collectionPattern,
          params,
        );
      } else {
        topic = mqttPattern.fill(
          protocolPatterns.aloesClient.instancePattern,
          params,
        );
      }
    }
    return topic;
  }
  return new Error('Error: Option must be an object type');
};

const publishToNative = options => {
  //  logger(4, "pubsub", "publishToNative:req", options);
  //  if (options && !isEmpty(options)) {
  if (options && options.data && options.data.protocolName) {
    let topic = null;
    const data = options.data;
    if (data.protocolName.toLowerCase() === 'mysensors') {
      const params = {
        prefixedDevEui: `${data.devEui}${data.inPrefix}`,
        nodeId: data.nativeNodeId,
        sensorId: data.nativeSensorId,
        subType: data.nativeResource,
      };
      logger(4, 'handlers', 'publishToNative', params);
      if (options.method === 'POST' || options.method === 'PUT') {
        params.method = 2;
        params.ack = 0;
        topic = mqttPattern.fill(protocolPatterns.mySensors.pattern, params);
        return {topic, payload: data.value};
      } else if (options.method === 'GET') {
        params.method = 2;
        params.ack = 0;
        topic = mqttPattern.fill(protocolPatterns.mySensors.pattern, params);
        return {topic, payload: data.value};
      }
      return 'Method not supported yet';
    } else if (data.protocolName.toLowerCase() === 'aloeslight') {
      const params = {
        prefixedDevEui: `${data.devEui}${data.inPrefix}`,
        omaObjectId: data.type,
        sensorId: data.nativeSensorId,
        omaResourcesId: data.resource,
      };
      logger(4, 'handlers', 'publishToNative', params);
      if (options.method === 'POST' || options.method === 'PUT') {
        params.method = 1;
        topic = mqttPattern.fill(protocolPatterns.aloes.pattern, params);
        return {topic, payload: data.value};
      } else if (options.method === 'GET') {
        params.method = 2;
        topic = mqttPattern.fill(protocolPatterns.aloes.pattern, params);
        return {topic, payload: data.value};
      }
      return 'Method not supported yet';
    }
    return 'Protocol not supported yet';
  }
  return new Error('Error: Option must be an object type');
};

let uploadedFiles = [];
let counter = 0;
function parseStream(payload, bufferSize) {
  console.log('parseStream.........', payload);
  if (payload.length === bufferSize) {
    //console.log(this.counter);
    if (counter === 1) {
      return (uploadedFiles = new Blob([payload], {
        type: 'image/jpeg',
      }));
    } else {
      return (uploadedFiles = new Blob([uploadedFiles, payload], {
        type: 'image/jpeg',
      }));
    }
  } else if (payload.length <= 4) {
    //console.log("last", this.counter);
    const blob = new Blob([this.uploadedFiles, payload], {
      type: 'image/jpeg',
    });
    uploadedFiles = [];
    counter = 0;
  }
}

const updateAloesSensors = (sensor, resource, value) => {
  logger(4, 'handlers', 'updateAloesSensors', {
    sensor,
    resource,
    value,
  });
  switch (Number(sensor.type)) {
    case 3200: // digital input
      if (resource === 5500) {
        sensor.resources[resource] = Boolean(value);
        sensor.value = Number(sensor.resources[resource]);
        if (value) sensor.resources['5501'] = sensor.resources['5501'] + 1;
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
      if (resource === 5550) {
        sensor.resources[resource] = Boolean(value);
        sensor.value = Number(sensor.resources[resource]);
      } else if (resource === 5551) {
        sensor.resources[resource] = Boolean(value); // polarity
      } else if (resource === 5750) {
        sensor.resources[resource] = value; // app_name
      }
      break;
    case 3202: // analog input
      if (resource === 5600) {
        sensor.resources[resource] = Number(value);
        sensor.value = sensor.resources[resource];
      } else if (resource === 5601 || resource === 5602) {
        sensor.resources[resource] = Number(value); // min || max measured range
      } else if (resource === 5603 || resource === 5604) {
        sensor.resources[resource] = Number(value); // min || max range
      } else if (resource === 5605) {
        sensor.resources[resource] = value; //reset min/max event
      } else if (resource === 5750 || resource === 5751) {
        sensor.resources[resource] = value; // app_name || sensor type
      }
      break;
    case 3203: // analog output
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
        sensor.resources[resource] = value; //reset min/max event
      } else if (resource === 5750 || resource === 5751) {
        sensor.resources[resource] = value; // app_name || sensor type
      }
      break;
    case 3301: // illuminance sensor
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
        sensor.resources[resource] = value; //reset min/max event
      } else if (resource === 5750 || resource === 5751) {
        sensor.resources[resource] = value; // app_name || sensor type
      }
      break;

    case 3302: // presence sensor
      if (resource === 5500) {
        sensor.resources[resource] = Number(value);
        sensor.value = sensor.resources[resource];
        if (value) sensor.resources['5501'] = sensor.resources['5501'] + 1;
        else sensor.resources['5501'] = 0;
      } else if (resource === 5903 || resource === 5904) {
        sensor.resources[resource] = Number(value); // busy to clear delay || clear to busy dealy
      } else if (resource === 5505) {
        sensor.resources[resource] = value; //reset counter event
      } else if (resource === 5751) {
        sensor.resources[resource] = value; // sensor type
      }
      break;
    case 3303: // temperature sensor
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
        sensor.resources[resource] = value; //reset min/max event
      } else if (resource === 5750 || resource === 5751) {
        sensor.resources[resource] = value; // app_name || sensor type
      }
      break;
    case 3304: // humidity sensor
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
        sensor.resources[resource] = value; //reset min/max event
      } else if (resource === 5750 || resource === 5751) {
        sensor.resources[resource] = value; // app_name || sensor type
      }
      break;
    case 3306: // actuation
      if (resource === 5851) {
        sensor.resources[resource] = Number(value); // dimmer
        sensor.value = sensor.resources[resource];
        if (sensor.resources['5851'] === 0) {
          sensor.resources['5850'] = 0;
        }
      } else if (resource === 5850) {
        sensor.resources[resource] = Boolean(value); // switch
        sensor.value = Number(sensor.resources[resource]);
        if (value) {
          if (sensor.resources['5852'] === 0) {
            sensor.resources['5852'] = new Date();
          } else {
            sensor.resources['5852'] = sensor.resources['5852'] - new Date();
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
      sensor.resources['5824'] = Date();
      sensor.resources['5826'] = 'event';
      //  sensor.value = sensor.resources["5550"];
      break;
    case 3311: // light control
      if (resource === 5851) {
        sensor.resources[resource] = Number(value);
        sensor.value = sensor.resources[resource];
        if (sensor.resources['5851'] === 0) {
          sensor.resources['5850'] = 0;
        }
      } else if (resource === 5850) {
        sensor.resources[resource] = Number(value);
        sensor.value = sensor.resources[resource];
        if (value) {
          if (sensor.resources['5852'] === 0) {
            sensor.resources['5852'] = new Date();
          } else {
            sensor.resources['5852'] = sensor.resources['5852'] - new Date();
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
      if (resource === 5851) {
        sensor.resources[resource] = Number(value);
        if (sensor.resources['5851'] === 0) {
          sensor.resources['5850'] = 0;
        }
      } else if (resource === 5850) {
        sensor.resources[resource] = Number(value);
        if (value) {
          if (sensor.resources['5852'] === 0) {
            sensor.resources['5852'] = new Date();
          } else {
            sensor.resources['5852'] = sensor.resources['5852'] - new Date();
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
        sensor.resources[resource] = value; //reset min/max event
      } else if (resource === 5750 || resource === 5751) {
        sensor.resources[resource] = value; // app_name || sensor type
      }
      break;
    case 3331: // energy
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
      if (resource === 5514 || resources === 5515) {
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
      if (resource === 5826) {
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
      } else if (resource === 5548 || resources === 5531) {
        sensor.resources[resource] = Number(value); // brightness || contrast level
      } else if (resource === 5750) {
        sensor.resources[resource] = value; // app_name
      }
      sensor.value = sensor.resources[resource];
      break;
    case 3342: // switch
      if (resource === 5500) {
        if (value) {
          sensor.resources['5501'] = sensor.resources['5501'] + 1; // counter
          if (sensor.resources['5852'] === 0) {
            sensor.resources['5852'] = new Date();
          } else {
            sensor.resources['5852'] = sensor.resources['5852'] - new Date();
          }
        } else {
          sensor.resources['5501'] = 0;
          if (sensor.resources['5854'] === 0) {
            sensor.resources['5854'] = new Date();
          } else {
            sensor.resources['5854'] = sensor.resources['5854'] - new Date();
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
        sensor.resources['5548'] = value;
        if (sensor.resources['5548'] > 0) {
          if (sensor.resources['5852'] === 0) {
            sensor.resources['5852'] = new Date();
          } else {
            sensor.resources['5852'] = sensor.resources['5852'] - new Date();
          }
        } else if (sensor.resources['5548'] === 0) {
          if (sensor.resources['5854'] === 0)
            sensor.resources['5854'] = new Date();
          else sensor.resources['5854'] = sensor.resources['5854'] - new Date();
        }
        sensor.value = sensor.resources['5548'];
      }
      break;
    case 3344: // up/down control
      if (resource === 5532) {
        //todo check resource type
        sensor.resources['5542'] = 0;
        sensor.resources['5541'] = sensor.resources['5541'] + 1;
        sensor.value = sensor.resources['5541'];
      } else if (resource === 5533) {
        sensor.resources['5541'] = 0;
        sensor.resources['5542'] = sensor.resources['5542'] + 1;
        sensor.value = -sensor.resources['5542'];
      } else if (resource === 5750) {
        sensor.resources[resource] = value; // app_name
      }
      break;
    case 3345: // joystick
      if (resource === 5702 || resource === 5703 || resource === 5704) {
        sensor.resources[resource] = Number(value); // X || Y || Z
        sensor.value = sensor.resources[resource];
      } else if (resource === 5500) {
        sensor.resources[resource] = Boolean(value); // input state
        if (value) {
          sensor.resources['5501'] = sensor.resources['5501'] + 1; // counter
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
      if (resource === 5500) {
        sensor.resources['5500'] = Boolean(value); // input value
        if (value) {
          sensor.resources['5501'] = sensor.resources['5501'] + 1; // counter
        } else {
          sensor.resources['5501'] = 0;
        }
      } else if (resource === 5750) {
        sensor.resources[resource] = value; // app name
      }
      break;
    case 3349: // bitmap
      if (resource === 5911) {
        sensor.resources[resource] = value; // bitmap input reset
      } else if (resource === 5912) {
        sensor.resources[resource] = value; // element description
      } else if (resource === 5910) {
        counter += 1;
        if (!value.length) {
          return false;
        }
        sensor.resources[resource] = Buffer.from(value); // buffer input
        sensor.value = Uint8Array.from(value).buffer;
        //  sensor.buffer = value;
      } else if (resource === 5750) {
        sensor.resources[resource] = value; // app name
      }
      break;
    case 3350: // stopwatch
      if (resource === 5544) {
        sensor.resources[resource] = Number(value); // cumulative time in s- 0  = reset
        sensor.value = sensor.resources[resource];
      } else if (resource === 5850) {
        sensor.resources[resource] = Boolean(value);
        if (value) {
          sensor.resources['5501'] = sensor.resources['5501'] + 1;
        } else {
          sensor.resources['5501'] = 0;
        }
      } else if (resource === 5750) {
        sensor.resources[resource] = value; // app name
      }
      break;
    default:
      // CATCH 3301 until 3305 - 3315 - 3316 until 3330 - 3346
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
        sensor.resources[resource] = value; //reset min/max event
      } else if (resource === 5821) {
        sensor.resources[resource] = Number(value); // current calibration
      } else if (resource === 5750 || resource === 5751) {
        sensor.resources[resource] = value; // app_name || sensor type
      } else {
        console.log('READ ONLY');
        //  sensor.value = sensor.resources["5700"];
        // sensor.resources[resource] = value;
      }
  }
  sensor.resource = resource;
  return sensor;
};

module.exports = {
  protocolPatterns,
  mySensorsApi,
  omaObjects,
  omaResources,
  omaViews,
  patternDetector,
  mySensorsDecoder,
  aloesLightDecoder,
  aloesClientDecoder,
  publish,
  subscribe,
  publishToNative,
  updateAloesSensors,
};
