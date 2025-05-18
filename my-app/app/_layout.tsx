// layout.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Index from './pages/Index'; 
import Organisation from './pages/Organisation'; 
import Boards from './pages/Boards';
import Cards from './pages/Cards';
import ListDetails from './pages/ListDetails';
import UpdateProfile from './pages/UpdateProfile';
import { useFonts, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Provider as PaperProvider, DefaultTheme, configureFonts } from 'react-native-paper';

const Stack = createStackNavigator();

// 🔠 Config de la police pour react-native-paper
const fontConfig = {
  default: {
    regular: {
      fontFamily: 'Poppins_700Bold',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Poppins_700Bold',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Poppins_700Bold',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Poppins_700Bold',
      fontWeight: 'normal',
    },
  },
};

// 🎨 Personnalisation du thème avec la police Poppins
const theme = {
  ...DefaultTheme,
  fonts: configureFonts(fontConfig),
};

const Layout = () => {
  return (
    <Stack.Navigator initialRouteName="Index">
      <Stack.Screen name="Index" options={{ headerShown: false }} component={Index} />
      <Stack.Screen name="Organisation" options={{ headerBackTitle: 'Retour', title: "Espace de travail" }} component={Organisation} />
      <Stack.Screen name="Boards" options={{ headerBackTitle: 'Retour', title: "Tableaux" }} component={Boards} />
      <Stack.Screen name="Cards" options={{ headerBackTitle: 'Retour', title: "Cartes" }} component={Cards} />
      <Stack.Screen name="ListDetails" component={ListDetails} />
      <Stack.Screen name="UpdateProfile" options={{ headerBackTitle: 'Retour', title: "Mon profil" }} component={UpdateProfile} />
    </Stack.Navigator>
  );
};

export default Layout;
