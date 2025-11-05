import { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Animated,
  RefreshControl,
} from "react-native";
import { router, useNavigation } from "expo-router";
import { getAllRestaurants } from "../../lib/services/restaurantService";
import { Restaurant } from "../../types/food-delivery";
import SeedButton from "../../components/SeedButton";
import { useCart } from "../../lib/presentation/state/CartProvider";

export default function RestaurantsScreen() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-300)); // Start from left
  const [tabBarTranslateY] = useState(new Animated.Value(0)); // For tab bar animation

  const navigation = useNavigation();
  const lastScrollY = useRef(0);
  const scrollDirection = useRef<"up" | "down">("down");
  const isTabBarHidden = useRef(false);

  const { itemCount } = useCart();

  const categories = [
    { id: "all", name: "ทั้งหมด", icon: "🍽️" },
    { id: "thai", name: "อาหารไทย", icon: "🌶️" },
    { id: "japanese", name: "ญี่ปุ่น", icon: "🍣" },
    { id: "western", name: "ฝรั่ง", icon: "🍔" },
    { id: "chinese", name: "จีน", icon: "🥟" },
    { id: "cafe", name: "คาเฟ่", icon: "☕" },
  ];

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    let filtered = restaurants;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((r) => r.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((r) =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredRestaurants(filtered);
  }, [selectedCategory, searchQuery, restaurants]);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const data = await getAllRestaurants();
      setRestaurants(data);
      setFilteredRestaurants(data);
    } catch (error: any) {
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลร้านอาหารได้");
      console.error("Error loading restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const data = await getAllRestaurants();
      setRestaurants(data);
      setFilteredRestaurants(data);
    } catch (error: any) {
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลร้านอาหารได้");
      console.error("Error refreshing restaurants:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setDrawerOpen(false);
    });
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const delta = currentScrollY - lastScrollY.current;

    // Only hide/show if scrolled more than 5px (reduced for smoother response)
    if (Math.abs(delta) > 5) {
      if (delta > 0 && currentScrollY > 30) {
        // Scrolling down & past threshold
        if (!isTabBarHidden.current) {
          isTabBarHidden.current = true;
          scrollDirection.current = "down";

          // Smooth animation
          Animated.timing(tabBarTranslateY, {
            toValue: 100, // Move tab bar down (hide)
            duration: 200,
            useNativeDriver: true,
          }).start();

          navigation.setOptions({
            tabBarStyle: {
              position: "absolute",
              transform: [{ translateY: 100 }],
              backgroundColor: "white",
            },
          });
        }
      } else if (delta < 0 || currentScrollY < 30) {
        // Scrolling up or near top
        if (isTabBarHidden.current) {
          isTabBarHidden.current = false;
          scrollDirection.current = "up";

          // Smooth animation
          Animated.timing(tabBarTranslateY, {
            toValue: 0, // Move tab bar back up (show)
            duration: 200,
            useNativeDriver: true,
          }).start();

          navigation.setOptions({
            tabBarStyle: {
              position: "absolute",
              transform: [{ translateY: 0 }],
              backgroundColor: "white",
            },
          });
        }
      }
      lastScrollY.current = currentScrollY;
    }
  };

  const renderRestaurantCard = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity
      style={styles.restaurantCard}
      onPress={() => {
        router.push(`/(main)/restaurant/${item.id}`);
      }}
    >
      <Image source={{ uri: item.image }} style={styles.restaurantImage} />

      {!item.isOpen && (
        <View style={styles.closedOverlay}>
          <Text style={styles.closedText}>ปิดแล้ว</Text>
        </View>
      )}

      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{item.name}</Text>

        <View style={styles.restaurantMeta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>⭐</Text>
            <Text style={styles.metaText}>{item.rating}</Text>
          </View>

          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>🕐</Text>
            <Text style={styles.metaText}>{item.deliveryTime}</Text>
          </View>

          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>🛵</Text>
            <Text style={styles.metaText}>฿{item.deliveryFee}</Text>
          </View>
        </View>

        <Text style={styles.minimumOrder}>ขั้นต่ำ ฿{item.minimumOrder}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Drawer Menu */}
      <Modal
        visible={drawerOpen}
        animationType="none"
        transparent={true}
        onRequestClose={closeDrawer}
      >
        <TouchableOpacity
          style={styles.drawerOverlay}
          activeOpacity={1}
          onPress={closeDrawer}
        >
          <Animated.View
            style={[
              styles.drawerContainer,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>📋 เมนู</Text>
              <TouchableOpacity onPress={closeDrawer}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => {
                closeDrawer();
                // Stay on current screen
              }}
            >
              <Text style={styles.drawerItemIcon}>🍽️</Text>
              <Text style={styles.drawerItemText}>ร้านอาหารทั้งหมด</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => {
                closeDrawer();
                router.push("/(main)/add-restaurant");
              }}
            >
              <Text style={styles.drawerItemIcon}>➕</Text>
              <Text style={styles.drawerItemText}>เพิ่มร้านอาหาร</Text>
            </TouchableOpacity>

            <View style={styles.drawerDivider} />

            <View style={styles.seedButtonContainer}>
              <SeedButton />
            </View>

            <View style={styles.drawerDivider} />

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => {
                closeDrawer();
                loadRestaurants();
              }}
            >
              <Text style={styles.drawerItemIcon}>🔄</Text>
              <Text style={styles.drawerItemText}>รีเฟรชข้อมูล</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ร้านอาหาร</Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => {
            router.push("/(main)/cart");
          }}
        >
          <Text style={styles.cartIcon}>🛒</Text>
          {itemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>
                {itemCount > 99 ? "99+" : itemCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="ค้นหาร้านอาหาร..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive,
            ]}
            onPress={() => handleCategoryPress(category.id)}
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

      {/* Restaurants List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>กำลังโหลดร้านอาหาร...</Text>
        </View>
      ) : filteredRestaurants.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🍽️</Text>
          <Text style={styles.emptyText}>ไม่พบร้านอาหาร</Text>
          <TouchableOpacity
            style={styles.reloadButton}
            onPress={loadRestaurants}
          >
            <Text style={styles.reloadButtonText}>โหลดใหม่</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredRestaurants}
          renderItem={renderRestaurantCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={8}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={8}
          windowSize={10}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#007AFF"]}
              tintColor="#007AFF"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "white",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  greeting: {
    fontSize: 16,
    color: "#666",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  cartButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cartIcon: {
    fontSize: 24,
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: "white",
  },
  cartBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    margin: 20,
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
    height: 50,
    minHeight: 50,
    maxHeight: 50,
  },
  categoriesContent: {
    alignItems: "center",
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 24,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  categoryChipActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 6,
    lineHeight: 20, // Adjusted line height
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20, // Adjusted line height
  },
  categoryTextActive: {
    color: "white",
    fontWeight: "600",
  },
  listContainer: {
    padding: 20,
    paddingTop: 10,
  },
  restaurantCard: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  restaurantImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#f0f0f0",
  },
  closedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 100,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  closedText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  restaurantInfo: {
    padding: 16,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  restaurantMeta: {
    flexDirection: "row",
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  metaIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  metaText: {
    fontSize: 14,
    color: "#666",
  },
  minimumOrder: {
    fontSize: 12,
    color: "#999",
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
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  addButtonInline: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  addButtonInlineText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  reloadButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  reloadButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  // Drawer styles
  drawerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
  },
  drawerContainer: {
    width: "80%",
    height: "100%",
    backgroundColor: "white",
    paddingTop: 60,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  closeButton: {
    fontSize: 28,
    color: "#666",
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  drawerItemIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  drawerItemText: {
    fontSize: 16,
    color: "#333",
  },
  drawerDivider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },
  seedButtonContainer: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 28,
    color: "#333",
  },
});
