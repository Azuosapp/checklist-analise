import { useTheme } from '../theme/theme';
import { profileApi } from '../api/profile.api';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from '@tanstack/react-router';
import { USER_ROLE_LABELS } from '@template/shared/schemas/user.schema';

import { mockAuth } from '../auth/mock-user';
import { activeNavKeyOf } from '../navigation/navigation';

export type AppShellModel = {
  data: {
    badges: Partial<Record<string, number>>;
    user: { name: string; email: string; role: string };
  };
  state: { activeKey: string | undefined };
};

/**
 * O que a casca precisa: quem está usando, qual item do menu está aceso e os contadores.
 *
 * Contador de menu (ex.: "3 tarefas atrasadas") é buscado AQUI, uma vez, e não em cada rota:
 * o menu é o mesmo em todas, e buscar de novo a cada navegação repetiria a mesma consulta a
 * cada clique. Falha de contador NÃO derruba o menu — `useQuery` sem `throwOnError`, e o selo
 * simplesmente não aparece.
 */
export function useAppShellModel(): AppShellModel {
  // Mantém a preferência compartilhada em todas as telas; o seletor fica no perfil.
  useTheme();
  const identity = useQuery({
    queryKey: ['profile', 'me'],
    queryFn: profileApi.me,
    retry: false,
    staleTime: 300_000,
  });
  const user = identity.data ?? mockAuth.getUser();
  const { pathname } = useLocation();

  return {
    data: {
      badges: {},
      user: {
        name: user.name,
        email: user.email,
        role: USER_ROLE_LABELS[user.role],
      },
    },
    /* Qual item está ativo é decidido AQUI, e não no componente: resolver a rota atual é
       trabalho de view-model; o compositor continua sem saber de roteamento. */
    state: { activeKey: activeNavKeyOf(pathname) },
  };
}
