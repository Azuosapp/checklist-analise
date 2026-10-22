import { isAbsolute, relative } from 'node:path';

/**
 * Cache HTTP do build do client que o Nest serve (`ServeStaticModule` em `app.module.ts`).
 *
 * O padrão do `express.static` é `public, max-age=0` em TUDO: o navegador guarda o arquivo,
 * mas pergunta ao servidor a cada carga se ele mudou. Para o `index.html` é isso mesmo que
 * se quer; para os arquivos de `assets/` é uma ida e volta desperdiçada por arquivo, em toda
 * tela aberta — eles nunca mudam.
 *
 * Nunca mudam porque o Vite põe o hash do CONTEÚDO no nome (`index-B3x9kQ.js`): conteúdo novo
 * é nome novo, e o `index.html` novo aponta para ele. Por isso `assets/` pode ficar um ano no
 * navegador sem perguntar nada (`immutable`).
 *
 * Todo o resto fica `no-cache` — que NÃO é "não guarde": é "guarde, mas confira antes de usar"
 * (o ETag responde 304 sem corpo). Entram aqui o `index.html`, o fallback da SPA (que devolve
 * o mesmo `index.html` para qualquer rota da tela) e os arquivos de `public/`, que saem com o
 * nome de sempre (`favicon.ico`, `manifest.webmanifest`). Se algum deles ficasse em cache
 * longo, a pessoa continuaria vendo a versão velha depois do deploy — e, no caso do
 * `index.html`, pedindo arquivos de `assets/` que já não existem.
 */
export const IMMUTABLE_CACHE_CONTROL = 'public, max-age=31536000, immutable';
export const REVALIDATE_CACHE_CONTROL = 'no-cache';

/**
 * A pasta que o Vite gera com nome com hash. É o `build.assetsDir` do `client/vite.config.ts`
 * (o padrão do Vite, `assets`). Se lá mudar, muda aqui — senão tudo cai em `no-cache`, o que
 * é lento, mas nunca serve versão velha.
 */
const HASHED_ASSETS_DIR = 'assets';

/**
 * Decide o `Cache-Control` de um arquivo servido de `rootPath`.
 *
 * Recebe o caminho ABSOLUTO do arquivo no disco — é o que o `setHeaders` do `serve-static`
 * entrega —, e não a URL: assim `/tasks/assets/x.js` (uma rota da SPA, que cai no fallback e
 * devolve o `index.html`) nunca é confundida com um asset de verdade.
 *
 * Fora da raiz, na dúvida, é `no-cache`: o erro barato é revalidar à toa; o caro é congelar
 * por um ano um arquivo que muda.
 */
export function staticCacheControl(rootPath: string, filePath: string): string {
  const fromRoot = relative(rootPath, filePath);
  if (fromRoot === '' || fromRoot.startsWith('..') || isAbsolute(fromRoot)) {
    return REVALIDATE_CACHE_CONTROL;
  }

  /* As duas barras: no Windows o `relative` devolve `assets\x.js`. */
  const [firstSegment, ...rest] = fromRoot.split(/[\\/]/);
  if (firstSegment === HASHED_ASSETS_DIR && rest.length > 0) return IMMUTABLE_CACHE_CONTROL;

  return REVALIDATE_CACHE_CONTROL;
}
