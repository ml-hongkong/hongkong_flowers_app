import axios from 'axios';
import Config from 'react-native-config';
import { apiSuccess, apiError } from '../actions';
import { API_REQUEST, API_POST, API_UPLOAD } from '../constants';

const API_URL = Config.API_URL;

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
export const apiMiddlewareFactory = api => ({ dispatch }) => (next) => {
  const isApiAction = type => [API_REQUEST, API_POST, API_UPLOAD].includes(type);

  return (action) => {
    const handleSuccess = (data) => {
      dispatch(apiSuccess({ type: action.payload.next.SUCCESS, data }));
      return data;
    };

    const notify = (data) => {
      (action.payload.success || [])
        .forEach(callback => dispatch(callback(data)));
      return data;
    };

    const handleError = (error) => {
      dispatch(apiError({ type: action.payload.next.ERROR, error }));
      return error;
    };

    // handle all api calls
    if (isApiAction(action.type)) {
      dispatch({ type: action.payload.next.PENDING });

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
        .then(handleSuccess)
        .then(notify)
        .catch(handleError);
    }

    return next(action);
  };
};

export default apiMiddlewareFactory(requester(API_URL));
