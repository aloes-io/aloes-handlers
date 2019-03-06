require('@babel/register');

import {assert} from 'chai';
import {cayenneEncoder} from '../lib/encoder';
import {cayennePatternDetector} from '../lib/detector';

//  cayenneLPPPattern: '+appEui/+type/+method/+gatewayId/#device',

describe('cayenneEncoder - test 1', () => {
  const result = '000c00';
  const payload = Buffer.from(
    '400100ff0300010001c8709a5f5f044708d8e6be',
    'hex',
  );
  const packet = {
    topic:
      '5c635046e1fec60e6050e47b/Unconfirmed Data Up/b827ebfffe6cc78d/03ff0001',
    payload,
  };

  const pattern = cayennePatternDetector(payload);
  let options = {
    pattern: pattern.name,
    method: 'POST',
    data: {
      transportProtocol: 'loraWan',
      messageProtocol: 'cayenneLPP',
      type: 3200,
      nativeType: '0',
      resource: 5500,
      resources: {'5500': 1},
      nativeResource: '5500',
      nativeSensorId: '12',
      devAddr: pattern.params.devAddr,
      // inputPath: `${pattern.params.appEui}/${pattern.params.type}/${
      //   pattern.params.method
      // }/${pattern.params.gatewayId}${pattern.params.devAddr}`,
      // outputPath: `${pattern.params.appEui}/${pattern.params.type}/${
      //   pattern.params.method
      // }/${pattern.params.gatewayId}${pattern.params.devAddr}`,
      value: '1',
    },
  };
  const encoded = cayenneEncoder(options.data);

  it('pattern should exist', () => {
    assert.typeOf(pattern, 'object');
  });

  it('pattern should contain params and value properties', () => {
    assert.hasAllKeys(pattern, ['params', 'name']);
  });

  it(`pattern name should be cayenneLPP`, () => {
    assert.strictEqual('cayenneLPP', pattern.name);
  });

  it('encoded payload should be a buffer', () => {
    assert.instanceOf(encoded, Buffer);
  });

  it(`encoded payload should be ${result}`, () => {
    assert.strictEqual(result, encoded.toString('hex'));
  });
});

describe('cayenneEncoder - test 2', () => {
  const result = '001530d4';
  // const packet = {
  //   topic:
  //     '5c635046e1fec60e6050e47b/ENCODED/Unconfirmed Data Down/b827ebfffe6cc78d/0004a30b001fbb91',
  //   payload,
  // };
  const payload = Buffer.from(
    '005b7a00d07ed5b370dc0b20000ba30400f432f59ab267',
    'hex',
  );
  const packet = {
    topic:
      '5c635046e1fec60e6050e47b/Join Request/b827ebfffe6cc78d/0004a30b001fbb91',
    payload,
  };
  const pattern = cayennePatternDetector(payload);
  let options = {
    pattern: pattern.name,
    method: 'PUT',
    data: {
      transportProtocol: 'loraWan',
      messageProtocol: 'cayenneLPP',
      type: 3202,
      nativeType: '2',
      resource: 5600,
      resources: {'5600': 125},
      nativeResource: '5600',
      nativeSensorId: '21',
      devEui: pattern.params.devEui,
      // inputPath: `${pattern.params.appEui}/${pattern.params.type}/${
      //   pattern.params.method
      // }/${pattern.params.gatewayId}${pattern.params.devEui}`,
      // outputPath: `${pattern.params.appEui}/${pattern.params.type}/${
      //   pattern.params.method
      // }/${pattern.params.gatewayId}${pattern.params.devEui}`,
      value: '125',
    },
  };
  const encoded = cayenneEncoder(options.data);

  it('pattern should exist', () => {
    assert.typeOf(pattern, 'object');
  });

  it('pattern should contain params and value properties', () => {
    assert.hasAllKeys(pattern, ['params', 'name']);
  });

  it(`pattern name should be cayenneLPP`, () => {
    assert.strictEqual('cayenneLPP', pattern.name);
  });

  it('encoded payload should be a buffer', () => {
    assert.instanceOf(encoded, Buffer);
  });

  it(`encoded payload should be ${result}`, () => {
    assert.strictEqual(result, encoded.toString('hex'));
  });
});
