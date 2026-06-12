# Memória Segura

Aplicativo de auxílio a idosos, cuidadores e familiares.
Permite cadastrar **medicamentos**, **rotina diária**, **cuidadores** e a
**ficha de saúde do idoso**, com login simples.

```
memoria-segura/
├── backend/    Spring Boot 4.0.6 + Java 21 + MySQL
└── frontend/   React 18 + Vite + React Router
```

---

## ✅ Pré-requisitos

| Ferramenta | Versão sugerida |
|---|---|
| Java JDK | 21+ |
| Maven | 3.9+ (ou use o Maven embutido do IntelliJ) |
| MySQL | 8.x rodando em `localhost:3306` |
| Node.js | 18+ |
| npm | 9+ |

---

## 1) Subir o backend (IntelliJ)

1. Abra o IntelliJ → **File → Open** → selecione a pasta `backend`.
2. Espere o IntelliJ baixar as dependências do Maven (ícone do Maven na barra lateral direita).
3. Confira no `application.properties` o usuário e senha do MySQL:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=root
   ```
   Ajuste se o seu MySQL usa outro login.
4. O parâmetro `createDatabaseIfNotExist=true` na URL faz o MySQL **criar a database
   `memoria_segura` automaticamente** na primeira execução — não precisa rodar
   nenhum script.
5. Rode a classe `MemoriaSeguraApplication` (ícone ▶️ verde ao lado do `main`).
6. Backend disponível em **http://localhost:8080**.
7. Documentação interativa da API em **http://localhost:8080/swagger-ui.html**.

### Endpoints

| Recurso | Endpoints |
|---|---|
| Usuários | `GET/POST/PUT/DELETE /usuarios`, `POST /usuarios/login` |
| Medicamentos | `GET/POST/PUT/DELETE /medicamentos`, `PATCH /medicamentos/{id}/tomado` |
| Rotinas | `GET/POST/PUT/DELETE /rotinas`, `PATCH /rotinas/{id}/concluida` |
| Cuidadores | `GET/POST/PUT/DELETE /cuidadores` |
| Idosos | `GET/POST/PUT/DELETE /idosos` |

---

## 2) Subir o frontend (React)

Em outro terminal, na raiz do projeto:

```bash
cd frontend
npm install
npm run dev
```

Frontend disponível em **http://localhost:5173** (abre automaticamente no navegador).

---

## 3) Primeiro uso

Como ainda não há tela de cadastro pública, o jeito mais rápido de testar é:

**Opção A — Entrar como convidado.** No login, clique em "Continuar como convidado".

**Opção B — Criar um usuário pelo Swagger.** Acesse <http://localhost:8080/swagger-ui.html>,
expanda o `POST /usuarios`, clique em "Try it out" e envie:

```json
{
  "nome": "Maria",
  "email": "maria@exemplo.com",
  "senha": "1234",
  "tipo": "FAMILIAR"
}
```

Depois é só voltar ao login e usar `maria@exemplo.com` / `1234`.

---

