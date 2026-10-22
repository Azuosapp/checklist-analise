import { Module } from '@nestjs/common';

import { ProfileController } from './controller/profile.controller';
import { ProfileService } from './service/profile.service';

/**
 * O índice da pasta. Sem repository: não há tabela de pessoa neste sistema (a identidade chega
 * pelo auth-forward).
 */
@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
