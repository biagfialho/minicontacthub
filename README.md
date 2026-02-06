# Welcome my first Lovable project

## Project info

**URL**: [https://lovable.dev/projects/minicontahub](https://minicontacthub.lovable.app/login)

# MiniContactHub

MiniContactHub é uma aplicação web desenvolvida como **projeto prático de integração e testes**, com o objetivo de demonstrar a construção de um protótipo funcional utilizando **Lovable**, **Supabase**, **n8n** e **Postman**.

O projeto simula um sistema de **cadastro de usuários**, com **autenticação**, **armazenamento seguro de dados** e **automações**, aplicando boas práticas de **qualidade de software, segurança e integração entre sistemas**.

---

## 🔗 Aplicação em Produção

- **Frontend (Lovable)**  
  👉 https://preview--minicontacthub.lovable.app/

- **Repositório GitHub**  
  👉 https://github.com/biagfialho/minicontacthub

---

## 🎯 Objetivo do Projeto

Este projeto foi criado para:

- Desenvolver um **protótipo web funcional**
- Implementar **login e cadastro de usuários**
- Integrar frontend com **Supabase (Auth + Database)**
- Criar **fluxos automatizados no n8n**
- Testar integrações usando **Postman**
- Aplicar **boas práticas de segurança e controle de acesso**
- Demonstrar **mentalidade de QA e testes de integração**

---

## 🧠 Visão Geral da Solução

O MiniContactHub funciona como um hub simples de contato, onde:

1. O usuário se cadastra na aplicação
2. Os dados são processados com segurança
3. Um fluxo automatizado é disparado
4. A comunicação ocorre de forma integrada entre sistemas

---

## 🧩 Arquitetura da Aplicação

```text
Usuário
  ↓
Frontend (Lovable / React)
  ↓
Supabase
  ├── Authentication (Login / Cadastro)
  ├── Database (armazenamento de dados)
  └── RLS (Row Level Security)
  ↓
n8n
  ├── Webhooks
  ├── Automação de fluxos
  └── Envio de mensagens
```

🚀 Tecnologias Utilizadas,

* Frontend
* React
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* Backend / Infraestrutura
* Supabase
* Authentication
* Database
* Row Level Security (RLS)
* Automação
* n8n

Webhooks

* Fluxos automatizados
* Testes e Validação
* Postman (testes de webhook e payload)
* Testes manuais de interface
* Testes de segurança e autenticação

🔐 Segurança

O projeto aplica conceitos básicos e intermediários de segurança:

* Autenticação via Supabase Auth
* Políticas de Row Level Security (RLS)
* Restrição de acesso a dados sensíveis
* Proteção contra acesso não autenticado
* Boas práticas recomendadas pelo scanner de segurança do Lovable
* Variáveis sensíveis isoladas em ambiente

🔄 Fluxos Automatizados (n8n)

📌 Fluxo: Cadastro de Usuário

* Trigger: Webhook
* Entrada: nome, email, menssagem

  * Processos:

    * Validação do payload
    * Organização dos dados
    * Disparo de automação (ex: email de boas-vindas)

📌 Fluxo: Comunicação Automatizada

* Execução baseada em eventos
* Possibilidade de extensão para envios periódicos
* Estrutura preparada para novos fluxos


📌 Boas Práticas Aplicadas

* Separação de responsabilidades
* Integração entre múltiplas plataformas
* Segurança desde a concepção
* Testes como parte do desenvolvimento
* Documentação clara e objetiva

📚 Aprendizados

Durante o desenvolvimento deste projeto, foram consolidados conhecimentos em:

* Integração frontend e backend
* Automação de processos com n8n
* Uso do Supabase como backend completo
* Testes de integração com Postman
* Importância da documentação técnica
* Visão de qualidade de software (QA)

👩‍💻 Autora

Bianca Fialho 
Formada em Administração, em transição para a área de tecnologia, com foco em Qualidade de Software (QA), testes de integração e boas práticas de desenvolvimento.
Conheça meu [Linkedin](www.linkedin.com/in/biancafialhoo)
