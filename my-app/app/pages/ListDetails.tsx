// ListDetails.js

import React from 'react';
import { View, FlatList } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { globalStyles } from '../styles/globalStyles';

const ListDetails = ({ route }) => {
  const { listName, cards } = route.params;

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>{listName.toUpperCase()}</Text>

      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={globalStyles.card}>
            <Text>{item.name}</Text>
          </Card>
        )}
      />
    </View>
  );
};

export default ListDetails;
