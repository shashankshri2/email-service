class EmailQueue {
  constructor(emailService, concurrency = 1) {
    this.emailService = emailService; // instance of EmailService
    this.queue = [];
    this.processing = 0;
    this.concurrency = concurrency;
  }

  enqueue(email) {
    return new Promise((resolve, reject) => {
      this.queue.push({ email, resolve, reject });
      this.processNext();
    });
  }

  async processNext() {
    if (this.processing >= this.concurrency) return; // respect concurrency limit
    if (this.queue.length === 0) return;

    const { email, resolve, reject } = this.queue.shift();
    this.processing++;

    try {
      const result = await this.emailService.sendEmail(email);
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.processing--;
      this.processNext(); // process next item in queue
    }
  }
}

module.exports = { EmailQueue };
