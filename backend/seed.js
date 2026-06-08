/**
 * PetStore Database Seeder
 * Run from: cd "Pet Store/backend" && node seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Pet = require('./models/Pet');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

const SELLERS = [
  { name: "Happy Paws Shelter", email: "happypaws@petstore.com", password: "seller123", role: "seller", shopName: "Happy Paws Shelter", isApproved: true },
  { name: "City Pet Center", email: "citypets@petstore.com", password: "seller123", role: "seller", shopName: "City Pet Center", isApproved: true },
  { name: "Nature Friends", email: "nature@petstore.com", password: "seller123", role: "seller", shopName: "Nature Friends", isApproved: true },
];

const PETS_DATA = [
  // Dogs – Free Adoption
  { name: "Bruno", species: "dog", breed: "Labrador Retriever", age: 24, gender: "male", price: 0, adoptionType: "adoption", imageUrl: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600", description: "Friendly & energetic Labrador, great with kids. Loves fetch and swimming.", vaccinated: true, neutered: true, location: "Chennai", sellerIdx: 0 },
  { name: "Max", species: "dog", breed: "Golden Retriever", age: 6, gender: "male", price: 0, adoptionType: "adoption", imageUrl: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=600", description: "Adorable Golden Retriever puppy, full of love and eager to learn tricks.", vaccinated: true, neutered: false, location: "Bangalore", sellerIdx: 1 },
  { name: "Rocky", species: "dog", breed: "Pembroke Corgi", age: 8, gender: "male", price: 0, adoptionType: "adoption", imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600", description: "Playful Corgi with big personality. Loves herding and outdoor adventures.", vaccinated: true, neutered: true, location: "Mumbai", sellerIdx: 0 },
  { name: "Bella", species: "dog", breed: "Maltese", age: 18, gender: "female", price: 0, adoptionType: "adoption", imageUrl: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=600", description: "Sweet Maltese, perfect for apartment living. Very affectionate.", vaccinated: true, neutered: true, location: "Delhi", sellerIdx: 2 },
  // Dogs – For Sale
  { name: "Duke", species: "dog", breed: "German Shepherd", age: 36, gender: "male", price: 8000, adoptionType: "sale", imageUrl: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600", description: "Trained German Shepherd, excellent guard dog. Commands: sit, stay, fetch.", vaccinated: true, neutered: false, location: "Pune", sellerIdx: 1 },
  { name: "Coco", species: "dog", breed: "Pomeranian", age: 24, gender: "female", price: 5000, adoptionType: "both", imageUrl: "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=600", description: "Fluffy Pomeranian ball of energy. Loves attention and family playtime.", vaccinated: true, neutered: true, location: "Hyderabad", sellerIdx: 2 },
  { name:"Bruno",    breed:"Labrador Retriever", species:"dog", age:24, ageUnit:"months", gender:"male",   price:0,     adoptionType:"adoption", stars:5, reviews:48, description:"Friendly & energetic Labrador, great with kids. Loves fetch and swimming.", imageUrl:"https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80", sellerIdx:0 },
  { name:"Milo",     breed:"British Shorthair",  species:"cat", age:12, ageUnit:"months", gender:"male",   price:0,     adoptionType:"adoption", stars:4, reviews:36, description:"Calm British Shorthair. Loves cozy spots and gentle petting.",               imageUrl:"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80", sellerIdx:1 },
  { name:"Rocky",    breed:"Pembroke Corgi",     species:"dog", age:8,  ageUnit:"months", gender:"male",   price:0,     adoptionType:"adoption", stars:5, reviews:62, description:"Playful herder with a big personality in a small body. Loves running around.",  imageUrl:"https://images.unsplash.com/photo-1612536057832-2ff7ead58194?w=600&auto=format&fit=crop&q=80", sellerIdx:2 },
  { name:"Luna",     breed:"Persian Cat",        species:"cat", age:36, ageUnit:"months", gender:"female", price:0,     adoptionType:"adoption", stars:4, reviews:29, description:"Elegant Persian with beautiful long coat. Loves grooming and cuddles.",       imageUrl:"https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a?w=600&auto=format&fit=crop&q=80", sellerIdx:0 },
  { name:"Max",      breed:"Golden Retriever",   species:"dog", age:6,  ageUnit:"months", gender:"male",   price:0,     adoptionType:"adoption", stars:5, reviews:91, description:"Adorable Golden Retriever puppy, full of love and eager to learn tricks.",   imageUrl:"https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=80", sellerIdx:1 },
  { name:"Bella",    breed:"Maltese",            species:"dog", age:18, ageUnit:"months", gender:"female", price:0,     adoptionType:"adoption", stars:5, reviews:55, description:"Sweet and gentle, perfect for apartment living. Very quiet and affectionate.",            imageUrl:"https://images.unsplash.com/photo-1537151608828-ea2b117b62e4?w=600&auto=format&fit=crop&q=80", sellerIdx:2 },
  { name:"Charlie",  breed:"Beagle",             species:"dog", age:4,  ageUnit:"months", gender:"male",   price:0,     adoptionType:"adoption", stars:4, reviews:41, description:"Curious Beagle pup with excellent nose. Loves long walks and socializing.",                  imageUrl:"https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=600&auto=format&fit=crop&q=80", sellerIdx:0 },
  { name:"Coco",     breed:"Pomeranian",         species:"dog", age:24, ageUnit:"months", gender:"female", price:0,     adoptionType:"adoption", stars:5, reviews:73, description:"Fluffy Pomeranian ball of energy. Loves attention and family playtime.",      imageUrl:"https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80", sellerIdx:1 },
  { name:"Duke",     breed:"German Shepherd",    species:"dog", age:36, ageUnit:"months", gender:"male",   price:18000, adoptionType:"sale",     stars:5, reviews:44, description:"Trained German Shepherd, excellent guard dog. Intelligent and loyal.",  imageUrl:"https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600", sellerIdx:1 },
  { name:"Daisy",    breed:"Toy Poodle",         species:"dog", age:18, ageUnit:"months", gender:"female", price:15000, adoptionType:"sale",     stars:5, reviews:68, description:"Elegant Poodle, highly intelligent and hypoallergenic.",         imageUrl:"https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?w=600", sellerIdx:2 },
  { name:"Buddy",    breed:"Siberian Husky",     species:"dog", age:10, ageUnit:"months", gender:"male",   price:22000, adoptionType:"sale",     stars:5, reviews:80, description:"Stunning Husky with beautiful eyes, energetic and friendly.",         imageUrl:"https://images.unsplash.com/photo-1531804055935-76f44d7c3621?w=600", sellerIdx:0 },
  { name:"Stella",   breed:"Siamese Cat",        species:"cat", age:24, ageUnit:"months", gender:"female", price:8500,  adoptionType:"sale",     stars:4, reviews:22, description:"Talkative Siamese. Forms strong bonds with her human family.",               imageUrl:"https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600", sellerIdx:2 },
  { name:"Oliver",   breed:"Maine Coon",         species:"cat", age:8,  ageUnit:"months", gender:"male",   price:12000, adoptionType:"sale",     stars:5, reviews:37, description:"Majestic Maine Coon with tufted ears and bushy tail. Very friendly.",         imageUrl:"https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=600", sellerIdx:1 },
  { name:"Chloe",    breed:"Ragdoll",            species:"cat", age:14, ageUnit:"months", gender:"female", price:14000, adoptionType:"sale",     stars:5, reviews:45, description:"Beautiful blue-eyed Ragdoll cat, extremely gentle and calm.",         imageUrl:"https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600", sellerIdx:0 },
  { name:"Simba",    breed:"Bengal Cat",         species:"cat", age:16, ageUnit:"months", gender:"male",   price:16000, adoptionType:"sale",     stars:5, reviews:52, description:"Active Bengal cat with gorgeous leopard-like spots.",         imageUrl:"https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600", sellerIdx:2 },
  { name:"Lily",     breed:"Sphynx Cat",         species:"cat", age:20, ageUnit:"months", gender:"female", price:25000, adoptionType:"sale",     stars:4, reviews:18, description:"Rare hairless Sphynx, very warm, affectionate and outgoing.",         imageUrl:"https://images.unsplash.com/photo-1526336024438-db31a22574b4?w=600", sellerIdx:1 },
  { name:"Cleo",     breed:"Russian Blue",       species:"cat", age:30, ageUnit:"months", gender:"female", price:9500,  adoptionType:"sale",     stars:4, reviews:30, description:"Elegant Russian Blue with quiet, gentle nature and silvery coat.",         imageUrl:"https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=600", sellerIdx:0 },
  { name:"Loki",     breed:"Scottish Fold",      species:"cat", age:15, ageUnit:"months", gender:"male",   price:11000, adoptionType:"sale",     stars:5, reviews:60, description:"Cute Scottish Fold with signature folded ears and round face.",         imageUrl:"https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600", sellerIdx:2 },
];

async function seed() {
  console.log("\n🌱 Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected!\n");

  // Remove old seeded pets first
  const seedEmails = SELLERS.map(s => s.email);
  const existing   = await User.find({ email: { $in: seedEmails } });
  const ids        = existing.map(u => u._id);
  if (ids.length) {
    const del = await Pet.deleteMany({ seller: { $in: ids } });
    console.log(`🧹 Removed ${del.deletedCount} old seeded pets\n`);
  }

  // Upsert sellers
  const sellerDocs = [];
  const salt = await bcrypt.genSalt(10);
  const pwd = await bcrypt.hash('seller123', salt);
  for (const s of SELLERS) {
    let doc = await User.findById(s._id);
    if (!doc) doc = await User.findOne({ email: s.email });
    if (!doc) {
      doc = await User.create({ ...s, password: pwd });
      console.log(`👤 Created seller: ${s.name}`);
    } else {
      doc.password = pwd;
      doc.role = "seller";
      doc.shopName = s.shopName;
      doc.isApproved = true;
      await doc.save();
      console.log(`👤 Verified/updated seller:   ${s.name}`);
    }
    sellerDocs.push(doc);
  }

  // Create pets
  console.log("");
  for (const p of PETS_DATA) {
    await Pet.create({
      name:p.name, species:p.species, breed:p.breed, age:p.age,
      ageUnit:"months", gender:p.gender, price:p.price,
      imageUrl:p.imageUrl, description:p.description,
      vaccinated:true, neutered:true, location:"Local",
      adoptionType:p.adoptionType, seller:sellerDocs[p.sellerIdx]._id,
      isApproved:true, status:"available",
      stars: p.stars, reviews: p.reviews
    });
    console.log(`  🐾 ${p.name.padEnd(10)} (${p.species})`);
  }

  console.log(`\n✅ Seeded ${PETS_DATA.length} pets with ${SELLERS.length} sellers!\n`);
  console.log("📋 Seller credentials:");
  SELLERS.forEach(s => console.log(`   📧 ${s.email}  🔑 seller123`));
  console.log("");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Seed error:", err.message);
  process.exit(1);
});
