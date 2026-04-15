import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
} from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../context/CartContext";
import { burgers } from "../data/burgers";

export default function DetailScreen({ route, navigation }) {
  const initialBurger = route.params?.burger ?? burgers[0];
  const [selectedBurger, setSelectedBurger] = useState(initialBurger);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const related = useMemo(() => {
    if (!selectedBurger) return [];
    const base = burgers.filter((item) => item.id !== selectedBurger.id);
    return [selectedBurger, ...base].slice(0, 5);
  }, [selectedBurger]);

  const arcPositions = [
    { top: 46, left: 4, size: 66 },
    { top: 10, left: 76, size: 60 },
    { top: -8, left: 145, size: 56 },
    { top: 10, right: 76, size: 60 },
    { top: 46, right: 4, size: 66 },
  ];

  function animateBurgerChange(nextBurger) {
    if (!nextBurger || nextBurger.id === selectedBurger?.id) return;

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
      setSelectedBurger(nextBurger);
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

  function increaseQty() {
    setQty((prev) => prev + 1);
  }

  function decreaseQty() {
    setQty((prev) => (prev > 1 ? prev - 1 : 1));
  }

  function handleAddToCart() {
    if (!selectedBurger) return;

    for (let i = 0; i < qty; i++) {
      addToCart(selectedBurger);
    }

    Alert.alert("Éxito", `${selectedBurger.name} x${qty} agregado al carrito`);
  }

  if (!selectedBurger) {
    return (
      <View style={[styles.container, styles.emptyState]}>
        <Text style={styles.emptyTitle}>No se encontró la hamburguesa</Text>
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
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Pressable
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color="#F5F5F5" />
          </Pressable>

          <Pressable style={styles.iconButton}>
            <Feather name="more-vertical" size={20} color="#F5F5F5" />
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
              "A patty or burger is a flattened, usually round, serving of ground meat or legumes, grains, vegetables, or meat alternatives."}
          </Text>

          <View style={styles.metaRow}>
            <View>
              <Text style={styles.metaTitle}>Delivery Time</Text>
              <View style={styles.inlineRow}>
                <Ionicons name="time-outline" size={15} color="#B8BBC5" />
                <Text style={styles.metaText}>
                  {selectedBurger.deliveryTime ?? 30} Minute
                </Text>
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
                ({selectedBurger.followers ?? "17K"} Followers)
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.arcSection}>
          <View style={styles.arcGlow} />
          <View style={styles.arcBase} />
          <View style={styles.arcInnerShadow} />

          <View style={styles.arcCarousel}>
            {related.map((item, index) => {
              const pos = arcPositions[index] || {
                top: 24,
                left: 24,
                size: 60,
              };
              const isActive = item.id === selectedBurger.id;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => animateBurgerChange(item)}
                  style={[
                    styles.arcItem,
                    {
                      top: pos.top,
                      left: pos.left,
                      right: pos.right,
                      width: pos.size,
                      height: pos.size,
                    },
                    isActive && styles.arcItemActive,
                  ]}
                >
                  <Image source={{ uri: item.image }} style={styles.arcItemImage} />
                </Pressable>
              );
            })}
          </View>

          <Pressable style={styles.moreDetails}>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={22}
              color="#FFFFFF"
            />
            <Text style={styles.moreDetailsText}>Show more details</Text>
          </Pressable>
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
    paddingTop: 18,
    paddingBottom: 130,
  },

  glowGreen: {
    position: "absolute",
    top: 70,
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
    marginBottom: 8,
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

  heroArea: {
    height: 270,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    position: "relative",
  },

  heroImageWrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
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
    color: "#B8BBC5",
    fontSize: 13,
    marginTop: 6,
  },

  arcSection: {
    height: 190,
    marginTop: 6,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },

  arcGlow: {
    position: "absolute",
    top: 34,
    width: "88%",
    height: 90,
    borderTopLeftRadius: 160,
    borderTopRightRadius: 160,
    backgroundColor: "rgba(255,255,255,0.02)",
  },

  arcBase: {
    position: "absolute",
    top: 36,
    width: "94%",
    height: 115,
    borderTopLeftRadius: 180,
    borderTopRightRadius: 180,
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  arcInnerShadow: {
    position: "absolute",
    top: 50,
    width: "82%",
    height: 70,
    borderTopLeftRadius: 140,
    borderTopRightRadius: 140,
    backgroundColor: "rgba(0,0,0,0.06)",
  },

  arcCarousel: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 120,
  },

  arcItem: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.035)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  arcItemActive: {
    transform: [{ scale: 1.13 }],
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.10)",
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
