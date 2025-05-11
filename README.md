# Sistema de Processamento de Documentos com IA

Este projeto é um sistema completo para processamento de documentos que inclui OCR (Reconhecimento Óptico de Caracteres), extração de texto e um chat interativo com IA para análise dos documentos.

## Funcionalidades

- Upload de documentos (imagens)
- Extração de texto usando OCR (Tesseract)
- Histórico de documentos processados
- Chat interativo com IA (GPT-3.5-turbo) para análise dos documentos
- Download de documentos e textos extraídos
- Autenticação de usuários

## Tecnologias Utilizadas

### Backend
- NestJS
- Prisma (ORM)
- PostgreSQL
- Tesseract.js (OCR)
- OpenAI API (GPT-3.5-turbo)
- JWT para autenticação

### Frontend
- React
- TypeScript
- Axios
- CSS Modules
- JSZip (para download de arquivos)

## Pré-requisitos

- Node.js (v16 ou superior)
- PostgreSQL
- Conta na OpenAI (para API key)
- NPM ou Yarn

## Configuração do Ambiente

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd [NOME_DO_PROJETO]
```

2. Instale as dependências do backend:
```bash
cd backend
npm install
```

3. Instale as dependências do frontend:
```bash
cd ../frontend
npm install
```

4. Configure as variáveis de ambiente:

No diretório `backend`, crie um arquivo `.env`:
```env
# Banco de dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"

# JWT
JWT_SECRET="seu_jwt_secret"

# OpenAI
OPENAI_API_KEY="sua_openai_api_key"
```

No diretório `frontend`, crie um arquivo `.env`:
```env
REACT_APP_API_URL="http://localhost:3000"
```

5. Execute as migrações do banco de dados:
```bash
cd backend
npx prisma migrate dev
```

## Executando o Projeto

> **IMPORTANTE**: O backend DEVE estar rodando tanto localmente quanto para a aplicação no Vercel para que o frontend funcione corretamente. O frontend faz chamadas para `http://localhost:3000` por padrão.

1. Inicie o backend primeiro:
```bash
cd backend
npm run start:dev
```

2. Verifique se o backend está rodando corretamente:
   - Acesse `http://localhost:3000` no navegador
   - Você deve ver uma mensagem indicando que o servidor está funcionando
   - Verifique o terminal do backend para garantir que não há erros

3. Em outro terminal, inicie o frontend:
```bash
cd frontend
npm start
```

O backend estará disponível em `http://localhost:3000` e o frontend em `http://localhost:3001`.

> **Nota**: Se você alterar a porta do backend (através da variável de ambiente `PORT`), lembre-se de atualizar a variável `REACT_APP_API_URL` no frontend para apontar para a nova porta.

### Solução de Problemas Comuns

1. **Backend não está respondendo**
   - Verifique se o terminal do backend está rodando sem erros
   - Confirme se a porta 3000 não está sendo usada por outro processo
   - Verifique se todas as variáveis de ambiente estão configuradas corretamente

2. **Frontend não consegue se conectar ao backend**
   - Confirme se o backend está rodando em `http://localhost:3000`
   - Verifique se a variável `REACT_APP_API_URL` no frontend está correta
   - Verifique se não há bloqueios de CORS (Cross-Origin Resource Sharing)

3. **Erro de conexão com o banco de dados**
   - Verifique se o PostgreSQL está rodando
   - Confirme se as credenciais no `DATABASE_URL` estão corretas
   - Execute `npx prisma migrate status` para verificar o estado das migrações

## Estrutura do Projeto

```
projeto/
├── backend/
│   ├── src/
│   │   ├── documents/
│   │   │   ├── documents.controller.ts
│   │   │   └── documents.service.ts
│   │   ├── auth/
│   │   └── main.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── DocumentChat.tsx
    │   │   └── DocumentChat.css
    │   ├── pages/
    │   │   ├── History.tsx
    │   │   └── History.css
    │   └── App.tsx
    └── package.json
```

## Uso do Sistema

1. **Autenticação**
   - Faça login no sistema usando suas credenciais
   - O token JWT será armazenado automaticamente

2. **Upload de Documentos**
   - Acesse a página de upload
   - Selecione uma imagem (JPG, PNG, GIF)
   - O sistema processará automaticamente o documento

3. **Histórico de Documentos**
   - Acesse a página de histórico
   - Visualize todos os documentos processados
   - Clique em "Ver" para expandir os detalhes

4. **Chat com IA**
   - No histórico, clique em "Ver" em um documento
   - Use o chat para fazer perguntas sobre o documento
   - As interações são salvas e podem ser consultadas posteriormente

5. **Download de Documentos**
   - No histórico, clique em "Baixar"
   - O sistema gerará um arquivo ZIP contendo:
     - A imagem original
     - O texto extraído em formato .txt

## API Endpoints

### Documentos
- `POST /documents/upload` - Upload de documento
- `GET /documents/history` - Histórico de documentos
- `POST /documents/:id/ask` - Fazer pergunta sobre documento
- `GET /documents/:id/interactions` - Histórico de interações

### Autenticação
- `POST /auth/login` - Login
- `POST /auth/register` - Registro

## Modelos do Banco de Dados

### Document
```prisma
model Document {
  id            String   @id @default(uuid())
  fileName      String
  fileType      String
  fileBase64    String
  fileUrl       String
  fileId        String
  userId        String
  extractedText String?
  status        String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  llmInteractions LlmInteraction[]
}
```

### LlmInteraction
```prisma
model LlmInteraction {
  id          String   @id @default(uuid())
  documentId  String
  document    Document @relation(fields: [documentId], references: [id])
  query       String
  response    String
  createdAt   DateTime @default(now())
}
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## Suporte

Para suporte, envie um email para [seu-email@dominio.com] ou abra uma issue no repositório.
