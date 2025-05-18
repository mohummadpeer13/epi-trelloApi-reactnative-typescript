// api.test.js
//test de la création d'un board trello via l'api
import { createBoard } from '../app/api_test/trelloAPI';

// Mock de l'appel à fetch pour simuler une réponse de l'API
global.fetch = jest.fn();

describe('createBoard', () => {
  it('should create a board successfully', async () => {

    const mockResponse = {
      id: '12345',
      name: 'New Board',
    };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const token = 'mock-token';
    const newBoard = await createBoard('New Board', API_KEY, TOKEN);

    expect(newBoard).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      `https://api.trello.com/1/boards/?name=New Board&key=${API_KEY}&token=${TOKEN}`,
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('should throw an error if the API key is incorrect (401 Unauthorized)', async () => {
    // Simuler une erreur 401 (Non autorisé) si la clé API ou le token est incorrect
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,  // Code d'erreur pour une mauvaise clé API
      json: () => Promise.resolve({ message: 'Invalid API Key' }),
    });

    const token = 'invalid-token';
    await expect(createBoard('New Board', 'invalid-api-key', token)).rejects.toThrow('Invalid API Key');
  });

  it('should throw an error if the API request fails', async () => {
    // Simuler une erreur générique de l'API
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,  // Code d'erreur interne du serveur
      json: () => Promise.resolve({ message: 'Server error' }),
    });

    const token = 'mock-token';
    await expect(createBoard('New Board', 'valid-api-key', token)).rejects.toThrow('Server error');
  });
});

