import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { logout } from "../api/auth";
import { RegularText } from "../components/StyledText";
import TextButton from "../components/TextButton";
import { CardView, View } from "../components/Themed";

const SettingsScreen: React.FC = () => {
  const queryClient = useQueryClient();

  const logoutMutation = useMutation(
    () => {
      return logout();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["validToken"]);
      },
    }
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <SettingsCard
          onPress={() => {
            console.log("account");
          }}
          name="Account"
          iconName="person"
        />
        <SettingsCard
          onPress={() => {
            console.log("account");
          }}
          name="Week"
          iconName="calendar"
        />
        <SettingsCard
          onPress={() => {
            console.log("account");
          }}
          name="Subjects"
          iconName="flag"
        />
        <SettingsCard
          onPress={() => {
            console.log("account");
          }}
          name="Professors"
          iconName="barcode"
        />
        <TextButton title="logout" onPress={() => logoutMutation.mutate()} />
      </ScrollView>
    </View>
  );
};

const SettingsCard: React.FC<{
  onPress: () => void;
  name: string;
  iconName: keyof typeof Ionicons.glyphMap;
}> = (props) => {
  const { text } = useTheme().colors;
  return (
    <TouchableOpacity onPress={props.onPress}>
      <CardView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottomWidth: 0.5,
          borderBottomColor: "#ddd",
          padding: 15,
        }}
      >
        <RegularText style={{ fontSize: 18 }}>{props.name}</RegularText>
        <Ionicons
          name={props.iconName}
          size={18}
          color={text}
          style={{ opacity: 0.8 }}
        />
      </CardView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SettingsScreen;
