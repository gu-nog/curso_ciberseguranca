const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("sqli/public")); // para HTML estático

const db = new sqlite3.Database(":memory:"); // Banco em memória (fácil de resetar)
db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER, username TEXT, password TEXT)");
  db.run("INSERT INTO users VALUES (1, 'admin', 'admin123')");
  db.run("INSERT INTO users VALUES (2, 'bob', 'bob123')");
  db.run("CREATE TABLE produtos (id INTEGER, nome TEXT, preco REAL)");
  db.run("INSERT INTO produtos VALUES (1, 'Notebook', 2500)");
  db.run("INSERT INTO produtos VALUES (2, 'Mouse', 50)");
});

// Lab 1: Login vulnerável
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  // Vulnerável: concatenação direta
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  console.log("Query:", query);
  db.get(query, (err, row) => {
    if (err) return res.send(`Erro: ${err.message}`);
    if (row) {
      res.send(
        `<h3>Login bem-sucedido! Bem-vindo, ${row.username}</h3><a href="/">Voltar</a>`,
      );
    } else {
      res.send(`<h3>Falha no login</h3><a href="/">Voltar</a>`);
    }
  });
});

// Lab 2: Busca de produtos vulnerável (UNION)
app.get("/produtos", (req, res) => {
  const busca = req.query.busca || "";
  const query = `SELECT id, nome, preco FROM produtos WHERE nome LIKE '%${busca}%'`;
  console.log("Query:", query);
  db.all(query, (err, rows) => {
    if (err) return res.json({ error: err.message });
    let html = `<h2>Produtos encontrados</h2><ul>`;
    rows.forEach((p) => {
      html += `<li>${p.nome} - R$ ${p.preco}</li>`;
    });
    html += `</ul><a href="/">Nova busca</a>`;
    res.send(html);
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(3000, () =>
  console.log("Servidor rodando em http://localhost:3000"),
);
