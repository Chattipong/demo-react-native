// Sample data for Food Delivery App
// Run this once to populate Firestore with test data

import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

const sampleRestaurants = [
  {
    name: "ร้านส้มตำนัวแท้",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400",
    coverImage:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    category: "thai",
    rating: 4.8,
    deliveryTime: "20-30 นาที",
    deliveryFee: 15,
    minimumOrder: 50,
    isOpen: true,
    address: "123 ถนนสุขุมวิท กรุงเทพฯ",
  },
  {
    name: "Sushi Master",
    image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400",
    coverImage:
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800",
    category: "japanese",
    rating: 4.7,
    deliveryTime: "30-40 นาที",
    deliveryFee: 25,
    minimumOrder: 80,
    isOpen: true,
    address: "456 ถนนสีลม กรุงเทพฯ",
  },
  {
    name: "Pizza Palace",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
    coverImage:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
    category: "western",
    rating: 4.5,
    deliveryTime: "25-35 นาที",
    deliveryFee: 20,
    minimumOrder: 60,
    isOpen: true,
    address: "789 ถนนพระราม 4 กรุงเทพฯ",
  },
  {
    name: "ก๋วยเตี๋ยวเรือคุณยาย",
    image: "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=400",
    coverImage:
      "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=800",
    category: "thai",
    rating: 4.9,
    deliveryTime: "15-25 นาที",
    deliveryFee: 10,
    minimumOrder: 40,
    isOpen: true,
    address: "321 ถนนเพชรบุรี กรุงเทพฯ",
  },
  {
    name: "Burger House",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400",
    coverImage:
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800",
    category: "western",
    rating: 4.6,
    deliveryTime: "20-30 นาที",
    deliveryFee: 18,
    minimumOrder: 55,
    isOpen: true,
    address: "555 ถนนรัชดาภิเษก กรุงเทพฯ",
  },
  {
    name: "Café de Paris",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400",
    coverImage:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800",
    category: "cafe",
    rating: 4.4,
    deliveryTime: "15-20 นาที",
    deliveryFee: 12,
    minimumOrder: 45,
    isOpen: true,
    address: "888 ถนนทองหล่อ กรุงเทพฯ",
  },
];

const sampleMenusByCategory = {
  thai: [
    {
      name: "ส้มตำไทย",
      description: "ส้มตำรสชาติเด็ด ปรุงสดใหม่ทุกวัน",
      price: 45,
      image:
        "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=300",
      category: "main",
      isAvailable: true,
      isPopular: true,
    },
    {
      name: "ลาบหมู",
      description: "ลาบหมูสับรสเด็ด เครื่องเทศแน่น",
      price: 55,
      image:
        "https://images.unsplash.com/photo-1604908815546-7a2e83e8674a?w=300",
      category: "main",
      isAvailable: true,
      isPopular: true,
    },
    {
      name: "ข้าวเหนียว",
      description: "ข้าวเหนียวนุ่ม หอม อร่อย",
      price: 10,
      image:
        "https://images.unsplash.com/photo-1612836376928-c2ce3bbe5b53?w=300",
      category: "side",
      isAvailable: true,
      isPopular: false,
    },
    {
      name: "ก๋วยเตี๋ยวเรือ",
      description: "ก๋วยเตี๋ยวเรือน้ำใส รสชาติแซ่บ",
      price: 50,
      image:
        "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=300",
      category: "main",
      isAvailable: true,
      isPopular: true,
    },
  ],
  japanese: [
    {
      name: "Salmon Sushi Set",
      description: "แซลมอนสดใหม่ 8 ชิ้น",
      price: 180,
      image:
        "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300",
      category: "main",
      isAvailable: true,
      isPopular: true,
    },
    {
      name: "California Roll",
      description: "แคลิฟอร์เนีย โรล 8 ชิ้น",
      price: 150,
      image:
        "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300",
      category: "main",
      isAvailable: true,
      isPopular: true,
    },
    {
      name: "Ramen Original",
      description: "ราเมงต้นตำรับ น้ำซุปเข้มข้น",
      price: 120,
      image:
        "https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=300",
      category: "main",
      isAvailable: true,
      isPopular: false,
    },
    {
      name: "Miso Soup",
      description: "ซุปมิโสะ รสชาติกลมกล่อม",
      price: 40,
      image:
        "https://images.unsplash.com/photo-1606850780554-b55ef70346ef?w=300",
      category: "appetizer",
      isAvailable: true,
      isPopular: false,
    },
  ],
  western: [
    {
      name: "Pepperoni Pizza",
      description: "พิซซ่าเปปเปอโรนี่ ชีสเยิ้ม",
      price: 199,
      image:
        "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300",
      category: "main",
      isAvailable: true,
      isPopular: true,
    },
    {
      name: "Classic Burger",
      description: "เบอร์เกอร์คลาสสิก เนื้อชั้นดี",
      price: 129,
      image:
        "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=300",
      category: "main",
      isAvailable: true,
      isPopular: true,
    },
    {
      name: "French Fries",
      description: "เฟรนช์ฟรายส์กรอบอร่อย",
      price: 49,
      image:
        "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=300",
      category: "side",
      isAvailable: true,
      isPopular: false,
    },
    {
      name: "Iced Coffee",
      description: "กาแฟเย็น รสชาติเข้มข้น",
      price: 55,
      image:
        "https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=300",
      category: "drink",
      isAvailable: true,
      isPopular: false,
    },
  ],
  cafe: [
    {
      name: "Latte",
      description: "ลาเต้หอมนุ่ม ครีมมี่",
      price: 65,
      image:
        "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=300",
      category: "drink",
      isAvailable: true,
      isPopular: true,
    },
    {
      name: "Croissant",
      description: "ครัวซองต์เนยสด กรอบนุ่ม",
      price: 45,
      image:
        "https://images.unsplash.com/photo-1623334044303-241021148842?w=300",
      category: "dessert",
      isAvailable: true,
      isPopular: true,
    },
    {
      name: "Cheesecake",
      description: "ชีสเค้กนิวยอร์ก หวานน้อย",
      price: 85,
      image:
        "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=300",
      category: "dessert",
      isAvailable: true,
      isPopular: false,
    },
  ],
};

export const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seed...");

    // Add restaurants and their menus
    for (const restaurant of sampleRestaurants) {
      const restaurantRef = await addDoc(collection(db, "restaurants"), {
        ...restaurant,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      console.log(`✅ Added restaurant: ${restaurant.name}`);

      // Add menus for this restaurant
      const menus =
        sampleMenusByCategory[
          restaurant.category as keyof typeof sampleMenusByCategory
        ] || [];

      for (const menu of menus) {
        await addDoc(collection(db, "restaurants", restaurantRef.id, "menus"), {
          ...menu,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      }

      console.log(`  ✅ Added ${menus.length} menus`);
    }

    console.log("🎉 Database seed completed!");
    console.log(`📊 Total: ${sampleRestaurants.length} restaurants added`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
};

// Note: Call this function once from your app or run it separately
// Example: seedDatabase().then(() => console.log('Done!'));
