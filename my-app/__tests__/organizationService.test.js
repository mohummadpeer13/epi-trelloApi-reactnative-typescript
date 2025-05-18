import { fetchOrganizations, createOrganization, editOrganization, deleteOrganization } from '../app/services/organizationService.tsx';
import AsyncStorage from '@react-native-async-storage/async-storage';

global.fetch = jest.fn();

describe('organizationService', () => {
  const mockApiKey = 'test-api-key';
  const mockToken = 'test-token';
  const mockOrgId = 'org-123';

  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem = jest.fn().mockImplementation((key) => {
      if (key === 'apiSecret') return Promise.resolve(mockApiKey);
      if (key === 'token') return Promise.resolve(mockToken);
      return Promise.resolve(null);
    });
  });

  test('fetchOrganizations récupère les organisations', async () => {
    const mockOrganizations = [{ id: mockOrgId, displayName: "Epitech" }];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockOrganizations),
    });

    const result = await fetchOrganizations();
    expect(result).toEqual(mockOrganizations);
  });

  test('deleteOrganization supprime une organisation', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: "Deleted" }),
    });

    await expect(deleteOrganization(mockOrgId)).resolves.toBeTruthy();
  });
});
