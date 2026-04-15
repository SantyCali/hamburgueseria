import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useCart } from "../context/CartContext";
import { burgers } from "../data/burgers";

const { width } = Dimensions.get("window");

const ARC_ITEM_SIZE = 62;
const ARC_ITEM_SPACING = 78;
const ARC_CENTER_OFFSET = (width - ARC_ITEM_SIZE) / 2;

export default function DetailScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const product = route.params?.burger ?? burgers[0];

  const categoryProducts = useMemo(() => {
    return burgers.filter((item) => item.category === product.category);
  }, [product.category]);

  const safeProducts =
    categoryProducts.length > 0 ? categoryProducts : [product];

  const initialIndex = safeProducts.findIndex((item) => item.id === product.id);
  const safeInitialIndex = initialIndex >= 0 ? initialIndex : 0;

  const [currentIndex, setCurrentIndex] = useState(safeInitialIndex);
  const [selectedBurger, setSelectedBurger] = useState(
    safeProducts[safeInitialIndex]
  );
  const [qty, setQty] = useState(1);

  const { addToCart, cartCount } = useCart();

  const flatListRef = useRef(null);
  const scrollX = useRef(
    new Animated.Value(safeInitialIndex * ARC_ITEM_SPACING)
  ).current;

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setSelectedBurger(safeProducts[safeInitialIndex]);
    setCurrentIndex(safeInitialIndex);
    setQty(1);
    scrollX.setValue(safeInitialIndex * ARC_ITEM_SPACING);

    requestAnimationFrame(() => {
      flatListRef.current?.scrollToOffset({
        offset: safeInitialIndex * ARC_ITEM_SPACING,
        animated: false,
      });
    });
  }, [safeInitialIndex, safeProducts, scrollX]);

  function animateProductChange(nextProduct, nextIndex) {
    if (!nextProduct) return;

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0.35,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.94,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSelectedBurger(nextProduct);
      setCurrentIndex(nextIndex);
      setQty(1);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }

  function handleArcScrollEnd(event) {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / ARC_ITEM_SPACING);
    const safeIndex = Math.max(0, Math.min(index, safeProducts.length - 1));

    if (safeIndex !== currentIndex) {
      animateProductChange(safeProducts[safeIndex], safeIndex);
    }
  }

  function scrollToProduct(index) {
    if (index < 0 || index >= safeProducts.length) return;

    flatListRef.current?.scrollToOffset({
      offset: index * ARC_ITEM_SPACING,
      animated: true,
    });

    animateProductChange(safeProducts[index], index);
  }

  function increaseQty() {
    setQty((prev) => prev + 1);
  }

  function decreaseQty() {
    setQty((prev) => (prev > 1 ? prev - 1 : 1));
  }

  function handleAddToCart() {
    if (!selectedBurger) return;

    addToCart(selectedBurger, qty);
    Alert.alert("Éxito", `${selectedBurger.name} x${qty} agregado al carrito`);
  }

  if (!selectedBurger) {
    return (
      <View style={[styles.container, styles.emptyState]}>
        <Text style={styles.emptyTitle}>No se encontró el producto</Text>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.glowGreen} />
      <View style={styles.glowOrange} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(30, insets.top + 14),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Pressable
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color="#F5F5F5" />
          </Pressable>

          <Pressable
            style={styles.cartButton}
            onPress={() => navigation.navigate("Cart")}
          >
            <Feather name="shopping-bag" size={20} color="#F5F5F5" />

            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        <View style={styles.heroArea}>
          <Animated.View
            style={[
              styles.heroImageWrap,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Image
              source={{ uri: selectedBurger.image }}
              style={styles.heroBurger}
            />
          </Animated.View>

          <View style={styles.caloriesBadge}>
            <Text style={styles.caloriesFire}>🔥</Text>
            <Text style={styles.caloriesText}>
              {selectedBurger.calories ?? 86} Calories
            </Text>
          </View>
        </View>

        <View style={styles.qtyRow}>
          <Pressable onPress={increaseQty} style={styles.qtyBtn}>
            <Text style={styles.qtySymbol}>+</Text>
          </Pressable>

          <Text style={styles.qtyValue}>{qty}</Text>

          <Pressable onPress={decreaseQty} style={styles.qtyBtn}>
            <Text style={styles.qtySymbol}>−</Text>
          </Pressable>
        </View>

        <View style={styles.infoGlass}>
          <Text style={styles.title}>{selectedBurger.name}</Text>

          <Text style={styles.description}>
            {selectedBurger.description ||
              "Delicious product prepared with fresh ingredients and a beautiful presentation."}
          </Text>

          <View style={styles.metaRow}>
            <View>
              <Text style={styles.metaTitle}>Category</Text>
              <View style={styles.inlineRow}>
                <Ionicons name="grid-outline" size={15} color="#B8BBC5" />
                <Text style={styles.metaText}>{selectedBurger.category}</Text>
              </View>
            </View>

            <View style={styles.ratingWrap}>
              <View style={styles.inlineRow}>
                <Ionicons name="star" size={15} color="#FFFFFF" />
                <Text style={styles.ratingValue}>
                  {selectedBurger.rating ?? 4.5}
                </Text>
              </View>
              <Text style={styles.ratingSub}>
                ${selectedBurger.price ?? 199}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.arcSection}>
          <View style={styles.arcGlow} />
          <View style={styles.arcBase} />
          <View style={styles.arcInnerShadow} />

          <Animated.FlatList
            ref={flatListRef}
            data={safeProducts}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={ARC_ITEM_SPACING}
            decelerationRate="fast"
            bounces={false}
            contentContainerStyle={{
              paddingHorizontal: ARC_CENTER_OFFSET,
            }}
            style={styles.arcCarousel}
            onMomentumScrollEnd={handleArcScrollEnd}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
            renderItem={({ item, index }) => {
              const inputRange = [
                (index - 2) * ARC_ITEM_SPACING,
                (index - 1) * ARC_ITEM_SPACING,
                index * ARC_ITEM_SPACING,
                (index + 1) * ARC_ITEM_SPACING,
                (index + 2) * ARC_ITEM_SPACING,
              ];

              const translateY = scrollX.interpolate({
                inputRange,
                outputRange: [68, 32, -12, 32, 68],
                extrapolate: "clamp",
              });

              const scale = scrollX.interpolate({
                inputRange,
                outputRange: [0.48, 0.78, 1.24, 0.78, 0.48],
                extrapolate: "clamp",
              });

              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.18, 0.62, 1, 0.62, 0.18],
                extrapolate: "clamp",
              });

              const shadowOpacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.08, 0.16, 0.3, 0.16, 0.08],
                extrapolate: "clamp",
              });

              return (
                <Pressable onPress={() => scrollToProduct(index)}>
                  <Animated.View
                    style={[
                      styles.arcItem,
                      {
                        opacity,
                        transform: [{ translateY }, { scale }],
                        shadowOpacity,
                      },
                    ]}
                  >
                    <Image
                      source={{ uri: item.image }}
                      style={styles.arcItemImage}
                    />
                  </Animated.View>
                </Pressable>
              );
            }}
          />

          <View style={styles.moreDetails}>
            <Ionicons name="chevron-down" size={22} color="#FFFFFF" />
            <Text style={styles.moreDetailsText}>
              More {selectedBurger.category.toLowerCase()} options
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.addBtn} onPress={handleAddToCart}>
          <Text style={styles.addBtnText}>Agregar al carrito</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D10",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 130,
  },

  glowGreen: {
    position: "absolute",
    top: 110,
    left: 90,
    width: 170,
    height: 170,
    borderRadius: 999,
    backgroundColor: "rgba(80,255,92,0.07)",
    shadowColor: "#4CFF5C",
    shadowOpacity: 1,
    shadowRadius: 100,
  },

  glowOrange: {
    position: "absolute",
    bottom: 120,
    right: 90,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: "rgba(255,187,43,0.05)",
    shadowColor: "#FFB52B",
    shadowOpacity: 1,
    shadowRadius: 100,
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },

  cartButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FF5B5B",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  heroArea: {
    height: 270,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    position: "relative",
  },

  heroImageWrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -10,
  },

  heroBurger: {
    width: "94%",
    height: 245,
    resizeMode: "contain",
    borderRadius: 999,
  },

  caloriesBadge: {
    position: "absolute",
    right: 0,
    top: 62,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },

  caloriesFire: {
    fontSize: 14,
    marginRight: 6,
  },

  caloriesText: {
    color: "#F1F2F5",
    fontSize: 14,
    fontWeight: "600",
  },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
    marginBottom: 18,
  },

  qtyBtn: {
    minWidth: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  qtySymbol: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "500",
  },

  qtyValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    minWidth: 18,
    textAlign: "center",
  },

  infoGlass: {
    backgroundColor: "rgba(255,255,255,0.045)",
    borderRadius: 30,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    marginBottom: 28,
  },

  title: {
    color: "#F8F8FA",
    fontSize: 31,
    fontWeight: "800",
    marginBottom: 12,
  },

  description: {
    color: "#A7ABB7",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  metaTitle: {
    color: "#F4F4F7",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },

  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  metaText: {
    color: "#B8BBC5",
    fontSize: 14,
  },

  ratingWrap: {
    alignItems: "flex-end",
  },

  ratingValue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  ratingSub: {
    color: "#FF6A5C",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 6,
  },

  arcSection: {
    height: 255,
    marginTop: 8,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },

  arcGlow: {
    position: "absolute",
    top: 92,
    width: "92%",
    height: 105,
    borderTopLeftRadius: 220,
    borderTopRightRadius: 220,
    backgroundColor: "rgba(255,255,255,0.02)",
  },

  arcBase: {
    position: "absolute",
    top: 96,
    width: "96%",
    height: 126,
    borderTopLeftRadius: 240,
    borderTopRightRadius: 240,
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  arcInnerShadow: {
    position: "absolute",
    top: 110,
    width: "84%",
    height: 82,
    borderTopLeftRadius: 180,
    borderTopRightRadius: 180,
    backgroundColor: "rgba(0,0,0,0.08)",
  },

  arcCarousel: {
    position: "absolute",
    top: 0,
    height: 170,
  },

  arcItem: {
    width: ARC_ITEM_SIZE,
    height: ARC_ITEM_SIZE,
    borderRadius: ARC_ITEM_SIZE / 2,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginHorizontal: (ARC_ITEM_SPACING - ARC_ITEM_SIZE) / 2,
    shadowColor: "#000000",
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  arcItemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  moreDetails: {
    alignItems: "center",
    marginBottom: 8,
  },

  moreDetailsText: {
    color: "#C9CBD1",
    fontSize: 15,
    marginTop: 3,
  },

  footer: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 24,
  },

  addBtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  addBtnText: {
    color: "#111214",
    fontSize: 16,
    fontWeight: "800",
  },

  emptyState: {
    flex: 1,
    backgroundColor: "#0D0D10",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },

  backBtn: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },

  backBtnText: {
    color: "#111214",
    fontSize: 15,
    fontWeight: "700",
  },
});