require('@babel/register');

import {assert} from 'chai';
import {mySensorsEncoder} from '../lib/encoder';
import {mySensorsPatternDetector} from '../lib/detector';

//	const mySensorsPattern = "+prefixedDevEui/+nodeId/+sensorId/+method/+ack/+subType";

describe('mySensorsEncoder - test 1', () => {
	let packet = {topic: 'MySensors123-in/0/2/1/0/4', payload: 'test'};
	let pattern = mySensorsPatternDetector(packet);
	let options = {
		pattern: pattern.name,
		method: 'POST',
		data: {
			type: 3300,
			protocolName: 'mySensors',
			nativeResource: 4,
			nativeNodeId: pattern.params.nodeId,
			nativeSensorId: pattern.params.sensorId,
			devEui: pattern.params.prefixedDevEui.split('-')[0],
			inputPath: `${pattern.params.prefixedDevEui.split('-')[0]}-in/${
				pattern.params.nodeId
			}/${pattern.params.sensorId}/${pattern.params.method}/1/${
				pattern.params.subType
			}`,
			outputPath: `${pattern.params.prefixedDevEui.split('-')[0]}-out/${
				pattern.params.nodeId
			}/${pattern.params.sensorId}/${pattern.params.method}/1/${
				pattern.params.subType
			}`,
			inPrefix: '-in',
			outPrefix: '-out',
			value: packet.payload,
		},
	};
	const encoded = mySensorsEncoder(options.data, options);

	it('pattern should exist', () => {
		assert.typeOf(pattern, 'object');
	});

	it('pattern should contain params and value properties', () => {
		assert.hasAllKeys(pattern, ['params', 'name']);
	});

	it(`pattern name should be mySensors`, () => {
		assert.strictEqual('mySensors', pattern.name);
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

describe('mySensorsEncoder - test 2', () => {
	const packet = {topic: 'MySensors123-in/0/2/1/0/4', payload: 'test'};
	const pattern = mySensorsPatternDetector(packet);
	const options = {
		pattern: pattern.name,
		method: 'PUT',
		data: {
			type: 3300,
			protocolName: 'mySensors',
			nativeResource: 4,
			nativeNodeId: pattern.params.nodeId,
			nativeSensorId: pattern.params.sensorId,
			devEui: pattern.params.prefixedDevEui.split('-')[0],
			inputPath: `${pattern.params.prefixedDevEui.split('-')[0]}-in/${
				pattern.params.nodeId
			}/${pattern.params.sensorId}/${pattern.params.method}/1/${
				pattern.params.subType
			}`,
			outputPath: `${pattern.params.prefixedDevEui.split('-')[0]}-out/${
				pattern.params.nodeId
			}/${pattern.params.sensorId}/${pattern.params.method}/1/${
				pattern.params.subType
			}`,
			inPrefix: '-in',
			outPrefix: '-out',
			value: packet.payload,
		},
	};
	const encoded = mySensorsEncoder(options.data, options);

	it('pattern should exist', () => {
		assert.typeOf(pattern, 'object');
	});

	it('pattern should contain params and value properties', () => {
		assert.hasAllKeys(pattern, ['params', 'name']);
	});

	it(`pattern name should be mySensors`, () => {
		assert.strictEqual('mySensors', pattern.name);
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

describe('mySensorsEncoder - test 3', () => {
	const packet = {topic: 'MySensors123-in/10/5/1/0/23', payload: '1'};
	const pattern = mySensorsPatternDetector(packet);
	const options = {
		pattern: pattern.name,
		method: 'PUT',
		data: {
			type: 3300,
			protocolName: 'mySensors',
			nativeResource: 23,
			nativeNodeId: pattern.params.nodeId,
			nativeSensorId: pattern.params.sensorId,
			devEui: pattern.params.prefixedDevEui.split('-')[0],
			inputPath: `${pattern.params.prefixedDevEui.split('-')[0]}-in/${
				pattern.params.nodeId
			}/${pattern.params.sensorId}/${pattern.params.method}/1/${
				pattern.params.subType
			}`,
			outputPath: `${pattern.params.prefixedDevEui.split('-')[0]}-out/${
				pattern.params.nodeId
			}/${pattern.params.sensorId}/${pattern.params.method}/1/${
				pattern.params.subType
			}`,
			inPrefix: '-in',
			outPrefix: '-out',
			value: packet.payload,
		},
	};
	const encoded = mySensorsEncoder(options.data, options);

	it('pattern should exist', () => {
		assert.typeOf(pattern, 'object');
	});

	it('pattern should contain params and value properties', () => {
		assert.hasAllKeys(pattern, ['params', 'name']);
	});

	it(`pattern name should be mySensors`, () => {
		assert.strictEqual('mySensors', pattern.name);
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
