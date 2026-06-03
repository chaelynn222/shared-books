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

    if (parts.length >= 2) {
      return `${parts[1]} ${parts[0]}`;
    }
  }

  return author;
}

function getCover(book) {
  // Use custom cover URL first
  if (book.coverUrl && book.coverUrl.length > 0) {
    return book.coverUrl;
  }

  // Fall back to ISBN
  const cleanISBN = book.isbn
    ? book.isbn.replace(/[^0-9Xx]/g, "")
    : "";

  if (cleanISBN) {
    return `https://covers.openlibrary.org/b/isbn/${cleanISBN}-L.jpg?default=false`;
  }

  return "https://via.placeholder.com/140x210?text=No+Cover";
}

function renderBooks(books) {
  const booksDiv = document.getElementById("books");
  const bookCount = document.getElementById("book-count");

  booksDiv.innerHTML = "";
  bookCount.textContent = `${allBooks.length} books we both wanna read`;

  books.forEach(book => {
    const card = document.createElement("div");
    card.className = "book-card";

    card.innerHTML = `
      <img src="${getCover(book)}"
           alt="${book.title} cover"
           onerror="this.src='https://via.placeholder.com/140x210?text=No+Cover'">

      <div class="book-info">
        <h2>${book.title}</h2>
        <p>${book.author}</p>
      </div>
    `;

    booksDiv.appendChild(card);
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
    coverUrl: row[3] || ""
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
  const sorted = [...allBooks].sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  renderBooks(sorted);
});

document.getElementById("sort-author").addEventListener("click", function () {
  const sorted = [...allBooks].sort((a, b) =>
    a.author.localeCompare(b.author)
  );

  renderBooks(sorted);
});

document.getElementById("random-pick").addEventListener("click", function () {
  const pick =
    allBooks[Math.floor(Math.random() * allBooks.length)];

  document.getElementById("random-result").innerHTML = `
    <strong>📚 Next Buddy Read Pick:</strong><br><br>
    ${pick.title}<br>
    <em>${pick.author}</em>
  `;
});

loadBooks();
