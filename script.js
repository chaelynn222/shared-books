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
  const query = encodeURIComponent(`intitle:${title} inauthor:${author}`);
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const book = data.items?.[0]?.volumeInfo;

    return {
      cover: book?.imageLinks?.thumbnail || "",
      rating: book?.averageRating || "No rating",
      ratingsCount: book?.ratingsCount || 0
    };
  } catch {
    return { cover: "", rating: "No rating", ratingsCount: 0 };
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
      ${info.cover ? `<img src="${info.cover}" alt="${title} cover">` : ""}
      <div>
        <h2>${title}</h2>
        <p>${author}</p>
        <p>⭐ ${info.rating} ${info.ratingsCount ? `(${info.ratingsCount} ratings)` : ""}</p>
      </div>
    `;

    booksDiv.appendChild(card);
  }
}

loadBooks();
