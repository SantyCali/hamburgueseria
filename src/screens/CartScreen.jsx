import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";

export default function CartScreen({ navigation }) {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    totalPrice,
  } = useCart();

  function handleCheckout() {
    Alert.alert("Compra realizada", "Tu pedido fue enviado correctamente.");
    clearCart();
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.glowGreen} />
      <View style={styles.glowOrange} />

      <View style={styles.topBar}>
        <Pressable style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#F5F5F5" />
        </Pressable>

        <Text style={styles.title}>Mi carrito</Text>

        <Pressable style={styles.iconButton} onPress={clearCart}>
          <Feather name="trash-2" size={20} color="#F5F5F5" />
        </Pressable>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptyText}>
            Agregá productos y van a aparecer acá.
          </Text>

          <Pressable
            style={styles.exploreButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.exploreButtonText}>Explorar productos</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {cartItems.map((item) => (
              <View key={item.id} style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.image} />

                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.subtitle}>{item.subtitle}</Text>
                  <Text style={styles.price}>${item.price}</Text>
                </View>

                <View style={styles.actions}>
                  <Pressable
                    style={styles.removeBtn}
                    onPress={() => removeFromCart(item.id)}
                  >
                    <Feather name="x" size={18} color="#FFFFFF" />
                  </Pressable>

                  <View style={styles.qtyBox}>
                    <Pressable
                      style={styles.qtyBtn}
                      onPress={() => decreaseQuantity(item.id)}
                    >
                      <Text style={styles.qtySymbol}>−</Text>
                    </Pressable>

                    <Text style={styles.qtyText}>{item.quantity}</Text>

                    <Pressable
                      style={styles.qtyBtn}
                      onPress={() => increaseQuantity(item.id)}
                    >
                      <Text style={styles.qtySymbol}>+</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.bottomSheet}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${totalPrice}</Text>
            </View>

            <Pressable style={styles.checkoutBtn} onPress={handleCheckout}>
              <Text style={styles.checkoutText}>Finalizar compra</Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D10",
    paddingHorizontal: 20,
  },
  glowGreen: {
    position: "absolute",
    top: 100,
    left: 70,
    width: 140,
    height: 140,
    borderRadius: 999,
    backgroundColor: "rgba(80,255,92,0.08)",
  },
  glowOrange: {
    position: "absolute",
    bottom: 140,
    right: 60,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: "rgba(255,187,43,0.06)",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 22,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 14,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 10,
  },
  emptyText: {
    color: "#B8BBC5",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  exploreButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 18,
  },
  exploreButtonText: {
    color: "#111214",
    fontSize: 15,
    fontWeight: "800",
  },
  listContent: {
    paddingBottom: 150,
    gap: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: 24,
    padding: 14,
    marginBottom: 14,
  },
  image: {
    width: 86,
    height: 86,
    borderRadius: 18,
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  name: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
  },
  subtitle: {
    color: "#AEB3C2",
    fontSize: 13,
    marginBottom: 8,
  },
  price: {
    color: "#FF5B5B",
    fontSize: 20,
    fontWeight: "800",
  },
  actions: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 86,
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 18,
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 10,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  qtySymbol: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  qtyText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    minWidth: 18,
    textAlign: "center",
  },
  bottomSheet: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 24,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: 26,
    padding: 18,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  totalLabel: {
    color: "#C9CBD1",
    fontSize: 16,
  },
  totalValue: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },
  checkoutBtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  checkoutText: {
    color: "#111214",
    fontSize: 16,
    fontWeight: "800",
  },
});