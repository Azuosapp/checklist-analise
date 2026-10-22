import { type SessionUser } from '@template/shared/schemas/user.schema';

import { apiRequest } from './http-client';

/**
 * A pessoa que está usando o sistema. O navegador não manda identidade nenhuma (ver
 * `http-client.ts`): quem diz quem ela é continua sendo o auth-forward, e esta chamada só PERGUNTA
 * ao servidor o que ele já resolveu.
 */
export const profileApi = {
  me: () => apiRequest<SessionUser>('/profile/me'),
};
