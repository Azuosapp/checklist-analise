import { describe, expect, it } from 'vitest';

import { type RequestUser } from '../../../lib/auth/request-user.type';
import { ProfileService } from './profile.service';

const user: RequestUser = {
  id: '09f805df',
  email: 'ana.souza@empresa.com.br',
  name: 'Ana Souza',
  role: 'admin',
};

describe('ProfileService.me', () => {
  // feliz
  it('answers who is using the system, from the identity of the request', () => {
    expect(new ProfileService().me(user)).toEqual(user);
  });

  // triste
  /* O que mais um dia entrar na identidade da requisição não pode vazar para o navegador. */
  it('copies only the four public fields, never anything else on the identity', () => {
    const withExtra = { ...user, token: 'segredo', internal: true } as unknown as RequestUser;

    const answer = new ProfileService().me(withExtra);

    expect(Object.keys(answer).sort()).toEqual(['email', 'id', 'name', 'role']);
    expect(JSON.stringify(answer)).not.toContain('segredo');
  });
});
