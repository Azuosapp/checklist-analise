import { useQuery } from '@tanstack/react-query';
import { USER_ROLE_LABELS } from '@template/shared/schemas/user.schema';
import { profileApi } from '../api/profile.api';
import { accountProfileUrl } from '../api/account-session.api';

/** A identidade é lida do servidor; nunca se afirma uma pessoa fixa na tela de perfil. */
export function useProfileModel() {
  const profile = useQuery({
    queryKey: ['profile', 'me'],
    queryFn: profileApi.me,
    retry: false,
    staleTime: 300_000,
  });
  const user = profile.data;
  return {
    data: {
      user: user ? { ...user, role: USER_ROLE_LABELS[user.role] } : null,
      accountUrl: accountProfileUrl(),
    },
    state: {
      isLoading: profile.isPending,
      error: profile.error ? 'Não consegui carregar seu perfil. Tente novamente.' : null,
    },
  };
}
