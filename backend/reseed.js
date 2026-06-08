/**
 * Quick reseed — dogs & cats only, 5 per seller
 * Run: node reseed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User = require('./models/User');
const Pet  = require('./models/Pet');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

const SELLERS = [
  { name:'Happy Paws Shelter',  email:'happypaws@petstore.com',   password:'seller123', role:'seller', shopName:'Happy Paws Shelter',  isApproved:true },
  { name:'City Pet Center',     email:'citypets@petstore.com',    password:'seller123', role:'seller', shopName:'City Pet Center',     isApproved:true },
  { name:'Furry Friends Foster',email:'furryfriends@petstore.com',password:'seller123', role:'seller', shopName:'Furry Friends Foster',isApproved:true },
];

const PETS = [
  // ── Seller 0: Happy Paws Shelter ──────────────────────────────────────────
  { si:0, name:'Bruno',   species:'dog', breed:'Labrador Retriever', age:24, gender:'male',   price:0,     adoptionType:'adoption', location:'Chennai',
    imageUrl:'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1200&q=90',
    description:'Friendly & energetic Labrador, great with kids. Loves fetch and swimming.', vaccinated:true, neutered:true },

  { si:0, name:'Luna',    species:'cat', breed:'Persian Cat',        age:36, gender:'female', price:0,     adoptionType:'adoption', location:'Chennai',
    imageUrl:'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=1200&q=90',
    description:'Elegant Persian with a silky long coat. Loves grooming sessions and warm cuddles.', vaccinated:true, neutered:true },

  { si:0, name:'Buddy',   species:'dog', breed:'Siberian Husky',     age:10, gender:'male',   price:22000, adoptionType:'sale',     location:'Delhi',
    imageUrl:'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=1200&q=90',
    description:'Stunning Husky with piercing blue eyes. Energetic, friendly and loves cold weather.', vaccinated:true, neutered:false },

  { si:0, name:'Chloe',   species:'cat', breed:'Ragdoll Cat',        age:14, gender:'female', price:14000, adoptionType:'sale',     location:'Delhi',
    imageUrl:'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=1200&q=90',
    description:'Beautiful blue-eyed Ragdoll — extremely gentle and calm. Goes limp when held.', vaccinated:true, neutered:true },

  { si:0, name:'Charlie', species:'dog', breed:'Beagle',             age:4,  gender:'male',   price:0,     adoptionType:'adoption', location:'Pune',
    imageUrl:'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=1200&q=90',
    description:'Curious Beagle pup with an amazing nose. Loves long walks and socialising.', vaccinated:true, neutered:false },

  // ── Seller 1: City Pet Center ──────────────────────────────────────────────
  { si:1, name:'Milo',    species:'cat', breed:'British Shorthair',  age:12, gender:'male',   price:0,     adoptionType:'adoption', location:'Bangalore',
    imageUrl:'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=1200&q=90',
    description:'Calm British Shorthair. Loves cozy indoor spots and unhurried, gentle petting.', vaccinated:true, neutered:true },

  { si:1, name:'Max',     species:'dog', breed:'Golden Retriever',   age:6,  gender:'male',   price:0,     adoptionType:'adoption', location:'Bangalore',
    imageUrl:'https://images.unsplash.com/photo-1552053831-71594a27632d?w=1200&q=90',
    description:'Adorable Golden Retriever puppy full of love and eager to learn new tricks.', vaccinated:true, neutered:false },

  { si:1, name:'Stella',  species:'cat', breed:'Siamese Cat',        age:24, gender:'female', price:8500,  adoptionType:'sale',     location:'Hyderabad',
    imageUrl:'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=1200&q=90',
    description:'Talkative and affectionate Siamese. Forms incredibly strong bonds with her family.', vaccinated:true, neutered:true },

  { si:1, name:'Duke',    species:'dog', breed:'German Shepherd',    age:36, gender:'male',   price:18000, adoptionType:'sale',     location:'Mumbai',
    imageUrl:'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=1200&q=90',
    description:'Trained German Shepherd — excellent guard dog. Knows sit, stay and fetch.', vaccinated:true, neutered:false },

  { si:1, name:'Coco',    species:'dog', breed:'Pomeranian',         age:24, gender:'female', price:0,     adoptionType:'adoption', location:'Mumbai',
    imageUrl:'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=1200&q=90',
    description:'Fluffy Pomeranian ball of energy. Loves attention, playtime and family.', vaccinated:true, neutered:true },

  // ── Seller 2: Furry Friends Foster ────────────────────────────────────────
  { si:2, name:'Rocky',   species:'dog', breed:'Pembroke Corgi',     age:8,  gender:'male',   price:0,     adoptionType:'adoption', location:'Chennai',
    imageUrl:'https://images.unsplash.com/photo-1612536057832-2ff7ead58194?w=1200&q=90',
    description:'Playful herder with a huge personality in a tiny body. Loves outdoor adventures.', vaccinated:true, neutered:true },

  { si:2, name:'Bella',   species:'dog', breed:'Maltese',            age:18, gender:'female', price:0,     adoptionType:'adoption', location:'Hyderabad',
    imageUrl:'https://images.unsplash.com/photo-1537151608828-ea2b117b62e4?w=1200&q=90',
    description:'Sweet and gentle Maltese, perfect for apartment living. Very quiet and affectionate.', vaccinated:true, neutered:true },

  { si:2, name:'Oliver',  species:'cat', breed:'Maine Coon',         age:8,  gender:'male',   price:12000, adoptionType:'sale',     location:'Bangalore',
    imageUrl:'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=1200&q=90',
    description:'Majestic Maine Coon with tufted ears and a bushy tail. Very dog-like and friendly.', vaccinated:true, neutered:false },

  { si:2, name:'Simba',   species:'cat', breed:'Bengal Cat',         age:16, gender:'male',   price:16000, adoptionType:'sale',     location:'Pune',
    imageUrl:'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=1200&q=90',
    description:'Active Bengal cat with gorgeous leopard-like spots. Playful and highly intelligent.', vaccinated:true, neutered:true },

  { si:2, name:'Daisy',   species:'dog', breed:'Toy Poodle',         age:18, gender:'female', price:15000, adoptionType:'sale',     location:'Delhi',
    imageUrl:'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?w=1200&q=90',
    description:'Elegant Toy Poodle — highly intelligent, hypoallergenic and loves learning tricks.', vaccinated:true, neutered:true },
];

async function run() {
  console.log('\n🌱 Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected!\n');

  // Remove old seeded pets
  const seedEmails = SELLERS.map(s => s.email);
  const existing   = await User.find({ email: { $in: seedEmails } });
  const ids        = existing.map(u => u._id);
  if (ids.length) {
    const del = await Pet.deleteMany({ seller: { $in: ids } });
    console.log(`🧹 Removed ${del.deletedCount} old seeded pets\n`);
  }

  // Upsert sellers
  const sellerDocs = [];
  const pwd = await bcrypt.hash('seller123', 10);
  for (const s of SELLERS) {
    let doc = await User.findOne({ email: s.email });
    if (!doc) {
      doc = await User.create({ ...s, password: pwd });
      console.log(`👤 Created seller: ${s.name}`);
    } else {
      doc.password = pwd; doc.role = 'seller';
      doc.shopName = s.shopName; doc.isApproved = true;
      await doc.save();
      console.log(`👤 Updated seller: ${s.name}`);
    }
    sellerDocs.push(doc);
  }

  // Create pets
  console.log('');
  for (const p of PETS) {
    await Pet.create({
      name:p.name, species:p.species, breed:p.breed, age:p.age,
      ageUnit:'months', gender:p.gender, price:p.price,
      imageUrl:p.imageUrl, description:p.description,
      vaccinated:p.vaccinated, neutered:p.neutered,
      location:p.location, adoptionType:p.adoptionType,
      seller:sellerDocs[p.si]._id, isApproved:true, status:'available',
    });
    console.log(`  🐾 ${p.name.padEnd(10)} (${p.species.padEnd(3)})  →  ${SELLERS[p.si].shopName}`);
  }

  console.log(`\n✅ Done! Seeded 15 pets (5 per seller) — dogs & cats only.`);
  console.log('\n📋 Seller logins (all password: seller123):');
  SELLERS.forEach(s => console.log(`   📧 ${s.email}`));
  console.log('');
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
