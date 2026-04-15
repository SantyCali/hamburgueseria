import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

export default function CategoryChip({ item }) {
  return (
    <Pressable style={[styles.categoryChip, item.active && styles.categoryChipActive]}>
      <Text style={styles.categoryEmoji}>{item.emoji}</Text>
      <Text style={[styles.categoryText, item.active && styles.categoryTextActive]}>
        {item.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  categoryChip: {
    width: 92,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  categoryChipActive: {
    backgroundColor: "rgba(255,255,255,0.10)",
    borderColor: "rgba(255,255,255,0.10)",
  },
  categoryEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  categoryText: {
    color: "#B8BBC5",
    fontSize: 14,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: "#F6F7FB",
  },
});