import { ProfileModule } from './modules/profile/profile.module';
import { join } from 'node:path';

import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { type Response } from 'express';
import { ZodValidationPipe } from 'nestjs-zod';

import { AuthModule } from './lib/auth/auth.module';
import { AppConfigModule } from './lib/config/app-config.module';
import { DbModule } from './lib/db/db.module';
import { staticCacheControl } from './lib/http/static-cache.util';
import { TasksModule } from './modules/tasks/tasks.module';

/**
 * Serve o build do client — sem Nginx, sem container à parte. Atrás do Traefik, esta
 * imagem responde `/` (SPA) e `/api` (Nest) sozinha. Em desenvolvimento a pasta não existe
 * (o Vite serve o client em :5173), e o `express.static` por baixo simplesmente devolve 404
 * em silêncio — não derruba o boot.
 */
const CLIENT_DIST = join(__dirname, '..', '..', 'client', 'dist');

/**
 * O pipe de validação é global: requisição com corpo fora do contrato é recusada antes de
 * chegar ao controller, e a resposta nomeia o campo. Dizer "dados inválidos" sem dizer qual
 * campo obriga a pessoa a adivinhar, e ela desiste antes de acertar.
 *
 * MÓDULO NOVO ENTRA NA LISTA DE `imports`. Esquecer é o motivo nº 1 de "a rota dá 404".
 */
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: CLIENT_DIST,
      exclude: ['/api/{*path}', '/docs', '/docs-json'],
      serveStaticOptions: {
        /* Arquivo com hash (`assets/`) fica um ano no navegador; o resto revalida a cada carga
           — o porquê está em `static-cache.util.ts`. O `serve-static` chama isto também no
           fallback da SPA, com o caminho do `index.html`, e o `send` não sobrescreve um
           `Cache-Control` que já veio definido. As rotas de `/api` não passam por aqui: estão
           no `exclude` e não existem como arquivo no `dist`. */
        setHeaders: (response: Response, filePath: string) => {
          response.setHeader('Cache-Control', staticCacheControl(CLIENT_DIST, filePath));
        },
      },
    }),
    AppConfigModule,
    /* `@Global` só vale a partir do momento em que o módulo é registrado UMA vez. Sem esta
       linha o token `DB` não existe em lugar nenhum, e todo repository falha na injeção. */
    DbModule,
    AuthModule,
    ProfileModule,
    TasksModule,
  ],
  providers: [{ provide: APP_PIPE, useClass: ZodValidationPipe }],
})
export class AppModule {}
