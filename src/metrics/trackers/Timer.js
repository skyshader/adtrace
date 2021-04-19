/**
 * Timer
 * keeps track of elapsed time in milliseconds
 * and updates the caller of the timer every second.
 *
 * Uses Performance Interface to track time
 * upto microseconds precision.
 */

export default class Timer {
  constructor() {
    this.running = false;
    this.lastStarted = 0;
    this.elapsedTime = 0;
    this.interval = null;
  }

  update() {
    const currentTime = performance.now();
    if (this.lastStarted) {
      const diff = currentTime - this.lastStarted;
      this.elapsedTime = this.elapsedTime + diff;
    }

    if (this.running) {
      this.lastStarted = currentTime;
    } else {
      this.lastStarted = 0;
    }
  }

  start() {
    this.running = true;
    this.update();
  }

  stop() {
    this.running = false;
    this.update();
  }

  reset() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.running = false;
    this.lastStarted = 0;
    this.elapsedTime = 0;
    this.interval = null;
  }

  track(cb) {
    this.interval = setInterval(() => {
      const previousElapsedTime = this.elapsedTime;
      this.update();
      if (previousElapsedTime !== this.elapsedTime) {
        cb(this.elapsedTime);
      }
    }, 1000);
  }
}
