import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { CurrentUser } from '../../../lib/auth/current-user.decorator';
import { type RequestUser } from '../../../lib/auth/request-user.type';
import { ProfileDto } from '../dto/profile.dto';
import { ProfileService } from '../service/profile.service';

/**
 * A pessoa logada, para a tela mostrar o nome e o papel dela. Qualquer pessoa autenticada vê a
 * PRÓPRIA identidade — não há dado de outra pessoa aqui, e por isso não há policy a consultar.
 */
@ApiTags('Perfil')
@Controller('profile')
export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Devolve a pessoa que está usando o sistema',
    description:
      'Lida dos cabeçalhos do auth-forward (User Manager). Em desenvolvimento, sem proxy, é a pessoa fixa do ambiente.',
  })
  @ApiOkResponse({ type: ProfileDto })
  @ApiUnauthorizedResponse({ description: 'A requisição chegou sem identidade válida.' })
  me(@CurrentUser() user: RequestUser): ProfileDto {
    return this.service.me(user);
  }
}
