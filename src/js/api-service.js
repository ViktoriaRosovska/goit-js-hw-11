const API_KEY = '4959719-2280f709437ef1ad4f05c2184';
const BASE_URL = 'https://pixabay.com/api/';



function fetchImage(serchTerm) {
    const params = new URLSearchParams({
    key: API_KEY,
    q: serchTerm,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
    page: 1,
    per_page: 40
});
    return fetch(`${BASE_URL}?${params}`).then(response => response.json());
}

fetchImage("dog").then(data => console.log(data));