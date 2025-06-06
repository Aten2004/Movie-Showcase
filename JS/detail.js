const API_KEY = '95b0232f4ff64af08ccdfdeffa7844ab';
const BASE_URL = 'https://api.themoviedb.org/3';

// === Language setup ===
const language = localStorage.getItem('language') || 'th';
const langText = LANG[language];

// === Highlight the active language button ===
const currentLangBtn = document.getElementById(`lang-${language}`);
if (currentLangBtn) currentLangBtn.classList.add('active');

// === Initialize page only when LANG object is available ===
function initializeDetail() {
  if (typeof LANG === 'undefined') {
    console.error('LANG object not found. Make sure lang.js is loaded before detail.js');
    return setTimeout(initializeDetail, 100);
  }

  // Re-read language and langText in case it was updated or reloaded
  const language = localStorage.getItem('language') || 'th';
  const langText = LANG[language] || LANG.th;

  loadMovieDetail();
}

// === Language switch button event listeners ===
document.getElementById('lang-th')?.addEventListener('click', () => setLanguage('th'));
document.getElementById('lang-en')?.addEventListener('click', () => setLanguage('en'));

// === Set localized text in search input and button ===
document.getElementById('search-Input').placeholder = langText.searchPlaceholder;
document.getElementById('search-Btn').textContent = langText.searchButton;

// === Get URL parameters: content ID and type ===
const urlParams = new URLSearchParams(window.location.search);
const contentId = urlParams.get('id'); 
const contentType = urlParams.get('type') || 'movie';

// === Validate presence of content ID ===
if (!contentId) {
  const movieDetailElement = document.getElementById('movie-detail');
  if (movieDetailElement) {
    movieDetailElement.innerHTML = '<p>Invalid movie ID</p>';
  }
  throw new Error('Movie ID is missing');
}

// === Utility: Format number as USD currency ===
function formatCurrency(amount) {
  if (!amount || amount === 0) return 'N/A';
  return `$${amount.toLocaleString()}`;
}

// === Utility: Map certification code to localized label ===
function mapCertification(cert, type = 'movie', langText) {
  const movieMap = {
    'G': { th: 'ทั่วไป', en: 'G' },
    'PG': { th: 'ผู้ปกครองแนะนำ', en: 'PG' },
    'PG-13': { th: '13+', en: 'PG-13' },
    'R': { th: '18+', en: 'R' },
    'NC-17': { th: '20+', en: 'NC-17' }
  };

  const tvMap = {
    'TV-Y': { th: 'เด็กเล็ก', en: 'Kids' },
    'TV-Y7': { th: 'เด็ก 7+', en: 'Older Kids' },
    'TV-14': { th: '14+', en: 'Teens' },
    'TV-MA': { th: 'ผู้ใหญ่', en: 'Adult' }
  };

  const selectedMap = type === 'movie' ? movieMap : tvMap;
  const isThai = Object.keys(LANG).find(key => LANG[key] === langText) === 'th';

  return selectedMap[cert]?.[isThai ? 'th' : 'en'] || langText.notRated || 'N/A';
}

// === Creates the "Now Streaming" UI overlay with provider icons and names ===
function createStreamingOverlay(watchInfo, tmdbWatchUrl) {
  if (!watchInfo?.flatrate?.length) return '';

  const allProviders = watchInfo.flatrate;
  const displayProviders = allProviders.slice(0, 4); // Limit icons to 4
  const remainingCount = Math.max(0, allProviders.length - 4);

  // Tooltip with all provider names
  const allProviderNames = allProviders.map(p => p.provider_name).join(', ');

  return `
    <div class="streaming-overlay" title="${allProviderNames}">
      <!-- Header badge -->
      <div class="streaming-header">
        <span class="streaming-badge">NOW STREAMING</span>
      </div>

      <!-- Provider icons -->
      <div class="streaming-providers">
        ${displayProviders.map(provider => `
          <a href="${tmdbWatchUrl}" target="_blank" title="${provider.provider_name}" class="provider-link">
            <img src="https://image.tmdb.org/t/p/w45${provider.logo_path}" 
                 alt="${provider.provider_name}" 
                 class="provider-icon" />
          </a>
        `).join('')}
        ${remainingCount > 0 ? `
          <div class="more-providers-count" title="${allProviders.slice(4).map(p => p.provider_name).join(', ')}">
            +${remainingCount}
          </div>
        ` : ''}
      </div>

      <!-- Provider names -->
      <div class="streaming-names">
        <div class="provider-names-list" title="${allProviderNames}">
          ${allProviders.length <= 2 
            ? allProviders.map(p => p.provider_name).join(', ')
            : `${allProviders.slice(0, 2).map(p => p.provider_name).join(', ')} +${allProviders.length - 2} more`
          }
        </div>
      </div>
    </div>
  `;
}

// === Renders full movie or TV show detail including title, poster, info, and streaming ===
function renderMovieDetail(data, trailer, credits, certification, watchInfo) {
  const isMovie = contentType === 'movie';
  const title = isMovie ? data.title : data.name;
  const date = isMovie ? data.release_date : data.first_air_date;
  let runtime;

  if (isMovie) {
    const hours = Math.floor(data.runtime / 60);
    const minutes = data.runtime % 60;

    if (data.runtime) {
      if (language === 'th') {
        runtime = `${hours > 0 ? `${hours} ชม.` : ''} ${minutes > 0 ? `${minutes} น.` : ''}`.trim();
      } else {
        runtime = `${hours > 0 ? `${hours}h` : ''} ${minutes > 0 ? `${minutes}m` : ''}`.trim();
      }
    } else {
      runtime = 'N/A';
    }

  } else {
    const seasons = data.number_of_seasons || 0;
    const episodes = data.number_of_episodes || 0;
    runtime = `${seasons} ${langText.seasons || 'ซีซัน'} • ${episodes} ${langText.episodes || 'ตอน'}`;
  }

  const topCast = credits?.cast ? credits.cast.slice(0, 5) : [];
  const container = document.getElementById('movie-detail');
  if (!container) return;

  const tmdbWatchUrl = isMovie
    ? `https://www.themoviedb.org/movie/${data.id}/watch`
    : `https://www.themoviedb.org/tv/${data.id}/watch`;

  container.innerHTML = `
  <div class="movie-hero-content">
    <div class="poster-container">
      ${createStreamingOverlay(watchInfo, tmdbWatchUrl)}
      <img class="movie-poster" src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${title}">
    </div>
    <div class="movie-video">
      ${trailer
        ? `<iframe src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>`
        : `<p style="color:#aaa;">${langText.trailerMissing}</p>`}
    </div>
  </div>

  <div class="movie-info">
    <h1 class="movie-title">${title}</h1>
    <p class="movie-meta">${date?.slice(0, 4)} · ${certification} · ${runtime}</p>

    <!-- Overview -->
    <div class="info-box full-width">
      <strong>${langText.overview}:</strong>
      <span>${data.overview || langText.notRated}</span>
    </div>

    <!-- Info Rows -->
    <div class="info-grid simple-layout">

      ${
        isMovie
          ? `
          <div class="info-box">
            <strong>${langText.rating}:</strong>
            <span>⭐ ${data.vote_average || 0} / 10</span>
          </div>
          <div class="info-box">
            <strong>${langText.releaseDate}:</strong>
            <span>${date || 'N/A'}</span>
          </div>
          <div class="info-box">
            <strong>${langText.budget}:</strong>
            <span>${formatCurrency(data.budget)}</span>
          </div>
          <div class="info-box">
            <strong>${langText.revenue}:</strong>
            <span>${formatCurrency(data.revenue)}</span>
          </div>
          <div class="info-box">
            <strong>${langText.originalLanguage}:</strong>
            <span>${data.original_language?.toUpperCase() || 'N/A'}</span>
          </div>
          <div class="info-box">
            <strong>${langText.genres}:</strong>
            <span>${data.genres?.map(g => g.name).join(', ') || 'N/A'}</span>
          </div>
          `
          : `
          <div class="info-box">
            <strong>${langText.rating}:</strong>
            <span>⭐ ${data.vote_average || 0} / 10</span>
          </div>
          <div class="info-box">
            <strong>${langText.releaseDate}:</strong>
            <span>${date || 'N/A'}</span>
          </div>
          <div class="info-box">
            <strong>${langText.nextEpisode}:</strong>
            <span>${data.next_episode_to_air?.air_date || langText.notAvailable}</span>
          </div>
          <div class="info-box">
            <strong>${langText.status}:</strong>
            <span>${langText.tvStatusMap?.[data.status] || data.status || 'N/A'}</span>
          </div>
          <div class="info-box">
            <strong>${langText.type}:</strong>
            <span>${langText.tvTypeMap?.[data.type] || data.type || 'N/A'}</span>
          </div>
          <div class="info-box">
            <strong>${langText.genres}:</strong>
            <span>${data.genres?.map(g => g.name).join(', ') || 'N/A'}</span>
          </div>
          `
      }

      <!-- Top Cast -->
      <div class="info-box full-width">
        <strong>${langText.topCast}:</strong>
        <span>${topCast.map(a => a.name).join(', ') || 'N/A'}</span>
      </div>
    </div>

    <div style="text-align:center; margin-top: 20px;">
      <a href="https://www.themoviedb.org/${contentType}/${data.id}" target="_blank" class="tmdb-link-button">
        ${langText.tmdbLink}
      </a>
    </div>
  </div>
`;

window.lastWatchInfo = watchInfo;
}

// === Handles click on share button: generates share image with QR code and streaming icons ===
document.getElementById('share-btn').addEventListener('click', async () => {
  const canvas = document.getElementById('share-canvas');
  const ctx = canvas.getContext('2d');

  // === Build URL and title ===
  const urlParams = new URLSearchParams(window.location.search);
  const contentId = urlParams.get('id');
  const contentType = urlParams.get('type') || 'movie';
  const tmdbUrl = `https://www.themoviedb.org/${contentType}/${contentId}`;
  const title = document.querySelector('.movie-title')?.textContent || 'Movie Title';

  // === Prepare canvas background and title text ===
  canvas.width = 600;
  canvas.height = 600;
  ctx.fillStyle = '#181A20';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 32px "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 2;

  // === Split title into lines that fit within maxWidth ===
  const maxWidth = 540;
  const words = title.split(' ');
  const lines = [];
  let currentLine = '';

  for (let word of words) {
    const testLine = currentLine + word + ' ';
    if (ctx.measureText(testLine).width > maxWidth && currentLine !== '') {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine.trim());

  const lineStartY = 60;
  const lineHeight = 38;
  const textHeight = lines.length * lineHeight;

  lines.forEach((line, index) => {
    ctx.fillText(line, canvas.width / 2, lineStartY + index * lineHeight);
  });

  // === Draw QR Code for TMDB page ===
  const qrSize = 300;
  const qrCanvas = document.createElement('canvas');
  await QRCode.toCanvas(qrCanvas, tmdbUrl, {
    width: qrSize,
    margin: 1,
    color: { dark: '#ffffff', light: '#181A20' }
  });

  ctx.shadowColor = 'rgba(0,0,0,0.2)';
  ctx.shadowBlur = 10;

  const qrX = (canvas.width - qrSize) / 2;
  const qrY = lineStartY + textHeight + 10;
  ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

  // === Add provider icons (if available) ===
  if (window.lastWatchInfo?.flatrate?.length) {
    const icons = window.lastWatchInfo.flatrate.slice(0, 4);
    const iconSize = 55;
    const spacing = 10;
    const totalWidth = icons.length * iconSize + (icons.length - 1) * spacing;

    const nowStreamingY = qrY + qrSize + 30;
    const iconY = nowStreamingY + 25;
    const startX = (canvas.width - totalWidth) / 2;

    ctx.font = 'bold 18px "Segoe UI", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('NOW STREAMING', canvas.width / 2, nowStreamingY);

    // Load and draw provider logos
    for (let i = 0; i < icons.length; i++) {
      const logoPath = icons[i].logo_path;
      const imageUrl = `https://image.tmdb.org/t/p/w92${logoPath}`;

      try {
        const response = await fetch(imageUrl, { mode: 'cors' });
        const blob = await response.blob();

        const img = new Image();
        const objectURL = URL.createObjectURL(blob);
        img.src = objectURL;

        await new Promise(resolve => {
          img.onload = () => {
            ctx.drawImage(img, startX + i * (iconSize + spacing), iconY, iconSize, iconSize);
            URL.revokeObjectURL(objectURL);
            resolve();
          };
          img.onerror = resolve;
        });
      } catch (e) {
        console.warn('Icon failed to load:', imageUrl, e);
      }
    }
  }

  // === Footer note ===
  ctx.shadowBlur = 0;
  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#bbb';
  ctx.fillText(langText.searchInformation, canvas.width / 2, canvas.height - 30);

  // === Save canvas as image ===
  const link = document.createElement('a');
  link.download = `share-${title}.png`;
  link.href = canvas.toDataURL();
  link.click();

  // === Copy link to clipboard and show toast ===
  function showToast(message) {
    const toast = document.getElementById('toast-notify');
    if (!toast) return;
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 3000);
  }

  try {
    await navigator.clipboard.writeText(tmdbUrl);
    showToast(langText.shareSuccess);
  } catch (err) {
    console.error('Copy failed', err);
    showToast(langText.shareError);
  }
});

// === Global toast notification utility ===
function showToast(message) {
  const toast = document.getElementById('toast-notify');
  if (!toast) return;
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 2500);
}

// === Loads and renders movie or TV show detail from TMDB API ===
async function loadMovieDetail() {
  try {
    const language = localStorage.getItem('language') || 'th';
    const langText = LANG[language] || LANG.th;

    console.log('Loading movie detail for:', contentId, contentType);

    // Fetch all required data in parallel
    const [mainRes, videoRes, creditRes, ratingRes, providerRes] = await Promise.all([
      fetch(`${BASE_URL}/${contentType}/${contentId}?api_key=${API_KEY}&language=${language}`),
      fetch(`${BASE_URL}/${contentType}/${contentId}/videos?api_key=${API_KEY}&language=en-US`),
      fetch(`${BASE_URL}/${contentType}/${contentId}/credits?api_key=${API_KEY}&language=${language}`),
      fetch(`${BASE_URL}/${contentType}/${contentId}/${contentType === 'movie' ? 'release_dates' : 'content_ratings'}?api_key=${API_KEY}`),
      fetch(`${BASE_URL}/${contentType}/${contentId}/watch/providers?api_key=${API_KEY}`)
    ]);

    // Basic error check
    if (!mainRes.ok) throw new Error(`Failed to fetch main data: ${mainRes.status}`);

    // Parse JSON (fallback to default structure if fetch failed)
    const [mainData, videos, credits, ratings, providers] = await Promise.all([
      mainRes.json(),
      videoRes.ok ? videoRes.json() : { results: [] },
      creditRes.ok ? creditRes.json() : { cast: [] },
      ratingRes.ok ? ratingRes.json() : { results: [] },
      providerRes.ok ? providerRes.json() : { results: {} }
    ]);

    console.log('Main data:', mainData);

    // Extract certification (US only fallback)
    let certification = 'NR';
    if (contentType === 'movie') {
      const usRelease = ratings.results?.find(r => r.iso_3166_1 === 'US');
      certification = usRelease?.release_dates?.[0]?.certification || 'NR';
    } else {
      const usRating = ratings.results?.find(r => r.iso_3166_1 === 'US');
      certification = usRating?.rating || 'NR';
    }

    // Find trailer from YouTube
    const trailer = videos.results?.find(v =>
      (v.type === 'Trailer' || v.type === 'Teaser') && v.site?.toLowerCase() === 'youtube'
    );

    // Get streaming providers (fallback to US)
    const countryCode = language === 'th' ? 'TH' : 'US';
    const watchInfo = providers.results?.[countryCode] || providers.results?.US;

    // Render full detail to UI
    renderMovieDetail(
      mainData,
      trailer,
      credits,
      mapCertification(certification, contentType, langText),
      watchInfo,
      langText
    );

  } catch (error) {
    console.error('Error loading details:', error);
    const container = document.getElementById('movie-detail');
    if (container) {
      const language = localStorage.getItem('language') || 'th';
      const langText = LANG[language] || LANG.th;
      container.innerHTML = `
        <div style="padding:20px;text-align:center;">
          <p style="color:red;font-size:18px;">${langText.loadError}</p>
          <p style="color:#666;">Error: ${error.message}</p>
        </div>
      `;
    }
  }
}

// === Handles movie/TV show search popup (triggered on search or Enter key) ===
async function handleSearchPopup() {
  const language = localStorage.getItem('language') || 'th';
  const langText = LANG[language] || LANG.th;

  const query = document.getElementById('search-Input')?.value.trim();
  const popup = document.getElementById('search-result');
  if (!popup) {
    console.error('search-result element not found');
    return;
  }

  if (!query) {
    popup.innerHTML = `<div class="no-result">${langText.searchPrompt || 'กรุณากรอกคำค้นหา'}</div>`;
    popup.style.display = 'block';
    return;
  }

  // Show loading state
  popup.innerHTML = `<div class="loading">${langText.searchLoading}</div>`;
  popup.style.display = 'block';

  try {
    // Fetch both movie and TV search results in parallel
    const [movieRes, tvRes] = await Promise.all([
      fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=${language}&query=${encodeURIComponent(query)}`),
      fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&language=${language}&query=${encodeURIComponent(query)}`)
    ]);

    const [movieData, tvData] = await Promise.all([
      movieRes.ok ? movieRes.json() : { results: [] },
      tvRes.ok ? tvRes.json() : { results: [] }
    ]);

    const movieResults = movieData.results || [];
    const tvResults = tvData.results || [];

    if (movieResults.length === 0 && tvResults.length === 0) {
      popup.innerHTML = `<div class="no-result">${langText.noResults || 'ไม่พบผลลัพธ์'}</div>`;
      return;
    }

    // Build HTML for search results
    let resultsHTML = '';

    if (movieResults.length > 0) {
      resultsHTML += movieResults.slice(0, 5).map(movie => `
        <a href="detail.html?id=${movie.id}&type=movie" class="search-item">
          <span class="item-type">🎬</span>
          <span class="item-title">${movie.title}</span>
          <span class="item-year">(${movie.release_date?.slice(0, 4) || '-'})</span>
        </a>
      `).join('');
    }

    if (tvResults.length > 0) {
      resultsHTML += tvResults.slice(0, 5).map(tv => `
        <a href="detail.html?id=${tv.id}&type=tv" class="search-item">
          <span class="item-type">📺</span>
          <span class="item-title">${tv.name}</span>
          <span class="item-year">(${tv.first_air_date?.slice(0, 4) || '-'})</span>
        </a>
      `).join('');
    }

    popup.innerHTML = resultsHTML;

  } catch (error) {
    console.error('Search error:', error);
    popup.innerHTML = `<div class="no-result">${langText.searchError || 'เกิดข้อผิดพลาดในการค้นหา'}</div>`;
  }
}

// === Register search button click and Enter key press ===
document.getElementById('search-Btn')?.addEventListener('click', handleSearchPopup);

document.getElementById('search-Input')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleSearchPopup();
  }
});

// === Hide search popup when clicking outside ===
document.addEventListener('click', (e) => {
  const popup = document.getElementById('search-result');
  const input = document.getElementById('search-Input');
  const btn = document.getElementById('search-Btn');

  const clickedOutside = popup && !popup.contains(e.target) && e.target !== input && e.target !== btn;
  if (clickedOutside) {
    popup.style.display = 'none';
  }
});

// === Initialize app logic after DOM is fully loaded ===
document.addEventListener('DOMContentLoaded', initializeDetail);
