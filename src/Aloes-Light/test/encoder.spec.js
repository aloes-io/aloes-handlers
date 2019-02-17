require('@babel/register');

import {assert} from 'chai';
import fs from 'fs';
import path from 'path';
import {updateAloesSensors} from '../..';
import {aloesLightEncoder} from '../lib/encoder';
import {aloesLightPatternDetector} from '../lib/detector';

//  const aloesLightPattern = "+prefixedDevEui/+method/+omaObjectId/+sensorId/+omaResourceId";

describe('aloesLightEncoder - test 1', () => {
  const packet = {topic: 'Aloes123-in/0/3349/3/5910', payload: 'test'};
  const pattern = aloesLightPatternDetector(packet);
  const options = {
    pattern: pattern.name,
    method: 'HEAD',
    data: {
      devEui: pattern.params.prefixedDevEui.split('-')[0],
      protocolName: 'aloesLight',
      type: Number(pattern.params.omaObjectId),
      resources: {'5700': null, '5750': 'awesome'},
      nativeSensorId: pattern.params.sensorId,
      resource: pattern.params.omaResourceId,
      inputPath: `${pattern.params.prefixedDevEui.split('-')[0]}-in/${
        pattern.params.method
      }/${pattern.params.omaObjectId}/${pattern.params.sensorId}/${
        pattern.params.omaResourceId
      }`,
      outputPath: `${pattern.params.prefixedDevEui.split('-')[0]}-out/${
        pattern.params.method
      }/${pattern.params.omaObjectId}/${pattern.params.sensorId}/${
        pattern.params.omaResourceId
      }`,
      inPrefix: '-in',
      outPrefix: '-out',
      value: packet.payload,
    },
  };
  const encoded = aloesLightEncoder(options.data, options);
  // console.log('Aloes Light - test1 - updateSensor', updatedSensor);

  it('pattern should exist', () => {
    assert.typeOf(pattern, 'object');
  });

  it('pattern should contain params and value properties', () => {
    assert.hasAllKeys(pattern, ['params', 'name']);
  });

  it(`pattern name should be aloesLight`, () => {
    assert.strictEqual('aloesLight', pattern.name);
  });

  it('encoded should exist', () => {
    assert.typeOf(encoded, 'object');
  });

  it('encoded payload should contain topic and payload properties', () => {
    assert.hasAllKeys(encoded, ['topic', 'payload']);
  });

  it(`encoded payload should be ${packet.payload}`, () => {
    assert.strictEqual(packet.payload, encoded.payload);
  });

  it(`encoded topic should be ${packet.topic}`, () => {
    assert.strictEqual(packet.topic, encoded.topic);
  });
});

describe('aloesLightEncoder - test 2', () => {
  const packet = {topic: 'Aloes123-in/0/3300/4/5700', payload: 'test'};
  const pattern = aloesLightPatternDetector(packet);
  const options = {
    pattern: pattern.name,
    method: 'HEAD',
    data: {
      devEui: pattern.params.prefixedDevEui.split('-')[0],
      protocolName: 'aloesLight',
      type: Number(pattern.params.omaObjectId),
      resources: {'5700': null, '5750': 'awesome'},
      nativeSensorId: pattern.params.sensorId,
      resource: pattern.params.omaResourceId,
      inputPath: `${pattern.params.prefixedDevEui.split('-')[0]}-in/${
        pattern.params.method
      }/${pattern.params.omaObjectId}/${pattern.params.sensorId}/${
        pattern.params.omaResourceId
      }`,
      outputPath: `${pattern.params.prefixedDevEui.split('-')[0]}-out/${
        pattern.params.method
      }/${pattern.params.omaObjectId}/${pattern.params.sensorId}/${
        pattern.params.omaResourceId
      }`,
      inPrefix: '-in',
      outPrefix: '-out',
      value: packet.payload,
    },
  };
  const encoded = aloesLightEncoder(options.data, options);
  console.log('encoded', encoded);
  it('pattern should exist', () => {
    assert.typeOf(pattern, 'object');
  });

  it('pattern should contain params and value properties', () => {
    assert.hasAllKeys(pattern, ['params', 'name']);
  });

  it(`pattern name should be aloesLight`, () => {
    assert.strictEqual('aloesLight', pattern.name);
  });

  it('encoded should exist', () => {
    assert.typeOf(encoded, 'object');
  });

  it('encoded payload should contain topic and payload properties', () => {
    assert.hasAllKeys(encoded, ['topic', 'payload']);
  });

  it(`encoded payload should be ${packet.payload}`, () => {
    assert.strictEqual(packet.payload, encoded.payload);
  });

  it(`encoded topic should be ${packet.topic}`, () => {
    assert.strictEqual(packet.topic, encoded.topic);
  });
});

describe('aloesLightEncoder - test 3', () => {
  const packet = {topic: 'Aloes123-in/1/3349/3/5910', payload: 'test'};
  const pattern = aloesLightPatternDetector(packet);
  const options = {
    pattern: pattern.name,
    method: 'POST',
    data: {
      devEui: pattern.params.prefixedDevEui.split('-')[0],
      protocolName: 'aloesLight',
      type: Number(pattern.params.omaObjectId),
      resources: {'5910': null, '5911': 0},
      nativeSensorId: pattern.params.sensorId,
      resource: pattern.params.omaResourceId,
      inputPath: `${pattern.params.prefixedDevEui.split('-')[0]}-in/${
        pattern.params.method
      }/${pattern.params.omaObjectId}/${pattern.params.sensorId}/${
        pattern.params.omaResourceId
      }`,
      outputPath: `${pattern.params.prefixedDevEui.split('-')[0]}-out/${
        pattern.params.method
      }/${pattern.params.omaObjectId}/${pattern.params.sensorId}/${
        pattern.params.omaResourceId
      }`,
      inPrefix: '-in',
      outPrefix: '-out',
      value: packet.payload,
    },
  };
  const encoded = aloesLightEncoder(options.data, options);
  // console.log('Aloes Light - test1 - updateSensor', updatedSensor);

  it('pattern should exist', () => {
    assert.typeOf(pattern, 'object');
  });

  it('pattern should contain params and value properties', () => {
    assert.hasAllKeys(pattern, ['params', 'name']);
  });

  it(`pattern name should be aloesLight`, () => {
    assert.strictEqual('aloesLight', pattern.name);
  });

  it('encoded should exist', () => {
    assert.typeOf(encoded, 'object');
  });

  it('encoded payload should contain topic and payload properties', () => {
    assert.hasAllKeys(encoded, ['topic', 'payload']);
  });

  it(`encoded payload should be ${packet.payload}`, () => {
    assert.strictEqual(packet.payload, encoded.payload);
  });

  it(`encoded topic should be ${packet.topic}`, () => {
    assert.strictEqual(packet.topic, encoded.topic);
  });
});

describe('aloesLightEncoder - test 4', () => {
  const packet = {
    topic: 'Aloes123-in/1/3349/4/5910',
    payload: Buffer.from('looognognogonbbuffferrr'),
  };
  const pattern = aloesLightPatternDetector(packet);
  const options = {
    pattern: pattern.name,
    method: 'POST',
    data: {
      devEui: pattern.params.prefixedDevEui.split('-')[0],
      protocolName: 'aloesLight',
      type: Number(pattern.params.omaObjectId),
      nativeSensorId: pattern.params.sensorId,
      resource: pattern.params.omaResourceId,
      resources: {'5910': null, '5911': 0},
      inputPath: `${pattern.params.prefixedDevEui.split('-')[0]}-in/${
        pattern.params.method
      }/${pattern.params.omaObjectId}/${pattern.params.sensorId}/${
        pattern.params.omaResourceId
      }`,
      outputPath: `${pattern.params.prefixedDevEui.split('-')[0]}-out/${
        pattern.params.method
      }/${pattern.params.omaObjectId}/${pattern.params.sensorId}/${
        pattern.params.omaResourceId
      }`,
      inPrefix: '-in',
      outPrefix: '-out',
      value: packet.payload,
    },
  };
  const encoded = aloesLightEncoder(options.data, options);
  let updatedSensor;
  // fs.readFile(`${path.resolve('.')}/src/assets/feuer.png`, (err, data) => {
  //   if (err) throw err;
  //   updatedSensor = updateAloesSensors(options.data, 5910, data);
  //   //  console.log('Aloes Light - test4 - updateSensor', updatedSensor);
  // });

  it('pattern should exist', () => {
    assert.typeOf(pattern, 'object');
  });

  it('pattern should contain params and value properties', () => {
    assert.hasAllKeys(pattern, ['params', 'name']);
  });

  it(`pattern name should be aloesLight`, () => {
    assert.strictEqual('aloesLight', pattern.name);
  });

  it('encoded should exist', () => {
    assert.typeOf(encoded, 'object');
  });

  it('encoded payload should contain topic and payload properties', () => {
    assert.hasAllKeys(encoded, ['topic', 'payload']);
  });

  it(`encoded payload should be ${packet.payload}`, () => {
    assert.strictEqual(packet.payload, encoded.payload);
  });

  it(`encoded topic should be ${packet.topic}`, () => {
    assert.strictEqual(packet.topic, encoded.topic);
  });

  // it('updatedSensors should exist', () => {
  //   assert.typeOf(updatedSensor, 'object');
  // });

  // it('updatedSensors value should exist', () => {
  //   assert.instanceOf(updatedSensor.value, 'Buffer');
  // });
});
