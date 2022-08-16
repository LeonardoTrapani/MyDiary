import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useValidToken } from './react-query-hooks';
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  useFonts,
} from '@expo-google-fonts/roboto';
import { useQuery } from '@tanstack/react-query';
import { getIsWeekCreatedWithToken } from '../api/auth';

export default function useInitialLoading() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  // Load any resources or data that we need prior to rendering the app

  const { data: validToken, isFetched: isValidTokenFetched } = useValidToken();
  console.log({ validToken });
  const { isFetched: isWeekCreatedFetched } = useQuery<boolean>(
    ['isWeekCreated', validToken],
    getIsWeekCreatedWithToken,
    {
      enabled: !!validToken,
    }
  );
  const [fontsLoaded] = useFonts({
    regular: Roboto_400Regular,
    medium: Roboto_500Medium,
    bold: Roboto_700Bold,
  });

  const loadResourcesAndDataAsync = async () => {
    try {
      SplashScreen.preventAutoHideAsync();
    } catch (e) {
      console.warn(e);
      // We might want to provide this error information to an error reporting service
    } finally {
      console.log('LOADING RESOURCES');
      setLoadingComplete(true);
      SplashScreen.hideAsync();
    }
  };

  useEffect(() => {
    if (isLoadingComplete) {
      return;
    }
    if (
      !isValidTokenFetched ||
      (!isWeekCreatedFetched && !!validToken) ||
      !fontsLoaded
    ) {
      console.log('RETURNING');
      return;
    }
    loadResourcesAndDataAsync();
  }, [
    fontsLoaded,
    isLoadingComplete,
    isValidTokenFetched,
    isWeekCreatedFetched,
    validToken,
  ]);

  return isLoadingComplete;
}
