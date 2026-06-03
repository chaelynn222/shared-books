const card = document.createElement("div");
card.className = "book-card";

card.innerHTML = `
  <img
    src="${info.cover}"
    alt="${book.title} cover"
    onerror="this.src='https://via.placeholder.com/140x210?text=No+Cover'"
  >

  <div class="book-info">
    <h2>${book.title}</h2>
    <p>${book.author}</p>
  </div>
`;

booksDiv.appendChild(card);
