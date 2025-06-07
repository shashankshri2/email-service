const { Logger } = require('../../utils/Logger');

const ProviderA = {
  sendEmail: async (email) => {
    Logger.info('ProviderA: Attempting to send email...');

    // Simulate random failure or success
    const success = Math.random() > 0.3; // 70% success rate
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    if (success) {
      Logger.success('ProviderA: Email sent successfully.');
      return { success: true };
    } else {
      Logger.error('ProviderA: Failed to send email.');
      throw new Error('ProviderA: Send failure');
    }
  }
};

module.exports = { ProviderA };
