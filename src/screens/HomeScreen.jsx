import React, { useMemo, useState } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import CategoryChip from "../components/CategoryChip";
import BurgerCard from "../components/BurgerCard";
import SideMenu from "../components/SideMenu";
import { burgers } from "../data/burgers";
import { categories } from "../data/categories";

export default function HomeScreen({ navigation }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Burger");

  const filteredProducts = useMemo(() => {
    return burgers.filter((item) => {
      const matchesCategory = item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <Header
          onOpenMenu={() => setMenuOpen(true)}
          navigation={navigation}
        />

        <SearchBar value={search} onChangeText={setSearch} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {categories.map((item) => (
            <CategoryChip
              key={item.id}
              item={item}
              active={selectedCategory === item.name}
              onPress={() => setSelectedCategory(item.name)}
            />
          ))}
        </ScrollView>

        <View style={styles.grid}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item) => (
              <BurgerCard
                key={item.id}
                item={item}
                onPress={() => navigation.navigate("Detail", { burger: item })}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>
              No hay productos en esta categoría.
            </Text>
          )}
        </View>
      </ScrollView>

      <SideMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0D0D10",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 28,
  },
  glowOne: {
    position: "absolute",
    top: 70,
    left: 88,
    width: 120,
    height: 120,
    borderRadius: 999,
    backgroundColor: "rgba(75, 255, 59, 0.13)",
  },
  glowTwo: {
    position: "absolute",
    bottom: 140,
    left: 150,
    width: 150,
    height: 150,
    borderRadius: 999,
    backgroundColor: "rgba(255, 188, 59, 0.09)",
  },
  categoriesRow: {
    gap: 14,
    paddingBottom: 8,
    marginBottom: 18,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },
  emptyText: {
    color: "#B8BBC5",
    fontSize: 16,
    marginTop: 20,
  },
});