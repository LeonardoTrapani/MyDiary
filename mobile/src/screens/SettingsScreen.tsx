import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { StyleSheet } from "react-native";
import { logout } from "../api/auth";
import TextButton from "../components/TextButton";
import { View } from "../components/Themed";

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
      <TextButton title="logout" onPress={() => logoutMutation.mutate()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SettingsScreen;
