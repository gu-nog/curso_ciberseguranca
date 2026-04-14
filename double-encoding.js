const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send(
    `<form action="/search">
        <label for="query_field">Digite sua busca</label><br>
        <input type="text" id="query_field" name="q"><br>
        <input type="submit" value="Buscar">
    </form>`,
  );
});

app.get("/search", (req, res) => {
  let query = req.query.q || "";

  console.log("===========");
  console.log("original", query);

  // Primeira decodificação
  query = decodeURIComponent(query);

  console.log("versão 2", query);

  // Filtro básico - bloqueia < e >
  if (query.includes("<") || query.includes(">")) {
    res.send(`<h1>Bloqueado - Caracteres perigosos detectados!</h1>`);
    return;
  }

  // Segunda decodificação (vulnerável)
  query = decodeURIComponent(query);

  console.log("versão final", query);

  res.send(`<h1>Resultado para: ${query}</h1>`);
});

app.listen(3000);
