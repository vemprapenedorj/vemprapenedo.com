# Vem Pra Penedo

Portal turístico de Penedo-RJ, desenvolvido com React, TypeScript, Vite e
pré-renderização estática para SEO.

## Run Locally

**Prerequisites:**  Node.js


1. Instale as dependências: `npm ci`
2. Inicie o ambiente local: `npm run dev`
3. Valide os dados: `npm run validate:db`
4. Gere o pacote de produção: `npm run build`

Não adicione segredos ao frontend. Variáveis públicas devem usar o prefixo
`VITE_` e estar documentadas em `.env.example`.

## Analytics e privacidade

O site utiliza o container `GTM-TTVH4RFS` com Consent Mode v2. A configuração
operacional do GA4 está documentada em `src/analytics/README.md`.
