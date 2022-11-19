import { StyleSheet, View } from "react-native";
import React from "react";
import TextButton from "../components/TextButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../api/auth";

export default function HomeScreen() {
  return <View></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
