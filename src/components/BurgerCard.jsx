import React from "react";
import { Pressable, Image, Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function RatingStars() {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3].map((star) => (
        <Ionicons key={star} name="star" size={12} color="#F6B319" />
      ))}
      {[4, 5].map((star) => (
        <Ionicons key={star} name="star-outline" size={12} color="#7B7C82" />
      ))}
    </View>
  );
}

export default function BurgerCard({ item, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
      <View style={styles.cardFooter}>
        <RatingStars />
        <Text style={styles.price}>${item.price}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "47%",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 26,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  cardImage: {
    width: "100%",
    height: 112,
    borderRadius: 18,
    marginBottom: 10,
    resizeMode: "cover",
  },
  cardTitle: {
    color: "#F7F7FA",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardSubtitle: {
    color: "#9EA2AE",
    fontSize: 12,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  price: {
    color: "#FF5C5C",
    fontSize: 18,
    fontWeight: "800",
  },
});