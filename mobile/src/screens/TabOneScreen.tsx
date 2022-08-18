import { StyleSheet, View } from 'react-native';
import React from 'react';
import TextButton from '../components/TextButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../api/auth';
import { useTheme } from '@react-navigation/native';
import FloatingButton from '../components/FloatingButton';

export default function TabOneScreen() {
  const queryClient = useQueryClient();
  const logoutMutation = useMutation(
    () => {
      return logout();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['validToken']);
      },
    }
  );
  const { primary } = useTheme().colors;
  return (
    <View style={styles.container}>
      <FloatingButton color={primary} ionIconName='ios-add'></FloatingButton>
      <TextButton title='logout' onPress={() => logoutMutation.mutate()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
