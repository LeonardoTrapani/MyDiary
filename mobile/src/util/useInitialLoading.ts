import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useIsWeekCreated } from './react-query-hooks';
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  useFonts,
} from '@expo-google-fonts/roboto';
export default function useInitialLoading() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  // Load any resources or data that we need prior to rendering the app

  // const { data: validToken, isFetched: isValidTokenFetched } = useValidToken();

  const { isFetched: isWeekCreatedFetched, data: weekCreated } =
    useIsWeekCreated();

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
      await SplashScreen.hideAsync();
      setLoadingComplete(true);
    }
  };

  useEffect(() => {
    if (isLoadingComplete) {
      return;
    }
    if (!isWeekCreatedFetched || !fontsLoaded) {
      return;
    }
    loadResourcesAndDataAsync();
  }, [fontsLoaded, isLoadingComplete, isWeekCreatedFetched, weekCreated]);

  return isLoadingComplete;
}
