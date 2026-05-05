const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const escapeHtml = require("escape-html");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", "./report/views");

const db = new sqlite3.Database(":memory:");
db.serialize(() => {
  db.run(
    "CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)",
  );
  db.run("INSERT INTO users (username, password) VALUES ('admin', 'admin123')");
  db.run("INSERT INTO users (username, password) VALUES ('bob', 'bob123')");

  db.run("CREATE TABLE comments (id INTEGER PRIMARY KEY, content TEXT)");
  db.run("INSERT INTO comments (content) VALUES ('Oii gente')");
  db.run(
    "INSERT INTO comments (content) VALUES ('Oiii amei o novo filme de Harry Potter')",
  );
  db.run("INSERT INTO comments (content) VALUES ('Tambémm')");
});

function allAsync(db, query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

app.get("/", async (req, res) => {
  try {
    const queryListUsers = "SELECT * FROM users";
    const queryGetComments = "SELECT * FROM comments";

    const [rowsUsers, rowsComments] = await Promise.all([
      allAsync(db, queryListUsers),
      allAsync(db, queryGetComments),
    ]);

    let users = rowsUsers.map((user) =>
      user.username.replaceAll("<script>", "").replaceAll("</script>", ""),
    );

    let comments = rowsComments.map((comment) => escapeHtml(comment.content));

    res.render("index", { users, comments });
  } catch (err) {
    console.error(err);
    res.send(`<h3>Erro no sistema, voltar mais tarde.</h3>`);
  }
});

app.post("/comment", (req, res) => {
  const { content } = req.body;

  const query = `INSERT INTO comments (content) VALUES (?)`;
  db.run(query, [content], (err) => {
    res.redirect("/");
  });
});

app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  const query = `INSERT INTO users (username, password) VALUES ('${username}', '${password}')`;
  console.log("Query SQL:", query);

  db.run(query, (err) => {
    if (err) {
      return res.send(`<h3>Erro: ${err.message}</h3><a href="/">Voltar</a>`);
    }
    res.send(`
      <h3>Conta criada! Bem-vindo, ${escapeHtml(username)}</h3>
      <a href="/">Voltar</a>
    `);
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
