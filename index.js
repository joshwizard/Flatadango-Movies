const movieList = document.getElementById("movie-list");
const movieDetails = document.getElementById("movie-details");
const API_URL = "http://localhost:3000/films";

// Fetch and display movie titles
fetch(API_URL)
  .then(res => res.json())
  .then(movies => {
    movies.forEach(movie => {
      const li = document.createElement("li");
      li.textContent = movie.title;
      li.addEventListener("click", () => showDetails(movie));
      movieList.appendChild(li);
    });
  });

// Display details of the selected movie
function showDetails(movie) {
  const availableTickets = movie.capacity - movie.tickets_sold;

  movieDetails.innerHTML = `
    <h2>${movie.title}</h2>
    <img src="${movie.poster}" alt="${movie.title}">
    <p><strong>Runtime:</strong> ${movie.runtime}</p>
    <p><strong>Showtime:</strong> ${movie.showtime}</p>
    <p><strong>Tickets Left:</strong> <span id="tickets">${availableTickets}</span></p>
    <button id="buy-btn" ${availableTickets === 0 ? "disabled" : ""}>Buy Ticket</button>
  `;

  document.getElementById("buy-btn").addEventListener("click", () => buyTicket(movie));
}

// Handle ticket purchase
function buyTicket(movie) {
  const availableTickets = movie.capacity - movie.tickets_sold;

  if (availableTickets > 0) {
    movie.tickets_sold++;

    // Update server
    fetch(`${API_URL}/${movie.id}`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ tickets_sold: movie.tickets_sold })
    })
    .then(() => {
      document.getElementById("tickets").textContent = movie.capacity - movie.tickets_sold;
      if (movie.capacity - movie.tickets_sold === 0) {
        document.getElementById("buy-btn").disabled = true;
      }
    });
  }
}
