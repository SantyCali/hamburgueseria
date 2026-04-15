import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";

export default function Header({ onOpenMenu, navigation }) {
  const { cartCount } = useCart();

  return (
    <View style={styles.container}>
      <Pressable style={styles.iconButton} onPress={onOpenMenu}>
        <Ionicons name="menu" size={22} color="#F4F6FA" />
      </Pressable>

      <View style={styles.titleWrap}>
        <Text style={styles.title}>Burger</Text>
        <Text style={styles.emoji}>🍔</Text>
      </View>

      <Pressable
        style={styles.cartButton}
        onPress={() => navigation.navigate("Cart")}
      >
        <Feather name="shopping-bag" size={20} color="#F4F6FA" />

        {cartCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartCount}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
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
  titleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    color: "#F5F6FA",
    fontSize: 20,
    fontWeight: "800",
  },
  emoji: {
    fontSize: 26,
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
});