import rawAxios from 'axios';

import { API_BASE_URL } from './config';

const axios = rawAxios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

export default axios;
