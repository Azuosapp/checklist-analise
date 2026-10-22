import { Injectable } from '@nestjs/common';
import { type SessionUser } from '@template/shared/schemas/user.schema';

import { type RequestUser } from '../../../lib/auth/request-user.type';

/**
 * QUEM É A PESSOA QUE ESTÁ USANDO — só o que a tela mostra no rodapé do menu.
 *
 * É uma LEITURA da identidade que o middleware já resolveu (os cabeçalhos do auth-forward). Não
 * consulta nem grava nada: o sistema não tem cadastro de pessoa, e quem diz quem ela é
 * continua sendo o User Manager.
 *
 * Os quatro campos saem copiados um a um, e não por `...user`: o que mais um dia entrar na
 * identidade da requisição não vaza para o navegador sem alguém decidir isso aqui.
 */
@Injectable()
export class ProfileService {
  me(user: RequestUser): SessionUser {
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }
}
