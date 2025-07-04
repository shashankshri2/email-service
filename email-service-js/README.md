# 📧 Email Service - Resilient Email Sending

![Tests](https://img.shields.io/badge/tests-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-100%25-blue)


## 📝 Overview

This project implements a resilient email sending service in **JavaScript** with the following features:

- Retry with exponential backoff  
- Fallback between providers  
- Idempotency  
- Rate limiting  
- Circuit breaker  
- Logging  
- Basic queue system  
- Status tracking  

---

## 🚀 Features

- 🔁 Retry mechanism with exponential backoff  
- 🔄 Fallback between two mock email providers  
- ✅ Idempotency to avoid duplicate sends  
- 📉 Basic rate limiting to throttle email frequency  
- 📊 Status tracking of send attempts  
- 🧯 Circuit breaker to prevent cascading failures  
- 🧾 Console logging for traceability  
- 🧵 Queue system with adjustable concurrency  

---

## 📁 Project Structure

EMAIL-SERVICE/

├── node_modules/
├── services/
│ ├── providers/
│ │ ├── ProviderA.js
│ │ ├── ProviderB.js
│ └── EmailService.js
├── tests/
│ └── EmailService.test.js
├── utils/
│ ├── CircuitBreaker.js
│ ├── EmailQueue.js
│ ├── Logger.js
│ ├── RateLimiter.js
├── statusTracker.js
├── runEmail.js
├── index.js
├── package.json
├── package-lock.json
└── README.md

## 📦 Installation

Install dependencies with:


npm install
🧪 Running Tests
To run the unit tests:


npm test
✅ Example Test Output

PASS  tests/EmailService.test.js
  EmailService
    ✓ should send email successfully
    ✓ should not send duplicate email (idempotency)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total

💡 Assumptions
Providers are mocked, not real email services

Circuit breaker and queue are in-memory, no external persistence used

Each email has a unique id for idempotency

Rate limiter is applied per service instance

Minimal dependencies used (only jest for testing)

💻 Usage

// Import the EmailService class from your services folder
const { EmailService } = require('./services/EmailService');

// Create a new instance of the email service
const emailService = new EmailService();

// Define the email object with necessary fields
const email = {
  id: 'unique-email-id-123',              // Unique ID to prevent duplicate sending (idempotency)
  to: 'recipient@example.com',            // Recipient email address
  subject: 'Test Email',                   // Email subject line
  body: 'This is a test email.',           // Email body content
};

// Send the email using the sendEmail method
emailService.sendEmail(email)
  .then(result => {
    if (result.success) {
      // If sending is successful, log a success message
      console.log('Email sent successfully!');
    } else {
      // If sending fails, log the error details
      console.error('Failed to send email:', result.error);
    }
  });



🧰 Guidelines Followed
✅ Language: JavaScript

✅ Minimal dependencies

✅ Unit tested using Jest

✅ Follows SOLID principles and clean code practices

✅ Fully documented with comments and README

✅ Robust error handling (with provider-specific messages)