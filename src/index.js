import { fetchImages } from './js/api-service';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import imageCard from './templates/imageCard.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

let page = 1;
let searchTerm = '';
let totalImages = 0;
const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const footer = document.querySelector('.footer');
const guard = document.querySelector('.guard');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        page += 1;
        if (totalImages / page < 40) {
          Notify.failure(
              'Sorry, there are no images matching your search query. Please try again.'
          );
          footer.classList.add('js-invisible');

    return;
  }
        getImages(searchTerm, page);
      }
    });
  },
  { rootMargin: "200px" }
);


form.addEventListener('submit', onSearchFormSubmit);
function onSearchFormSubmit(evt) {
  evt.preventDefault();
  evt.target.elements.searchQuery.value =
  evt.target.elements.searchQuery.value.trim();
  const inputSearch = evt.target.elements.searchQuery.value;

  if (!inputSearch || inputSearch === "") {
    Notify.failure(
      'Sorry, there are no search query. Please type a query and try again.'
    );
    return;
  }
  searchTerm = inputSearch;
  page = 1;
  gallery.innerHTML = '';
  observer.unobserve(guard);
  form.reset();
  getImages(searchTerm, page);
  loadMoreBtn.classList.remove('js-invisible');
  footer.classList.remove('js-invisible');
}

async function getImages(searchTerm, page) {
  const data = await fetchImages(searchTerm, page);
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
  .firstElementChild.getBoundingClientRect();
window.scrollBy({
  top: cardHeight / 4,
  behavior: "smooth",
});
  page += 1;
  observer.observe(guard);
}

function renderImages(data) {
  totalImages = data.totalHits;
  if (totalImages === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  if ((page === 1) && (totalImages !== 0)) {
    Notify.success(`Hooray! We found ${totalImages} images`);
  }
    console.log(totalImages);
    const markup = data.hits.map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return {
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        };
      }
    );
    gallery.insertAdjacentHTML('beforeend', imageCard(markup));
  }

loadMoreBtn.addEventListener('click', onClickLoadMoreBtn);

function onClickLoadMoreBtn() {
  loadMoreBtn.classList.add('js-invisible');
  footer.classList.add('js-invisible');
  if (totalImages / page < 40) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  page += 1;
  getImages(searchTerm, page);
  loadMoreBtn.classList.remove('js-invisible');
  footer.classList.remove('js-invisible');
}
