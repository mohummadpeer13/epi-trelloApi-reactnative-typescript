import AsyncStorage from '@react-native-async-storage/async-storage';
const EXPO_PUBLIC_API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN ?? "";

export interface Member {
  id: string;
  fullName: string;
  username: string;
  [key: string]: any;
}

export const fetchBoardListsAndCards = async (boardId: string) => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (EXPO_PUBLIC_API_TOKEN && token) {
      const url = `https://api.trello.com/1/boards/${boardId}/lists?cards=all&key=${EXPO_PUBLIC_API_TOKEN}&token=${token}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        const boardName = data.name;
        return { lists: data, boardName };
      } else {
        throw new Error('Erreur lors de la récupération des listes et cartes');
      }
    } else {
      throw new Error('API Secret ou Token manquants');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des listes et cartes:', error);
    throw error;
  }
};


export const addCardToList = async (listId: string, cardName: string) => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!EXPO_PUBLIC_API_TOKEN || !token) throw new Error('Clés API manquantes');

    const response = await fetch(
      `https://api.trello.com/1/cards?idList=${listId}&name=${encodeURIComponent(cardName)}&key=${EXPO_PUBLIC_API_TOKEN}&token=${token}`,
      { method: 'POST' }
    );

    if (!response.ok) throw new Error('Erreur lors de l\'ajout de la carte');

    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    return null;
  }
};


export const updateCard = async (cardId: string, newCardName: string) => {
  try {
    const token = await AsyncStorage.getItem('token');

    const url = `https://api.trello.com/1/cards/${cardId}?key=${EXPO_PUBLIC_API_TOKEN}&token=${token}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newCardName,
      }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour de la carte');
    }

    const updatedCard = await response.json();
    return updatedCard;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la carte:', error);
    throw error;
  }
};

export const assignMembersToCard = async (cardId: string, memberIds: string[]) => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!EXPO_PUBLIC_API_TOKEN || !token) throw new Error('Clés API manquantes');

    
    const existingMembers: Member[] = await fetchCardMembers(cardId);
    const existingMemberIds = existingMembers.map((member) => member.id);

    const updatedMemberIds = [...new Set([...existingMemberIds, ...memberIds])];

    const assignResponse = await fetch(
      `https://api.trello.com/1/cards/${cardId}/idMembers?key=${EXPO_PUBLIC_API_TOKEN}&token=${token}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: updatedMemberIds,
        }),
      }
    );
    
    if (!assignResponse.ok) {
      throw new Error('Erreur lors de l\'assignation des membres à la carte');
    }

    const membersToRemove = existingMemberIds.filter((id) => !memberIds.includes(id));

    const removalRequests = membersToRemove.map((memberId) =>
      fetch(`https://api.trello.com/1/cards/${cardId}/idMembers/${memberId}?key=${apiSecret}&token=${token}`, {
        method: 'DELETE',
      })
    );
   
    const removalResponses = await Promise.all(removalRequests);
    
    removalResponses.forEach((response) => {
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression d\'un membre de la carte');
      }
    });

    return true;
  } catch (error) {
    console.error('Erreur lors de l\'assignation des membres à la carte:', error);
    throw error;
  }
};


export const fetchBoardMembers = async (boardId: string) => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (EXPO_PUBLIC_API_TOKEN && token) {
      const url = `https://api.trello.com/1/boards/${boardId}/members?key=${EXPO_PUBLIC_API_TOKEN}&token=${token}`;
      const response = await fetch(url);
      const members = await response.json();

      if (response.ok) {
        return members;
      } else {
        throw new Error('Erreur lors de la récupération des membres du board');
      }
    } else {
      throw new Error('API Secret ou Token manquants');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des membres du board:', error);
    throw error;
  }
};

export const fetchCardMembers = async (cardId: string) => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (EXPO_PUBLIC_API_TOKEN && token) {
      const url = `https://api.trello.com/1/cards/${cardId}/members?key=${EXPO_PUBLIC_API_TOKEN}&token=${token}`;
      const response = await fetch(url);
      const members = await response.json();

      if (response.ok) {
        return members;
      } else {
        throw new Error('Erreur lors de la récupération des membres de la carte');
      }
    } else {
      throw new Error('API Secret ou Token manquants');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des membres de la carte:', error);
    throw error;
  }
};

export const removeMembersFromCard = async (cardId: string, memberIds: string[]) => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!EXPO_PUBLIC_API_TOKEN || !token) throw new Error('Clés API manquantes');

    const requests = memberIds.map((memberId) =>
      fetch(`https://api.trello.com/1/cards/${cardId}/idMembers/${memberId}?key=${EXPO_PUBLIC_API_TOKEN}&token=${token}`, {
        method: 'DELETE',
      })
    );

    const responses = await Promise.all(requests);

    responses.forEach((response) => {
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression d\'un membre de la carte');
      }
    });

    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression des membres de la carte:', error);
    throw error;
  }
};

export const addMemberToBoard = async (boardId: string, email: string, type = 'normal') => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (EXPO_PUBLIC_API_TOKEN && token) {
      const url = `https://api.trello.com/1/boards/${boardId}/members`;
      const body = {
        email,
        type,
        key: EXPO_PUBLIC_API_TOKEN,
        token,
      };

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Erreur lors de l\'ajout du membre au board');
      }
    } else {
      throw new Error('API Secret ou Token manquants');
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout du membre au board:', error);
    throw error;
  }
};


export const deleteCardFromList = async (cardId: string) => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!EXPO_PUBLIC_API_TOKEN || !token) throw new Error('Clés API manquantes');

    const response = await fetch(`https://api.trello.com/1/cards/${cardId}?key=${EXPO_PUBLIC_API_TOKEN}&token=${token}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression de la carte');
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression de la carte:', error);
    throw error;
  }
};


export default {
  deleteCardFromList,
  addMemberToBoard,
  removeMembersFromCard,
  fetchCardMembers,
  assignMembersToCard,
  fetchBoardListsAndCards,
  addCardToList,
  updateCard
};