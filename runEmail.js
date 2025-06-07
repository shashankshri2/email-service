const { EmailService } = require('./services/EmailService');

async function main() {
  const emailService = new EmailService();

  const email = {
    id: 'unique-email-id-123',
    to: 'recipient@example.com',
    subject: 'Test Email',
    body: 'This is a test email.',
  };

  try {
    const result = await emailService.sendEmail(email);
    if (result.success) {
      console.log('Email sent successfully!');
    } else {
      console.error('Failed to send email:', result.error);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

main();
