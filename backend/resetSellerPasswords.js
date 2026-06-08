/**
 * resetSellerPasswords.js
 * Resets every seller account's password to "123456" (bcrypt-hashed).
 * Run once with:  node resetSellerPasswords.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('./models/User');

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const newPasswordRaw = '123456';
  const salt           = await bcrypt.genSalt(10);
  const hashed         = await bcrypt.hash(newPasswordRaw, salt);

  // Update directly in DB (bypasses pre-save hook to avoid double-hashing)
  const result = await User.updateMany(
    { role: 'seller' },
    { $set: { password: hashed } }
  );

  console.log(`✅ Updated ${result.modifiedCount} seller account(s) — password is now: 123456`);
  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
