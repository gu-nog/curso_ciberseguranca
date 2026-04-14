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
  // const name = escapeHtml(insecure_name);
  res.send(`<h1>Nenhum resultado para ${insecure_name}</h1>`);
});

app.listen(3000);
