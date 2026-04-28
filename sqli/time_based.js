const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("sqli/public"));

// Conexão com o MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "labuser",
  password: "labpass",
  database: "sqli_lab",
  port: 3307,
});

db.connect((err) => {
  if (err) throw err;
  console.log("Conectado ao MySQL");

  // Criar tabelas (se não existirem)
  db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50),
      password VARCHAR(50)
    )
  `);
  db.query(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100),
      preco DECIMAL(10,2)
    )
  `);

  // Inserir dados de exemplo
  db.query("DELETE FROM users");
  db.query(
    "INSERT INTO users (username, password) VALUES ('admin', 'admin123'), ('alice', 'alice123')",
  );

  db.query("DELETE FROM produtos");
  db.query(
    "INSERT INTO produtos (nome, preco) VALUES ('Notebook', 2500), ('Mouse', 50)",
  );
});

app.get("/produtos", (req, res) => {
  const busca = req.query.busca || "";

  const query = `SELECT id, nome, preco FROM produtos WHERE nome LIKE '%${busca}%'`;
  console.log("Query:", query);

  db.query(query, (err, results) => {
    if (err) return res.send(`Erro: ${err.message}`);
    let html = `<h2>Produtos encontrados</h2><ul>`;
    results.forEach((p) => {
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
