document.addEventListener("DOMContentLoaded", function() {
    let currentFilmId = null;
    let currentAvailableTickets = 0;

    // Fetch the local db.json file
    fetch('db.json')
        .then(response => response.json())
        .then(data => {
            const filmsList = document.getElementById('films');
            const searchBox = document.getElementById('search');
            filmsList.innerHTML = ''; // Clear the placeholder

            data.films.forEach(film => {
                const li = document.createElement('li');
                li.className = 'film item';
                li.textContent = film.title;
                li.addEventListener('click', () => loadFilmDetails(film.id));
                filmsList.appendChild(li);
            });

            // Load the details of the first movie on page load
            if (data.films.length > 0) {
                loadFilmDetails(data.films[0].id);
            }

            // Filter movies based on search input
            searchBox.addEventListener('input', function() {
                const searchTerm = searchBox.value.toLowerCase();
                const filteredFilms = data.films.filter(film =>
                    film.title.toLowerCase().includes(searchTerm)
                );
                filmsList.innerHTML = '';
                filteredFilms.forEach(film => {
                    const li = document.createElement('li');
                    li.className = 'film item';
                    li.textContent = film.title;
                    li.addEventListener('click', () => loadFilmDetails(film.id));
                    filmsList.appendChild(li);
                });
            });
        })
        .catch(error => console.error('Error fetching movie list:', error));

    // Load and display the details of the selected movie
    function loadFilmDetails(filmId) {
        fetch('db.json')
            .then(response => response.json())
            .then(data => {
                const film = data.films.find(f => f.id == filmId);
                if (film) {
                    currentFilmId = film.id;
                    currentAvailableTickets = film.capacity - film.tickets_sold;
                    document.getElementById('poster').src = film.poster;
                    document.getElementById('title').textContent = film.title;
                    document.getElementById('showtime').textContent = film.showtime;
                    document.getElementById('available-tickets').textContent = currentAvailableTickets;

                    // Enable or disable the buy ticket button
                    const buyTicketButton = document.getElementById('buy-ticket');
                    buyTicketButton.disabled = currentAvailableTickets === 0;
                }
            })
            .catch(error => console.error('Error fetching movie details:', error));
    }

    // Handle buy ticket button click
    document.getElementById('buy-ticket').addEventListener('click', function() {
        if (currentAvailableTickets > 0) {
            currentAvailableTickets--;
            document.getElementById('available-tickets').textContent = currentAvailableTickets;
            // Disable the button if no tickets are left
            if (currentAvailableTickets === 0) {
                this.disabled = true;
            }
        }
    });
});
