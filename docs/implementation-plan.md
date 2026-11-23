# Revisão de entrega e SEO

Escopo autorizado: preservar a interface e a marquise, corrigir lacunas reais de funcionamento, preparar SEO, Google Analytics e Search Console sem dados inventados ou publicação.

- [x] Validar catálogo, contatos, acessibilidade e largura mínima; corrigir falhas reproduzidas.
- [x] Gerar catálogo no HTML a partir de dados únicos; manter filtros e seleção existentes.
- [x] Centralizar domínio, indexação, ID GA4 e verificação Search Console em configuração vazia por padrão.
- [x] Gerar metadados, canonical, dados estruturados, robots e sitemap somente com dados confirmados. Não marcar negócios locais sem endereço nem ofertas sem preço.
- [x] Preparar GA4 com consentimento prévio, recusa e revogação; medir apenas ações com valores controlados, sem dados de contato ou parâmetros da URL.
- [x] Testar configuração pendente e preenchida (com dados fictícios somente nos testes), catálogo sem JS, fluxos, responsividade e preferências de movimento.
- [x] Documentar fotos e dados pendentes, ativação e limitações; preparar mensagem factual para Jhad e doutor Luiz.

Validações: `node tests/site.cjs`, `node tests/brand-curve.cjs`, `node --check` e `git diff --check`. Site estático, sem dependências novas de produção; testes usam Playwright disponível no ambiente.
