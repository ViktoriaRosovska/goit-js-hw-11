import axios from 'axios';

const API_KEY = '4959719-2280f709437ef1ad4f05c2184';
const BASE_URL = 'https://pixabay.com/api/';

axios.defaults.baseURL = BASE_URL;


async function fetchImages(serchTerm, page) {
    const { data } = await axios("", {
        params: {
            key: API_KEY,
            q: serchTerm,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: true,
            page,
            per_page: 40,
        }
    });
    return data;    
}

export { fetchImages };