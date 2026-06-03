const SHEET_URL = "https://docs.google.com/spreadsheets/d/1H3-DYgbU5k7ZkaV8CyEUZMfdMe2BZLZM/gviz/tq?tqx=out:csv";

let allBooks = [];

function parseCSV(text) {
  return text
    .trim()
    .split("\n")
    .slice(1)
    .map(row =>
      row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)
        .map(cell => cell.replace(/^"|"$/g, "").trim())
    );
}

async function getBookInfo(title, author, isbn) {
  const cleanISBN = isbn ? isbn.replace(/[^0-9Xx]/g, "") : "";

  return {
    cover: cleanISBN
      ? `https://covers.openlibrary.org/b/isbn/${cleanISBN}-L.jpg?default=false`
      : "https://via.placeholder.com/140x210?text=No+Cover"
  };
}

async function renderBooks(books) {
  const booksDiv = document.getElementById("books");
  const bookCount = document.getElementById("book-count");

  booksDiv.innerHTML = "";
  bookCount.textContent = `${allBooks.length} books we both wanna read`;

  for (const book of books) {
    const info = await getBookInfo(book.title, book.author, book.isbn);

    const card = document.createElement("div");
    card.className = "book-card";

    card.innerHTML = `
      <img src="${info.cover}" alt="${book.title} cover" onerror="this.src='https://via.placeholder.com/140x210?text=No+Cover'">
      <div class="book-info">
        <h2>${book.title}</h2>
        <p>${book.author}</p>
      </div>
    `;

    booksDiv.appendChild(card);
  }
}

async function loadBooks() {
  const res = await fetch(SHEET_URL);
  const text = await res.text();
  const rows = parseCSV(text);

  allBooks = rows.map(([title, author, isbn]) => ({
    title,
    author,
    isbn
  }));

  renderBooks(allBooks);
}

document.getElementById("search").addEventListener("input", e => {
  const term = e.target.value.toLowerCase();

  const filtered = allBooks.filter(book =>
    book.title.toLowerCase().includes(term) ||
    book.author.toLowerCase().includes(term)
  );

  renderBooks(filtered);
});

document.getElementById("sort-title").addEventListener("click", () => {
  const sorted = [...allBooks].sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  renderBooks(sorted);
});

document.getElementById("sort-author").addEventListener("click", () => {
  const sorted = [...allBooks].sort((a, b) =>
    a.author.localeCompare(b.author)
  );

  renderBooks(sorted);
});

document.getElementById("random-pick").addEventListener("click", () => {
  const pick = allBooks[Math.floor(Math.random() * allBooks.length)];

  document.getElementById("random-result").innerHTML = `
    <strong>📚 Next Buddy Read Pick:</strong><br><br>
    ${pick.title}<br>
    <em>${pick.author}</em>
  `;
});

loadBooks();
