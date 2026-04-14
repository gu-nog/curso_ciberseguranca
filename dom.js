const express = require("express");

const app = express();

// Base de dados fake
const posts = [
  {
    id: 1,
    title: "JavaScript Basics",
    author: "João",
    tags: ["js", "beginner"],
  },
  {
    id: 2,
    title: "React Advanced",
    author: "Maria",
    tags: ["react", "advanced"],
  },
  {
    id: 3,
    title: "Node XSS Security",
    author: "Pedro",
    tags: ["security", "node"],
  },
  { id: 4, title: "CSS Flexbox Guide", author: "Ana", tags: ["css", "layout"] },
];

app.get("/", (req, res) => {
  res.send(
    `<h1>Blog</h1>
    <p>Procure por tags ou autor:</p>
    <input type="text" id="search_box" placeholder="Digite uma tag ou autor...">
    <button onclick="search()">Buscar</button>

    <h2>Filtro Ativo: <span id="currentFilter">Nenhum</span></h2>

    <div id="posts">
      <p>Use a barra de busca para filtrar posts</p>
    </div>

    <script>
      function search() {
        const term = document.getElementById("search_box").value;
        window.location.hash = term;
      }

      function renderPosts() {
        const filter = decodeURIComponent(window.location.hash.substring(1)) || "";
        document.getElementById("currentFilter").innerHTML = filter || "Nenhum";

        const posts = ${JSON.stringify(posts)};

        let filtered = posts.filter(p => 
          p.tags.some(t => t.includes(filter.toLowerCase())) || 
          p.author.toLowerCase().includes(filter.toLowerCase())
        );

        let html = filtered.length > 0 
          ? filtered.map(p => \`<div style="border:1px solid #ccc; padding:10px; margin:10px 0;">
              <h3>\${p.title}</h3>
              <p><strong>Autor:</strong> \${p.author}</p>
              <p><strong>Tags:</strong> \${p.tags.join(", ")}</p>
            </div>\`).join("")
          : "<p>Nenhum post encontrado para: " + filter + "</p>";

        document.getElementById("posts").innerHTML = html;
      }

      renderPosts();
      window.addEventListener("hashchange", renderPosts);
    </script>`,
  );
});

app.listen(3000);
