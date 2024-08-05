import axios from 'axios';
export const BASE_URL='https://youtube-v31.p.rapidapi.com';
const options = {
  params: {
    // q: 'music',
    // part: 'snippet,id',
    // regionCode: 'US',
    maxResults: 100,
    // order: 'date'
  },
  headers: {
    'X-RapidAPI-Key': '1920a5ba97msh4589523b4edcc0ap107ec1jsn614b55524301',
    'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
  }
};

export const fetchFromAPI = async(url)=>{
  const {data}= await axios.get(`${BASE_URL}/${url}`,options);
  return data;
};