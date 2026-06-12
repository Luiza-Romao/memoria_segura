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

## Resumo das mudanças em relação à versão original

### Backend
- **`pom.xml`**: adicionado `spring-boot-starter-validation`; removido o
  conflito com starters de teste sem nome canônico (o Spring Boot 4
  renomeou os pares de teste — agora estão como `*-test`).
- **`application.properties`**: criado do zero (não existia), com
  configuração de MySQL, `ddl-auto=update` e Swagger habilitado.
- **Entidades**: convertidas para **Lombok** (`@Data`, `@NoArgsConstructor`,
  `@AllArgsConstructor`) — cortou ~40 linhas por classe de boilerplate.
  Adicionada validação com `@NotBlank`, `@Email`.
- **Novas entidades**: `Rotina`, `Cuidador`, `Idoso` (antes só existiam
  rotas no front sem nada no back).
- **`CorsConfig`**: substitui o `@CrossOrigin("*")` espalhado em cada
  controller por uma config global.
- **Controllers**: CRUD completo (`GET`, `GET/{id}`, `POST`, `PUT`, `DELETE`)
  em vez de só listar/salvar. `PATCH` para alternar "tomado/concluído".
- **Login**: novo endpoint `POST /usuarios/login` (autenticação simples;
  serve para o trabalho, **não use assim em produção**).

### Frontend
- **`package.json` e `vite.config.js`**: criados (não existiam).
- **`styles.css`**: design system completo do zero. Tipografia base **18px**,
  botões com altura **mínima de 56px**, paleta calma (azul profundo +
  verde acolhedor) com **alto contraste**, sombras suaves, foco visível
  para acessibilidade. Fontes Google: **Fraunces** (títulos) + **Nunito**
  (corpo).
- **`services/api.js`**: cliente axios centralizado — uma única URL base
  pra trocar quando precisar.
- **`Layout.jsx`**: novo componente com header sticky, botão de sair, marca
  do app.
- **`Login.jsx`**: visual repensado (card centralizado com sombra grande,
  marca, tagline), inputs **controlados**, integração real com o backend,
  tratamento de erro 401 vs falha de rede, opção "convidado".
- **`Dashboard.jsx`**: 4 botões viraram **4 cards** com ícone, título e
  descrição. Saudação personalizada.
- **`Medicamentos.jsx`**: a UI **não existia** no original — só tinha um
  `<h1>`. Reconstruída com formulário, lista, marcar/desmarcar tomado,
  editar, excluir, estado vazio.
- **`Rotina.jsx`**, **`Cuidador.jsx`**, **`Idoso.jsx`**: telas novas
  (eram só rotas sem implementação).

---

## Possíveis melhorias futuras

- Tela de **cadastro público** de usuário (hoje só Swagger ou seed manual).
- **Hash de senha** (BCrypt) — o login compara senha em texto puro,
  é didático mas inseguro.
- **Autenticação real** (JWT ou Spring Security com sessão).
- Relacionar `Medicamento`, `Rotina` etc. ao `Idoso` (`@ManyToOne`),
  hoje cada um existe solto.
- **Notificações** (push ou e-mail) nos horários dos remédios.
- **Testes** unitários e de integração nos controllers.
