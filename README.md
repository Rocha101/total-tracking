![print-atlas8](https://github.com/user-attachments/assets/9bcdfd93-384c-4086-98a0-3ea7523fcd6e)

# Iron Atlas

## Plataforma de Gestão para Fisiculturismo

## Sobre o Projeto

O Iron Atlas foi desenvolvido para atender às necessidades de atletas e treinadores de fisiculturismo, oferecendo uma plataforma completa e intuitiva para a gestão de treinos, alimentação, suplementação e protocolos hormonais. Hoje no mercado, não existe uma plataforma que atenda todas as necessidades de um coach de fisiculturismo, o Iron Atlas veio para suprir essa necessidade, com um sistema completo e integrado.

## Recursos Principais

### Planos de Treino Personalizados

Crie rotinas de exercícios sob medida para atender às necessidades e objetivos exclusivos de cada atleta, garantindo desempenho e progresso ideais.

### Planos Alimentares Personalizados

Desenvolva planos dietéticos individualizados adaptados às necessidades de cada atleta, otimizando a nutrição para o máximo desempenho e bem-estar.

### Protocolos Hormonais

Elabore protocolos hormonais personalizados alinhados com as necessidades e objetivos específicos de cada atleta, aprimorando os resultados do treinamento e a recuperação.

### Planos de Suplementação

Crie planos de suplementação personalizados de acordo com as necessidades de cada atleta.

### Suporte 24 Horas

Receba assistência 24 horas para atender prontamente às necessidades de atletas e treinadores, garantindo orientação e suporte contínuos.

### Totalmente Responsivo

Acesse a plataforma de forma fluida a partir de qualquer dispositivo, seja um smartphone, tablet ou computador, garantindo conveniência e flexibilidade para os usuários em movimento.

## Tecnologias Utilizadas

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Estilização**: Shadcn UI
- **Gerenciamento de Estado**: React Query
- **Validação de Formulários**: Zod

## Estrutura do Projeto

O projeto está estruturado da seguinte forma:

- **app/**: Contém os componentes e páginas da aplicação

  - **(auth)**: Páginas de autenticação (login, cadastro, recuperação de senha)
  - **(landing)**: Página inicial do site
  - **admin/**: Área administrativa para coaches
  - **app/**: Área do cliente/atleta

- **components/**: Componentes reutilizáveis

  - **ui/**: Componentes de interface do usuário
  - **forms/**: Componentes de formulários
  - **landing-page/**: Componentes específicos da landing page
  - **sidebar/**: Componentes da barra lateral

- **context/**: Contextos da aplicação (autenticação, etc.)

- **public/**: Arquivos estáticos (imagens, ícones, etc.)

## Instalação e Configuração

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn ou pnpm

### Passos para Instalação

1. Clone o repositório

   ```bash
   git clone [URL_DO_REPOSITÓRIO]
   cd total-tracking
   ```

2. Instale as dependências

   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   ```

3. Configure as variáveis de ambiente

   - Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`

4. Inicie o servidor de desenvolvimento

   ```bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev
   ```

5. Acesse a aplicação em `http://localhost:3000`

## Licença

© 2024 Rocha Soluções em Tecnologia. Todos os direitos reservados.
