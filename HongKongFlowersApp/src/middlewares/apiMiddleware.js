import axios from 'axios';
import Config from 'react-native-config';
import createDispatcher from './createDispatcher';
import { API_REQUEST, API_POST, API_UPLOAD } from '../constants';

/*
  Example:
  const v1API = requester('http://example.com/v1');
  const v2API = requester('http://example.com/v2');
  v1API({ url, type, data, headers });
*/
export const requester = apiUrl => async ({ url, method, data, headers }) => {
  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const newApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
  const newUrl = url.startsWith('/') ? url.slice(1) : url;
  const options = {
    url: `${newApiUrl}/${newUrl}`,
    method,
    data,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };

  // handle api response
  try {
    return await (await axios(options)).data;
  } catch (error) {
    throw error;
  }
};

/*
  A apiMiddleware support action callbacks and centralized all api success, error handling strategy
*/
export default ({ dispatch }) => (next) => {
  const isApiAction = type => [API_REQUEST, API_POST, API_UPLOAD].includes(type);
  const api = requester(Config.API_URL);

  return (action) => {
    const dispatcher = createDispatcher(dispatch, action);

    // handle all api calls
    if (isApiAction(action.type)) {
      dispatcher.start();

      // select a http method
      let method;
      switch (action.type) {
        case API_POST:
        case API_UPLOAD:
          method = 'POST';
          break;
        case API_REQUEST:
        default:
          method = 'GET';
          break;
      }

      // api chaining
      api({ ...action.payload, method })
        .then(dispatcher.success)
        .then(dispatcher.notify)
        .catch(dispatcher.error);
    }

    return next(action);
  };
};
