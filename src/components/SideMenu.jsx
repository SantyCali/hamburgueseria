import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function SideMenu({ visible, onClose }) {
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -SCREEN_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <Animated.View
        style={[
          styles.menu,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <Text style={styles.title}>Menú</Text>

        <Pressable style={styles.item}>
          <Text style={styles.itemText}>Inicio</Text>
        </Pressable>

        <Pressable style={styles.item}>
          <Text style={styles.itemText}>Burgers</Text>
        </Pressable>

        <Pressable style={styles.item}>
          <Text style={styles.itemText}>Pizzas</Text>
        </Pressable>

        <Pressable style={styles.item}>
          <Text style={styles.itemText}>Cookies</Text>
        </Pressable>

        <Pressable style={styles.item}>
          <Text style={styles.itemText}>Cakes</Text>
        </Pressable>

        <Pressable style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>Cerrar</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    flexDirection: "row",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  menu: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "72%",
    backgroundColor: "#151518",
    paddingTop: 70,
    paddingHorizontal: 20,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 24,
  },
  item: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  itemText: {
    color: "#EAECEF",
    fontSize: 16,
    fontWeight: "600",
  },
  closeBtn: {
    marginTop: 28,
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  closeText: {
    color: "#111",
    fontWeight: "800",
    fontSize: 15,
  },
});