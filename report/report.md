# Injeção persistente no campo username durante cadastro - [Stored Cross-Site Scripting (XSS)]

## Descrição

A aplicação permite que um atacante cadastre um nome de usuário contendo código JavaScript malicioso (ex.: `<img src=x onerror=alert(document.cookie)>`). Esse nome é armazenado no banco de dados e exibido sem sanitização adequada na página inicial, executando o script no navegador de qualquer visitante.

## Severidade

**Média** - Score = 5.3 `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:P/VC:N/VI:N/VA:N/SC:L/SI:L/SA:N`

**Justificativa:** A vulnerabilidade pode ser explorada remotamente pela rede (AV:N), com baixa complexidade (AC:L), sem requisitos especiais de ataque (AT:N) e sem necessidade de privilégios (PR:N). O atacante precisa apenas que a vítima acesse a página inicial, uma interação passiva do usuário (UI:P), que é involuntária e comum no uso normal da aplicação.

O impacto direto no sistema vulnerável (o servidor web) é nulo (VC:N/VI:N/VA:N), pois o XSS não corrompe o backend nem afeta sua disponibilidade. Entretanto, no sistema subsequente (o navegador da vítima), há perda limitada de confidencialidade (SC:L – ex.: roubo de cookies de sessão) e integridade (SI:L – ex.: injeção de conteúdo falso ou redirecionamento). Não há impacto na disponibilidade do sistema subsequente (SA:N). A pontuação final é 5.3 (Médio), refletindo um risco real, porém limitado ao ambiente do cliente.

## Technical Details

**Vulnerability:** Stored XSS (injeção persistente)

**Affected endpoints:**

- `POST /signup` (parâmetro `username`) – injeção do payload
- `GET /` (listagem de usuários) – execução do payload

**Request:**

```text/plain
POST /signup HTTP/1.1
Host: localhost:3000
Content-Type: application/x-www-form-urlencoded
Content-Length: 73

username=<img src=x onerror=alert(document.cookie)>&password=123
```

## Impact

**Confidentiality:** Roubo de cookies de sessão; acesso a contas de outros usuários

**Integrity:** Injeção de conteúdo falso na página (ex.: formulários de phishing, redirecionamentos)

**Availability:** Não impacta diretamente, embora scripts possam causar lentidão no navegador da vítima

**Business:** Violação da LGPD/GDPR (vazamento de dados pessoais sem consentimento); dano à reputação da empresa

## Scope

**Alvo:** Home do site

**Usuários afetados:** Qualquer visitante autenticado ou anônimo que acesse a página inicial

**Pré-condição:** Nenhuma – o ataque é público (basta cadastrar um usuário malicioso)

## PoC

<video src="./media/PoC.mp4" width="640" height="360" controls></video>

## Steps to Reproduce

1. Acesse `http://localhost:3000`
2. Cadastre um novo usuário com o nome: `<img src=x onerror=alert(document.cookie)>` e qualquer senha
3. Após o cadastro, clique no link para voltar à página inicial ou recarregue `/`
4. Observe a execução do alert mostrando os cookies atuais

**Tech stack:** Navegador: qualquer versão moderna com JavaScript habilitado

**Condições:** Não é necessário estar logado – o cadastro é público

## Fix Recommendation

### Correção Definitiva: Código Seguro

_Opção 1_

Substituir o filtro frágil (remover tag script) por escape de HTML contextual adequado. Exemplo em `javascript`:

```javascript
let users = usersFromDB.map((user) => escapeHtml(user.username));
```

_Opção 2_
Usar uma template engine com escape HTML, como EJS usando `<%=`

### Mitigações Adicionais

- **Content Security Policy (CSP):** Configurar `Content-Security-Policy: script-src 'self'` para bloquear execução de scripts inline
- **HttpOnly + Secure flags:** Aplicar nas cookies de sessão (impede acesso via `document.cookie`)
- **Validação de entrada:** Whitelist de caracteres alfanuméricos para nomes de usuário
- **Firewall de aplicação:** Implementar WAF (Web Application Firewall) para detecção de padrões XSS conhecidos

## References

- [CWE-79: Cross-site Scripting (XSS)](https://cwe.mitre.org/data/definitions/79.html)
- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [OWASP Testing Guide – Stored XSS](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/02-Testing_for_Stored_Cross_Site_Scripting)
