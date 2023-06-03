import { fetchImages } from './js/api-service';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

let page = 1;
let searchTerm = '';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const link = document.querySelector('.image-link');


form.addEventListener('submit', onSearchFormSubmit);
function onSearchFormSubmit(evt) {
    evt.preventDefault();
    // console.log(evt.target.elements.searchQuery.value);
    evt.target.elements.searchQuery.value = evt.target.elements.searchQuery.value.trim();
    const inputSearch = evt.target.elements.searchQuery.value;
    
    if (!inputSearch || inputSearch === searchTerm) {
        return;
    }
    searchTerm = inputSearch;
    page = 1;
    gallery.innerHTML = "";
    getImages(searchTerm, page);
    loadMoreBtn.classList.remove('js-invisible');
}     
        
   

async function getImages(searchTerm, page) {
     const data = await fetchImages(searchTerm, page);
    renderImages(data);
    const lightbox = new SimpleLightbox('.image-link', {
        captionsData: "alt"
    });
    lightbox.open('show.simplelightbox', () => {
        gallery.addEventListener('click', (e) => {
            e.preventDefault();
        });
    });

 }
    

function renderImages(data) {
    const totalImages = data.totalHits;
    console.log(totalImages);
    const markup = data.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `
        <a href=${largeImageURL} target="_blank" class="image-link">
        <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" class="gallery-img"/>
  <div class="info">
    <p class="info-item"> 
      <b>Likes</b>
      <span class="count-item">${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
       <span class="count-item">${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span class="count-item">${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span class="count-item">${downloads}</span>
    </p>
  </div>
</div>
</a>`
    }).join("");
    gallery.insertAdjacentHTML("beforeend", markup);
};

loadMoreBtn.addEventListener('click', onClickLoadMoreBtn);

function onClickLoadMoreBtn() {
    loadMoreBtn.classList.add('js-invisible');
    page += 1;
    getImages(searchTerm, page);
    loadMoreBtn.classList.remove('js-invisible');

}