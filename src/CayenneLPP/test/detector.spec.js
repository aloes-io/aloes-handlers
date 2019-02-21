require('@babel/register');

import {assert} from 'chai';
import {cayennePatternDetector} from '../lib/detector';

//  const cayennePattern =  "+appEui/+type/+method/+gatewayId/#device";

describe('cayennePatternDetector - test 1', () => {
  const payload = Buffer.from('005b7a00d07ed5b370dc0b20000ba30400f432f59ab267', 'hex');
  const packet = {
    topic:
      '5c635046e1fec60e6050e47b/Join Request/b827ebfffe6cc78d/0004a30b001fbb91',
    payload,
  };
  const pattern = cayennePatternDetector(payload);
  const params = pattern.params;
  const keys = ['appEui', 'devNonce', 'method', 'devEui', 'packet'];

  it('pattern should exist', () => {
    assert.typeOf(pattern, 'object');
  });

  it('pattern should contain params and value properties', () => {
    assert.hasAllKeys(pattern, ['params', 'name']);
  });

  it(`pattern name should be cayenneLPP`, () => {
    assert.strictEqual('cayenneLPP', pattern.name);
  });

  it(`params should contain ${keys.toString()}`, () => {
    assert.hasAllKeys(params, keys);
  });
});

describe('cayennePatternDetector - test 2', () => {
  const payload = Buffer.from(
    '800100ff0300000001461c02b695ac147a4a9d540334168034a58ac5',
    'hex',
  );
  const packet = {
    topic:
      '5c635046e1fec60e6050e47b/Unconfirmed Data Up/b827ebfffe6cc78d/03ff0001',
    payload,
  };
  const pattern = cayennePatternDetector(payload);
  const params = pattern.params;
  const keys = ['frameCounter', 'method', 'devAddr', 'packet'];

  it('pattern should exist', () => {
    assert.typeOf(pattern, 'object');
  });

  it('pattern should contain params and value properties', () => {
    assert.hasAllKeys(pattern, ['params', 'name']);
  });

  it(`pattern name should be cayenneLPP`, () => {
    assert.strictEqual('cayenneLPP', pattern.name);
  });

  it(`params should contain ${keys.toString()}`, () => {
    assert.hasAllKeys(params, keys);
  });
});

describe('cayennePatternDetector - test 3', () => {
  const payload = Buffer.from(
    '005b7a00d07ed5b370dc0b20000ba30400eb5be53e82a5',
    'hex',
  );
  const packet = {
    topic:
      '5c635046e1fec60e6050e47b/Join Request/b827ebfffe6cc78d/0004a30b001fbb91',
    payload,
  };
  const pattern = cayennePatternDetector(payload);
  const params = pattern.params;
  const keys = ['appEui', 'devNonce', 'method', 'devEui', 'packet'];

  it('pattern should exist', () => {
    assert.typeOf(pattern, 'object');
  });

  it('pattern should contain params and value properties', () => {
    assert.hasAllKeys(pattern, ['params', 'name']);
  });

  it(`pattern name should be cayenneLPP`, () => {
    assert.strictEqual('cayenneLPP', pattern.name);
  });

  it(`params should contain ${keys.toString()}`, () => {
    assert.hasAllKeys(params, keys);
  });
});
