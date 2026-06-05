const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const { login } = require('./controllers/authController');

require('dotenv').config();

console.log("Starting debug script...");
mongoose.connect('mongodb://127.0.0.1:27017/skillmaster')
  .then(async () => {
    console.log("Connected to local DB (assumed URL).");
    try {
      const email = 'debug2024@test.com';
      const password = 'password123';
      
      // Cleanup previous
      await User.deleteOne({ email });
      
      console.log("Creating user...");
      const user = await User.create({
        name: 'Debug User',
        email,
        password,
        role: 'student'
      });
      console.log("User created:", user._id);
      
      // Mock req/res
      const req = { body: { email, password } };
      const res = {
        status: function(s) { this.statusCode = s; return this; },
        json: function(data) { console.log("Response JSON:", data); return data; }
      };
      
      console.log("Calling login...");
      await login(req, res);
      
      console.log("Success!");
    } catch(err) {
      console.error("Error during test:", err);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch(err => console.log("DB Connection failed:", err));
