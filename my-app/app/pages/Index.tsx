import React, { useState } from "react";
import { View, Platform, Linking } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { Button, Snackbar, Provider, Card, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as AuthSession from "expo-auth-session";
import { globalStyles } from '../styles/globalStyles';
import { Image } from "react-native";
import GradientBackground from '../components/GradientBackground';

type NavigationProp = {
  navigate: (screen: string) => void;
};

const EXPO_PUBLIC_API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN ?? "";
const REDIRECT_URI = AuthSession.makeRedirectUri({
  native: ''
});

const Index: React.FC = () => {
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigation = useNavigation<NavigationProp>();

  const authenticateWithTrello = async () => {
    try {
      const authUrl = `https://trello.com/1/authorize?expiration=1day&scope=read,write,account&response_type=token&key=${EXPO_PUBLIC_API_TOKEN}&callback_method=fragment&return_url=${REDIRECT_URI}`;

      if (Platform.OS === 'android') {
        // Android
        await WebBrowser.openBrowserAsync(authUrl);

        const subscription = Linking.addEventListener('url', (event) => {
          const url = event.url;
          const tokenMatch = url.match(/token=([^&]+)/);

          if (tokenMatch) {
            handleToken(tokenMatch[1]);
            subscription.remove();
          }
        });
      } else {
        // iOS
        const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);

        if (result.type === 'success' && result.url) {
          const tokenMatch = result.url.match(/token=([^&]+)/);
          if (tokenMatch) {
            handleToken(tokenMatch[1]);
          }
        }
      }
    } catch (error) {
      console.error("Erreur d'authentification:", error);
      showSnackbar("Échec de la connexion");
    }
  };

  const handleToken = async (token: string) => {
    try {
      await AsyncStorage.setItem('token', token);
      showSnackbar("Connexion réussie !");
      setTimeout(() => navigation.navigate('Organisation'), 2000);
    } catch (error) {
      console.error("Erreur de stockage:", error);
      showSnackbar("Erreur de stockage du token");
    }
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setVisibleSnackbar(true);
  };

  return (
    <Provider>
      <GradientBackground>
        <View style={globalStyles.centeredContainer}>

          <Card style={globalStyles.card}>

            <View style={globalStyles.logoRow}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={globalStyles.logoImage}
              />
            </View>

            <View>
            <Text style={globalStyles.logoSubtitle} >Organisez votre travail</Text>
            <Text style={globalStyles.logoSubtitle} >Libérez votre potentiel</Text>
              <Button
                mode="contained"
                icon="login"
                onPress={authenticateWithTrello}
                style={[globalStyles.button, { marginTop: 90}]}
                labelStyle={globalStyles.labelButton}
              >
                Connexion
              </Button>
            </View>
          </Card>

          <Snackbar
            visible={visibleSnackbar}
            onDismiss={() => setVisibleSnackbar(false)}
            duration={2000}
            style={snackbarMessage.includes("réussie") ? globalStyles.snackbarSuccess : globalStyles.snackbarError}
          >
            {snackbarMessage}
          </Snackbar>


        </View>
      </GradientBackground>
    </Provider>
  );
};

export default Index;