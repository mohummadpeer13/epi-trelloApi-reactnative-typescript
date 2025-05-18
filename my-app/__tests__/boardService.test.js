import { fetchBoards, createBoard, deleteBoard } from '../app/services/boardService.tsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
jest.mock('@react-native-async-storage/async-storage', () => require('../__mocks__/AsyncStorage'));

// Simuler fetch
global.fetch = jest.fn();

describe('boardService', () => {
  const mockApiKey = 'test-api-key';
  const mockToken = 'test-token';
  const mockOrgId = 'org-123';
  const mockBoardId = 'board-123';

  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem = jest.fn().mockImplementation((key) => {
      if (key === 'apiSecret') return Promise.resolve(mockApiKey);
      if (key === 'token') return Promise.resolve(mockToken);
      return Promise.resolve(null);
    });
  });

  test('fetchBoards retourne la liste des boards', async () => {
    const mockBoards = [{ id: '1', name: 'Board 1' }, { id: '2', name: 'Board 2' }];
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockBoards),
    });

    const boards = await fetchBoards(mockOrgId);

    expect(boards).toEqual(mockBoards);
    expect(fetch).toHaveBeenCalledWith(
      `https://api.trello.com/1/organizations/${mockOrgId}/boards?key=${mockApiKey}&token=${mockToken}`
    );
  });

  test('createBoard appelle l’API et retourne le board créé', async () => {
    const mockBoard = { id: mockBoardId, name: 'New Board' };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockBoard),
    });

    const newBoard = await createBoard('New Board', 'Description', mockOrgId, 'standard');

    expect(newBoard).toEqual(mockBoard);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://api.trello.com/1/boards'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  test('deleteBoard appelle l’API et supprime un board', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Board supprimé' }),
    });

    const response = await deleteBoard(mockBoardId);

    expect(response).toEqual({ message: 'Board supprimé' });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`https://api.trello.com/1/boards/${mockBoardId}`),
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  test('fetchBoards retourne une erreur si l’API échoue', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: 'Erreur serveur' }),
    });

    await expect(fetchBoards(mockOrgId)).rejects.toThrow('Erreur lors de la récupération des boards');
  });
});
