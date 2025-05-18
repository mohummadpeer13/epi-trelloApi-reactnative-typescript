//Test de la récupération des workspaces Trello

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getWorkspaces } from '../app/api_test/trelloAPI';


jest.mock('@react-native-async-storage/async-storage', () => require('../__mocks__/AsyncStorage'));

const mock = new MockAdapter(axios);

describe('getWorkspaces', () => {

  afterEach(() => {
    mock.reset();
  });

  test('devrait récupérer les workspaces avec succès', async () => {
    const mockWorkspaces = [
      { displayName: 'Epitech' },
      { displayName: 'TrelloTech' },
    ];

    mock.onGet(`https://api.trello.com/1/members/me/organizations?key=${API_KEY}&token=${TOKEN}`).reply(200, mockWorkspaces);
    const workspaces = await getWorkspaces(API_KEY, TOKEN);

    expect(workspaces).toMatchObject(mockWorkspaces);
  });

  test('devrait échouer si l\'API retourne une erreur', async () => {
    mock.onGet(`https://api.trello.com/1/members/me/organizations?key=${API_KEY}`).reply(500);
    await expect(getWorkspaces(API_KEY, TOKEN)).rejects.toThrow('Failed to fetch workspaces');
  });

});
