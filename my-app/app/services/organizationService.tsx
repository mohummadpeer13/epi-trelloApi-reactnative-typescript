import AsyncStorage from '@react-native-async-storage/async-storage';

const EXPO_PUBLIC_API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN ?? "";

// list organisations
export const fetchOrganizations = async () => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!EXPO_PUBLIC_API_TOKEN || !token) {
      throw new Error('API Secret ou Token manquants');
    }

    const url = `https://api.trello.com/1/members/me/organizations?key=${EXPO_PUBLIC_API_TOKEN}&token=${token}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des organisations');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// crée une organisation
export const createOrganization = async (newOrgName: string, newOrgDescription: string) => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!EXPO_PUBLIC_API_TOKEN || !token) {
      throw new Error('API Secret ou Token manquants');
    }

    const url = `https://api.trello.com/1/organizations?displayName=${newOrgName}&desc=${newOrgDescription}&key=${EXPO_PUBLIC_API_TOKEN}&token=${token}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'organisation:', error);
    throw error;
  }
};

// supprime une organisation
export const deleteOrganization = async (orgId: string) => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!EXPO_PUBLIC_API_TOKEN || !token) {
      throw new Error('API Secret ou Token manquants');
    }

    const url = `https://api.trello.com/1/organizations/${orgId}?key=${EXPO_PUBLIC_API_TOKEN}&token=${token}`;

    const response = await fetch(url, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'organisation:', error);
    throw error;
  }
};


// modifie une organisation
export const editOrganization = async (orgId: string, newOrgName: string, newOrgDescription: string) => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!EXPO_PUBLIC_API_TOKEN || !token) {
      throw new Error('API Secret ou Token manquants');
    }

    const url = `https://api.trello.com/1/organizations/${orgId}?displayName=${newOrgName}&desc=${newOrgDescription}&key=${EXPO_PUBLIC_API_TOKEN}&token=${token}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Accept': 'application/json' },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la modification de l\'organisation:', error);
    throw error;
  }
};

export default {
  fetchOrganizations,
  createOrganization,
  deleteOrganization,
  editOrganization
};