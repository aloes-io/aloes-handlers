require('@babel/register');

import {assert} from 'chai';
import {mySensorsDecoder} from '../lib/decoder';
import {mySensorsPatternDetector} from '../lib/detector';

//	const mySensorsPattern = "+prefixedDevEui/+nodeId/+sensorId/+method/+ack/+subType";

describe('mySensorsDecoder - test 1', () => {
	const packet = {topic: 'MySensors123-out/0/2/1/0/4', payload: 'test'};
	const pattern = mySensorsPatternDetector(packet);
	const params = pattern.params;
	const decoded = mySensorsDecoder(packet, params);
	const keys = [
		'devEui',
		'nativeSensorId',
		'nativeNodeId',
		'nativeResource',
		'resource',
		'resources',
		'inputPath',
		'outputPath',
		'inPrefix',
		'outPrefix',
		'value',
		'lastSignal',
		'method',
		'prefix',
	];

	it('pattern should exist', () => {
		assert.typeOf(pattern, 'object');
	});

	it('pattern should contain params and value properties', () => {
		assert.hasAllKeys(pattern, ['params', 'name']);
	});

	it(`pattern name should be mySensors`, () => {
		assert.strictEqual('mySensors', pattern.name);
	});

	it('decoded should exist', () => {
		assert.typeOf(decoded, 'object');
	});

	it('decoded payload should contain all sensor properties', () => {
		assert.hasAllKeys(decoded, keys);
	});

	it(`decoded payload should be ${packet.payload}`, () => {
		assert.strictEqual(packet.payload, decoded.value);
	});

	it(`decoded topic should be ${packet.topic}`, () => {
		assert.strictEqual(packet.topic, decoded.outputPath);
	});
});

describe('mySensorsDecoder - test 2', () => {
	const packet = {topic: 'MySensors123-out/0/2/0/0/4', payload: 'test'};
	const pattern = mySensorsPatternDetector(packet);
	const params = pattern.params;
	const decoded = mySensorsDecoder(packet, params);
	const keys = [
		'name',
		'devEui',
		'protocolName',
		'type',
		'nativeSensorId',
		'nativeNodeId',
		'nativeType',
		'resources',
		'inPrefix',
		'outPrefix',
		'value',
		'colors',
		'frameCounter',
		'icons',
		'lastSignal',
		'method',
		'prefix',
	];

	it('pattern should exist', () => {
		assert.typeOf(pattern, 'object');
	});

	it('pattern should contain params and value properties', () => {
		assert.hasAllKeys(pattern, ['params', 'name']);
	});

	it(`pattern name should be mySensors`, () => {
		assert.strictEqual('mySensors', pattern.name);
	});

	it('decoded should exist', () => {
		assert.typeOf(decoded, 'object');
	});

	it('decoded payload should contain all sensor registering properties', () => {
		assert.hasAllKeys(decoded, keys);
	});

	it(`decoded payload should be ${packet.payload}`, () => {
		assert.strictEqual(packet.payload, decoded.value);
	});

	it(`decoded type should be 3312`, () => {
		assert.strictEqual(3312, decoded.type);
	});
});

describe('mySensorsDecoder - test 3', () => {
	const packet = {topic: 'MySensors123-out/10/5/1/0/23', payload: '1'};
	const pattern = mySensorsPatternDetector(packet);
	const params = pattern.params;
	const decoded = mySensorsDecoder(packet, params);
	const keys = [
		'devEui',
		'nativeSensorId',
		'nativeNodeId',
		'nativeResource',
		'resource',
		'resources',
		'inputPath',
		'outputPath',
		'inPrefix',
		'outPrefix',
		'value',
		'lastSignal',
		'method',
		'prefix',
	];

	it('pattern should exist', () => {
		assert.typeOf(pattern, 'object');
	});

	it('pattern should contain params and value properties', () => {
		assert.hasAllKeys(pattern, ['params', 'name']);
	});

	it(`pattern name should be mySensors`, () => {
		assert.strictEqual('mySensors', pattern.name);
	});

	it('decoded should exist', () => {
		assert.typeOf(decoded, 'object');
	});

	it('decoded payload should contain all sensor properties', () => {
		assert.hasAllKeys(decoded, keys);
	});

	it(`decoded payload should be ${packet.payload}`, () => {
		assert.strictEqual(packet.payload, decoded.value);
	});

	it(`decoded topic should be ${packet.topic}`, () => {
		assert.strictEqual(packet.topic, decoded.outputPath);
	});
});
