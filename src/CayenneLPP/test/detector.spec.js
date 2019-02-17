require('@babel/register');

import {assert} from 'chai';
import {cayennePatternDetector} from '../lib/detector';

//  const cayennePattern =  "+appEui/+type/+method/+gatewayId/#device";

describe('cayennePatternDetector - test 1', () => {
  const payload = Buffer.from(
    '01000002027ed0',
    'hex',
  );
  const packet = {
    topic:
      '5c635046e1fec60e6050e47b/DECODED/Unconfirmed Data Up/b827ebfffe6cc78d/03ff0001',
    payload,
  };
  const pattern = cayennePatternDetector(packet);
  const params = pattern.params;
  const keys = ['appEui', 'type', 'gatewayId', 'method', 'devAddr'];

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
    '01000002027ed0',
    'hex',
  );
  const packet = {
    topic:
      '5c635046e1fec60e6050e47b/DECODED/Confirmed Data Up/b827ebfffe6cc78d/0004a30b001fbb91',
    payload,
  };
  const pattern = cayennePatternDetector(packet);
  const params = pattern.params;
  const keys = ['appEui', 'type', 'gatewayId', 'method', 'devEui'];

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
    '01000002027ed0',
    'hex',
  );
  const packet = {
    topic:
      '5c635046e1fec60e6050e47b/DECODED/Join Request/b827ebfffe6cc78d/0004a30b001fbb91',
    payload,
  };
  const pattern = cayennePatternDetector(packet);
  const params = pattern.params;
  const keys = ['appEui', 'type', 'gatewayId', 'method', 'devEui'];

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
