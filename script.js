const API_KEY = 'YOUR_API_KEY_HERE';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;

const movieList = document.getElementById("movie-list");
const detailPanel = document.getElementById("detailPanel");
const detailPoster = document.getElementById("detailPoster");
const detailTitle = document.getElementById("detailTitle");
const detailGenre = document.getElementById("detailGenre");
const detailDate = document.getElementById("detailDate");
const detailDesc = document.getElementById("detailDesc");
const trailerContainer = document.getElementById("trailerContainer");
const closePanelBtn = document.getElementById("closePanel");

const searchInput = document.getElementById("search");
const genreFilter = document.getElementById("genreFilter");
const sortFilter = document.getElementById("sortFilter");
const themeToggle = document.getElementById("themeToggle");
const splashScreen = document.getElementById("splash-screen");
const pagination = document.getElementById("pagination");

let movies = [];
let genres = [];
let currentPage = 1;
let totalPages = 1;
let currentSort = "popular";

window.onload = () => {
  setTimeout(() => {
    splashScreen.style.opacity = "0";
    setTimeout(() => {
      splashScreen.style.display = "none";
    }, 600);
  }, 2000);
};

function displayMovies(moviesToShow) {
  movieList.innerHTML = "";

  const itemsPerRow = getItemsPerRow();
  const remainder = moviesToShow.length % itemsPerRow;
  const placeholdersNeeded = remainder === 0 ? 0 : itemsPerRow - remainder;

  if (moviesToShow.length === 0) {
    movieList.innerHTML = "<p>No movies found.</p>";
    return;
  }

  moviesToShow.forEach((movie) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} poster" />
      <h4>${movie.title}</h4>
      <p>⭐ ${movie.vote_average}</p>
    `;
    card.addEventListener("click", () => showDetails(movie));
    movieList.appendChild(card);
  });

  for(let i=0; i<placeholdersNeeded; i++) {
    const placeholder = document.createElement("div");
    placeholder.className = "card placeholder";
    movieList.appendChild(placeholder);
  }
}

function getItemsPerRow() {
  const width = window.innerWidth;
  if (width < 600) return 1;
  if (width < 900) return 2;
  if (width < 1200) return 3;
  return 4;
}

async function showDetails(movie) {
  detailPoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  detailTitle.textContent = movie.title;

  const movieGenres = movie.genre_ids
    .map((id) => {
      const genre = genres.find((g) => g.id === id);
      return genre ? genre.name : "";
    })
    .filter(Boolean);
  detailGenre.textContent = `Genre: ${movieGenres.join(", ") || "N/A"}`;
  detailDate.textContent = `Released: ${movie.release_date}`;
  detailDesc.textContent = movie.overview;

 
  trailerContainer.innerHTML = "Loading trailer...";
  try {
    const res = await fetch(`${BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}&language=en-US`);
    const data = await res.json();
    const trailer = data.results.find(
      (vid) => vid.site === "YouTube" && vid.type === "Trailer"
    );
    if (trailer) {
      trailerContainer.innerHTML = `
        <iframe 
          src="https://www.youtube.com/embed/${trailer.key}" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>`;
    } else {
      trailerContainer.innerHTML = "<p>No trailer available.</p>";
    }
  } catch (err) {
    trailerContainer.innerHTML = "<p>Failed to load trailer.</p>";
  }

  detailPanel.classList.add("show");
  detailPanel.setAttribute("aria-hidden", "false");
}

closePanelBtn.onclick = () => {
  detailPanel.classList.remove("show");
  detailPanel.setAttribute("aria-hidden", "true");
};

function filterMovies() {
  const searchTerm = searchInput.value.toLowerCase();
  const genreTerm = genreFilter.value;

  const filtered = movies.filter((movie) => {
    const matchesSearch =
      movie.title.toLowerCase().includes(searchTerm) ||
      movie.overview.toLowerCase().includes(searchTerm);
    const matchesGenre = genreTerm === "" || movie.genre_ids.includes(Number(genreTerm));
    return matchesSearch && matchesGenre;
  });

  displayMovies(filtered);
}

function toggleTheme() {
  if (document.body.classList.contains("light")) {
    document.body.classList.remove("light");
    themeToggle.textContent = "🌙 Dark Mode";
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.add("light");
    themeToggle.textContent = "🌞 Light Mode";
    localStorage.setItem("theme", "light");
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light");
    themeToggle.textContent = "🌞 Light Mode";
  } else {
    document.body.classList.remove("light");
    themeToggle.textContent = "🌙 Dark Mode";
  }
}

function buildPagination() {
  pagination.innerHTML = "";

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Prev";
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      loadMovies();
    }
  });
  pagination.appendChild(prevBtn);


  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  if (endPage - startPage < maxPagesToShow -1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    if (i === currentPage) pageBtn.disabled = true;
    pageBtn.addEventListener("click", () => {
      currentPage = i;
      loadMovies();
    });
    pagination.appendChild(pageBtn);
  }

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      loadMovies();
    }
  });
  pagination.appendChild(nextBtn);
}

async function loadGenres() {
  try {
    const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
    const data = await res.json();
    genres = data.genres;

    genreFilter.innerHTML = `<option value="">All Genres</option>`; // Default option

    genres.forEach((genre) => {
      const option = document.createElement("option");
      option.value = genre.id;
      option.textContent = genre.name;
      genreFilter.appendChild(option);
    });
  } catch (err) {
    console.error("Failed to load genres:", err);
  }
}

async function loadMovies() {
  let url = "";
  switch (currentSort) {
    case "top_rated":
      url = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${currentPage}`;
      break;
    case "oldest":

      url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=release_date.asc&page=${currentPage}`;
      break;
    case "newest":

      url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=release_date.desc&page=${currentPage}`;
      break;
    case "popular":
    default:
      url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${currentPage}`;
  }

  try {
    const res = await fetch(url);
    const data = await res.json();
    movies = data.results;
    totalPages = data.total_pages;


    filterMovies();
    buildPagination();
  } catch (err) {
    console.error("Failed to fetch movies:", err);
    movieList.innerHTML = "<p>Error loading movies.</p>";
  }
}

searchInput.addEventListener("input", () => {
  filterMovies();

});

genreFilter.addEventListener("change", () => {
  filterMovies();
});

sortFilter.addEventListener("change", (e) => {
  currentSort = e.target.value;
  currentPage = 1;
  loadMovies();
});

themeToggle.addEventListener("click", toggleTheme);


window.addEventListener("resize", () => {
  displayMovies(movies);
});


async function init() {
  loadTheme();
  await loadGenres();
  loadMovies();
}

init();
