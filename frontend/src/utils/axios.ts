import rawAxios from 'axios';

import { API_BASE_URL_PROD } from './config';

const axios = rawAxios.create({
  baseURL: API_BASE_URL_PROD,
  timeout: 5000,
});

export default axios;
