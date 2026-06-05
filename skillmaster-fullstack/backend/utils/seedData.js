// utils/seedData.js
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');
};

const users = [
  { name: 'Admin User', email: 'admin@skillmaster.com', password: 'Admin@123', role: 'admin' },
  { name: 'Priya Sharma', email: 'priya@skillmaster.com', password: 'Faculty@123', role: 'faculty' },
  { name: 'Rajesh Kumar', email: 'rajesh@skillmaster.com', password: 'Faculty@123', role: 'faculty' },
  { name: 'Rohan Patel', email: 'rohan@student.com', password: 'Student@123', role: 'student' },
  { name: 'Sneha Singh', email: 'sneha@student.com', password: 'Student@123', role: 'student' },
  { name: 'Amit Shah', email: 'amit@student.com', password: 'Student@123', role: 'student' },
];

const seedDB = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await User.deleteMany({});
  await Course.deleteMany({});

  console.log('Creating users...');
  const createdUsers = await User.create(users);
  const faculty = createdUsers.find(u => u.role === 'faculty');

  console.log('Creating courses...');
  await Course.create([
    {
      title: 'Full Stack Web Development with MERN',
      description: 'Learn to build scalable web apps using MongoDB, Express, React, Node.js. Covers REST APIs, JWT auth, deployment and more.',
      price: 1999, category: 'Web Development', level: 'Intermediate',
      faculty: faculty._id, isPublished: true,
      tags: ['MERN', 'React', 'Node.js', 'MongoDB'],
      requirements: ['Basic JavaScript knowledge', 'HTML/CSS basics'],
      whatYouLearn: ['Build full stack apps', 'REST API design', 'React hooks & Redux', 'MongoDB CRUD'],
    },
    {
      title: 'Python for Data Science',
      description: 'Master Python, Pandas, NumPy, Matplotlib for data analysis and visualization.',
      price: 1499, category: 'Data Science', level: 'Beginner',
      faculty: faculty._id, isPublished: true,
      tags: ['Python', 'Pandas', 'NumPy', 'Data Analysis'],
    },
    {
      title: 'Machine Learning A-Z',
      description: 'Complete ML course from supervised learning to neural networks with hands-on projects.',
      price: 2499, category: 'AI/ML', level: 'Advanced',
      faculty: faculty._id, isPublished: true,
      tags: ['Machine Learning', 'Deep Learning', 'TensorFlow'],
    },
    {
      title: 'React.js Complete Guide',
      description: 'Master React from basics to advanced patterns including hooks, context, and performance optimization.',
      price: 999, category: 'Web Development', level: 'Intermediate',
      faculty: faculty._id, isPublished: true,
      tags: ['React', 'JavaScript', 'Frontend'],
    },
    {
      title: 'JavaScript Fundamentals',
      description: 'Comprehensive JavaScript course covering ES6+, async programming, and DOM manipulation.',
      price: 0, category: 'Web Development', level: 'Beginner',
      faculty: faculty._id, isPublished: true,
      tags: ['JavaScript', 'ES6', 'Free Course'],
    },
  ]);

  console.log('\n✅ Database seeded successfully!\n');
  console.log('Test Credentials:');
  console.log('  Admin:   admin@skillmaster.com / Admin@123');
  console.log('  Faculty: priya@skillmaster.com / Faculty@123');
  console.log('  Student: rohan@student.com / Student@123\n');

  process.exit(0);
};

seedDB().catch(err => { console.error(err); process.exit(1); });
