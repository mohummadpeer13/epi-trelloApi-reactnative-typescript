import axios from 'axios';

export const getWorkspaces = async (API_KEY, TOKEN) => {
  const url = `https://api.trello.com/1/members/me/organizations?key=${API_KEY}&token=${TOKEN}`;

  try {
    const response = await axios.get(url); 
    console.log("ok")
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch workspaces');
  }
};

export const createBoard = async (name, API_KEY, TOKEN) => {
  const url = `https://api.trello.com/1/boards/?name=${name}&key=${API_KEY}&token=${TOKEN}`;

  const response = await fetch(url, {
    method: 'POST',
  });

  if (!response.ok) {
    const errorData = await response.json(); 
    throw new Error(errorData.message || 'Failed to create board');
  }

  const data = await response.json();
  return data;
};


export default {
  getWorkspaces,
  createBoard
};
