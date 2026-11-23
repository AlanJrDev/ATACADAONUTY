# Entrega local — 23/11/2026

Estrutura, navegação e catálogo revisados no projeto local; sem publicação, push ou alteração de conta Google. A marquise curva foi preservada. O domínio definitivo ainda será comprado e informado pelo cliente.

## Implementado e verificado

- Catálogo de 12 produtos no HTML, disponível sem JavaScript, a partir de `content/products.json`. Filtros, variantes e consulta por loja continuam funcionando com JavaScript.
- Correção do cabeçalho em 320 px, menu fechável por Escape, link para pular ao conteúdo e nomes acessíveis dos diálogos.
- Descrição das variantes nas imagens, prioridade da imagem principal e fonte com `font-display: swap`.
- Título e descrição com marca, produtos e região; metadados de compartilhamento preparados.
- Gerador sem dependências para canonical, dados estruturados WebSite/Organization, robots e sitemap de uma única página. URLs e dados estruturados absolutos só são emitidos depois de informado o domínio. Sem preço, telefone, endereço, avaliação ou horário inventados; sem marcação de ofertas ou LocalBusiness incompleto.
- Preparação da meta tag Search Console para propriedade de prefixo de URL. Não houve verificação ou envio de sitemap ao Google.
- Preparação do GA4 em `dist/privacy.js`, com escolha prévia, recusa persistente, revogação, remoção dos cookies `_ga` deste site e recarga para descarregar a biblioteca Google. Sem biblioteca Google antes da permissão e sem medição fora do domínio configurado. Publicidade e Google Signals desabilitados.
- Eventos preparados: `page_view`, `product_filter`, `product_interest`, `store_select` e `contact_click` (Instagram). Representam ações no site, não pedidos, vendas ou leads confirmados. Não enviam texto de consultas, telefones, dados pessoais ou query strings. A origem de referência é reduzida ao domínio; parâmetros de campanha da URL não são enviados pelo código.
- Informação de privacidade e controle de cookies no rodapé. Não havia política anterior no repositório. A identidade/contato definitivo do responsável pelo tratamento também precisa ser confirmada pela Nuty.

## Estado das integrações

| Item | Situação real |
| --- | --- |
| Domínio | Pendente de compra e envio pelo cliente. Nenhuma compra realizada. |
| Endereço Vercel encontrado | `atacadao-nuty.vercel.app`, sem domínio próprio vinculado nesta consulta. Não utilizado como canonical definitivo. |
| Indexação | `noindex,follow` no HTML local; `robots.txt` permite rastrear a página para ler essa instrução. Não é bloqueio de acesso ou autenticação. |
| Canonical e dados estruturados absolutos | Gerador pronto; aguardam `siteUrl`. |
| Sitemap | Gerador pronto; arquivo não emitido enquanto domínio/indexação estiverem pendentes. |
| Google Analytics | Inativo: ID real e domínio ausentes. Consentimento validado com biblioteca simulada, sem coleta real. |
| Search Console | Meta tag preparada no gerador, token ausente; propriedade não vinculada/verificada. Não há ferramenta de conta Search Console conectada nesta execução. |

## Fotos pendentes: cinco espaços

| Local no site | Material a receber | Referência |
| --- | --- | --- |
| Nossas lojas — Vicente Pires | Fotografia real da unidade | `dist/index.html`, `#lojas .store-photo` |
| Nossas lojas — Ceilândia | Fotografia real da unidade | `dist/index.html`, `#lojas .store-photo.second` |
| Catálogo — Sorvete trufado | Foto oficial da linha 1,8 L | `content/products.json`, produto “Sorvete trufado” |
| Catálogo — Picolé de fruta | Foto oficial da linha à base de água | `content/products.json`, produto “Picolé de fruta” |
| Catálogo — Picolé à base de leite | Foto oficial da linha | `content/products.json`, produto “Picolé à base de leite” |

Foram conferidos os 26 arquivos `p0.webp` a `p25.webp` e todas as variantes usadas no catálogo. Há imagens de produtos na Hero, no atacado e nas demais entradas do catálogo. Os arquivos sem uso são um pudim sem embalagem, uma tampa/embalagem de pudim e a marca Boozy (`p0`, `p1`, `p9`); eles não substituem as cinco fotos ainda pendentes.

A foto do copo azul da Nuty enviada pelo usuário foi inserida no self-service em 23/11/2026. Os arquivos `dist/assets/self-service-nuty-640.webp` e `self-service-nuty-1280.webp` são versões otimizadas da mesma fotografia, sem alteração criativa. O enquadramento 4:3 preserva a altura da foto e recorta apenas o fundo nas laterais, mantendo sorvete e marca visíveis. Esta é uma foto do produto fornecida para essa seção, não uma comprovação visual do espaço físico da unidade.

## Outros materiais/dados ainda necessários

- WhatsApp de cada unidade. Até receber, o atendimento orienta o usuário para os perfis de Instagram já existentes no projeto; não há pedido ou envio automático.
- Endereço completo e horários de Vicente Pires e Ceilândia.
- Preço, dias/horários aplicáveis e regras da quinta promocional.
- Condições de atacado, pedido mínimo, exigência ou não de CNPJ, entrega e retirada.
- Confirmação das linhas/sabores ainda previstos e do volume do DUO; não foram deduzidos das fotografias.
- Arquivo licenciado da fonte Oktah Round e validação visual comercial final. A fonte alternativa existente foi preservada.

## Ativação após receber os dados

1. Confirmar o domínio comprado e apontá-lo ao projeto Vercel, com HTTPS. Não houve alteração de DNS nesta execução.
2. Preencher `siteUrl`. Revisar contatos, fotos, conteúdo comercial e a informação de privacidade com a Nuty.
3. Na conta do cliente, criar/selecionar o fluxo Web do GA4 e fornecer o ID de medição `G-…`. Revisar retenção de dados, permissões e medições otimizadas da propriedade: deixar desativada a medição automática de formulários/cliques/URLs se não houver revisão específica, para manter somente os eventos e dados controlados por este código. O teste com biblioteca simulada não substitui essa conferência da conta real.
4. No Search Console, escolher propriedade de domínio (validação via DNS) ou prefixo da URL HTTPS (meta tag); fornecer o registro DNS ou o valor da meta tag correspondente. Não usar Analytics como prova de verificação porque a tag depende de consentimento.
5. Preencher o ID/token real quando aplicável, executar `node scripts/prepare-site.cjs` e conferir o HTML gerado. Definir `indexable: true` somente na liberação final; previews Vercel continuam com `noindex`.
6. Após autorização de publicação, verificar URLs e redirecionamentos reais, status HTTP, canonical, robots e sitemap no domínio. Verificar a propriedade no Search Console e enviar `/sitemap.xml`.
7. Testar aceitar/recusar/revogar no domínio real, conferir as requisições com Tag Assistant e a chegada dos eventos em Tempo real/DebugView do GA4. Não foi constatada coleta em uma propriedade real nesta execução.

A menor solicitação técnica para avançar nas ferramentas Google é: domínio comprado, ID GA4 e opção de verificação Search Console com o token/registro fornecido pela conta do cliente (ou acesso autorizado para configurar essas propriedades). Não são necessárias senhas compartilhadas.

## Validações e limites

- `node tests/site.cjs`: configuração SEO pendente e preenchida em teste, catálogo sem JS, alvos de navegação, foco do link de pular ao conteúdo (com e sem movimento reduzido), imagens de todas as variantes, menu em 320 px, diálogos, filtros, seleção, contato por Instagram e consentimento/recusa/revogação, incluindo remoção de cookies de teste e ausência de query strings nos eventos.
- `node tests/brand-curve.cjs`: geometria fixa em 320, 390, 768, 1440 e 1920 px; movimento, pausa, hover, parada fora da tela e movimento reduzido inicial e dinâmico.
- Conferência visual em 1440 e 320 px e inspeção dos arquivos de imagem.
- Sintaxe JavaScript e diferenças de Git conferidas. Não há pacote ou compilação de framework; a preparação usa apenas Node.
- Navegador automatizado: Chromium. Não foram testados aparelhos físicos, Safari ou Firefox, nem recebimento real de mensagens/vendas ou as respostas dos perfis do Instagram.
- As regras Vercel e ferramentas Google aguardam validação depois da publicação autorizada. Este relatório não declara indexação, posição na busca, visitas ou conversões reais.

## Arquivos da entrega

- Alterados: `dist/index.html`, `dist/app.js`, `dist/style.css`, `vercel.json` e `README.md`.
- Novos: `dist/privacy.js`, `dist/robots.txt`, `content/site.json`, `content/products.json`, `scripts/prepare-site.cjs`, `tests/site.cjs`, `tests/brand-curve.cjs`, `docs/implementation-plan.md` e este `docs/entrega.md`. O teste da curva veio da etapa anterior e foi preservado.
- `dist/sitemap.xml` será gerado depois de configurar o domínio e liberar a indexação; não existe um sitemap com domínio fictício nesta entrega.

## Documentação oficial utilizada

- [Consentimento básico da tag Google](https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic): biblioteca bloqueada até a permissão.
- [Controles de privacidade da tag](https://developers.google.com/tag-platform/security/guides/privacy): bloqueio de medição e recursos de publicidade.
- [Verificação Search Console](https://support.google.com/webmasters/answer/9008080?hl=pt-BR): prefixo por meta tag e propriedade de domínio via DNS.
- [Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) e [canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls): URLs absolutas definitivas.

## Mensagem pronta para Jhad e doutor Luiz

Jhad e doutor Luiz, tudo bem?

Concluí a estrutura e a revisão funcional do site do Atacadão da Nuty, incluindo navegação, catálogo de produtos, seleção de opções e encaminhamento para os canais das lojas. Também finalizei o ajuste das palavras que acompanham a curva abaixo da apresentação inicial.

As fotos reais das duas unidades e das linhas de sorvete trufado e picolés serão inseridas assim que vocês disponibilizarem os arquivos. Para fechar os dados de atendimento, ainda precisamos confirmar WhatsApp, endereços, horários e condições comerciais.

Como bônus fora do contrato, incluí melhorias de SEO e deixei preparada a integração com Google Search Console e Google Analytics. O SEO ajuda os buscadores a compreender o conteúdo; o Search Console permite acompanhar a presença do site na busca e identificar problemas de indexação. O Analytics permitirá entender a audiência, de onde vêm as visitas e ações como consultar produtos ou escolher uma loja, respeitando a escolha de privacidade do visitante. Essas ações não equivalem automaticamente a vendas.

A ativação das ferramentas e a publicação final ficarão para depois da compra e configuração do domínio e da disponibilização das contas/códigos do Google. As ferramentas ainda não estão ativas, e esse trabalho não representa promessa de posição no Google.

Com o domínio, os dados e as fotos em mãos, concluímos essa etapa para a publicação.
