import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AllPlaces from './screens/AllPlaces';
import AddPlace from './screens/AddPlace';
import IconButton from './components/UI/IconButton';
import { Colors } from './constants/colors';
import Map from './screens/Map';
import { AppProvider } from './context/appContext';
import { useCallback, useEffect, useState } from 'react';
import { init } from './util/database';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await init();
        setAppIsReady(true);
      } catch (error) {
        console.log(error);
      }
    };

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <>
      <StatusBar style='dark' />
      <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
        <AppProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerStyle: { backgroundColor: Colors.primary500 },
                headerTintColor: Colors.gray700,
                contentStyle: { backgroundColor: Colors.gray700 },
              }}
            >
              <Stack.Screen
                name='AllPlaces'
                component={AllPlaces}
                options={({ navigation }) => ({
                  title: 'Your Favorite Places',
                  headerRight: ({ tintColor }) => (
                    <IconButton
                      icon='add'
                      size={30}
                      color={tintColor}
                      onPress={() => navigation.navigate('AddPlace')}
                    />
                  ),
                })}
              />
              <Stack.Screen
                name='AddPlace'
                component={AddPlace}
                options={{
                  title: 'Add a new Place',
                }}
              />
              <Stack.Screen
                name='Map'
                component={Map}
                options={{ title: 'Select Location' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </AppProvider>
      </View>
    </>
  );
}
