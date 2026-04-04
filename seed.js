import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URL;

const products = [
  {
    name: "Men's Kurta",
    price: 999,
    category: "indian",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
    description: "Comfortable cotton kurta",
    featured: true,
    createdAt: new Date(),
  },
  {
    name: "Women's Saree",
    price: 1999,
    category: "indian",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
    description: "Elegant silk saree",
    featured: true,
    createdAt: new Date(),
  },
  {
    name: "Casual T-Shirt",
    price: 499,
    category: "western",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
    description: "Soft cotton t-shirt",
    featured: false,
    createdAt: new Date(),
  },
  {
    name: "Jeans",
    price: 1499,
    category: "western",
   image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
    description: "Slim fit jeans",
    featured: true,
    createdAt: new Date(),
  }
];

async function seed() {
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db("wasp_ecommerce");
  const collection = db.collection("products");

  await collection.deleteMany(); // optional: clear old data
  await collection.insertMany(products);

  console.log("✅ Data seeded successfully");

  await client.close();
}

seed();