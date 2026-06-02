const SHEET_URL = "https://docs.google.com/spreadsheets/d/1H3-DYgbU5k7ZkaV8CyEUZMfdMe2BZLZM/gviz/tq?tqx=out:csv";

function parseCSV(text) {
  return text
    .trim()
    .split("\n")
    .slice(1)
    .map(row => row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)
      .map(cell => cell.replace(/^"|"$/g, "").trim())
    );
}

async function getBookInfo(title, author) {
  const cleanTitle = title.replace(/\(.*?\)/g, "").trim();
  const cleanAuthor = author.replace(/,.*$/, "").trim();

  const query = encodeURIComponent(`${cleanTitle} ${cleanAuthor}`);
  const url = `https://openlibrary.org/search.json?q=${query}&limit=1`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const book = data.docs?.[0];

    return {
      cover: book?.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
        : "https://via.placeholder.com/120x180?text=No+Cover",
      rating: "No rating",
      ratingsCount: 0
    };
  } catch {
    return {
      cover: "https://via.placeholder.com/120x180?text=No+Cover",
      rating: "No rating",
      ratingsCount: 0
    };
  }
}

async function loadBooks() {
  const res = await fetch(SHEET_URL);
  const text = await res.text();
  const rows = parseCSV(text);

  const booksDiv = document.getElementById("books");
  booksDiv.innerHTML = "";

  for (const [title, author] of rows) {
    const info = await getBookInfo(title, author);

    const card = document.createElement("div");
    card.className = "book-card";

    card.innerHTML = `
  <img src="${info.cover}" alt="${title} cover">
  <div>
    <h2>${title}</h2>
    <p>${author}</p>
    <p>⭐ ${info.rating}</p>
  </div>
`;

    booksDiv.appendChild(card);
  }
}

loadBooks();
