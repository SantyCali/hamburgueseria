import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";

export default function Header({ onOpenMenu }) {
  const { cart } = useCart();

  return (
    <View style={styles.headerRow}>
      <Pressable style={styles.iconButton} onPress={onOpenMenu}>
        <Feather name="menu" size={20} color="#F5F5F5" />
      </Pressable>

      <Text style={styles.brand}>Burger 🍔</Text>

      <View style={styles.rightBox}>
        <Pressable style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={20} color="#F5F5F5" />
          <View style={styles.notificationDot} />
        </Pressable>

        <View style={styles.cartBadge}>
          <Text style={styles.cartText}>{cart.length}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  brand: {
    color: "#F3F4F6",
    fontSize: 28,
    fontWeight: "800",
  },
  notificationDot: {
    position: "absolute",
    right: 12,
    top: 12,
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: "#FF453A",
  },
  rightBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cartBadge: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FF5C5C",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  cartText: {
    color: "#fff",
    fontWeight: "800",
  },
});