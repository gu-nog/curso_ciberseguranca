# Labs do curso de cibersegurança

`Nodejs`: framework para rodar javascript no servidor.
`Express`: framework do nodejs para fazer aplicações web.
`npm`: gerenciador de pacotes (bibliotecas) do nodejs

## Execução lab XSS

Primeiro instale o node na versão especificada em .nvmrc (ou use o nvm para isso).
`npm install express`
`node xss/{arquivo}.js`

## Execução lab SQLi

Primeiro instale o node na versão especificada em .nvmrc (ou use o nvm para isso).
Instale pacotes necessários: `npm install express sqlite3 body-parser`

### Time-based

Instalar docker: container

```bash
docker run --name mysql-sqli-lab \
-e MYSQL_ROOT_PASSWORD=rootpass \
-e MYSQL_DATABASE=sqli_lab \
-e MYSQL_USER=labuser \
-e MYSQL_PASSWORD=labpass \
-p 3307:3306 \
-d mysql:8
```

obs: comum é porta 3306, mas já estou usando ela

`npm install mysql2`

Ao final,

```bash
docker ps
docker stop {prefixo id}
docker rm {prefixo id}
```
