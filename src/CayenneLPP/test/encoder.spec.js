require('@babel/register');

import {assert} from 'chai';
import {cayenneEncoder} from '../lib/encoder';
import {cayennePatternDetector} from '../lib/detector';

//  cayenneLPPPattern: '+appEui/+type/+method/+gatewayId/#device',

describe('cayenneEncoder - test 1', () => {
  const payload = Buffer.from('000c00', 'hex');
  const packet = {
    topic:
      '5c635046e1fec60e6050e47b/ENCODED/Unconfirmed Data Down/b827ebfffe6cc78d/03ff0001',
    payload,
  };
  const pattern = cayennePatternDetector(packet);
  let options = {
    pattern: pattern.name,
    method: 'POST',
    data: {
      protocolName: 'cayenneLPP',
      type: 3200,
      nativeType: '0',
      resource: 5500,
      resources: {'5500': 1},
      nativeResource: '5500',
      nativeSensorId: '12',
      appEui: pattern.params.appEui,
      gatewayId: pattern.params.gatewayId,
      devAddr: pattern.params.devAddr,
      inputPath: `${pattern.params.appEui}/${pattern.params.type}/${
        pattern.params.method
      }/${pattern.params.gatewayId}${pattern.params.devAddr}`,
      outputPath: `${pattern.params.appEui}/${pattern.params.type}/${
        pattern.params.method
      }/${pattern.params.gatewayId}${pattern.params.devAddr}`,
      value: '1',
    },
  };
  const encoded = cayenneEncoder(options.data, options);

  it('pattern should exist', () => {
    assert.typeOf(pattern, 'object');
  });

  it('pattern should contain params and value properties', () => {
    assert.hasAllKeys(pattern, ['params', 'name']);
  });

  it(`pattern name should be cayenneLPP`, () => {
    assert.strictEqual('cayenneLPP', pattern.name);
  });

  it('encoded should exist', () => {
    assert.typeOf(encoded, 'object');
  });

  it('encoded payload should contain topic and payload properties', () => {
    assert.hasAllKeys(encoded, ['topic', 'payload']);
  });

  it('encoded payload should be a buffer', () => {
    assert.instanceOf(encoded.payload, Buffer);
  });

  it(`encoded payload should be ${payload.toString('hex')}`, () => {
    assert.strictEqual(
      payload.toString('hex'),
      encoded.payload.toString('hex'),
    );
  });

  it(`encoded topic should be ${packet.topic}`, () => {
    assert.strictEqual(packet.topic, encoded.topic);
  });
});

describe('cayenneEncoder - test 2', () => {
  const payload = Buffer.from('001530d4', 'hex');
  const packet = {
    topic:
      '5c635046e1fec60e6050e47b/ENCODED/Unconfirmed Data Down/b827ebfffe6cc78d/0004a30b001fbb91',
    payload,
  };
  const pattern = cayennePatternDetector(packet);
  let options = {
    pattern: pattern.name,
    method: 'PUT',
    data: {
      protocolName: 'cayenneLPP',
      type: 3202,
      nativeType: '2',
      resource: 5600,
      resources: {'5600': 125},
      nativeResource: '5600',
      nativeSensorId: '21',
      appEui: pattern.params.appEui,
      gatewayId: pattern.params.gatewayId,
      devEui: pattern.params.devEui,
      inputPath: `${pattern.params.appEui}/${pattern.params.type}/${
        pattern.params.method
      }/${pattern.params.gatewayId}${pattern.params.devEui}`,
      outputPath: `${pattern.params.appEui}/${pattern.params.type}/${
        pattern.params.method
      }/${pattern.params.gatewayId}${pattern.params.devEui}`,
      value: '125',
    },
  };
  const encoded = cayenneEncoder(options.data, options);

  it('pattern should exist', () => {
    assert.typeOf(pattern, 'object');
  });

  it('pattern should contain params and value properties', () => {
    assert.hasAllKeys(pattern, ['params', 'name']);
  });

  it(`pattern name should be cayenneLPP`, () => {
    assert.strictEqual('cayenneLPP', pattern.name);
  });

  it('encoded should exist', () => {
    assert.typeOf(encoded, 'object');
  });

  it('encoded payload should contain topic and payload properties', () => {
    assert.hasAllKeys(encoded, ['topic', 'payload']);
  });

  it('encoded payload should be a buffer', () => {
    assert.instanceOf(encoded.payload, Buffer);
  });


  it(`encoded payload should be ${payload.toString('hex')}`, () => {
    assert.strictEqual(
      payload.toString('hex'),
      encoded.payload.toString('hex'),
    );
  });

  it(`encoded topic should be ${packet.topic}`, () => {
    assert.strictEqual(packet.topic, encoded.topic);
  });
});
