# Publicação na Hostinger

## Antes de publicar

O domínio oficial indexável deve usar estas variáveis durante o build:

```text
SITE_URL=https://vemprapenedo.com
VITE_SITE_URL=https://vemprapenedo.com
ALLOW_INDEXING=true
```

Se o ambiente de build da Hostinger não conseguir iniciar o Chromium, defina
também `SKIP_PRERENDER=true`. Sem essa variável, o build tenta pré-renderizar
as páginas e, se o Chromium estiver indisponível, publica a versão SPA
funcional como alternativa.

Em `homologacao.vemprapenedo.com`, use as URLs do subdomínio e mantenha
`ALLOW_INDEXING=false`:

```text
SITE_URL=https://homologacao.vemprapenedo.com
VITE_SITE_URL=https://homologacao.vemprapenedo.com
ALLOW_INDEXING=false
```

## Deploy automático pelo GitHub

A integração da Hostinger de homologação deve acompanhar a branch
`homologacao`. A integração do site oficial deve acompanhar a branch `main`.
Nos dois ambientes, execute `npm ci` e depois `npm run build`, publicando a
pasta `dist/` e configurando as variáveis correspondentes acima.

No GitHub Desktop, revise os arquivos, crie um commit e use **Push origin**.
Um push em `homologacao` atualiza somente o ambiente de teste. Depois da
validação, faça o merge em `main` e envie `main` para atualizar o site oficial.
A publicação correspondente será iniciada pela Hostinger após o push.

## Arquivos publicados

Somente o conteúdo da pasta `dist/` deve ser enviado para a pasta pública do domínio, normalmente `public_html/`. Não envie `src/`, `node_modules/`, testes ou arquivos de configuração do projeto.

O upload deve incluir arquivos ocultos. Confirme especialmente a presença de:

- `dist/.htaccess`;
- `dist/index.html`;
- `dist/robots.txt`;
- `dist/sitemap.xml`;
- `dist/site.webmanifest`;
- `dist/assets/`.

## Verificação após o deploy

1. Abrir a home e uma página de cada categoria.
2. Atualizar diretamente uma URL interna no navegador.
3. Confirmar uma página Premium e um artigo.
4. Confirmar que uma URL inexistente mostra a página 404.
5. Verificar `/robots.txt` e `/sitemap.xml`.
6. Testar os redirects antigos com uma ferramenta de status HTTP.

Redirects esperados:

```text
/contatos -> /contato
/blog/penedo-guia -> /blog/artigo/penedo-guia
/detalhe/casa-da-picanha -> /gastronomia/casa-da-picanha
```

Os redirects devem responder com status HTTP 301.
