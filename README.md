# OdinhaBot

Bot de Discord para apoiar sessões de RPG. O projeto começou como um rolador
de dados e foi ganhando recursos de configuração por servidor e integração com
fichas de personagem em planilhas.

## Funcionalidades

- **Rolagem de dados:** interpreta expressões como `1d20`, `2d6+3` e `4#d6`,
  exibe os resultados individuais e calcula expressões com operadores
  matemáticos.
- **Canal de rolagens configurável:** administradores podem escolher em qual
  canal o bot deve responder a rolagens. Sem um canal definido, ele aceita
  rolagens nos canais do servidor.
- **Fichas em planilhas:** permite que cada pessoa registre uma planilha do
  Google Sheets e consulte valores de células vinculados a comandos de ficha.
- **Insultos opcionais:** o bot pode responder ocasionalmente às mensagens com
  um insulto bem-humorado. Esse recurso fica ativado por padrão e pode ser
  desligado por servidor.

## Comandos do Discord

| Comando | Descrição | Permissão |
| --- | --- | --- |
| `/register_sheet url:<link>` | Registra a planilha de personagem da pessoa no servidor atual. | Membro do servidor |
| `/server_settings dice_channel chat:<canal>` | Define o canal usado para rolagens. | Administrador |
| `/server_settings insult status:<on\|off>` | Ativa ou desativa os insultos no servidor. | Administrador |

Após registrar a planilha, comandos de ficha começam com `>` (por exemplo,
`>ataque`). O comando precisa estar associado a uma célula da ficha para que o
bot possa buscar o valor e usá-lo na rolagem.

### Exemplos de rolagem

```text
1d20
2d6 + 3
4#d6
1d20 + 5 ataque poderoso
```

O número antes de `#` indica quantas vezes repetir a rolagem. O limite é de
100 repetições por mensagem; cada dado pode ter até 200 rolagens e 1.000 faces.

## Requisitos

- Node.js e npm
- Uma aplicação e um bot criados no [Discord Developer Portal](https://discord.com/developers/applications)
- Um banco de dados MySQL ou MariaDB
- Acesso à API do Google Sheets para consultar as planilhas

No portal do Discord, habilite o intent **Message Content** para o bot. Ele
também precisa poder ver os canais, ler e enviar mensagens e usar comandos de
aplicação no servidor.

## Configuração

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie um arquivo `.env` na raiz do projeto. Use `.env.example` como referência
   e configure as variáveis:

   | Variável | Uso |
   | --- | --- |
   | `DISCORD_TOKEN` | Token do bot do Discord. |
   | `DISCORD_CLIENT_ID` | ID da aplicação do Discord. |
   | `DATABASE_HOST` | Host do banco de dados. |
   | `DATABASE_PORT` | Porta do banco de dados. |
   | `DATABASE_USER` | Usuário do banco de dados. |
   | `DATABASE_PASSWORD` | Senha do banco de dados. |
   | `DATABASE_NAME` | Nome do banco de dados. |
   | `DATABASE_URL` | URL de conexão usada pelas ferramentas do Prisma. |
   | `GOOGLE_SHEETS_API` | Credencial/configuração de acesso à API do Google Sheets. |

   Mantenha tokens, senhas e credenciais fora do controle de versão. O arquivo
   `.env` já está listado no `.gitignore`.

3. Gere o cliente do Prisma e prepare o banco de dados:

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. Inicie o bot em modo de desenvolvimento:

   ```bash
   npm run dev
   ```

Ao iniciar, o bot conecta ao banco de dados e atualiza os comandos de
aplicação nos servidores em que está presente.

## Scripts disponíveis

| Script | Descrição |
| --- | --- |
| `npm run dev` | Executa o bot em modo de desenvolvimento, com reinício automático ao alterar arquivos. |
| `npm run build` | Gera a build de produção em `dist/`. |
| `npm start` | Inicia a build de produção. |

Para produção, gere a build com `npm run build` e inicie com `npm start`.
