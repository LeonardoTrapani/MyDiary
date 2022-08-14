import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useIsTokenValid } from './react-query-hooks';
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  useFonts,
} from '@expo-google-fonts/roboto';

export default function useInitialLoading() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  // Load any resources or data that we need prior to rendering the app
  const { isLoading: isUserIdLoading } = useIsTokenValid();

  const [fontsLoaded] = useFonts({
    regular: Roboto_400Regular,
    medium: Roboto_500Medium,
    bold: Roboto_700Bold,
  });

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
        // We might want to provide this error information to an error reporting service
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    if (isUserIdLoading === false && fontsLoaded) {
      loadResourcesAndDataAsync();
    }
  }, [isUserIdLoading, fontsLoaded]);

  return isLoadingComplete;
}
