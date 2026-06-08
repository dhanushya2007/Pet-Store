require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Pet = require('./models/Pet');
const Application = require('./models/Application');
const Order = require('./models/Order');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find({}, 'name email role');
  console.log("USERS:", users);
  
  const pets = await Pet.find({}, 'name seller');
  console.log("PETS COUNT:", pets.length);
  
  process.exit();
}
run();
