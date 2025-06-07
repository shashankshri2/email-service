const { ProviderA } = require('./providers/ProviderA');
const { ProviderB } = require('./providers/ProviderB');
const { Logger } = require('../utils/Logger');
const { RateLimiter } = require('../utils/RateLimiter');
const { CircuitBreaker } = require('../utils/CircuitBreaker');

class EmailService {
  constructor() {
    this.providers = [ProviderA, ProviderB];
    this.currentProviderIndex = 0;

    this.rateLimiter = new RateLimiter(5, 10000); // 5 emails per 10 seconds
    this.circuitBreakers = [
      new CircuitBreaker(3, 5000), // For ProviderA
      new CircuitBreaker(3, 5000), // For ProviderB
    ];

    this.sentEmailIds = new Set(); // To ensure idempotency
  }

  async sendEmail(email) {
    if (!email.id) {
      throw new Error('Email must have a unique id for idempotency');
    }

    // Rate limiting check
    if (!this.rateLimiter.isAllowed()) {
      Logger.warn('Rate limit exceeded. Try again later.');
      return { success: false, error: 'Rate limit exceeded' };
    }

    // Idempotency check
    if (this.sentEmailIds.has(email.id)) {
      Logger.info(`Email with id ${email.id} has already been sent.`);
      return {
        success: true,
        message: 'Email already sent (idempotent)',
        status: 'sent',
      };
    }

    // Try sending email with retry and fallback
    for (let attempt = 1; attempt <= 3; attempt++) {
      let providerIndex = this.currentProviderIndex;

      // Check if provider circuit is closed (can send)
      if (!this.circuitBreakers[providerIndex].canRequest()) {
        Logger.warn(`Provider ${providerIndex} circuit is open. Switching provider.`);
        providerIndex = (providerIndex + 1) % this.providers.length;
        this.currentProviderIndex = providerIndex;
      }

      const provider = this.providers[providerIndex];
      const circuitBreaker = this.circuitBreakers[providerIndex];

      try {
        Logger.info(`Attempt ${attempt}: Sending email via Provider ${providerIndex}`);
        await provider.sendEmail(email);

        circuitBreaker.recordSuccess();
        this.sentEmailIds.add(email.id);
        Logger.success(`Email sent successfully with Provider ${providerIndex}`);

        return {
          success: true,
          providerIndex,
          status: 'sent'
        };
      } catch (error) {
        Logger.error(`Attempt ${attempt} failed: ${error.message}`);
        circuitBreaker.recordFailure();

        // Exponential backoff delay
        const delay = 500 * Math.pow(2, attempt);
        Logger.info(`Waiting ${delay}ms before retrying...`);
        await new Promise(resolve => setTimeout(resolve, delay));

        // Fallback to other provider on next attempt
        this.currentProviderIndex = (this.currentProviderIndex + 1) % this.providers.length;
      }
    }

    Logger.error('All attempts to send email failed.');
    return {
      success: false,
      error: 'Failed to send email after retries',
      status: 'failed'
    };
  }
}

module.exports = { EmailService };
