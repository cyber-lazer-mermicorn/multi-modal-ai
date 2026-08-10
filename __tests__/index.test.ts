import { processText } from '../lib/multi-modal';

describe('processText', () => {
  it('should be defined', () => {
    expect(processText).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof processText).toBe('function');
  });
});
