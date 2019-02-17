import assert from 'assert';
import {Encoder} from '../lib/encoder';

describe('encoder', () => {
  it('should return a valid temperature payload', () => {
    const cyn = new Encoder();
    cyn.addTemperature(99, 33.0);
    const pl = cyn.getPayload().toString('base64');
    assert.equal('Y2cBSg==', pl);
  });

  it('should return a valid payload with multiple channels', () => {
    const cyn = new Encoder();
    cyn.addAnalogInput(13, -13.131313);
    cyn.addTemperature(99, 33.2);
    cyn.addDigitalInput(10, 1);
    const pl = cyn.getPayload().toString('base64');
    assert.equal('DQL63mNnAUwKAAE=', pl);
  });
});
