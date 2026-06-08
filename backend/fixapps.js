const mongoose = require('mongoose');
require('dotenv').config();
const Application = require('./models/Application');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 }).then(async () => {
  const bhavi = await User.findOne({ email: 'bhavi@gmail.com' });
  const seller2 = await User.findOne({ email: 'seller2@test.com' });

  await Application.updateMany(
    { userId: null },
    { $set: { userId: bhavi._id, sellerId: seller2._id } }
  );

  console.log('Database fixed. Applications assigned to Bhavi and Happy Tails Shelter (seller2).');
  process.exit(0);
}).catch(e => { console.error(e); process.exit(1); });
