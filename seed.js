/**
 * PetStore Database Seeder
 * Run: node backend/seed.js
 * Seeds 3 seller accounts and 18 approved pets across categories
 */

require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

// Load models directly (not via middleware)
const User = require('./backend/models/User');
const Pet  = require('./backend/models/Pet');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

const SELLERS = [
  { name:"Happy Paws Shelter",  email:"happypaws@petstore.com",  password:"seller123", role:"seller", shopName:"Happy Paws Shelter",  isApproved:true },
  { name:"City Pet Center",     email:"citypets@petstore.com",   password:"seller123", role:"seller", shopName:"City Pet Center",     isApproved:true },
  { name:"Nature's Friends",    email:"nature@petstore.com",     password:"seller123", role:"seller", shopName:"Nature's Friends",    isApproved:true },
];

const PETS_DATA = [
  // Dogs
  { name:"Bruno",    species:"dog",    breed:"Labrador Retriever",  age:24, gender:"male",   price:0,   adoptionType:"adoption", imageUrl:"https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600", description:"Friendly & energetic Labrador, great with kids. Loves fetch and swimming.",  vaccinated:true,  neutered:true,  location:"Chennai",   sellerIdx:0 },
  { name:"Max",      species:"dog",    breed:"Golden Retriever",    age:6,  gender:"male",   price:0,   adoptionType:"adoption", imageUrl:"https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=600", description:"Adorable Golden Retriever puppy, full of love and eager to learn tricks.",    vaccinated:true,  neutered:false, location:"Bangalore", sellerIdx:1 },
  { name:"Rocky",    species:"dog",    breed:"Pembroke Corgi",      age:8,  gender:"male",   price:0,   adoptionType:"adoption", imageUrl:"https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600", description:"Playful Corgi with big personality. Loves herding and outdoor adventures.",   vaccinated:true,  neutered:true,  location:"Mumbai",    sellerIdx:0 },
  { name:"Bella",    species:"dog",    breed:"Maltese",             age:18, gender:"female", price:0,   adoptionType:"adoption", imageUrl:"https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=600", description:"Sweet and gentle Maltese, perfect for apartment living. Very affectionate.",  vaccinated:true,  neutered:true,  location:"Delhi",     sellerIdx:2 },
  { name:"Duke",     species:"dog",    breed:"German Shepherd",     age:36, gender:"male",   price:8000, adoptionType:"sale",    imageUrl:"https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600", description:"Trained German Shepherd, excellent guard dog. Commands: sit, stay, fetch.",   vaccinated:true,  neutered:false, location:"Pune",      sellerIdx:1 },
  { name:"Coco",     species:"dog",    breed:"Pomeranian",          age:24, gender:"female", price:5000, adoptionType:"both",   imageUrl:"https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600", description:"Fluffy Pomeranian ball of energy. Loves attention and playtime with family.",  vaccinated:true,  neutered:true,  location:"Hyderabad", sellerIdx:2 },
  // Cats
  { name:"Milo",     species:"cat",    breed:"British Shorthair",   age:12, gender:"male",   price:0,   adoptionType:"adoption", imageUrl:"https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600", description:"Calm and affectionate British Shorthair. Loves cozy spots and gentle petting.", vaccinated:true,  neutered:true,  location:"Chennai",   sellerIdx:0 },
  { name:"Luna",     species:"cat",    breed:"Persian Cat",         age:36, gender:"female", price:0,   adoptionType:"adoption", imageUrl:"https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=600", description:"Elegant Persian with beautiful long coat. Loves being groomed and cuddled.",    vaccinated:true,  neutered:true,  location:"Bangalore", sellerIdx:1 },
  { name:"Stella",   species:"cat",    breed:"Siamese",             age:24, gender:"female", price:3500, adoptionType:"sale",   imageUrl:"https://images.unsplash.com/photo-1513245543132-31f507417b26?w=600", description:"Talkative and playful Siamese. Forms strong bonds with her human family.",     vaccinated:true,  neutered:true,  location:"Mumbai",    sellerIdx:2 },
  { name:"Oliver",   species:"cat",    breed:"Maine Coon",          age:8,  gender:"male",   price:6000, adoptionType:"sale",   imageUrl:"https://images.unsplash.com/photo-1531720519349-cc3a318c4e56?w=600", description:"Majestic Maine Coon with tufted ears and a bushy tail. Very dog-like in nature.", vaccinated:true, neutered:false, location:"Delhi",     sellerIdx:0 },
  // Birds
  { name:"Tweety",   species:"bird",   breed:"Budgerigar (Budgie)", age:6,  gender:"male",   price:800,  adoptionType:"sale",   imageUrl:"https://images.unsplash.com/photo-1497206365907-f5e630693df0?w=600", description:"Cheerful yellow Budgie who loves to chirp and mimic simple words.",              vaccinated:false, neutered:false, location:"Chennai",   sellerIdx:2 },
  { name:"Rio",      species:"bird",   breed:"Cockatiel",           age:12, gender:"male",   price:1500, adoptionType:"both",   imageUrl:"https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600", description:"Friendly Cockatiel who loves head scratches and whistling tunes.",             vaccinated:false, neutered:false, location:"Hyderabad", sellerIdx:1 },
  { name:"Sunny",    species:"bird",   breed:"African Grey Parrot", age:24, gender:"female", price:25000,adoptionType:"sale",   imageUrl:"https://images.unsplash.com/photo-1548767797-d8c844163c4a?w=600", description:"Intelligent African Grey Parrot with a vocabulary of over 50 words.",           vaccinated:true,  neutered:false, location:"Bangalore", sellerIdx:0 },
  // Rabbits
  { name:"Snowball",  species:"rabbit", breed:"Holland Lop",        age:4,  gender:"female", price:0,   adoptionType:"adoption", imageUrl:"https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600", description:"Adorable Holland Lop with floppy ears. Loves hay, veggies and gentle pets.",   vaccinated:false, neutered:false, location:"Pune",      sellerIdx:2 },
  { name:"Hazel",     species:"rabbit", breed:"Mini Rex",           age:8,  gender:"male",   price:1200, adoptionType:"sale",   imageUrl:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600", description:"Velvety soft Mini Rex rabbit. Curious and playful, bonds well with families.",  vaccinated:false, neutered:true,  location:"Mumbai",    sellerIdx:1 },
  // Fish
  { name:"Nemo",      species:"fish",   breed:"Clownfish",          age:3,  gender:"male",   price:500,  adoptionType:"sale",   imageUrl:"https://images.unsplash.com/photo-1558618047-f4e60cef66b3?w=600", description:"Vibrant Clownfish, perfect for a saltwater aquarium. Very easy to care for.",   vaccinated:false, neutered:false, location:"Chennai",   sellerIdx:0 },
  // Dogs (more)
  { name:"Charlie",   species:"dog",    breed:"Beagle",             age:4,  gender:"male",   price:0,   adoptionType:"adoption", imageUrl:"https://images.unsplash.com/photo-1608096299210-db7e38487075?w=600", description:"Curious and sociable Beagle pup with an excellent nose. Loves long walks.",    vaccinated:true,  neutered:false, location:"Delhi",     sellerIdx:1 },
  { name:"Daisy",     species:"dog",    breed:"Poodle",             age:18, gender:"female", price:12000,adoptionType:"sale",   imageUrl:"https://images.unsplash.com/photo-1504595403659-9088ce801e1f?w=600", description:"Elegant standard Poodle, highly intelligent and hypoallergenic. Show-quality.",  vaccinated:true,  neutered:true,  location:"Bangalore", sellerIdx:2 },
];

async function seed() {
  console.log("🌱 Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Clear existing seeded data (optional: comment out to keep)
  const seedEmails = SELLERS.map(s=>s.email);
  const existingSellers = await User.find({ email: { $in: seedEmails } });
  const existingIds = existingSellers.map(s=>s._id);

  // Remove old seeded pets
  if (existingIds.length > 0) {
    await Pet.deleteMany({ seller: { $in: existingIds } });
    console.log("🧹 Cleared old seeded pets");
  }

  // Create sellers (or update if exist)
  const sellerDocs = [];
  for (const s of SELLERS) {
    let doc = await User.findOne({ email: s.email });
    if (!doc) {
      doc = await User.create(s);
      console.log(`  👤 Created seller: ${s.name}`);
    } else {
      console.log(`  👤 Seller already exists: ${s.name}`);
    }
    sellerDocs.push(doc);
  }

  // Create pets
  let count = 0;
  for (const p of PETS_DATA) {
    const seller = sellerDocs[p.sellerIdx];
    await Pet.create({
      name:         p.name,
      species:      p.species,
      breed:        p.breed,
      age:          p.age,
      ageUnit:      "months",
      gender:       p.gender,
      price:        p.price,
      imageUrl:     p.imageUrl,
      description:  p.description,
      vaccinated:   p.vaccinated,
      neutered:     p.neutered,
      location:     p.location,
      adoptionType: p.adoptionType,
      seller:       seller._id,
      isApproved:   true,       // auto-approved for demo
      status:       "available",
    });
    count++;
    process.stdout.write(`  🐾 Seeded: ${p.name} (${p.species})\n`);
  }

  console.log(`\n✅ Seeding complete! Created ${count} pets across ${sellerDocs.length} sellers.`);
  console.log("\n📋 Seller login credentials:");
  SELLERS.forEach(s => console.log(`   ${s.email} / ${s.password}`));
  console.log("\n🔑 Admin login: admin@petstore.com / (set your own password)");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Seed error:", err.message);
  process.exit(1);
});
