import hdLabrador   from "../Assets/Images/hd_labrador.png";
import hdShorthair  from "../Assets/Images/hd_british_shorthair.png";
import hdCorgi      from "../Assets/Images/hd_corgi.png";
import hdPersian    from "../Assets/Images/hd_persian_cat.png";
import hdGolden     from "../Assets/Images/hd_golden_retriever.png";
import hdMaltese    from "../Assets/Images/hd_maltese.png";
import hdBeagle     from "../Assets/Images/hd_beagle.png";
import hdPomeranian from "../Assets/Images/hd_pomeranian.png";

export const FALLBACK_IMGS = {
  dog: hdGolden,
  cat: hdPersian,
};

/* ── 3 Sellers ─────────────────────────────────────────────── */
const s1 = { _id: "6a26518f80ca145ca06f6f2b", name: "Paws & Claws",  email: "seller1@test.com", shopName: "Paws & Claws"  };
const s2 = { _id: "6a26518f80ca145ca06f6f2c", name: "Happy Tails",   email: "seller2@test.com", shopName: "Happy Tails"   };
const s3 = { _id: "6a26518f80ca145ca06f6f2d", name: "Furry Friends", email: "seller3@test.com", shopName: "Furry Friends" };

/* ── 15 Pets: 5 per seller (dogs & cats only) ──────────────── */
export const STATIC_PETS = [
  /* ═══ Seller 1 – Paws & Claws (5 pets) ═══════════════ */
  {
    _id: "s101", name: "Bruno", breed: "Labrador Retriever", species: "dog",
    imageUrl: "/images/hd_labrador.png",
    age: 24, ageUnit: "months", gender: "male", price: 0,
    stars: 5, reviews: 48, adoptionType: "adoption",
    description: "Friendly & energetic Labrador, great with kids. Loves fetch and swimming.",
    vaccinated: true, neutered: true, location: "Chennai", seller: s1,
  },
  {
    _id: "s102", name: "Luna", breed: "Persian Cat", species: "cat",
    imageUrl: "/images/hd_persian_cat.png",
    age: 36, ageUnit: "months", gender: "female", price: 0,
    stars: 4, reviews: 29, adoptionType: "adoption",
    description: "Elegant Persian with a silky long coat. Loves grooming sessions and warm cuddles.",
    vaccinated: true, neutered: true, location: "Chennai", seller: s1,
  },
  {
    _id: "s103", name: "Charlie", breed: "Beagle", species: "dog",
    imageUrl: "/images/hd_beagle.png",
    age: 4, ageUnit: "months", gender: "male", price: 0,
    stars: 5, reviews: 41, adoptionType: "adoption",
    description: "Curious and sociable pup with an amazing nose.",
    vaccinated: true, neutered: true, location: "Pune", seller: s1,
  },
  {
    _id: "s104", name: "Lily", breed: "Persian Mix", species: "cat",
    imageUrl: "/images/hd_persian_cat.png",
    age: 60, ageUnit: "months", gender: "female", price: 0,
    stars: 4, reviews: 27, adoptionType: "adoption",
    description: "Senior beauty who deserves a warm and quiet home.",
    vaccinated: true, neutered: true, location: "Local", seller: s1,
  },
  {
    _id: "s105", name: "Duke", breed: "Beagle Mix", species: "dog",
    imageUrl: "/images/hd_beagle.png",
    age: 7, ageUnit: "months", gender: "male", price: 0,
    stars: 5, reviews: 38, adoptionType: "adoption",
    description: "Adventurous pup always ready for the next walk.",
    vaccinated: true, neutered: true, location: "Local", seller: s1,
  },

  /* ═══ Seller 2 – Happy Tails (5 pets) ══════════════════ */
  {
    _id: "s106", name: "Milo", breed: "British Shorthair", species: "cat",
    imageUrl: "/images/hd_british_shorthair.png",
    age: 12, ageUnit: "months", gender: "male", price: 0,
    stars: 4, reviews: 36, adoptionType: "adoption",
    description: "Calm and affectionate cat, loves cozy indoor life.",
    vaccinated: true, neutered: true, location: "Bangalore", seller: s2,
  },
  {
    _id: "s107", name: "Max", breed: "Golden Retriever", species: "dog",
    imageUrl: "/images/hd_golden_retriever.png",
    age: 6, ageUnit: "months", gender: "male", price: 0,
    stars: 5, reviews: 91, adoptionType: "adoption",
    description: "Adorable Golden Retriever puppy full of love and eager to learn new tricks.",
    vaccinated: true, neutered: true, location: "Bangalore", seller: s2,
  },
  {
    _id: "s108", name: "Coco", breed: "Pomeranian", species: "dog",
    imageUrl: "/images/hd_pomeranian.png",
    age: 24, ageUnit: "months", gender: "female", price: 0,
    stars: 5, reviews: 73, adoptionType: "adoption",
    description: "Fluffy ball of energy that loves attention and play.",
    vaccinated: true, neutered: true, location: "Mumbai", seller: s2,
  },
  {
    _id: "s109", name: "Buddy", breed: "Golden Retriever", species: "dog",
    imageUrl: "/images/hd_golden_retriever.png",
    age: 12, ageUnit: "months", gender: "male", price: 0,
    stars: 5, reviews: 88, adoptionType: "adoption",
    description: "Your perfect everyday companion — happy and loyal.",
    vaccinated: true, neutered: true, location: "Local", seller: s2,
  },
  {
    _id: "s110", name: "Daisy", breed: "Pomeranian Mix", species: "dog",
    imageUrl: "/images/hd_pomeranian.png",
    age: 36, ageUnit: "months", gender: "female", price: 0,
    stars: 5, reviews: 66, adoptionType: "adoption",
    description: "Loveable fluffball who gets along with everyone.",
    vaccinated: true, neutered: true, location: "Local", seller: s2,
  },

  /* ═══ Seller 3 – Furry Friends (5 pets) ═════════════ */
  {
    _id: "s111", name: "Rocky", breed: "Pembroke Corgi", species: "dog",
    imageUrl: "/images/hd_corgi.png",
    age: 8, ageUnit: "months", gender: "male", price: 0,
    stars: 5, reviews: 62, adoptionType: "adoption",
    description: "Playful herder with a big personality in a small body.",
    vaccinated: true, neutered: true, location: "Chennai", seller: s3,
  },
  {
    _id: "s112", name: "Bella", breed: "Maltese", species: "dog",
    imageUrl: "/images/hd_maltese.png",
    age: 18, ageUnit: "months", gender: "female", price: 0,
    stars: 5, reviews: 55, adoptionType: "adoption",
    description: "Sweet and gentle Maltese, perfect for apartment living.",
    vaccinated: true, neutered: true, location: "Hyderabad", seller: s3,
  },
  {
    _id: "s113", name: "Oscar", breed: "Labrador Mix", species: "dog",
    imageUrl: "/images/hd_labrador.png",
    age: 36, ageUnit: "months", gender: "male", price: 0,
    stars: 5, reviews: 33, adoptionType: "adoption",
    description: "Calm and loyal companion, ideal for all home types.",
    vaccinated: true, neutered: true, location: "Local", seller: s3,
  },
  {
    _id: "s114", name: "Stella", breed: "British Shorthair", species: "cat",
    imageUrl: "/images/hd_british_shorthair.png",
    age: 24, ageUnit: "months", gender: "female", price: 0,
    stars: 4, reviews: 42, adoptionType: "adoption",
    description: "Quiet and independent, loves sunny window spots.",
    vaccinated: true, neutered: true, location: "Local", seller: s3,
  },
  {
    _id: "s115", name: "Toby", breed: "Corgi Mix", species: "dog",
    imageUrl: "/images/hd_corgi.png",
    age: 12, ageUnit: "months", gender: "male", price: 0,
    stars: 5, reviews: 52, adoptionType: "adoption",
    description: "Smart, fun and full of corgi charm — loves agility.",
    vaccinated: true, neutered: true, location: "Local", seller: s3,
  },
];
