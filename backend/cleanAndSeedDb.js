require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Pet = require('./models/Pet');
const Application = require('./models/Application');
const Order = require('./models/Order');

const STATIC_PETS = [
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
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // 1. Wipe old data
    await Pet.deleteMany({});
    await Application.deleteMany({});
    await Order.deleteMany({});

    // Keep ONLY key user/admin accounts
    await User.deleteMany({ email: { $nin: ['bhavi@gmail.com', 'admin@gmail.com', 'dhanu@admin.com', 'adarsha@gmail.com'] } });
    console.log('Cleared old pets, applications, and non-essential users.');

    // 2. Create/Verify Sellers with fixed ObjectIds (matching static pets)
    const salt = await bcrypt.genSalt(10);
    const pwd = await bcrypt.hash('123456', salt);

    const sellers = [
      { _id: new mongoose.Types.ObjectId("6a26518f80ca145ca06f6f2b"), name: "Paws & Claws Rescue", email: "seller1@test.com", password: pwd, role: "seller", shopName: "Paws & Claws Rescue", isApproved: true },
      { _id: new mongoose.Types.ObjectId("6a26518f80ca145ca06f6f2c"), name: "Happy Tails Shelter", email: "seller2@test.com", password: pwd, role: "seller", shopName: "Happy Tails Shelter", isApproved: true },
      { _id: new mongoose.Types.ObjectId("6a26518f80ca145ca06f6f2d"), name: "Furry Friends Foster", email: "seller3@test.com", password: pwd, role: "seller", shopName: "Furry Friends Foster", isApproved: true }
    ];

    const createdSellers = [];
    for (const s of sellers) {
      let doc = await User.findById(s._id);
      if (!doc) doc = await User.findOne({ email: s.email });
      if (!doc) {
        doc = await User.create(s);
      } else {
        doc.password = pwd;
        doc.role = "seller";
        doc.shopName = s.shopName;
        doc.isApproved = true;
        await doc.save();
      }
      createdSellers.push(doc);
    }
    console.log(`Verified/created ${createdSellers.length} sellers.`);

    // 3. Insert Pets
    const petsToInsert = STATIC_PETS.map((pet) => {
      const seller = createdSellers[pet.sellerIdx]._id;
      return {
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
        ageUnit: pet.ageUnit,
        gender: pet.gender,
        price: pet.price,
        imageUrl: pet.imageUrl,
        description: pet.description,
        vaccinated: true,
        neutered: true,
        location: "Local",
        adoptionType: pet.adoptionType,
        seller,
        isApproved: true,
        status: 'available',
        stars: pet.stars,
        reviews: pet.reviews
      };
    });

    const result = await Pet.insertMany(petsToInsert);
    console.log(`Inserted ${result.length} distinct pets as real DB pets.`);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
