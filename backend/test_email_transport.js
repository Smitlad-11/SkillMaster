require('dotenv').config();
const sendEmail = require('./utils/sendEmail');

const testEmail = async () => {
  try {
    console.log('Testing email transport...');
    await sendEmail({
      to: 'test@example.com', // Replace with a real email if you want to test for real
      subject: 'SkillMaster Test Email',
      html: '<h1>If you see this, email transport is working!</h1>'
    });
    console.log('Email sent successfully (or at least transport accepted it)!');
  } catch (err) {
    console.error('Email transport failed:', err.message);
  }
};

testEmail();
