import React, { useMemo, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
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

  const filteredBurgers = useMemo(() => {
    return burgers.filter((burger) =>
      burger.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <Header onOpenMenu={() => setMenuOpen(true)} />

        <SearchBar value={search} onChangeText={setSearch} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {categories.map((item) => (
            <CategoryChip key={item.id} item={item} />
          ))}
        </ScrollView>

        <View style={styles.grid}>
          {filteredBurgers.map((item) => (
            <BurgerCard
              key={item.id}
              item={item}
              onPress={() => navigation.navigate("Detail", { burger: item })}
            />
          ))}
        </View>
      </ScrollView>

      <SideMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0D0D10",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
  },
  glowOne: {
    position: "absolute",
    top: 36,
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
});