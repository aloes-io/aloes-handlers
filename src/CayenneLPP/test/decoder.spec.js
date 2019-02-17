import {assert} from 'chai';
import {cayenneDecoder} from '../lib/decoder';
import {cayennePatternDetector} from '../lib/detector';

//  cayenneLPPPattern: '+appEui/+type/+method/+gatewayId/#device',

describe('cayenneDecoder - test 1', () => {
  const payload = Buffer.from(
    '016700E9026838036701040468530402014901020126',
    'hex',
  );
  const packet = {
    topic:
      '5c635046e1fec60e6050e47b/DECODED/Unconfirmed Data Up/b827ebfffe6cc78d/0004a30b001fbb91',
    payload,
  };
  const pattern = cayennePatternDetector(packet);
  const params = pattern.params;
  const decoded = cayenneDecoder(packet, params);
  const keys = [
    'appEui',
    'type',
    'method',
    'gatewayId',
    'devEui',
    'nativeSensorId',
    'nativeType',
    'nativeResource',
    'resource',
    'resources',
    // 'inputPath',
    // 'outputPath',
    'inPrefix',
    'outPrefix',
    'value',
    'lastSignal',
    'payload',
  ];

  it('pattern should exist', () => {
    assert.typeOf(pattern, 'object');
  });

  it(`pattern name should be cayenneLPP`, () => {
    assert.strictEqual('cayenneLPP', pattern.name);
  });

  it('decoded should contain 3 channels', () => {
    assert.equal(3, decoded.length);
  });

  it('channel 1 & 3 should exist', () => {
    assert.typeOf(decoded[0], 'object');
    assert.typeOf(decoded[2], 'object');
  });

  it('channel 4 should not exist', () => {
    assert.isUndefined(decoded[3]);
  });

  it('channel 2 should contain all sensor instance properties', () => {
    assert.hasAllKeys(decoded[1], keys);
  });

  it('value on channel 3 should be 28', () => {
    assert.strictEqual(28, decoded[2].value);
  });
});

describe('cayenneDecoder - test 2', () => {
  const payload = Buffer.from('01000002027ed0', 'hex');
  const packet = {
    topic:
      '5c635046e1fec60e6050e47b/DECODED/Unconfirmed Data Up/b827ebfffe6cc78d/03ff0001',
    payload,
  };
  const pattern = cayennePatternDetector(packet);
  const params = pattern.params;
  const decoded = cayenneDecoder(packet, params);
  const keys = [
    'appEui',
    'type',
    'method',
    'gatewayId',
    'devAddr',
    'nativeSensorId',
    'nativeType',
    'nativeResource',
    'resource',
    'resources',
    // 'inputPath',
    // 'outputPath',
    'inPrefix',
    'outPrefix',
    'value',
    'lastSignal',
    'payload',
  ];

  it('pattern should exist', () => {
    assert.typeOf(pattern, 'object');
  });

  it('pattern should contain params and value properties', () => {
    assert.hasAllKeys(pattern, ['params', 'name']);
  });

  it(`pattern name should be cayenneLPP`, () => {
    assert.strictEqual('cayenneLPP', pattern.name);
  });

  it('decoded should contain 2 channels', () => {
    assert.equal(2, decoded.length);
  });

  it('channel 1 & 2 should exist', () => {
    assert.typeOf(decoded[0], 'object');
    assert.typeOf(decoded[1], 'object');
  });

  it('channel 1 should contain all sensor instance properties', () => {
    assert.hasAllKeys(decoded[0], keys);
  });

  it('value on channel 1 should be 0', () => {
    assert.strictEqual(0, decoded[0].value);
  });
});

describe('cayenneDecoder - test 3', () => {
  const payload = Buffer.from('01000002027ed0', 'hex');
  const packet = {
    topic:
      '5c635046e1fec60e6050e47b/DECODED/Presentation/b827ebfffe6cc78d/03ff0001',
    payload,
  };
  const pattern = cayennePatternDetector(packet);
  const params = pattern.params;
  const decoded = cayenneDecoder(packet, params);
  const keys = [
    'appEui',
    'type',
    'method',
    'gatewayId',
    'devAddr',
    'nativeSensorId',
    'nativeType',
    'nativeResource',
    'resource',
    'resources',
    // 'inputPath',
    // 'outputPath',
    'inPrefix',
    'outPrefix',
    'value',
    'lastSignal',
    'payload',
    'colors',
    'frameCounter',
    'icons',
    'name',
    'protocolName',
  ];

  it('pattern should exist', () => {
    assert.typeOf(pattern, 'object');
  });

  it('pattern should contain params and value properties', () => {
    assert.hasAllKeys(pattern, ['params', 'name']);
  });

  it(`pattern name should be cayenneLPP`, () => {
    assert.strictEqual('cayenneLPP', pattern.name);
  });

  it('decoded should contain 2 channels', () => {
    assert.equal(2, decoded.length);
  });

  it('channel 1 & 2 should exist', () => {
    assert.typeOf(decoded[0], 'object');
    assert.typeOf(decoded[1], 'object');
  });

  it('channel 1 should contain all sensor instance properties', () => {
    assert.hasAllKeys(decoded[0], keys);
  });

  it('value on channel 1 should be 0', () => {
    assert.strictEqual(0, decoded[0].value);
  });
});
