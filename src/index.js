import { fetchImages } from './js/api-service';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import imageCard from './templates/imageCard.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

let page = 0;
let searchTerm = '';
const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const footer = document.querySelector('.footer');
const guard = document.querySelector('.guard');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        getImages(searchTerm);
      }
    });
  },
  { rootMargin: "200px" }
);


form.addEventListener('submit', onSearchFormSubmit);
function onSearchFormSubmit(evt) {
  evt.preventDefault();
  const inputSearch = evt.target.elements.searchQuery.value.trim();
  searchTerm = inputSearch;
  page = 0;
  totalImages = 0;
  gallery.innerHTML = '';
  observer.unobserve(guard);
  
  if (!inputSearch || inputSearch === "") {
    Notify.failure(
      'Sorry, there are no search query. Please type a query and try again.'
    );
    return;
  }
  loadMoreBtn.classList.remove('js-invisible');
  footer.classList.remove('js-invisible');
  getImages(searchTerm);
  form.reset();
}

async function getImages(searchTerm) {
  page += 1;
  const data = await fetchImages(searchTerm, page);

  if (page === 1)
  {
    if (data.hits.length) {
      Notify.success(`Hooray! We found ${data.totalHits} images`);
    }
    else {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      finishObserve();
      return;
    }
  }
  else if (!data.hits.length) {
    Notify.info('No more images matching your search query.');
    finishObserve();
    return;
  }

  renderImages(data);
  const lightbox = new SimpleLightbox('.image-link', {
    captionsData: 'alt',
  });
  lightbox.open('show.simplelightbox', () => {
    gallery.addEventListener('click', e => {
      e.preventDefault();
    });
  });
  lightbox.refresh();
  const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild?.getBoundingClientRect() || 0;

  window.scrollBy({
    top: cardHeight / 4,
    behavior: "smooth",
  });

  observer.observe(guard);
}

function renderImages(data) {
  gallery.insertAdjacentHTML('beforeend', imageCard(data.hits));
}

loadMoreBtn.addEventListener('click', onClickLoadMoreBtn);

function onClickLoadMoreBtn() {
  getImages(searchTerm);
}

function finishObserve() {
  observer.unobserve(guard);
  loadMoreBtn.classList.add('js-invisible');
  footer.classList.add('js-invisible');
}