import AsyncStorage from "@react-native-async-storage/async-storage";
const EXPO_PUBLIC_API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN ?? "";

// crée une liste
export const createList = async (name: string, boardId: string) => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (EXPO_PUBLIC_API_TOKEN && token) {
      const url = `https://api.trello.com/1/lists?name=${name}&idBoard=${boardId}&key=${EXPO_PUBLIC_API_TOKEN}&token=${token}`;
      const response = await fetch(url, { method: 'POST' });
      const newList = await response.json();

      if (response.ok) {
        return newList;
      } else {
        throw new Error('Erreur lors de la création de la liste');
      }
    } else {
      throw new Error('API Secret ou Token manquants');
    }
  } catch (error) {
    console.error('Erreur lors de la création de la liste:', error);
    throw error;
  }
};

// modifie une liste
export const updateList = async (listId: string, name: string) => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (EXPO_PUBLIC_API_TOKEN && token) {
      const url = `https://api.trello.com/1/lists/${listId}?key=${EXPO_PUBLIC_API_TOKEN}&token=${token}&name=${name}`;
      const response = await fetch(url, { method: 'PUT' });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Erreur lors de la mise à jour de la liste');
      }
    } else {
      throw new Error('API Secret ou Token manquants');
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la liste:', error);
    throw error;
  }
};

// archive une liste
export const archiveList = async (listId: string) => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (EXPO_PUBLIC_API_TOKEN && token) {
      const url = `https://api.trello.com/1/lists/${listId}/closed?key=${EXPO_PUBLIC_API_TOKEN}&token=${token}&value=true`;
      const response = await fetch(url, { method: 'PUT' });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Erreur lors de l\'archivage de la liste');
      }
    } else {
      throw new Error('API Secret ou Token manquants');
    }
  } catch (error) {
    console.error('Erreur lors de l\'archivage de la liste:', error);
    throw error;
  }
};


export default {
  createList,
  updateList,
  archiveList
};