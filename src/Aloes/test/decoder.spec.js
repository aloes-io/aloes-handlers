require('@babel/register');

import {assert} from 'chai';
import {aloesClientDecoder} from '../lib/decoder';
import {aloesClientPatternDetector} from '../lib/detector';

// collectionPattern: '+userId/+collectionName/+method',
// instancePattern: '+userId/+collectionName/+method/+modelId',

describe('aloesClientDecoder - test 1', () => {
	const packet = {
		topic: '1/Sensor/POST',
		payload: Buffer.from(
			JSON.stringify({
				protocolName: 'aloesLight',
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
	const params = pattern.params;
	const decoded = aloesClientDecoder(packet, params);

	it('pattern should exist', () => {
		assert.typeOf(pattern, 'object');
	});

	it('pattern should contain params and value properties', () => {
		assert.hasAllKeys(pattern, ['params', 'name', 'subType']);
	});

	it(`pattern name should be aloesClient`, () => {
		assert.strictEqual('aloesClient', pattern.name);
	});

	it('decoded should exist', () => {
		assert.typeOf(decoded, 'object');
	});

	it('decoded payload should contain topic and payload properties', () => {
		assert.hasAllKeys(decoded, ['topic', 'payload']);
	});

	it(`decoded payload should be 5`, () => {
		assert.strictEqual(5, decoded.payload);
	});

	it(`decoded topic should be 3322321-in/1/3300/4/5700`, () => {
		assert.strictEqual('3322321-in/1/3300/4/5700', decoded.topic);
	});
});

describe('aloesClientDecoder - test 2', () => {
	const packet = {
		topic: '1/Sensor/PUT/1',
		payload: Buffer.from(
			JSON.stringify({
				id: 1,
				protocolName: 'aloesLight',
				devEui: '3322321',
				type: 3306,
				nativeSensorId: 4,
				resource: 5850,
				resources: {'5850': 1},
				inputPath: `3322321-in/1/3306/4/5850`,
				outputPath: `3322321-out/1/3306/4/5850`,
				inPrefix: '-in',
				outPrefix: '-out',
				value: 10,
			}),
		),
	};

	const pattern = aloesClientPatternDetector(packet);
	const params = pattern.params;
	const decoded = aloesClientDecoder(packet, params);

	it('pattern should exist', () => {
		assert.typeOf(pattern, 'object');
	});

	it('pattern should contain params and value properties', () => {
		assert.hasAllKeys(pattern, ['params', 'name', 'subType']);
	});

	it(`pattern name should be aloesClient`, () => {
		assert.strictEqual('aloesClient', pattern.name);
	});

	it('decoded should exist', () => {
		assert.typeOf(decoded, 'object');
	});

	it('decoded payload should contain topic and payload properties', () => {
		assert.hasAllKeys(decoded, ['topic', 'payload']);
	});

	it(`decoded payload should be 10`, () => {
		assert.strictEqual(10, decoded.payload);
	});

	it(`decoded topic should be 3322321-in/1/3306/4/5850`, () => {
		assert.strictEqual('3322321-in/1/3306/4/5850', decoded.topic);
	});
});

describe('aloesClientDecoder - test 3', () => {
	const packet = {
		topic: '1/Sensor/PUT/1',
		payload: Buffer.from(
			JSON.stringify({
				id: 1,
				protocolName: 'mySensors',
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
	const params = pattern.params;
	const decoded = aloesClientDecoder(packet, params);

	it('pattern should exist', () => {
		assert.typeOf(pattern, 'object');
	});

	it('pattern should contain params and value properties', () => {
		assert.hasAllKeys(pattern, ['params', 'name', 'subType']);
	});

	it(`pattern name should be aloesClient`, () => {
		assert.strictEqual('aloesClient', pattern.name);
	});

	it('decoded should exist', () => {
		assert.typeOf(decoded, 'object');
	});

	it('decoded payload should contain topic and payload properties', () => {
		assert.hasAllKeys(decoded, ['topic', 'payload']);
	});

	it(`decoded payload should be 5`, () => {
		assert.strictEqual(5, decoded.payload);
	});

	it(`decoded topic should be 3322321-in/3/4/1/0/48`, () => {
		assert.strictEqual('3322321-in/3/4/1/0/48', decoded.topic);
	});
});

describe('aloesClientDecoder - test 4', () => {
	const packet = {
		topic: '1/IoTAgent/PUT',
		payload: Buffer.from(
			JSON.stringify({
				protocolName: 'mySensors',
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
				value: 15,
			}),
		),
	};
	const pattern = aloesClientPatternDetector(packet);
	const params = pattern.params;
	const decoded = aloesClientDecoder(packet, params);

	it('pattern should exist', () => {
		assert.typeOf(pattern, 'object');
	});

	it('pattern should contain params and value properties', () => {
		assert.hasAllKeys(pattern, ['params', 'name', 'subType']);
	});

	it(`pattern name should be aloesClient`, () => {
		assert.strictEqual('aloesClient', pattern.name);
	});

	it('decoded should exist', () => {
		assert.typeOf(decoded, 'object');
	});

	it('decoded payload should contain topic and payload properties', () => {
		assert.hasAllKeys(decoded, ['topic', 'payload']);
	});

	it(`decoded payload should be 15`, () => {
		assert.strictEqual(15, decoded.payload);
	});

	it(`decoded topic should be 3322321-in/4/4/1/0/2`, () => {
		assert.strictEqual('3322321-in/4/4/1/0/2', decoded.topic);
	});
});
