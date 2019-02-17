import {assert} from 'chai';
import {Decoder} from '../lib/decoder';

function getDecoder() {
  const buffer = Buffer.from(
    '016700E9026838036701040468530402014901020126',
    'hex',
  );
  const cyn = new Decoder(buffer);
  cyn.decode();

  return cyn;
}

describe('decoder', () => {
  const cyn = getDecoder();
  const channel1 = getDecoder().getChannel(1);
  const channel3 = getDecoder().getChannel(3);

  it('data should contain 4 channels', () => {
    assert.equal(4, Object.keys(cyn.getChannels()).length);
  });

  it('channel 1 & 3 should exist', () => {
    assert.typeOf(channel1, 'object');
    assert.typeOf(channel3, 'object');
  });

  it('channel 5 should not exist', () => {
    assert.isFalse(getDecoder().getChannel(5));
  });

  it('channel 1 should contain temperature and analog properties', () => {
    assert.hasAllKeys(channel1, ['temperature', 'analog']);
  });

  it('temperature on channel 1 should be 23.3', () => {
    assert.strictEqual(23.3, channel1.temperature);
  });
});
