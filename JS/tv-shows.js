const API_KEY = '95b0232f4ff64af08ccdfdeffa7844ab';
const BASE_URL = 'https://api.themoviedb.org/3';
const language = localStorage.getItem('language') || 'th';
const langText = LANG[language];
let currentPage = 1;
let totalPages = null;

async function fetchTVShows(page = 1) {
  const res = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=${language}&page=${page}`);
  const data = await res.json();
  totalPages = data.total_pages;
  return data.results;
}

function renderTVShows(tvShows) {
  const grid = document.getElementById('tv-grid');
  tvShows.forEach(show => {
    const div = document.createElement('div');
    div.className = 'movie-card';

    const score = show.vote_average?.toFixed(1) ?? 'N/A';
    const posterUrl = show.poster_path
      ? `https://image.tmdb.org/t/p/w300${show.poster_path}`
      : 'https://via.placeholder.com/300x450?text=No+Image';

    div.innerHTML = `
      <a href="detail.html?id=${show.id}&type=tv">
        <div class="poster-wrapper">
          <img src="${posterUrl}" alt="${show.name}">
          <div class="movie-score">${score}</div>
        </div>
        <div class="movie-info">
          <h3>${show.name}</h3>
          <p>${show.first_air_date || ''}</p>
        </div>
      </a>
    `;
    grid.appendChild(div);
  });
}

async function loadInitialTVShows() {
  const shows = await fetchTVShows(currentPage);
  renderTVShows(shows);
  toggleLoadMoreVisibility();
}

async function loadMoreTVShows() {
  const btn = document.getElementById('load-more-btn');
  btn.disabled = true;
  btn.textContent = langText.loading || 'Loading...';

  currentPage++;
  const shows = await fetchTVShows(currentPage);
  renderTVShows(shows);

  btn.disabled = false;
  btn.textContent = langText.loadMore;
  toggleLoadMoreVisibility();
}

function toggleLoadMoreVisibility() {
  const btn = document.getElementById('load-more-btn');
  if (totalPages && currentPage >= totalPages) {
    btn.style.display = 'none';
  } else {
    btn.style.display = 'block';
  }
}

function applyTVLanguage() {
  document.getElementById('all-tv-title').textContent = langText.trendingTVTitle;
  document.getElementById('load-more-btn').textContent = langText.loadMore;
}

document.addEventListener('DOMContentLoaded', () => {
  applyCommonLanguage();
  setupLanguageToggle();
  applyTVLanguage();
  loadInitialTVShows();
  document.getElementById('load-more-btn').addEventListener('click', loadMoreTVShows);
});
