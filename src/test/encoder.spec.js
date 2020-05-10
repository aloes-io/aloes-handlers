/* Copyright 2020 Edouard Maleix, read LICENSE */

const {assert} = require('chai');
const {aloesClientEncoder} = require('../lib/encoder');
const {aloesClientPatternDetector} = require('../lib/detector');

// collectionPattern: '+userId/+collection/+method',
// instancePattern: '+userId/+collection/+method/+modelId',

describe('aloesClientEncoder', () => {
  describe('Test 1 - aloesLight POST', () => {
    const packet = {
      topic: '1/Sensor/POST',
      payload: Buffer.from(
        JSON.stringify({
          transportProtocol: 'aloesLight',
          messageProtocol: 'aloesLight',
          devEui: '3322321',
          type: 3300,
          nativeSensorId: 4,
          resource: 5700,
          resources: {'5700': 1},
          inputPath: `3322321-in/1/3300/4/5700`,
          outputPath: `3322321-out/1/3300/4/5700`,
          inPrefix: '-in',
          outPrefix: '-out',
          value: 5,
        }),
      ),
    };
    const pattern = aloesClientPatternDetector(packet);
    const options = {
      pattern: pattern.name,
      userId: pattern.params.userId,
      collection: pattern.params.collection,
      modelId: pattern.params.modelId,
      method: pattern.params.method,
      data: JSON.parse(packet.payload),
    };
    const encoded = aloesClientEncoder(options);

    it('encoded should exist', () => {
      assert.typeOf(encoded, 'object');
    });

    it('encoded payload should contain topic and payload properties', () => {
      assert.hasAllKeys(encoded, ['topic', 'payload']);
    });

    it(`encoded payload should be 5`, () => {
      assert.strictEqual(5, encoded.payload.value);
    });

    it(`encoded topic should be ${packet.topic}`, () => {
      assert.strictEqual(packet.topic, encoded.topic);
    });
  });

  describe('Test 2 - aloesLight PUT', () => {
    const packet = {
      topic: '1/Sensor/PUT',
      payload: Buffer.from(
        JSON.stringify({
          id: 1,
          transportProtocol: 'aloesLight',
          messageProtocol: 'aloesLight',
          devEui: '3322321',
          type: 3306,
          nativeSensorId: 4,
          resource: 5850,
          resources: {'5850': 1},
          inputPath: `3322321-in/1/3306/4/5850`,
          outputPath: `3322321-out/1/3306/4/5850`,
          inPrefix: '-in',
          outPrefix: '-out',
          value: 5,
        }),
      ),
    };
    const pattern = aloesClientPatternDetector(packet);
    const options = {
      pattern: pattern.name,
      userId: pattern.params.userId,
      collection: pattern.params.collection,
      modelId: pattern.params.modelId,
      method: pattern.params.method,
      data: JSON.parse(packet.payload),
    };
    const encoded = aloesClientEncoder(options);
    // const updatedSensor = updateAloesSensors(JSON.parse(packet.payload), 5850, 0);

    it('encoded should exist', () => {
      assert.typeOf(encoded, 'object');
    });

    it('encoded payload should contain topic and payload properties', () => {
      assert.hasAllKeys(encoded, ['topic', 'payload']);
    });

    it(`encoded payload should be 5`, () => {
      assert.strictEqual(5, encoded.payload.value);
    });

    it(`encoded topic should be ${packet.topic}`, () => {
      assert.strictEqual(packet.topic, encoded.topic);
    });
  });

  describe('Test 2 - aloesLight GET', () => {
    const packet = {
      topic: '1/Sensor/GET',
      payload: Buffer.from(
        JSON.stringify({
          id: 1,
          transportProtocol: 'aloesLight',
          messageProtocol: 'aloesLight',
          devEui: '3322321',
          type: 3306,
          nativeSensorId: 4,
          resource: 5850,
          resources: {'5850': 1},
          inputPath: `3322321-in/1/3306/4/5850`,
          outputPath: `3322321-out/1/3306/4/5850`,
          inPrefix: '-in',
          outPrefix: '-out',
          value: 5,
        }),
      ),
    };
    const pattern = aloesClientPatternDetector(packet);
    const options = {
      pattern: pattern.name,
      userId: pattern.params.userId,
      collection: pattern.params.collection,
      modelId: pattern.params.modelId,
      method: pattern.params.method,
      data: JSON.parse(packet.payload),
    };
    const encoded = aloesClientEncoder(options);
    // const updatedSensor = updateAloesSensors(JSON.parse(packet.payload), 5850, 0);

    it('encoded should exist', () => {
      assert.typeOf(encoded, 'object');
    });

    it('encoded payload should contain topic and payload properties', () => {
      assert.hasAllKeys(encoded, ['topic', 'payload']);
    });

    it(`encoded payload should be 5`, () => {
      assert.strictEqual(5, encoded.payload.value);
    });

    it(`encoded topic should be ${packet.topic}`, () => {
      assert.strictEqual(packet.topic, encoded.topic);
    });
  });

  describe('Test 2 - aloesLight DELETE', () => {
    const packet = {
      topic: '1/Sensor/DELETE',
      payload: Buffer.from(
        JSON.stringify({
          id: 1,
          transportProtocol: 'aloesLight',
          messageProtocol: 'aloesLight',
          devEui: '3322321',
          type: 3306,
          nativeSensorId: 4,
          resource: 5850,
          resources: {'5850': 1},
          inputPath: `3322321-in/1/3306/4/5850`,
          outputPath: `3322321-out/1/3306/4/5850`,
          inPrefix: '-in',
          outPrefix: '-out',
          value: 5,
        }),
      ),
    };
    const pattern = aloesClientPatternDetector(packet);
    const options = {
      pattern: pattern.name,
      userId: pattern.params.userId,
      collection: pattern.params.collection,
      modelId: pattern.params.modelId,
      method: pattern.params.method,
      data: JSON.parse(packet.payload),
    };
    const encoded = aloesClientEncoder(options);
    // const updatedSensor = updateAloesSensors(JSON.parse(packet.payload), 5850, 0);

    it('encoded should exist', () => {
      assert.typeOf(encoded, 'object');
    });

    it('encoded payload should contain topic and payload properties', () => {
      assert.hasAllKeys(encoded, ['topic', 'payload']);
    });

    it(`encoded payload should be 5`, () => {
      assert.strictEqual(5, encoded.payload.value);
    });

    it(`encoded topic should be ${packet.topic}`, () => {
      assert.strictEqual(packet.topic, encoded.topic);
    });
  });

  describe('Test 3 - mySensors', () => {
    let packet = {
      topic: '1/Sensor/PUT/1',
      payload: Buffer.from(
        JSON.stringify({
          id: 1,
          transportProtocol: 'mySensors',
          messageProtocol: 'mySensors',
          devEui: '3322321',
          type: 3300,
          nativeNodeId: 3,
          nativeSensorId: 4,
          nativeResource: 48,
          resource: 5700,
          resources: {'5700': 1},
          inputPath: `3322321-in/3/4/1/0/48`,
          outputPath: `3322321-out/3/4/1/0/48`,
          inPrefix: '-in',
          outPrefix: '-out',
          value: 5,
        }),
      ),
    };
    const pattern = aloesClientPatternDetector(packet);
    const options = {
      pattern: pattern.name,
      userId: pattern.params.userId,
      collection: pattern.params.collection,
      modelId: pattern.params.modelId,
      method: pattern.params.method,
      data: JSON.parse(packet.payload),
    };
    const encoded = aloesClientEncoder(options);

    it('encoded should exist', () => {
      assert.typeOf(encoded, 'object');
    });

    it('encoded payload should contain topic and payload properties', () => {
      assert.hasAllKeys(encoded, ['topic', 'payload']);
    });

    it(`encoded payload should be 5`, () => {
      assert.strictEqual(5, encoded.payload.value);
    });

    it(`encoded topic should be ${packet.topic}`, () => {
      assert.strictEqual(packet.topic, encoded.topic);
    });
  });

  describe('Test 4 - mySensors', () => {
    let packet = {
      topic: '1/IoTAgent/PUT',
      payload: Buffer.from(
        JSON.stringify({
          transportProtocol: 'mySensors',
          messageProtocol: 'mySensors',
          devEui: '3322321',
          type: 3306,
          nativeSensorId: 4,
          nativeNodeId: 4,
          nativeResource: 2,
          resource: 5850,
          resources: {'5850': 5},
          inputPath: `3322321-in/4/4/1/0/2`,
          outputPath: `3322321-out/4/4/1/0/2`,
          inPrefix: '-in',
          outPrefix: '-out',
          value: 5,
        }),
      ),
    };
    const pattern = aloesClientPatternDetector(packet);
    const options = {
      pattern: pattern.name,
      userId: pattern.params.userId,
      collection: pattern.params.collection,
      modelId: pattern.params.modelId,
      method: pattern.params.method,
      data: JSON.parse(packet.payload),
    };
    const encoded = aloesClientEncoder(options);

    it('encoded should exist', () => {
      assert.typeOf(encoded, 'object');
    });

    it('encoded payload should contain topic and payload properties', () => {
      assert.hasAllKeys(encoded, ['topic', 'payload']);
    });

    it(`encoded payload should be 5`, () => {
      assert.strictEqual(5, encoded.payload.value);
    });

    it(`encoded topic should be ${packet.topic}`, () => {
      assert.strictEqual(`${packet.topic}`, encoded.topic);
    });
  });

  describe('Test 5 - mySensors', () => {
    let packet = {
      topic: '1/IoTAgent/PUT',
      payload: Buffer.from(
        JSON.stringify({
          transportProtocol: 'mySensors',
          messageProtocol: 'mySensors',
          devEui: '3322321',
          type: 3306,
          nativeSensorId: 4,
          nativeNodeId: 4,
          nativeResource: 2,
          resource: 5850,
          resources: {'5850': 5},
          inputPath: `3322321-in/4/4/1/0/2`,
          outputPath: `3322321-out/4/4/1/0/2`,
          inPrefix: '-in',
          outPrefix: '-out',
          value: 5,
        }),
      ),
    };
    const pattern = aloesClientPatternDetector(packet);
    const options = {
      pattern: pattern.name,
      userId: pattern.params.userId,
      collection: pattern.params.collection,
      modelId: pattern.params.modelId,
      method: pattern.params.method,
      //  data: JSON.parse(packet.payload),
    };
    const encoded = aloesClientEncoder(options);

    it('encoded should exist', () => {
      assert.typeOf(encoded, 'object');
    });

    it('encoded contains topic', () => {
      assert.typeOf(encoded.topic, 'string');
    });

    it(`encoded topic should be ${packet.topic}/#`, () => {
      assert.strictEqual(`${packet.topic}/#`, encoded.topic);
    });
  });
});
