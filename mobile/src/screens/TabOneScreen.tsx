import { StyleSheet, View } from 'react-native';
import React from 'react';
import TextButton from '../components/TextButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../api/auth';

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
  return (
    <View style={styles.container}>
      <TextButton title='logout' onPress={() => logoutMutation.mutate()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
