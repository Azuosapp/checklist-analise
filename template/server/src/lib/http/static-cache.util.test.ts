import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  IMMUTABLE_CACHE_CONTROL,
  REVALIDATE_CACHE_CONTROL,
  staticCacheControl,
} from './static-cache.util';

const ROOT = join('/repo', 'client', 'dist');

describe('staticCacheControl', () => {
  // feliz
  it('caches hashed files under assets/ for a year, as immutable', () => {
    expect(staticCacheControl(ROOT, join(ROOT, 'assets', 'index-B3x9kQ.js'))).toBe(
      IMMUTABLE_CACHE_CONTROL,
    );
    expect(staticCacheControl(ROOT, join(ROOT, 'assets', 'index-Dd81aZ.css'))).toBe(
      IMMUTABLE_CACHE_CONTROL,
    );
  });

  it('caches files in nested folders under assets/ as immutable too', () => {
    expect(staticCacheControl(ROOT, join(ROOT, 'assets', 'fonts', 'inter-Ab12.woff2'))).toBe(
      IMMUTABLE_CACHE_CONTROL,
    );
  });

  /* O `index.html` é o que aponta para os nomes novos depois do deploy. Em cache longo, a
     pessoa ficaria presa na versão velha, pedindo arquivos que já foram apagados. */
  it('revalidates index.html, which is also what the SPA fallback serves', () => {
    expect(staticCacheControl(ROOT, join(ROOT, 'index.html'))).toBe(REVALIDATE_CACHE_CONTROL);
  });

  it('revalidates files copied from public/, whose names carry no hash', () => {
    expect(staticCacheControl(ROOT, join(ROOT, 'favicon.ico'))).toBe(REVALIDATE_CACHE_CONTROL);
    expect(staticCacheControl(ROOT, join(ROOT, 'manifest.webmanifest'))).toBe(
      REVALIDATE_CACHE_CONTROL,
    );
  });

  // triste
  it('does not treat a file merely named like the folder as a hashed asset', () => {
    expect(staticCacheControl(ROOT, join(ROOT, 'assets'))).toBe(REVALIDATE_CACHE_CONTROL);
    expect(staticCacheControl(ROOT, join(ROOT, 'assets-old', 'x.js'))).toBe(
      REVALIDATE_CACHE_CONTROL,
    );
  });

  /* Só a pasta `assets/` NA RAIZ do build tem hash. Uma pasta `assets` dentro de `public/`
     (ex.: `public/img/assets/logo.png`) sai com o nome original. */
  it('does not treat an assets/ folder below the root as hashed', () => {
    expect(staticCacheControl(ROOT, join(ROOT, 'img', 'assets', 'logo.png'))).toBe(
      REVALIDATE_CACHE_CONTROL,
    );
  });

  it('revalidates anything outside the root', () => {
    expect(staticCacheControl(ROOT, join('/repo', 'client', 'assets', 'x.js'))).toBe(
      REVALIDATE_CACHE_CONTROL,
    );
    expect(staticCacheControl(ROOT, ROOT)).toBe(REVALIDATE_CACHE_CONTROL);
  });
});
