require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Pet = require('./models/Pet');

// The 15 static pets
const STATIC_PETS = [
  { name:"Bruno",   breed:"Labrador Retriever", species:"dog", imageUrl:"/assets/hd_labrador.png", age:24, ageUnit:"months", gender:"male",   price:0,   stars:5, reviews:48,  description:"Friendly & energetic, great with kids and families.", adoptionType:"adoption" },
  { name:"Milo",    breed:"British Shorthair",  species:"cat", imageUrl:"/assets/hd_shorthair.png", age:12, ageUnit:"months", gender:"male",   price:0,   stars:4, reviews:36,  description:"Calm and affectionate cat, loves cozy indoor life.", adoptionType:"adoption" },
  { name:"Rocky",   breed:"Pembroke Corgi",     species:"dog", imageUrl:"/assets/hd_corgi.png", age:8,  ageUnit:"months", gender:"male",   price:0,   stars:5, reviews:62,  description:"Playful herder with a big personality in a small body.", adoptionType:"adoption" },
  { name:"Luna",    breed:"Persian Cat",        species:"cat", imageUrl:"/assets/hd_persian.png", age:36, ageUnit:"months", gender:"female", price:0,   stars:4, reviews:29,  description:"Elegant and gentle, loves being groomed and cuddled.", adoptionType:"adoption" },
  { name:"Max",     breed:"Golden Retriever",   species:"dog", imageUrl:"/assets/hd_golden.png", age:6,  ageUnit:"months", gender:"male",   price:0,   stars:5, reviews:91,  description:"Adorable puppy full of love, eager to learn tricks.", adoptionType:"adoption" },
  { name:"Bella",   breed:"Maltese",            species:"dog", imageUrl:"/assets/hd_maltese.png", age:18, ageUnit:"months", gender:"female", price:0,   stars:5, reviews:55,  description:"Sweet and gentle, perfect for apartment living.", adoptionType:"adoption" },
  { name:"Charlie", breed:"Beagle",             species:"dog", imageUrl:"/assets/hd_beagle.png", age:4,  ageUnit:"months", gender:"male",   price:0,   stars:4, reviews:41,  description:"Curious and sociable pup with an amazing nose.", adoptionType:"adoption" },
  { name:"Coco",    breed:"Pomeranian",         species:"dog", imageUrl:"/assets/hd_pomeranian.png", age:24, ageUnit:"months", gender:"female", price:0,   stars:5, reviews:73,  description:"Fluffy ball of energy that loves attention and play.", adoptionType:"adoption" },
  { name:"Oscar",   breed:"Labrador Mix",       species:"dog", imageUrl:"/assets/hd_labrador.png", age:36, ageUnit:"months", gender:"male",   price:0,   stars:4, reviews:33,  description:"Calm and loyal companion, ideal for all home types.", adoptionType:"adoption" },
  { name:"Lily",    breed:"Persian Mix",        species:"cat", imageUrl:"/assets/hd_persian.png", age:60, ageUnit:"months", gender:"female", price:0,   stars:4, reviews:27,  description:"Senior beauty who deserves a warm and quiet home.", adoptionType:"adoption" },
  { name:"Buddy",   breed:"Golden Retriever",   species:"dog", imageUrl:"/assets/hd_golden.png", age:12, ageUnit:"months", gender:"male",   price:0,   stars:5, reviews:88,  description:"Your perfect everyday companion — happy and loyal.", adoptionType:"adoption" },
  { name:"Stella",  breed:"British Shorthair",  species:"cat", imageUrl:"/assets/hd_shorthair.png", age:24, ageUnit:"months", gender:"female", price:0,   stars:4, reviews:42,  description:"Quiet and independent, loves sunny window spots.", adoptionType:"adoption" },
  { name:"Duke",    breed:"Beagle Mix",         species:"dog", imageUrl:"/assets/hd_beagle.png", age:7,  ageUnit:"months", gender:"male",   price:0,   stars:4, reviews:38,  description:"Adventurous pup always ready for the next walk.", adoptionType:"adoption" },
  { name:"Daisy",   breed:"Pomeranian Mix",     species:"dog", imageUrl:"/assets/hd_pomeranian.png", age:36, ageUnit:"months", gender:"female", price:0,   stars:5, reviews:66,  description:"Loveable fluffball who gets along with everyone.", adoptionType:"adoption" },
  { name:"Toby",    breed:"Corgi Mix",          species:"dog", imageUrl:"/assets/hd_corgi.png", age:12, ageUnit:"months", gender:"male",   price:0,   stars:5, reviews:52,  description:"Smart, fun and full of corgi charm — loves agility.", adoptionType:"adoption" },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // 1. Create Sellers
    const salt = await bcrypt.genSalt(10);
    const pwd = await bcrypt.hash('123456', salt);

    const sellers = [
      { name: "Paws & Claws Rescue", email: "seller1@test.com", password: pwd, role: "seller", shopName: "Paws & Claws Rescue", isApproved: true },
      { name: "Happy Tails Shelter", email: "seller2@test.com", password: pwd, role: "seller", shopName: "Happy Tails Shelter", isApproved: true },
      { name: "Furry Friends Foster", email: "seller3@test.com", password: pwd, role: "seller", shopName: "Furry Friends Foster", isApproved: true }
    ];

    // Remove old ones if they exist
    await User.deleteMany({ email: { $in: sellers.map(s => s.email) } });
    const createdSellers = await User.insertMany(sellers);
    console.log(`Created ${createdSellers.length} sellers.`);

    // 2. Insert Pets
    const petsToInsert = STATIC_PETS.map((pet, idx) => {
      // Assign to a random seller
      const seller = createdSellers[idx % createdSellers.length]._id;
      return {
        ...pet,
        seller,
        isApproved: true,
        status: 'available',
        imageUrl: '', // clear so frontend uses fallback correctly, or we can leave it empty
      };
    });

    const result = await Pet.insertMany(petsToInsert);
    console.log(`Inserted ${result.length} static pets as real DB pets.`);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
