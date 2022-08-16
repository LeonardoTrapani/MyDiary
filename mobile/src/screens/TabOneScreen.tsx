import { StyleSheet } from 'react-native';
import React from 'react';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
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
      <Text style={styles.title}>Tab One</Text>
      <TextButton
        title='logout'
        onPress={() => {
          logoutMutation.mutate();
        }}
      />
      <View
        style={styles.separator}
        lightColor='#eee'
        darkColor='rgba(255,255,255,0.1)'
      />
      <EditScreenInfo path='/screens/TabOneScreen.tsx' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
