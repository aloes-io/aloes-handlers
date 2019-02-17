require('@babel/register');

import {assert} from 'chai';
import {mySensorsPatternDetector} from '../lib/detector';

//  const mySensorsPattern = "+prefixedDevEui/+nodeId/+sensorId/+method/+ack/+subType";

describe('mySensorsPatternDetector - test 1', () => {
  const packet = {topic: 'MySensors123-out/0/2/1/0/4', payload: 'test'};
  const pattern = mySensorsPatternDetector(packet);
  const params = pattern.params;
  const keys = [
    'nodeId',
    'sensorId',
    'prefixedDevEui',
    'method',
    'ack',
    'subType',
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

  it(`params should contain ${keys.toString()}`, () => {
    assert.hasAllKeys(params, keys);
  });
});

describe('mySensorsPatternDetector - test 2', () => {
  const packet = {topic: 'MySensors123-out/0/2/0/0/4', payload: 'test'};
  const pattern = mySensorsPatternDetector(packet);
  const params = pattern.params;
  const keys = [
    'nodeId',
    'sensorId',
    'prefixedDevEui',
    'method',
    'ack',
    'subType',
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

  it(`params should contain ${keys.toString()}`, () => {
    assert.hasAllKeys(params, keys);
  });
});

describe('mySensorsPatternDetector - test 3', () => {
  const packet = {topic: 'MySensors123-out/10/5/1/0/23', payload: '1'};
  const pattern = mySensorsPatternDetector(packet);
  const params = pattern.params;
  const keys = [
    'nodeId',
    'sensorId',
    'prefixedDevEui',
    'method',
    'ack',
    'subType',
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

  it(`params should contain ${keys.toString()}`, () => {
    assert.hasAllKeys(params, keys);
  });
});
