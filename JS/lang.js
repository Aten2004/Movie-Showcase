// Language dictionary containing text in Thai and English
const LANG = {
  th: {
    shareButton: "แบ่งปันเนื้อหานี้",
    shareSuccess: "✅ บันทึกภาพและคัดลอกลิงก์เรียบร้อยแล้ว!",
    shareError: "เกิดข้อผิดพลาดในการคัดลอกลิงก์",
    searchInformation: "ข้อมูลโดย TMDB",
    searchPlaceholder: "ค้นชื่อหนัง...",
    searchButton: "ค้นหา",
    allMovies: "รายชื่อภาพยนตร์ทั้งหมด",
    loadMore: "แสดงเพิ่มเติม",
    trendingTitle: "หนังยอดนิยมประจำสัปดาห์",
    trendingTVTitle: "รายการทีวียอดนิยม",
    trendingAnimationTitle: "การ์ตูนยอดนิยม",
    trailerMissing: "ไม่มีตัวอย่างหนัง",
    overview: "เรื่องย่อ",
    rating: "คะแนน",
    genres: "หมวดหมู่",
    releaseDate: "วันที่ฉาย",
    originalLanguage: "ภาษาต้นฉบับ",
    budget: "งบประมาณ",
    revenue: "รายได้",
    topCast: "นักแสดงหลัก",
    tmdbLink: "ลิงก์ต้นทาง TMDB",
    notRated: "ไม่ระบุเรท",
    footerNote: "เว็บไซต์นี้ใช้ข้อมูลจาก TMDB แต่ไม่ได้รับการรับรองหรือสนับสนุนโดย TMDB",
    loadError: "เกิดข้อผิดพลาดในการโหลดข้อมูล",
    searchPrompt: "กรุณาพิมพ์ชื่อหนังก่อนค้นหา",
    noResults: "ไม่พบผลลัพธ์",
    searchError: "เกิดข้อผิดพลาดในการค้นหา",
    searchLoading: "กำลังค้นหา...",
    type: "ประเภท",
    status: "สถานะ",
    nextEpisode: "ตอนต่อไป",
    notAvailable: "ยังไม่มีข้อมูล",
    seasons: "ซีซัน",
    episodes: "ตอน",
    tvTypeMap: {
      Scripted: "เขียนบท",
      Reality: "เรียลลิตี้",
      Documentary: "สารคดี"
    },
    tvStatusMap: {
      "Returning Series": "กำลังฉาย",
      "Ended": "จบแล้ว",
      "Canceled": "ถูกยกเลิก"
    }
  },
  en: {
    shareButton: "Share this content",
    shareSuccess: "✅ Image saved and link copied!",
    shareError: "Failed to copy link",
    searchInformation: "Information from TMDB",
    searchPlaceholder: "Search for a movie...",
    searchButton: "Search",
    allMovies: "All Movies",
    loadMore: "Load More",
    trendingTitle: "Trending Movies This Week",
    trendingTVTitle: "Trending TV Shows",
    trendingAnimationTitle: "Trending Animation",
    trailerMissing: "No trailer available",
    overview: "Overview",
    rating: "Rating",
    genres: "Genres",
    releaseDate: "Release Date",
    originalLanguage: "Original Language",
    budget: "Budget",
    revenue: "Revenue",
    topCast: "Top Cast",
    tmdbLink: "View on TMDB",
    notRated: "Not Rated",
    footerNote: "This product uses the TMDB API but is not endorsed or certified by TMDB",
    loadError: "Error loading data",
    searchPrompt: "Please enter a movie name",
    noResults: "No results found",
    searchError: "Search error",
    searchLoading: "Searching...",
    type: "Type",
    status: "Status",
    nextEpisode: "Next Episode",
    notAvailable: "Not Available",
    seasons: "seasons",
    episodes: "episodes",
    tvTypeMap: {
      Scripted: "Scripted",
      Reality: "Reality",
      Documentary: "Documentary"
    },
    tvStatusMap: {
      Returning: "Returning",
      Ended: "Ended",
      Canceled: "Canceled"
    }
  }
};

// Apply common language text to elements on the page
function applyCommonLanguage() {
  const language = localStorage.getItem('language') || 'th';
  const langText = LANG[language];

  const shareBtn = document.getElementById('share-btn');
  const searchInput = document.getElementById('search-Input');
  const searchBtn = document.getElementById('search-Btn');
  const trendingTitle = document.querySelector('.trending-section h2');
  const tvTitle = document.getElementById('tv-section-title');
  const animationTitle = document.getElementById('animation-title');
  const footerText = document.getElementById('footer-text');
  const searchInformation = document.getElementById('search-Infor');

  // Set localized text content
  if (shareBtn) shareBtn.textContent = langText.shareButton;
  if (searchInformation) searchInformation.textContent = langText.shareButton;
  if (searchInput) searchInput.placeholder = langText.searchPlaceholder;
  if (searchBtn) searchBtn.textContent = langText.searchButton;
  if (trendingTitle) trendingTitle.textContent = langText.trendingTitle;
  if (tvTitle) tvTitle.textContent = langText.trendingTVTitle;
  if (animationTitle) animationTitle.textContent = langText.trendingAnimationTitle;
  if (footerText) footerText.textContent = langText.footerNote;
}

// Setup language toggle button and event handlers
function setupLanguageToggle() {
  const language = localStorage.getItem('language') || 'th';
  const currentLangBtns = document.querySelectorAll(`#lang-${language}`);
  currentLangBtns.forEach(btn => btn.classList.add('active'));

  document.querySelectorAll('#lang-th').forEach(btn => {
    btn.addEventListener('click', () => setLanguage('th'));
  });
  document.querySelectorAll('#lang-en').forEach(btn => {
    btn.addEventListener('click', () => setLanguage('en'));
  });
}

// Change language setting and reload page
function setLanguage(lang) {
  localStorage.setItem('language', lang);
  location.reload();
}

// Run language setup when page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  applyCommonLanguage();
  setupLanguageToggle();
});

// ========== HIGHLIGHT CURRENT PAGE IN NAVBAR ==========
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname.split('/').pop(); 
  const navLinks = document.querySelectorAll('.nav-bar a');

  navLinks.forEach(link => {
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
    }
  });
});

// ========== TOGGLE NAVBAR ON MOBILE ==========
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('mobile-menu-toggle');
  const nav = document.getElementById('main-nav');

  toggle?.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
});
