import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Avatar, Menu, Divider, ActivityIndicator, Text, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../styles/globalStyles';

const EXPO_PUBLIC_API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN ?? "";

const UserNavbar = () => {
  const navigation = useNavigation();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (EXPO_PUBLIC_API_TOKEN && token) {
          const userUrl = `https://api.trello.com/1/members/me?fields=fullName,username,email,avatarUrl,id,bio,url&key=${EXPO_PUBLIC_API_TOKEN}&token=${token}`;
          const userResponse = await fetch(userUrl);
          const userData = await userResponse.json();

          if (userResponse.ok) {
            setUserData(userData);
          } else {
            console.error("Impossible de récupérer les données de l'utilisateur:", userData);
          }
        } else {
          console.error('API Secret ou Token manquants');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.navigate('Index');
  };

  return (
    <View style={globalStyles.navbarContainer}>
      
      {loading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        userData && (
          <>
            {/* Avatar et infos utilisateur */}
            <TouchableOpacity onPress={() => setMenuVisible(true)} style={globalStyles.userInfo}>
              {userData.avatarUrl ? (
                <Avatar.Image
                  size={50}
                  source={{ uri: `${userData.avatarUrl}/170.png` }}
                  style={globalStyles.avatar}
                />
              ) : (
                <Avatar.Icon size={50} icon="account-circle" style={globalStyles.avatar} />
              )}
              <View>
                <Text style={globalStyles.userName}>{userData.fullName}</Text>
                <Text style={globalStyles.userEmail}>{userData.email}</Text>
              </View>
            </TouchableOpacity>

            {/* Bouton Menu */}
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  color="#ffffff"
                  size={28}
                  onPress={() => setMenuVisible(true)}
                  style={[
                    globalStyles.menuIcon,
                    {
                      backgroundColor: 'white',
                      borderRadius: 50,
                      padding: 2,
                    },
                  ]}
                />
              }
            >
              <Menu.Item
                title="Mon Profil"
                onPress={() => {
                  setMenuVisible(false);
                  navigation.navigate('UpdateProfile', { userData });
                }}
              />
              <Divider />
              <Menu.Item title="Déconnexion" onPress={handleLogout} />
            </Menu>
          </>
        )
      )}
    </View>
  );
};

export default UserNavbar;
