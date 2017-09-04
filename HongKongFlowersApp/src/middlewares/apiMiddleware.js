import axios from 'axios';
import Config from 'react-native-config';
import { apiSuccess, apiError } from '../actions';
import { API_REQUEST, API_POST, API_UPLOAD } from '../constants';

const BASE_API_URL = Config.API_URL;

const isApiAction = type => [API_REQUEST, API_POST, API_UPLOAD].includes(type);

const createHttpOptions = ({ url, method, data, headers }) => {
  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return {
    url,
    method,
    data,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };
};

const api = async ({ url, data, type, headers }) => {
  // select a http method;
  let method;
  switch (type) {
    case API_POST:
    case API_UPLOAD:
      method = 'POST';
      break;
    case API_REQUEST:
    default:
      method = 'GET';
      break;
  }

  // handle all api response
  try {
    const response = await axios(
      createHttpOptions({
        url: `${BASE_API_URL}${url}`,
        method,
        data,
        headers,
      }),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/*
  A apiMiddleware support action callbacks and centralized all api success, error handling strategy
*/
export default ({ dispatch }) => next => (action) => {
  const handleSuccess = (data) => {
    dispatch(apiSuccess({
      type: action.payload.next.SUCCESS,
      data,
    }));
    return data;
  };

  const notify = (data) => {
    if (action.payload.success) {
      action.payload.success.forEach((callback) => {
        dispatch(callback(data));
      });
    }
    return data;
  };

  const handleError = (error) => {
    dispatch(apiError({
      type: action.payload.next.ERROR,
      error,
    }));
    return error;
  };

  // handle all api calls
  if (isApiAction(action.type)) {
    dispatch({ type: action.payload.next.PENDING });

    // api chaining
    api({ ...action.payload, type: action.type })
      .then(handleSuccess)
      .then(notify)
      .catch(handleError);
  }

  return next(action);
};
