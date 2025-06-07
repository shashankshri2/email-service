const { Logger } = require('../../utils/Logger');

const ProviderB = {
  sendEmail: async (email) => {
    Logger.info('ProviderB: Attempting to send email...');

    // Simulate random failure or success
    const success = Math.random() > 0.5; // 50% success rate
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate network delay

    if (success) {
      Logger.success('ProviderB: Email sent successfully.');
      return { success: true };
    } else {
      Logger.error('ProviderB: Failed to send email.');
      throw new Error('ProviderB: Send failure');
    }
  }
};

module.exports = { ProviderB };
