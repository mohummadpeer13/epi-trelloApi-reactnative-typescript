import AsyncStorage from '@react-native-async-storage/async-storage';
const EXPO_PUBLIC_API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN ?? "";

// list boards
export const fetchBoards = async (orgId: string) => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (EXPO_PUBLIC_API_TOKEN && token) {
      const url = `https://api.trello.com/1/organizations/${orgId}/boards?key=${EXPO_PUBLIC_API_TOKEN}&token=${token}`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        throw new Error('Erreur lors de la récupération des boards');
      }
    } else {
      throw new Error('API Secret ou Token manquants');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des boards:', error);
    throw error;
  }
};

// crée board
export const createBoard = async ( 
  newBoardName: string,
  newBoardDesc: string,
  orgId: string,
  selectedTemplate: string) => {
  
  let idBoardSource = null;
  let defaultLists = true;

  if (selectedTemplate === 'kanban') {
    idBoardSource = '5e6005043fbdb55d9781821e';
    defaultLists = false;
  } else if (selectedTemplate === 'agile') {
    idBoardSource = '591ca6422428d5f5b2794aee';
    defaultLists = false;
  }

  try {
    const token = await AsyncStorage.getItem('token');

    if (EXPO_PUBLIC_API_TOKEN && token) {
      const url = `https://api.trello.com/1/boards?key=${EXPO_PUBLIC_API_TOKEN}&token=${token}&name=${newBoardName}&desc=${newBoardDesc}&idOrganization=${orgId}&idBoardSource=${idBoardSource}&defaultLists=${defaultLists}`;
      const response = await fetch(url, { method: 'POST' });
      const newBoard = await response.json();

      if (response.ok) {
        return newBoard;
      } else {
        throw new Error('Erreur lors de la création du board');
      }
    } else {
      throw new Error('API Secret ou Token manquants');
    }
  } catch (error) {
    console.error('Erreur lors de la création du board:', error);
    throw error;
  }
};

// modifie board
export const editBoard = async ( 
  boardId: string,
  newBoardName: string,
  newBoardDescription: string) => {
  
    try {
    const token = await AsyncStorage.getItem('token');

    if (EXPO_PUBLIC_API_TOKEN && token) {
      const url = `https://api.trello.com/1/boards/${boardId}?key=${EXPO_PUBLIC_API_TOKEN}&token=${token}&name=${newBoardName}&desc=${newBoardDescription}`;
      const response = await fetch(url, { method: 'PUT' });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Erreur lors de la modification du board');
      }
    } else {
      throw new Error('API Secret ou Token manquants');
    }
  } catch (error) {
    console.error('Erreur lors de la modification du board:', error);
    throw error;
  }
};

// supprime board
export const deleteBoard = async (boardId: string) => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (EXPO_PUBLIC_API_TOKEN && token) {
      const url = `https://api.trello.com/1/boards/${boardId}?key=${EXPO_PUBLIC_API_TOKEN}&token=${token}`;
      const response = await fetch(url, { method: 'DELETE' });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Erreur lors de la suppression du board');
      }
    } else {
      throw new Error('API Secret ou Token manquants');
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du board:', error);
    throw error; 
  }
};

export default {
  fetchBoards,
  createBoard,
  editBoard,
  deleteBoard
};