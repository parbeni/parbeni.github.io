const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const searchInput = document.querySelector('[data-search]');
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('.photo-card')];
const emptyState = document.querySelector('[data-empty]');
const lightbox = document.querySelector('[data-lightbox]');
const lightboxImage = document.querySelector('[data-lightbox-image]');
const lightboxTitle = document.querySelector('[data-lightbox-title]');
const lightboxMeta = document.querySelector('[data-lightbox-meta]');
let activeFilter = 'all';

function updateHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 24);
}

function toggleMenu(force) {
  const shouldOpen = typeof force === 'boolean' ? force : mobileMenu.hidden;
  mobileMenu.hidden = !shouldOpen;
  menuButton.setAttribute('aria-expanded', String(shouldOpen));
  menuButton.setAttribute('aria-label', shouldOpen ? 'Close menu' : 'Open menu');
  document.body.classList.toggle('menu-open', shouldOpen);
}

function applyFilters() {
  const term = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  cards.forEach((card) => {
    const matchesEra = activeFilter === 'all' || card.dataset.era === activeFilter;
    const matchesSearch = !term || card.dataset.searchable.includes(term) || card.textContent.toLowerCase().includes(term);
    const isVisible = matchesEra && matchesSearch;
    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  emptyState.hidden = visibleCount !== 0;
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

menuButton.addEventListener('click', () => toggleMenu());
mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => toggleMenu(false)));

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('is-active', item === button));
    applyFilters();
  });
});

searchInput.addEventListener('input', applyFilters);

document.querySelectorAll('[data-timeline-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.timelineFilter;
    filterButtons.forEach((item) => item.classList.toggle('is-active', item.dataset.filter === activeFilter));
    applyFilters();
    document.querySelector('#archive').scrollIntoView({ behavior: 'smooth' });
  });
});

document.querySelectorAll('[data-photo]').forEach((button) => {
  button.addEventListener('click', () => {
    lightboxImage.src = button.dataset.photo;
    lightboxImage.alt = button.querySelector('img').alt;
    lightboxTitle.textContent = button.dataset.title;
    lightboxMeta.textContent = button.dataset.meta;
    lightbox.showModal();
  });
});

document.querySelector('[data-lightbox-close]').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});
