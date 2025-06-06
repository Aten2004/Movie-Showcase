const API_KEY = '95b0232f4ff64af08ccdfdeffa7844ab';
const BASE_URL = 'https://api.themoviedb.org/3';

// === Language setup ===
const language = localStorage.getItem('language') || 'th';
const langText = LANG[language];

// ========== SEARCH FUNCTION ==========
async function handleSearchPopup() {
  const query = document.getElementById('search-Input')?.value.trim();
  const popup = document.getElementById('search-result');
  if (!popup || !query) {
    popup.innerHTML = `<div class="no-result">${language === 'th' ? 'กรุณาพิมพ์ชื่อหนังก่อนค้นหา' : 'Please enter a movie name'}</div>`;
    popup.style.display = 'block';
    return;
  }

  popup.innerHTML = '';
  popup.style.display = 'block';

  try {
    const [movieRes, tvRes] = await Promise.all([
      fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=${language}&query=${encodeURIComponent(query)}`),
      fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&language=${language}&query=${encodeURIComponent(query)}`)
    ]);

    const movieData = await movieRes.json();
    const tvData = await tvRes.json();

    if (!movieData.results.length && !tvData.results.length) {
      popup.innerHTML = `<div class="no-result">${language === 'th' ? 'ไม่พบผลลัพธ์' : 'No results found'}</div>`;
      return;
    }

    const movieLinks = movieData.results.map(item =>
      `<a href="detail.html?id=${item.id}&type=movie">${item.title} (${item.release_date?.slice(0, 4) || '-'})</a>`
    );

    const tvLinks = tvData.results.map(item =>
      `<a href="detail.html?id=${item.id}&type=tv">${item.name} (${item.first_air_date?.slice(0, 4) || '-'})</a>`
    );

    popup.innerHTML = [...movieLinks, ...tvLinks].join('');

  } catch (err) {
    popup.innerHTML = `<div class="no-result">${language === 'th' ? 'เกิดข้อผิดพลาดในการค้นหา' : 'Search error'}</div>`;
  }
}



// ========== SETUP SEARCH EVENTS ==========
function setupSearchHandlers() {
  const searchBtn = document.getElementById('search-Btn');
  const searchInput = document.getElementById('search-Input');
  const popup = document.getElementById('search-result');

  if (!searchBtn || !popup || !searchInput) return;

  searchBtn.addEventListener('click', () => {
    handleSearchPopup();
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchPopup();
    }
  });

  document.addEventListener('click', (e) => {
    if (!popup.contains(e.target) && e.target.id !== 'search-Btn' && e.target.id !== 'search-Input') {
      popup.style.display = 'none';
    }
  });
}

// ========== TRENDING MOVIES ==========
async function loadTrendingMovies() {
  try {
    const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=${language}`);
    const data = await res.json();
    const carousel = document.getElementById('carousel');
    if (!carousel) return;

    carousel.innerHTML = data.results
      .slice(0, 15)
      .map(movie => `
        <div class="movie-card">
          <a href="detail.html?id=${movie.id}">
            <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>${langText.rating}: ⭐ ${movie.vote_average}</p>
          </a>
        </div>
      `).join('');
  } catch (err) {
    console.error("Error loading trending movies:", err);
  }
}

// ========== Generic Carousel Scroll Setup (MOVIES) ==========
function setupCarouselScroll() {
  const carousel = document.getElementById('carousel');
  if (!carousel) return;

  document.getElementById('scroll-left')?.addEventListener('click', () => {
    carousel.scrollBy({ left: -300, behavior: 'smooth' });
  });

  document.getElementById('scroll-right')?.addEventListener('click', () => {
    carousel.scrollBy({ left: 300, behavior: 'smooth' });
  });
}

// ========== TRENDING TV SHOWS ==========
async function loadTrendingTVShows() {
  try {
    const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&language=${language}`);
    const data = await res.json();
    const carousel = document.getElementById('tv-carousel');
    if (!carousel) return;

    carousel.innerHTML = data.results
      .slice(0, 15)
      .map(tv => `
        <div class="movie-card">
          <a href="detail.html?id=${tv.id}&type=tv">
            <img src="https://image.tmdb.org/t/p/w300${tv.poster_path}" alt="${tv.name}">
            <h3>${tv.name}</h3>
            <p>${langText.rating}: ⭐ ${tv.vote_average}</p>
          </a>
        </div>
      `).join('');
  } catch (err) {
    console.error("Error loading trending TV shows:", err);
  }
}

// ========== Generic Carousel Scroll Setup (TV SHOWS) ==========
function setupTVCarouselScroll() {
  const carousel = document.getElementById('tv-carousel');
  if (!carousel) return;

  document.getElementById('tv-scroll-left')?.addEventListener('click', () => {
    carousel.scrollBy({ left: -300, behavior: 'smooth' });
  });

  document.getElementById('tv-scroll-right')?.addEventListener('click', () => {
    carousel.scrollBy({ left: 300, behavior: 'smooth' });
  });
}

// ========== TRENDING ANIMATION ==========
async function loadTrendingAnimation() {
  try {
    const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=${language}&with_genres=16&sort_by=popularity.desc`);
    const data = await res.json();
    const carousel = document.getElementById('animation-carousel');
    if (!carousel) return;

    carousel.innerHTML = data.results
      .slice(0, 15)
      .map(movie => `
        <div class="movie-card">
          <a href="detail.html?id=${movie.id}">
            <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>${langText.rating}: ⭐ ${movie.vote_average}</p>
          </a>
        </div>
      `).join('');
  } catch (err) {
    console.error("Error loading animation:", err);
  }
}

// ========== Generic Carousel Scroll Setup (ANIMATION) ==========
function setupAnimationCarouselScroll() {
  const carousel = document.getElementById('animation-carousel');
  if (!carousel) return;

  document.getElementById('animation-scroll-left')?.addEventListener('click', () => {
    carousel.scrollBy({ left: -300, behavior: 'smooth' });
  });

  document.getElementById('animation-scroll-right')?.addEventListener('click', () => {
    carousel.scrollBy({ left: 300, behavior: 'smooth' });
  });
}

// ========== INITIALIZE ==========
document.addEventListener("DOMContentLoaded", () => {
  loadTrendingMovies();
  setupCarouselScroll();
  loadTrendingTVShows();    
  setupTVCarouselScroll();
  loadTrendingAnimation();
  setupAnimationCarouselScroll();
  setupSearchHandlers();
});
