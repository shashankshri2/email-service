const express = require('express');
const { EmailService } = require('./services/EmailService');
const { StatusTracker } = require('./statusTracker');
const { Logger } = require('./utils/Logger');
const { EmailQueue } = require('./utils/EmailQueue');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Email service API is running');
});

// Optional: API endpoint to trigger sending emails (demo)
app.get('/send-emails', async (req, res) => {
  const emailService = new EmailService();
  const emailQueue = new EmailQueue(emailService, 2); // concurrency=2
  const statusTracker = new StatusTracker();

  const emails = [
    { id: 'email_001', to: 'user1@example.com', subject: 'Hello 1', body: 'Test email 1' },
    { id: 'email_002', to: 'user2@example.com', subject: 'Hello 2', body: 'Test email 2' },
    { id: 'email_003', to: 'user3@example.com', subject: 'Hello 3', body: 'Test email 3' },
  ];

  for (const email of emails) {
    statusTracker.setStatus(email.id, 'pending');
    emailQueue.enqueue(email)
      .then(result => {
        if (result.success) {
          statusTracker.setStatus(email.id, 'sent');
          Logger.success(`Email ${email.id} sent successfully!`);
        } else {
          statusTracker.setStatus(email.id, 'failed');
          Logger.error(`Email ${email.id} sending failed:`, result.error);
        }
        Logger.info(`Email ${email.id} status: ${statusTracker.getStatus(email.id)}`);
      })
      .catch(error => {
        statusTracker.setStatus(email.id, 'failed');
        Logger.error(`Email ${email.id} error:`, error);
      });
  }

  res.send('Emails are being processed. Check logs for details.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
