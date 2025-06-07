const { EmailService } = require('../services/EmailService');

describe('EmailService', () => {
  let emailService;

  beforeEach(() => {
    emailService = new EmailService();
  });

  test('should send email successfully', async () => {
    const email = { id: 'test1', to: 'test@example.com', subject: 'Hi', body: 'Test' };
    const result = await emailService.sendEmail(email);
    expect(result.success).toBe(true);
    expect(result.providerIndex).toBeDefined();
  });

  test('should not send duplicate email (idempotency)', async () => {
    const email = { id: 'dupEmail', to: 'test2@example.com', subject: 'Hello', body: 'Test' };
    const firstSend = await emailService.sendEmail(email);
    const secondSend = await emailService.sendEmail(email);

    expect(firstSend.success).toBe(true);
    expect(secondSend.success).toBe(true);
    expect(secondSend.message).toMatch(/already sent/i);
  });
});
