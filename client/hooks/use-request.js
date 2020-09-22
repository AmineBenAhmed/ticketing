import axios from 'axios';
import { useState } from 'react';

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      const response = await axios[method](url, body);

      if (onSuccess) { //here we check if onSuccess callbeck is provided f provided we return callback
        onSuccess(response.data); //we will excute now the callback
      }

      return response.data;
    } catch (err) {
      setErrors(<div className='alert alert-danger'>
        <h4>Ooops...</h4>
        <ul className='my-0'>
          {err && err.response.data.errors.map(err => <li key={err.message}>{err.message}</li>)}
        </ul>
      </div>);
     // throw err;
    }
  };

  return {doRequest, errors};
}