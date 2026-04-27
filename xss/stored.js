const express = require("express");
const escapeHtml = require("escape-html");

const app = express();

const comentarios = [];

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  const comentariosHtml = comentarios.map((c) => `<div>${c}</div>`).join("");

  res.send(
    `<form action="/comment" method="POST">
      <label for="query_field">Digite seu comentário</label><br>
      <input type="text" id="query_field" name="conteudo"><br>
      <input type="submit" value="Submit">
    </form>
    <h2>Comentários:</h2>
    <div>${comentariosHtml || "<p>Nenhum comentário ainda.</p>"}</div>`,
  );
});

app.post("/comment", (req, res) => {
  const insecure_comment = req.body.conteudo;
  //   const comment = escapeHtml(insecure_comment);

  if (insecure_comment && insecure_comment.trim()) {
    comentarios.push(insecure_comment);
  }

  res.redirect("/");
});

app.listen(3000);
console.log("Servidor rodando em http://localhost:3000");
