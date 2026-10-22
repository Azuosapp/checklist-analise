import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { profileApi } from '../api/profile.api';
import { useProfileModel } from './use-profile.model';

vi.mock('../api/profile.api', () => ({ profileApi: { me: vi.fn() } }));
beforeEach(() => vi.resetAllMocks());
function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return renderHook(useProfileModel, { wrapper });
}
describe('useProfileModel', () => {
  // feliz
  it('shows the server identity with the translated access role', async () => {
    vi.mocked(profileApi.me).mockResolvedValue({
      id: 'real-id',
      name: 'Ana Souza',
      email: 'ana@example.test',
      role: 'admin',
    });
    const { result } = setup();
    await waitFor(() => expect(result.current.data.user?.name).toBe('Ana Souza'));
    expect(result.current.data.user?.role).toBe('Administrador');
  });
  // triste
  it('does not replace an unavailable identity with a fictional person', async () => {
    vi.mocked(profileApi.me).mockRejectedValue(new Error('Offline'));
    const { result } = setup();
    await waitFor(() => expect(result.current.state.error).toBeTruthy());
    expect(result.current.data.user).toBeNull();
  });
});
