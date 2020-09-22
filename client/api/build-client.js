import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    return axios.create({
      baseURL: 'http://172.17.0.3',
      headers: req.headers
    });
  } else {
    return axios.create({
      baseURL: '/'
    });
  }

}