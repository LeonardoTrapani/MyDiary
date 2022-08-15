import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logout } from '../api/auth';
import { BoldText } from '../components/StyledText';
import TextButton from '../components/TextButton';

const CreateWeekScreen = () => {
  const queryClient = useQueryClient();

  const logoutMutation = useMutation(
    () => {
      return logout();
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(['isTokenValid']);
        queryClient.invalidateQueries(['isWeekCreated']);
        queryClient.invalidateQueries(['token']);
      },
    }
  );
  return (
    <SafeAreaView>
      <BoldText>Create WEEK</BoldText>
      <TextButton
        title='logout'
        onPress={() => {
          logoutMutation.mutate();
        }}
      />
    </SafeAreaView>
  );
};

export default CreateWeekScreen;
