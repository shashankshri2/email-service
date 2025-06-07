class CircuitBreaker {
  constructor(failureThreshold = 3, cooldownTime = 5000) {
    this.failureThreshold = failureThreshold;
    this.cooldownTime = cooldownTime;
    this.failureCount = 0;
    this.state = 'CLOSED'; // CLOSED, OPEN
    this.lastFailureTime = null;
  }

  canRequest() {
    if (this.state === 'OPEN') {
      const now = Date.now();
      if (now - this.lastFailureTime > this.cooldownTime) {
        this.state = 'CLOSED';
        this.failureCount = 0;
        return true;
      }
      return false;
    }
    return true;
  }

  recordSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  recordFailure() {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.lastFailureTime = Date.now();
    }
  }
}

module.exports = { CircuitBreaker };
