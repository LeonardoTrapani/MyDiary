import { StyleSheet, View } from 'react-native';
import React from 'react';
import TextButton from '../components/TextButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../api/auth';
import { useTheme } from '@react-navigation/native';
import FloatingButton from '../components/FloatingButton';
import { RootTabScreenProps } from '../../types';

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<'TabThree'>) {
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

  const addHomeworkHandler = () => {
    navigation.navigate('AddHomework');
  };

  return (
    <View style={styles.container}>
      <FloatingButton
        color={primary}
        ionIconName='ios-add'
        onPress={addHomeworkHandler}
      />
      <TextButton title='logout' onPress={() => logoutMutation.mutate()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
