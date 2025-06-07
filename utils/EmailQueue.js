// utils/EmailQueue.js

class EmailQueue {
  constructor(emailService, concurrency = 1) {
    this.emailService = emailService;
    this.queue = [];
    this.concurrentCount = 0;
    this.concurrency = concurrency;
  }

  enqueue(email) {
    return new Promise((resolve, reject) => {
      this.queue.push({ email, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.concurrentCount >= this.concurrency || this.queue.length === 0) return;

    const { email, resolve, reject } = this.queue.shift();
    this.concurrentCount++;

    try {
      const result = await this.emailService.sendEmail(email);
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.concurrentCount--;
      this.processQueue();
    }
  }
}

module.exports = { EmailQueue };
