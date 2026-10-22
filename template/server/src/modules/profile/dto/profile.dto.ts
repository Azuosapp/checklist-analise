import { sessionUserSchema } from '@template/shared/schemas/user.schema';
import { createZodDto } from 'nestjs-zod';

export class ProfileDto extends createZodDto(sessionUserSchema) {}
