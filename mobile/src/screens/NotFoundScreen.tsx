import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Text, View } from "../components/Themed";
import { RootStackScreenProps } from "../../types";
import { RegularText } from "../components/StyledText";

export default function NotFoundScreen({
  navigation,
}: RootStackScreenProps<"NotFound">) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This screen doesnt exist.</Text>
      <TouchableOpacity
        onPress={() => navigation.replace("Root")}
        style={styles.link}
      ></TouchableOpacity>
    </View>
  );
}

export const NoConnectionScreen = ({
  navigation,
}: RootStackScreenProps<"NoConnection">) => {
  return (
    <View>
      <RegularText>No Connection</RegularText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
