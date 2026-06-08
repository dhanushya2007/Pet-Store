/**
 * cleanup.js — removes all pets from old sellers, keeps only the 15 new ones
 * Run: node cleanup.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Pet  = require('./models/Pet');
const User = require('./models/User');

const KEEP_EMAILS = ['happypaws@petstore.com', 'citypets@petstore.com', 'furryfriends@petstore.com'];

async function cleanup() {
  console.log('\n🔌 Connecting...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected!\n');

  // Find the 3 new sellers
  const keepers = await User.find({ email: { $in: KEEP_EMAILS } });
  const keepIds = keepers.map(u => u._id.toString());
  console.log(`Found ${keepers.length} new sellers: ${keepers.map(u => u.shopName).join(', ')}\n`);

  // Delete all pets NOT belonging to the 3 new sellers
  const del = await Pet.deleteMany({ seller: { $nin: keepIds } });
  console.log(`🧹 Deleted ${del.deletedCount} stale pets from old sellers\n`);

  // List what remains
  const remaining = await Pet.find().populate('seller', 'shopName').sort({ seller: 1, name: 1 });
  console.log(`📋 ${remaining.length} pets remaining:\n`);
  let lastShop = '';
  for (const p of remaining) {
    const shop = p.seller?.shopName || 'Unknown';
    if (shop !== lastShop) { console.log(`\n  📦 ${shop}`); lastShop = shop; }
    console.log(`     🐾 ${p.name.padEnd(10)} (${p.species}) — ${p.adoptionType}`);
  }

  console.log('\n✅ Database is clean!\n');
  await mongoose.disconnect();
  process.exit(0);
}

cleanup().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
