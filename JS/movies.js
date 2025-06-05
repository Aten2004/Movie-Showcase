const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://api.themoviedb.org/3';

let currentPage = 1;
let totalPages = null;

// ========== LANGUAGE SETUP ==========
const language = localStorage.getItem('language') || 'th';
const langText = LANG[language];

// ========== FETCH POPULAR MOVIES ==========
async function fetchMovies(page = 1) {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=${language}&page=${page}`);
  const data = await res.json();
  totalPages = data.total_pages;
  return data.results;
}

// ========== APPLY LANGUAGE TEXT TO PAGE ==========
function applyMoviesLanguage() {
  const language = localStorage.getItem('language') || 'th';
  const langText = LANG[language];

  const movieTitle = document.getElementById('all-movies-title');
  const loadMoreBtn = document.getElementById('load-more-btn');

  if (movieTitle) movieTitle.textContent = langText.allMovies;
  if (loadMoreBtn) loadMoreBtn.textContent = langText.loadMore;
}



// ========== RENDER MOVIE CARDS ==========
function renderMovies(movies) {
  const grid = document.getElementById('movies-grid');
  movies.forEach(movie => {
    const div = document.createElement('div');
    div.className = 'movie-card';

    const score = movie.vote_average?.toFixed(1) ?? 'N/A';
    const posterUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
      : 'https://via.placeholder.com/300x450?text=No+Image';

    div.innerHTML = `
      <a href="detail.html?id=${movie.id}&type=movie">
        <div class="poster-wrapper">
          <img src="${posterUrl}" alt="${movie.title || 'No Title'}">
          <div class="movie-score">${score}</div>
        </div>
        <div class="movie-info">
          <h3>${movie.title || movie.name || 'No Title'}</h3>
          <p>${movie.release_date || movie.first_air_date || ''}</p>
        </div>
      </a>
    `;
    grid.appendChild(div);
  });
}

// ========== LOAD FIRST PAGE ==========
async function loadInitialMovies() {
  const movies = await fetchMovies(currentPage);
  renderMovies(movies);
  toggleLoadMoreVisibility();
}

// ========== LOAD NEXT PAGE ==========
async function loadMoreMovies() {
  const loadMoreBtn = document.getElementById('load-more-btn');
  loadMoreBtn.disabled = true;
  loadMoreBtn.textContent = langText.loading || 'Loading...';

  currentPage++;
  const movies = await fetchMovies(currentPage);
  renderMovies(movies);

  loadMoreBtn.disabled = false;
  loadMoreBtn.textContent = langText.loadMore;

  toggleLoadMoreVisibility();
}

// ========== TOGGLE LOAD MORE BUTTON ==========
function toggleLoadMoreVisibility() {
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (totalPages && currentPage >= totalPages) {
    loadMoreBtn.style.display = 'none';
  } else {
    loadMoreBtn.style.display = 'block';
  }
}

// ========== INIT PAGE ==========
document.addEventListener('DOMContentLoaded', () => {
  applyCommonLanguage();       
  applyMoviesLanguage(); 
  setupLanguageToggle();       
  loadInitialMovies();

  document.getElementById('load-more-btn').addEventListener('click', loadMoreMovies);
});
