const books = [
  {
    title: "The Secret History",
    author: "Donna Tartt",
    rating: 4.17,
    pages: 559,
    sharedDays: 91,
    cover: "https://images-na.ssl-images-amazon.com/images/I/91M9xPIf10L.jpg"
  }
];

const container = document.getElementById("books");

books.forEach(book => {
  container.innerHTML += `
    <div class="book">
      <img src="${book.cover}">
      <h2>${book.title}</h2>
      <p>${book.author}</p>
      <p>Rating: ${book.rating || "NA"}</p>
      <p>Pages: ${book.pages || "NA"}</p>
      <p>Shared Days: ${book.sharedDays}</p>
    </div>
  `;
});