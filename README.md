# Atacadão da Nuty

Landing page estática em HTML, CSS e JavaScript.

## Preparação local

Execute `node scripts/prepare-site.cjs` depois de alterar `content/products.json` ou `content/site.json`. O comando atualiza o catálogo estático, os metadados e o `robots.txt` em `dist/`; gera `sitemap.xml` somente quando há domínio e indexação autorizados. Não publica o site e não exige dependências de produção.

Vercel: framework Other; output directory `dist`; build `node scripts/prepare-site.cjs`; instalação vazia. Alterações de configuração são locais até uma publicação autorizada.

## SEO e Google

O domínio ainda será comprado pelo cliente. Não preencha a URL de produção com um endereço inventado. O único endereço verificado na Vercel nesta revisão foi `atacadao-nuty.vercel.app`, sem domínio próprio vinculado; ele não foi assumido como definitivo.

Em `content/site.json`:

- `siteUrl`: origem HTTPS definitiva, sem caminho ou parâmetros.
- `indexable`: manter `false` até a revisão final. Com domínio confirmado e liberação, mudar para `true`; isso gera canonical, sitemap e instruções de indexação. Deploys de preview da Vercel sempre recebem `noindex`.
- `analyticsMeasurementId`: ID GA4 real do fluxo Web, no formato `G-…`. Vazio mantém a integração inativa. O código também exige que o navegador esteja no domínio configurado.
- `searchConsoleVerification`: somente o valor `content` da meta tag fornecida pela conta Google para uma propriedade de prefixo de URL. Vazio não gera tag. Uma propriedade de domínio exige verificação DNS, que não é feita pelo site.

O consentimento bloqueia a biblioteca Google antes da permissão; o visitante pode recusar ou revogar em “Privacidade e cookies”. Não há tag ativa, conta GA4 vinculada ou propriedade Search Console verificada nesta entrega local. Veja [o relatório de entrega](docs/entrega.md).

## Verificação

Com Playwright disponível: `node tests/site.cjs` e `node tests/brand-curve.cjs`. Se necessário, a variável `PLAYWRIGHT_MODULE` pode apontar para o módulo já instalado e `PLAYWRIGHT_BROWSERS_PATH` para os navegadores existentes. Os testes de Analytics interceptam a biblioteca Google e usam uma configuração fictícia apenas em memória, sem coletar dados reais.

## Pendências
WhatsApp, endereços, horários, seis espaços de fotos, regras comerciais, arquivo licenciado da fonte Oktah Round, domínio e configuração das ferramentas Google. A relação concreta está em [docs/entrega.md](docs/entrega.md).
