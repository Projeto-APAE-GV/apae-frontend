# Sistema APAE - Frontend

Sistema de gestão para a APAE (Associação de Pais e Amigos dos Excepcionais) desenvolvido em React com TypeScript.

## 🚀 Tecnologias Utilizadas

- **React 18.3.1** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **React Router DOM 7.0.1** - Roteamento para aplicações React
- **React Hook Form 7.53.2** - Biblioteca para gerenciamento de formulários
- **Yup 1.4.0** - Validação de esquemas JavaScript
- **Axios 1.7.8** - Cliente HTTP para requisições à API
- **JWT-Decode 4.0.0** - Decodificação de tokens JWT
- **Day.js 1.11.13** - Manipulação de datas
- **Vite** - Build tool e servidor de desenvolvimento

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Cabecalho.tsx   # Cabeçalho da aplicação
│   └── RotaProtegida.tsx # Componente para rotas protegidas
├── pages/              # Páginas da aplicação
│   ├── Login.tsx       # Página de login
│   ├── Dashboard.tsx   # Tela inicial
│   ├── CadastroUsuario.tsx
│   ├── FichaProntuario.tsx
│   ├── Relatorio.tsx
│   └── BuscarCpf.tsx
├── services/           # Serviços HTTP
│   ├── BackendService.tsx
│   └── clients/
│       └── LoginClient.tsx
└── utils/              # Utilitários e validações
    ├── AuthUtils.tsx   # Funções de autenticação
    └── UsuarioDto.tsx  # Interface do usuário
```

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd apae-frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto:
```
VITE_URL_BACKEND=http://localhost:3000
```

4. Execute a aplicação:
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3001`

## 🔐 Autenticação

O sistema utiliza autenticação JWT. Para fazer login, use as credenciais:
- **Email:** admin@apae.com
- **Senha:** 123456

### Tipos de Usuário

- **admin:** Acesso completo ao sistema, incluindo cadastro de usuários
- **Outros tipos:** Acesso limitado (sem permissão para cadastro de usuários)

## 🎨 Funcionalidades

### ✅ Implementadas
- Sistema de login com validação
- Autenticação JWT com decodificação de token
- Rotas protegidas
- Dashboard com estatísticas e atalhos
- Menu superior responsivo
- Controle de acesso baseado no tipo de usuário
- Interface responsiva

### 🔄 Em Desenvolvimento
- Cadastro de usuários
- Ficha de prontuário
- Relatórios
- Busca por CPF

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a build de produção
- `npm run preview` - Visualiza a build de produção
- `npm run lint` - Executa o linter

## 🎯 Funcionalidades da Interface

### Login
- Formulário com validação usando React Hook Form e Yup
- Design responsivo com logo e identidade visual da APAE
- Feedback visual para erros de autenticação
- Redirecionamento automático após login

### Dashboard
- Estatísticas de usuários e prontuários
- Atalhos rápidos para funcionalidades principais
- Agenda do dia com horários e pacientes
- Seção de comunicados
- Layout responsivo com grid

### Navegação
- Menu superior com logo da APAE
- Links para todas as seções do sistema
- Informações do usuário logado
- Botão de logout
- Controle de visibilidade baseado em permissões

## 🔒 Segurança

- Validação de token JWT
- Rotas protegidas
- Controle de acesso por tipo de usuário
- Logout seguro com limpeza de token
- Redirecionamento automático para login quando não autenticado

## 📱 Responsividade

O sistema foi desenvolvido com design responsivo, adaptando-se a:
- Desktops (1200px+)
- Tablets (768px - 1023px)
- Smartphones (até 767px)

## 🎨 Design System

### Cores Principais
- **Azul APAE:** #4A90E2, #357ABD
- **Amarelo:** #FFD700, #FFA500
- **Verde:** #4CAF50, #1ABC9C
- **Cinza:** #f8f9fa, #6b7280

### Tipografia
- **Fonte:** Sistema (Apple System, Segoe UI, Roboto)
- **Tamanhos:** Escala consistente (0.8rem - 2rem)

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte, entre em contato com a equipe de desenvolvimento.