import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { logout } from "../api/auth";
import { MediumText, RegularText } from "../components/StyledText";
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
          isFirst
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
          isLast
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
  isFirst?: boolean;
  isLast?: boolean;
}> = (props) => {
  const { text } = useTheme().colors;
  return (
    <TouchableOpacity onPress={props.onPress}>
      <CardView
        style={[
          {
            flexDirection: "row",
            justifyContent: "space-between",
            borderBottomWidth: 0.5,
            borderBottomColor: "#ddd",
            padding: 12,
            marginHorizontal: 15,
          },
          props.isFirst
            ? {
                marginTop: 15,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
              }
            : {},
          props.isLast
            ? {
                marginBottom: 15,
                borderBottomRightRadius: 10,
                borderBottomWidth: 0,
                borderBottomLeftRadius: 10,
              }
            : {},
        ]}
      >
        <CardView style={{ flexDirection: "row" }}>
          <Ionicons
            name={props.iconName}
            size={20}
            color={text}
            style={{ opacity: 0.8 }}
          />
          <MediumText style={{ fontSize: 18, marginLeft: 10 }}>
            {props.name}
          </MediumText>
        </CardView>
        <Ionicons name="chevron-forward" size={20} color={"#888"} />
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
