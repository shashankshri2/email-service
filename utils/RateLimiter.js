class RateLimiter {
  constructor(limit, interval) {
    this.limit = limit;
    this.interval = interval;
    this.timestamps = [];
  }

  isAllowed() {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(ts => now - ts < this.interval);

    if (this.timestamps.length < this.limit) {
      this.timestamps.push(now);
      return true;
    }

    return false;
  }
}

module.exports = { RateLimiter };
