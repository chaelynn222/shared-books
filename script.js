const SHEET_URL = "https://docs.google.com/spreadsheets/d/1H3-DYgbU5k7ZkaV8CyEUZMfdMe2BZLZM/gviz/tq?tqx=out:csv";

async function loadBooks() {
  const res = await fetch(SHEET_URL);
  const text = await res.text();

  const rows = text.trim().split("\n").slice(1);

  const booksDiv = document.getElementById("books");
  booksDiv.innerHTML = "";

  rows.forEach(row => {
    const [title, author] = row.split(",");

    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
      <h2>${title}</h2>
      <p>${author}</p>
    `;
    booksDiv.appendChild(card);
  });
}

loadBooks();
