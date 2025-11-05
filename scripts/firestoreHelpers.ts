import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// 🗑️ Clear all data from a collection
export const clearCollection = async (collectionName: string) => {
  try {
    console.log(`🗑️ Clearing collection: ${collectionName}`);
    const querySnapshot = await getDocs(collection(db, collectionName));

    const deletePromises = querySnapshot.docs.map((document) =>
      deleteDoc(doc(db, collectionName, document.id))
    );

    await Promise.all(deletePromises);
    console.log(
      `✅ Cleared ${querySnapshot.docs.length} documents from ${collectionName}`
    );
  } catch (error) {
    console.error(`❌ Error clearing ${collectionName}:`, error);
    throw error;
  }
};

// 🗑️ Clear all restaurants and their menus
export const clearRestaurants = async () => {
  try {
    console.log("🗑️ Clearing all restaurants...");
    const restaurantsSnapshot = await getDocs(collection(db, "restaurants"));

    for (const restaurantDoc of restaurantsSnapshot.docs) {
      // Clear menus subcollection first
      const menusSnapshot = await getDocs(
        collection(db, "restaurants", restaurantDoc.id, "menus")
      );

      const menuDeletePromises = menusSnapshot.docs.map((menuDoc) =>
        deleteDoc(doc(db, "restaurants", restaurantDoc.id, "menus", menuDoc.id))
      );

      await Promise.all(menuDeletePromises);
      console.log(
        `  🗑️ Cleared ${menusSnapshot.docs.length} menus from ${
          restaurantDoc.data().name
        }`
      );

      // Delete restaurant
      await deleteDoc(doc(db, "restaurants", restaurantDoc.id));
    }

    console.log(`✅ Cleared ${restaurantsSnapshot.docs.length} restaurants`);
  } catch (error) {
    console.error("❌ Error clearing restaurants:", error);
    throw error;
  }
};

// 📊 Get collection stats
export const getCollectionStats = async (collectionName: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    console.log(`📊 ${collectionName}: ${querySnapshot.docs.length} documents`);
    return querySnapshot.docs.length;
  } catch (error) {
    console.error(`❌ Error getting stats for ${collectionName}:`, error);
    throw error;
  }
};

// 📊 Get all database stats
export const getAllStats = async () => {
  try {
    console.log("📊 Getting database statistics...");

    const collections = ["restaurants", "orders", "users"];
    const stats: Record<string, number> = {};

    for (const collectionName of collections) {
      stats[collectionName] = await getCollectionStats(collectionName);
    }

    return stats;
  } catch (error) {
    console.error("❌ Error getting database stats:", error);
    throw error;
  }
};

// 🔄 Reset database (clear and reseed)
export const resetDatabase = async () => {
  try {
    console.log("🔄 Resetting database...");

    // Clear existing data
    await clearRestaurants();
    await clearCollection("orders");

    // Reseed
    const { seedDatabase } = await import("./seedData");
    await seedDatabase();

    console.log("🎉 Database reset completed!");
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    throw error;
  }
};
