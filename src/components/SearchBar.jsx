import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function SearchBar({ value, onChangeText }) {
  return (
    <View style={styles.searchBar}>
      <Ionicons name="search" size={20} color="#C9CBD1" />
      <TextInput
        placeholder="search your favorite"
        placeholderTextColor="#8A8C94"
        style={styles.searchInput}
        value={value}
        onChangeText={onChangeText}
      />
      <MaterialCommunityIcons name="tune-variant" size={22} color="#EAECEF" />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 16,
    height: 58,
    marginBottom: 22,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    marginLeft: 12,
    fontSize: 14,
  },
});