const axios = require('axios');

export async function fetchPics(name, pageNumber) {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=28028897-84f3add7f8612b6dc8ccd4fc5&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageNumber}&per_page=40`
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
