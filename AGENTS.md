<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:ads-hyperframes -->
# ads/hyperframes — subprojeto de criativos

`ads/hyperframes/` tem seu próprio `package.json` com `"type": "module"`. O script principal é `ads/hyperframes/scripts/generate.js` — roda via `node ads/hyperframes/scripts/generate.js` a partir da raiz.

**Diretórios gitignored (não existem em fresh clone):**
- `ads/hyperframes/compositions/` — gerado pelo script, o script cria via `mkdirSync` antes de escrever
- `public/ads/` — espelho para o Next.js, gerado pelo `prebuild`

**Fluxo do prebuild (`package.json` root):**
1. Gera 45 compositions em `ads/hyperframes/compositions/`
2. Copia compositions → `public/ads/compositions/` (reescrevendo `src="../src/assets/logo.png"` → `src="/logo.png"`)
3. Copia static ads de `ads/` → `public/ads/static/` (reescrevendo paths de CSS e logo)

**Rota `/preview/ads`:** ferramenta interna, retorna 404 quando `VERCEL_ENV === 'production'`. Grade de criativos com modal de preview ao clicar.
<!-- END:ads-hyperframes -->
