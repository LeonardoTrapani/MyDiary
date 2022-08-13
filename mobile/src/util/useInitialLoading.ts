import { FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useUserId } from './react-query-hooks';

export default function useInitialLoading() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  // Load any resources or data that we need prior to rendering the app
  const { isLoading: isUserIdLoading } = useUserId();

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
          'space-mono': require('../../assets/fonts/SpaceMono-Regular.ttf'),
        });
      } catch (e) {
        console.warn(e);
        // We might want to provide this error information to an error reporting service
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    if (isUserIdLoading === false) {
      loadResourcesAndDataAsync();
    }
  }, [isUserIdLoading]);

  return isLoadingComplete;
}
