const SHEET_URL = "https://docs.google.com/spreadsheets/d/1H3-DYgbU5k7ZkaV8CyEUZMfdMe2BZLZM/gviz/tq?tqx=out:csv";

let allBooks = [];

function parseCSV(text) {
  const lines = text.trim().split("\n").slice(1);

  return lines.map(line => {
    const cells = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
    return cells.map(cell => cell.replace(/^"|"$/g, "").trim());
  });
}

function formatAuthor(author) {
  if (!author) return "";

  if (author.includes(",")) {
    const parts = author.split(",").map(part => part.trim());
    if (parts.length >= 2) return `${parts[1]} ${parts[0]}`;
  }

  return author;
}

function getCover(book) {
  if (book.coverUrl && book.coverUrl.length > 0) return book.coverUrl;

  const cleanISBN = book.isbn ? book.isbn.replace(/[^0-9Xx]/g, "") : "";

  if (cleanISBN) {
    return `https://covers.openlibrary.org/b/isbn/${cleanISBN}-L.jpg?default=false`;
  }

  return "https://via.placeholder.com/140x210?text=No+Cover";
}

function createBookCard(book, isPick = false) {
  const card = document.createElement(book.goodreadsUrl ? "a" : "div");

  card.className = "book-card";

  if (book.goodreadsUrl) {
    card.href = book.goodreadsUrl;
    card.target = "_self";
  }

  card.innerHTML = `
    <img src="${getCover(book)}"
         alt="${book.title} cover"
         onerror="this.src='https://via.placeholder.com/140x210?text=No+Cover'">

    <div class="book-info">
      ${isPick ? "<p><strong>📚 Next Buddy Read Pick</strong></p>" : ""}
      <h2>${book.title}</h2>
      <p>${book.author}</p>
    </div>
  `;

  return card;
}

function renderBooks(books) {
  const booksDiv = document.getElementById("books");
  const bookCount = document.getElementById("book-count");

  booksDiv.innerHTML = "";
  bookCount.textContent = `${allBooks.length} books we both wanna read`;

  books.forEach(book => {
    booksDiv.appendChild(createBookCard(book));
  });
}

async function loadBooks() {
  const response = await fetch(SHEET_URL);
  const text = await response.text();
  const rows = parseCSV(text);

  allBooks = rows.map(row => ({
    title: row[0] || "",
    author: formatAuthor(row[1] || ""),
    isbn: row[2] || "",
    coverUrl: row[3] || "",
    goodreadsUrl: row[4] || ""
  }));

  renderBooks(allBooks);
}

document.getElementById("search").addEventListener("input", function () {
  const term = this.value.toLowerCase();

  const filtered = allBooks.filter(book =>
    book.title.toLowerCase().includes(term) ||
    book.author.toLowerCase().includes(term)
  );

  renderBooks(filtered);
});

document.getElementById("sort-title").addEventListener("click", function () {
  const sorted = [...allBooks].sort((a, b) => a.title.localeCompare(b.title));
  renderBooks(sorted);
});

document.getElementById("sort-author").addEventListener("click", function () {
  const sorted = [...allBooks].sort((a, b) => a.author.localeCompare(b.author));
  renderBooks(sorted);
});

document.getElementById("random-pick").addEventListener("click", function () {
  const pick = allBooks[Math.floor(Math.random() * allBooks.length)];
  const randomResult = document.getElementById("random-result");

  randomResult.innerHTML = "";
  randomResult.appendChild(createBookCard(pick, true));
});

loadBooks();
