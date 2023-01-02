import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { logout } from "../api/auth";
import { MediumText } from "../components/StyledText";
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
            console.log("calendar");
          }}
          name="Week"
          iconName="calendar"
        />
        <SettingsCard
          onPress={() => {
            console.log("subjects");
          }}
          name="Subjects"
          iconName="flag"
        />
        <SettingsCard
          onPress={() => {
            console.log("professors");
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
  return (
    <TouchableOpacity onPress={props.onPress} style={{ marginHorizontal: 15 }}>
      <CardView
        style={[
          {
            flexDirection: "row",
            padding: 12,
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
                borderBottomLeftRadius: 10,
              }
            : {},
        ]}
      >
        <Ionicons
          name={props.iconName}
          size={20}
          color="#444"
          style={{ opacity: 0.8 }}
        />
        <CardView
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <MediumText style={{ fontSize: 18, marginLeft: 10 }}>
            {props.name}
          </MediumText>
          <Ionicons name="chevron-forward" size={20} color={"#888"} />
        </CardView>
      </CardView>
      {!props.isLast && (
        <CardView>
          <CardView
            style={{
              height: 0.7,
              backgroundColor: "#ddd",
              flex: 1,
              marginLeft: 40,
            }}
          ></CardView>
        </CardView>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SettingsScreen;
