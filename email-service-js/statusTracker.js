class StatusTracker {
  constructor() {
    this.statuses = new Map(); // emailId => status
  }

  setStatus(emailId, status) {
    this.statuses.set(emailId, status);
  }

  getStatus(emailId) {
    return this.statuses.get(emailId) || 'unknown';
  }
}

module.exports = { StatusTracker };
