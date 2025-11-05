import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  getRestaurantById,
  getRestaurantMenus,
} from "../../../lib/services/restaurantService";
import { MenuItem, Restaurant } from "../../../types/food-delivery";
import { useCart } from "../../../lib/presentation/state/CartProvider";

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const {
    addToCart,
    getItemQuantity,
    updateQuantity,
    removeFromCart,
    cartItems,
  } = useCart();

  const menuCategories = [
    { id: "all", name: "ทั้งหมด", icon: "🍽️" },
    { id: "main", name: "จานหลัก", icon: "🍛" },
    { id: "appetizer", name: "เเกล้ม", icon: "🥗" },
    { id: "dessert", name: "ของหวาน", icon: "🍰" },
    { id: "drink", name: "เครื่องดื่ม", icon: "🥤" },
  ];

  const loadRestaurantData = async () => {
    try {
      setLoading(true);
      const [restaurantData, menusData] = await Promise.all([
        getRestaurantById(id as string),
        getRestaurantMenus(id as string),
      ]);
      setRestaurant(restaurantData);
      setMenus(menusData);
    } catch (error: any) {
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลได้");
      console.error("Error loading restaurant:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadRestaurantData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const filteredMenus =
    selectedCategory === "all"
      ? menus
      : menus.filter((menu) => menu.category === selectedCategory);

  const handleAddToCart = (menu: MenuItem) => {
    if (!restaurant) return;

    addToCart(
      menu,
      restaurant.id,
      restaurant.name,
      restaurant.deliveryFee || 0,
      1
    );
  };

  const handleIncreaseQuantity = (menu: MenuItem) => {
    if (!restaurant) return;

    const currentQty = getItemQuantity(menu.id);
    if (currentQty > 0) {
      // Find the cart item to update
      const cartItem = cartItems.find(
        (item) => item.menuId === menu.id && item.restaurantId === restaurant.id
      );
      if (cartItem) {
        updateQuantity(cartItem.id, currentQty + 1);
      }
    } else {
      addToCart(
        menu,
        restaurant.id,
        restaurant.name,
        restaurant.deliveryFee || 0,
        1
      );
    }
  };

  const handleDecreaseQuantity = (menuId: string) => {
    if (!restaurant) return;

    const currentQty = getItemQuantity(menuId);
    const cartItem = cartItems.find(
      (item) => item.menuId === menuId && item.restaurantId === restaurant.id
    );

    if (!cartItem) return;

    if (currentQty > 1) {
      updateQuantity(cartItem.id, currentQty - 1);
    } else if (currentQty === 1) {
      removeFromCart(cartItem.id);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>กำลังโหลด...</Text>
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>ไม่พบข้อมูลร้านอาหาร</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>กลับ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{restaurant.name}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView>
        {/* Restaurant Image */}
        <Image source={{ uri: restaurant.image }} style={styles.image} />

        {/* Restaurant Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.description}>{restaurant.description}</Text>

          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>⭐</Text>
              <Text style={styles.metaText}>{restaurant.rating}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>🕐</Text>
              <Text style={styles.metaText}>{restaurant.deliveryTime}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>🛵</Text>
              <Text style={styles.metaText}>฿{restaurant.deliveryFee}</Text>
            </View>
          </View>

          <View style={styles.addressContainer}>
            <Text style={styles.addressIcon}>📍</Text>
            <Text style={styles.addressText}>{restaurant.address}</Text>
          </View>

          <Text style={styles.minimumText}>
            ขั้นต่ำ ฿{restaurant.minimumOrder}
          </Text>
        </View>

        {/* Menu Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {menuCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Menu List */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>เมนูอาหาร</Text>
          {filteredMenus.length === 0 ? (
            <View style={styles.emptyMenuContainer}>
              <Text style={styles.emptyMenuText}>ไม่มีเมนูในหมวดหมู่นี้</Text>
            </View>
          ) : (
            filteredMenus.map((menu) => {
              const quantity = getItemQuantity(menu.id);

              return (
                <View key={menu.id} style={styles.menuCard}>
                  <Image
                    source={{ uri: menu.image }}
                    style={styles.menuImage}
                  />
                  <View style={styles.menuInfo}>
                    <Text style={styles.menuName}>{menu.name}</Text>
                    <Text style={styles.menuDescription} numberOfLines={2}>
                      {menu.description}
                    </Text>
                    <View style={styles.menuFooter}>
                      <Text style={styles.menuPrice}>฿{menu.price}</Text>
                      {menu.isPopular && (
                        <View style={styles.popularBadge}>
                          <Text style={styles.popularText}>🔥 ยอดนิยม</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {quantity === 0 ? (
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => handleAddToCart(menu)}
                    >
                      <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleDecreaseQuantity(menu.id)}
                      >
                        <Text style={styles.quantityButtonText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{quantity}</Text>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleIncreaseQuantity(menu)}
                      >
                        <Text style={styles.quantityButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  headerButtonText: {
    fontSize: 24,
    color: "#333",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  placeholder: {
    width: 40,
  },
  image: {
    width: "100%",
    height: 250,
    backgroundColor: "#e0e0e0",
  },
  infoContainer: {
    backgroundColor: "white",
    padding: 20,
    marginBottom: 10,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
    lineHeight: 24,
  },
  metaContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  metaIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  metaText: {
    fontSize: 14,
    color: "#666",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  addressIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  minimumText: {
    fontSize: 14,
    color: "#FF9500",
    fontWeight: "600",
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "white",
    marginBottom: 10,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  categoryChipActive: {
    backgroundColor: "#007AFF",
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
  },
  categoryTextActive: {
    color: "white",
    fontWeight: "600",
  },
  menuContainer: {
    backgroundColor: "white",
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  emptyMenuContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyMenuText: {
    fontSize: 16,
    color: "#999",
  },
  menuCard: {
    flexDirection: "row",
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
  },
  menuImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
  },
  menuInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  menuName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  menuFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
    marginRight: 8,
  },
  popularBadge: {
    backgroundColor: "#FFE5E5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  popularText: {
    fontSize: 12,
    color: "#FF3B30",
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  addButtonText: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 18,
    paddingHorizontal: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginHorizontal: 12,
    minWidth: 24,
    textAlign: "center",
  },
});
