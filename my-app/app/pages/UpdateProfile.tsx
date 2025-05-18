import React from 'react';
import { View, Linking } from 'react-native';
import { Card, Title, Paragraph, Avatar, Button } from 'react-native-paper';
import { globalStyles } from '../styles/globalStyles';
import GradientBackground from '../components/GradientBackground';

const UpdateProfile = ({ route, navigation }) => {
  const { userData } = route.params;

  return (
    <GradientBackground>
      <View style={[globalStyles.centeredContainer, { justifyContent: 'flex-start', alignItems: 'center' }]}>
        <Card style={[globalStyles.card, { alignItems: 'center'}]}>
          <Card.Content style={{ alignItems: 'center' }}>
            {userData.avatarUrl ? (
              <Avatar.Image size={100} source={{ uri: `${userData.avatarUrl}/170.png` }} style={globalStyles.avatar} />
            ) : (
              <Avatar.Icon size={100} icon="account-circle" style={globalStyles.avatar} />
            )}

            <Title style={[globalStyles.title, { marginTop: 10 }]}>MON PROFIL</Title>

            <View style={[globalStyles.profileSection, { marginTop: 20, justifyContent: "center", }]}>
              <Paragraph style={globalStyles.textBold}>Nom Complet</Paragraph>
              <Paragraph style={globalStyles.textNormal}>{userData.fullName}</Paragraph>

              <Paragraph style={[globalStyles.textBold, { marginTop: 15 }]}>Email</Paragraph>
              <Paragraph style={globalStyles.textNormal}>{userData.email || 'Non disponible'}</Paragraph>

              <Paragraph style={[globalStyles.textBold, { marginTop: 15 }]}>Nom d'utilisateur</Paragraph>
              <Paragraph style={globalStyles.textNormal}>{userData.username}</Paragraph>
            </View>

            <View style={{ flexDirection: 'column', gap: 10, marginTop: 10, width:'100%' }}>
              <Button
                mode="contained"
                onPress={() => navigation.goBack()}
                style={[globalStyles.button, { width: '100%' }]}
                labelStyle={globalStyles.labelButton}
              >
                Retour
              </Button>
              <Button
                mode="text"
                onPress={() => Linking.openURL(userData.url)}
                style={[globalStyles.buttonReverse, { width: '100%' }]}
                labelStyle={globalStyles.labelButtonReverse}
              >
                Mon profil Trello
              </Button>
            </View>

          </Card.Content>
        </Card>
      </View>
    </GradientBackground>
  );
};

export default UpdateProfile;
