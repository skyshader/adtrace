import Timer from '../Timer';

jest.useFakeTimers();

describe('testing Timer', () => {
  test('Timer is initialized with defaults', () => {
    const timer = new Timer();
    expect(timer.running).toBe(false);
    expect(timer.lastStarted).toBe(0);
    expect(timer.elapsedTime).toBe(0);
  });

  test('Timer starts properly', () => {
    const timer = new Timer();
    expect(timer.running).toBe(false);

    timer.start();
    expect(timer.running).toBe(true);
    expect(timer.lastStarted).toBeGreaterThan(0);
    expect(timer.elapsedTime).toBe(0);
    timer.reset();
  });

  test('Timer stops properly', () => {
    const timer = new Timer();
    timer.start();
    expect(timer.running).toBe(true);
    expect(timer.lastStarted).toBeGreaterThan(0);
    expect(timer.elapsedTime).toBe(0);
    timer.stop();
    expect(timer.running).toBe(false);
    expect(timer.lastStarted).toBe(0);
    expect(timer.elapsedTime).toBeGreaterThan(0);
    timer.reset();
  });

  test('Timer tracks elapsed time when running', () => {
    const timer = new Timer();
    const callback = jest.fn();

    timer.start();
    expect(timer.running).toBe(true);
    expect(timer.lastStarted).toBeGreaterThan(0);
    expect(timer.elapsedTime).toBe(0);

    timer.track(callback);

    jest.advanceTimersByTime(2000);
    const seconds = Math.round(timer.elapsedTime / 1000);
    expect(seconds).toBeLessThanOrEqual(2);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  test('Timer does not track elapsed time when stopped', () => {
    const timer = new Timer();
    const callback = jest.fn();

    timer.start();
    expect(timer.running).toBe(true);
    expect(timer.lastStarted).toBeGreaterThan(0);
    expect(timer.elapsedTime).toBe(0);

    timer.track(callback);

    jest.advanceTimersByTime(1000);
    timer.stop();

    jest.advanceTimersByTime(1000);
    const seconds = Math.round(timer.elapsedTime / 1000);
    expect(seconds).toBeLessThanOrEqual(1);
    expect(callback).toHaveBeenCalledTimes(1);

    timer.reset();
    jest.clearAllTimers();
  });

  test('Timer resets properly', () => {
    const timer = new Timer();

    timer.start();
    expect(timer.running).toBe(true);
    expect(timer.lastStarted).toBeGreaterThan(0);
    expect(timer.elapsedTime).toBe(0);

    timer.reset();
    expect(timer.running).toBe(false);
    expect(timer.lastStarted).toBe(0);
    expect(timer.elapsedTime).toBe(0);
  });
});
