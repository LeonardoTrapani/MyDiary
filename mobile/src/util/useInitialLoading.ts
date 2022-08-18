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

  const { isFetched: isWeekCreatedFetched, data: weekCreated } =
    useIsWeekCreated();

  const [fontsLoaded] = useFonts({
    regular: Roboto_400Regular,
    medium: Roboto_500Medium,
    bold: Roboto_700Bold,
  });

  useEffect(() => {
    const loadResourcesAndDataAsync = async () => {
      console.log('TRY');
      try {
        SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
        // We might want to provide this error information to an error reporting service
      } finally {
        console.log('LOADING RESOURCES, week created: ', weekCreated);
        await SplashScreen.hideAsync();
        setLoadingComplete(true);
      }
    };
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
