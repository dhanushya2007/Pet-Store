/**
 * Seed Route — POST /api/seed
 * Seeds 15 studio-style HD pets + 3 sellers with correct IDs.
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Pet = require('../models/Pet');

const SELLERS = [
  { _id: "6a26518f80ca145ca06f6f2b", name: "Paws & Claws",   email: "seller1@test.com", password: "seller123", role: "seller", shopName: "Paws & Claws",   isApproved: true },
  { _id: "6a26518f80ca145ca06f6f2c", name: "Happy Tails",    email: "seller2@test.com", password: "seller123", role: "seller", shopName: "Happy Tails",    isApproved: true },
  { _id: "6a26518f80ca145ca06f6f2d", name: "Furry Friends",  email: "seller3@test.com", password: "seller123", role: "seller", shopName: "Furry Friends",  isApproved: true },
];

const PETS_DATA = [
  /* ── Paws & Claws (5 pets) ── */
  { si:0, name:"Bruno",   species:"dog", breed:"Labrador Retriever", age:24, gender:"male",   price:0,     adoptionType:"adoption", vaccinated:true,  neutered:true,  location:"Chennai",
    imageUrl:"/images/hd_labrador.png", stars: 5, reviews: 48,
    description:"Friendly & energetic Labrador, great with kids. Loves fetch and swimming." },

  { si:0, name:"Luna",    species:"cat", breed:"Persian Cat",        age:36, gender:"female", price:0,     adoptionType:"adoption", vaccinated:true,  neutered:true,  location:"Chennai",
    imageUrl:"/images/hd_persian_cat.png", stars: 4, reviews: 29,
    description:"Elegant Persian with a silky long coat. Loves grooming sessions and warm cuddles." },

  { si:0, name:"Charlie", species:"dog", breed:"Beagle",             age:4,  gender:"male",   price:0,     adoptionType:"adoption", vaccinated:true,  neutered:true,  location:"Pune",
    imageUrl:"/images/hd_beagle.png", stars: 5, reviews: 41,
    description:"Curious and sociable pup with an amazing nose." },

  { si:0, name:"Lily",    species:"cat", breed:"Persian Mix",        age:60, gender:"female", price:0,     adoptionType:"adoption", vaccinated:true,  neutered:true,  location:"Local",
    imageUrl:"/images/hd_persian_cat.png", stars: 4, reviews: 27,
    description:"Senior beauty who deserves a warm and quiet home." },

  { si:0, name:"Duke",    species:"dog", breed:"Beagle Mix",         age:7,  gender:"male",   price:0,     adoptionType:"adoption", vaccinated:true,  neutered:true,  location:"Local",
    imageUrl:"/images/hd_beagle.png", stars: 5, reviews: 38,
    description:"Adventurous pup always ready for the next walk." },

  /* ── Happy Tails (5 pets) ── */
  { si:1, name:"Milo",    species:"cat", breed:"British Shorthair",  age:12, gender:"male",   price:0,     adoptionType:"adoption", vaccinated:true,  neutered:true,  location:"Bangalore",
    imageUrl:"/images/hd_british_shorthair.png", stars: 4, reviews: 36,
    description:"Calm and affectionate cat, loves cozy indoor life." },

  { si:1, name:"Max",     species:"dog", breed:"Golden Retriever",   age:6,  gender:"male",   price:0,     adoptionType:"adoption", vaccinated:true,  neutered:true,  location:"Bangalore",
    imageUrl:"/images/hd_golden_retriever.png", stars: 5, reviews: 91,
    description:"Adorable Golden Retriever puppy full of love and eager to learn new tricks." },

  { si:1, name:"Coco",    species:"dog", breed:"Pomeranian",         age:24, gender:"female", price:0,     adoptionType:"adoption", vaccinated:true,  neutered:true,  location:"Mumbai",
    imageUrl:"/images/hd_pomeranian.png", stars: 5, reviews: 73,
    description:"Fluffy ball of energy that loves attention and play." },

  { si:1, name:"Buddy",   species:"dog", breed:"Golden Retriever",   age:12, gender:"male",   price:0,     adoptionType:"adoption", vaccinated:true,  neutered:true,  location:"Local",
    imageUrl:"/images/hd_golden_retriever.png", stars: 5, reviews: 88,
    description:"Your perfect everyday companion — happy and loyal." },

  { si:1, name:"Daisy",   species:"dog", breed:"Pomeranian Mix",     age:36, gender:"female", price:0,     adoptionType:"adoption", vaccinated:true,  neutered:true,  location:"Local",
    imageUrl:"/images/hd_pomeranian.png", stars: 5, reviews: 66,
    description:"Loveable fluffball who gets along with everyone." },

  /* ── Furry Friends (5 pets) ── */
  { si:2, name:"Rocky",   species:"dog", breed:"Pembroke Corgi",     age:8,  gender:"male",   price:0,     adoptionType:"adoption", vaccinated:true,  neutered:true,  location:"Chennai",
    imageUrl:"/images/hd_corgi.png", stars: 5, reviews: 62,
    description:"Playful herder with a big personality in a small body." },

  { si:2, name:"Bella",   species:"dog", breed:"Maltese",            age:18, gender:"female", price:0,     adoptionType:"adoption", vaccinated:true,  neutered:true,  location:"Hyderabad",
    imageUrl:"/images/hd_maltese.png", stars: 5, reviews: 55,
    description:"Sweet and gentle Maltese, perfect for apartment living." },

  { si:2, name:"Oscar",   species:"dog", breed:"Labrador Mix",       age:36, gender:"male",   price:0,     adoptionType:"adoption", vaccinated:true,  neutered:true,  location:"Local",
    imageUrl:"/images/hd_labrador.png", stars: 5, reviews: 33,
    description:"Calm and loyal companion, ideal for all home types." },

  { si:2, name:"Stella",  species:"cat", breed:"British Shorthair",  age:24, gender:"female", price:0,     adoptionType:"adoption", vaccinated:true,  neutered:true,  location:"Local",
    imageUrl:"/images/hd_british_shorthair.png", stars: 4, reviews: 42,
    description:"Quiet and independent, loves sunny window spots." },

  { si:2, name:"Toby",    species:"dog", breed:"Corgi Mix",          age:12, gender:"male",   price:0,     adoptionType:"adoption", vaccinated:true,  neutered:true,  location:"Local",
    imageUrl:"/images/hd_corgi.png", stars: 5, reviews: 52,
    description:"Smart, fun and full of corgi charm — loves agility." },
];

// GET /api/seed — instructions
router.get('/', (req, res) => {
  res.json({
    message: 'To seed the database, POST to /api/seed',
    warning: 'This will delete existing seeded pets and re-create them.',
    usage: 'POST http://localhost:5000/api/seed',
  });
});

// POST /api/seed — run the seed
router.post('/', async (req, res) => {
  try {
    // Wipe ALL pets so we always start clean
    await Pet.deleteMany({});

    // Wipe and recreate seed sellers to ensure fixed IDs
    await User.deleteMany({ email: { $in: SELLERS.map(s => s.email) } });
    
    const sellerDocs = [];
    for (const s of SELLERS) {
      const doc = await User.create(s);
      sellerDocs.push(doc);
    }

    // Create pets
    const pets = [];
    for (const p of PETS_DATA) {
      const pet = await Pet.create({
        name: p.name, species: p.species, breed: p.breed, age: p.age,
        ageUnit: "months", gender: p.gender, price: p.price,
        imageUrl: p.imageUrl, description: p.description,
        vaccinated: p.vaccinated, neutered: p.neutered, location: p.location,
        adoptionType: p.adoptionType, seller: sellerDocs[p.si]._id,
        isApproved: true, status: "available", stars: p.stars, reviews: p.reviews
      });
      pets.push(pet.name);
    }

    res.json({
      success: true,
      message: `✅ Seeded ${pets.length} pets with ${sellerDocs.length} sellers!`,
      pets,
      sellerLogins: SELLERS.map(s => ({ email: s.email, password: s.password })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
