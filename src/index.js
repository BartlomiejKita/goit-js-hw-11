const axios = require('axios');
import { fetchPics } from './fetchPics';
import Notiflix from 'notiflix';
import './sass/index.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const btn = document.querySelector('button');
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');

let page = 0;
let leftHits;

function searchPics() {
  fetchPics(input.value, page)
    .then(data => {
      renderPictures(data);
    })
    .catch(error => {
      console.log(error);
    });
}

function renderPictures({ totalHits, hits }) {
  leftHits = totalHits - page * 40;
  const markup = hits
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
  <a class="gallery-item" href="${largeImageURL}"><img class="gallery-image"  src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>`;
      }
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);

  let lightbox = new SimpleLightbox('.gallery a', {
    captionDelay: '250',
  }).refresh();

  if (page > 2) {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }

  if (totalHits == 0) {
    Notiflix.Notify.failure(
      `Sorry, there are no images matching your search query. Please try again.`
    );
  }

  if (page == 1 && totalHits > 0) {
    Notiflix.Notify.success(`Found ${totalHits} images`);
  }

  if (!totalHits == 0 && leftHits < 0) {
    Notiflix.Notify.failure(
      `We're sorry, but you've reached the end of search results.`
    );
  }
}

const search = e => {
  e.preventDefault();
  page = 1;
  gallery.innerHTML = '';
  searchPics();
};

btn.addEventListener('click', search);

function loadMore() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (clientHeight + scrollTop >= scrollHeight - 1 && leftHits > 0) {
    page += 1;
    searchPics();
  }
}

window.addEventListener('scroll', loadMore);
