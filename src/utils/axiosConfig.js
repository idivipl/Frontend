import axios from 'axios';

const idivipl_axios = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

export default idivipl_axios;
