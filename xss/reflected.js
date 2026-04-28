const express = require("express");
const escapeHtml = require("escape-html");

const app = express();

app.get("/", (req, res) => {
  res.send(
    `<form action="/search">
      <label for="query_field">Digite sua pergunta</label><br>
      <input type="text" id="query_field" name="pergunta"><br>
      <input type="submit" value="Submit">
    </form>`,
  );
});

app.get("/search", (req, res) => {
  const insecure_name = req.query.pergunta;
  console.log(insecure_name);
  const name = escapeHtml(insecure_name);
  console.log(name);
  res.send(`<h1>Nenhum resultado para ${name}</h1>`);
});

app.listen(3000, () =>
  console.log("Servidor rodando em http://localhost:3000"),
);
