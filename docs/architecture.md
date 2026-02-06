## Arquitetura do Projeto

Este projeto utiliza uma arquitetura baseada em serviços:

- Frontend: Lovable (React + Vite)
- Backend: Supabase (Auth + Database)
- Automação: n8n (Webhooks e fluxos)
- Testes: Postman

Fluxo principal:
Usuário → Frontend → Supabase → n8n → Email
