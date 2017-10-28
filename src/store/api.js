import axios from 'axios';
import Config from 'react-native-config';
import createDispatcher from './createDispatcher';
import { API_REQUEST, API_POST, API_UPLOAD } from '../constants';

/*
  Example:
  const v1API = requester('http://example.com/v1');
  const v2API = requester('http://example.com/v2');
  v1API({ endpoint, type, data, headers });
*/
export const requester = apiUrl => async ({ endpoint, method, data, headers }) => {
  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const updatedApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
  const updatedEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const options = {
    url: `${updatedApiUrl}/${updatedEndpoint}`,
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
          method = 'POST';
          break;
        case API_UPLOAD:
          method = 'POST';
          break;
        case API_REQUEST:
        default:
          method = 'GET';
          break;
      }
      let req;

      if (action.payload.endpoint === '/predict') {
        // api chaining
        req = Promise.resolve(JSON.parse('{"top_n":[{"index":158,"label":2275,"prob":0.5247020125389099,"chineseName":"白菜","chineseName2":"青菜","englishName":"Chinese White Cabbage","englishName2":"","scientificName":"Brassica chinensis","species":"BRASSICACEAE 十字花科","type":"草本","previewUrl":"https://storage.googleapis.com/dlhk-flower.appspot.com/preview%2F2275.jpg?GoogleAccessId=934086972724-compute@developer.gserviceaccount.com&Expires=1509178726&Signature=hz8lbu2RU%2FIJ3z5DgXB4uYk6qFRKpe2AwoJekYHTVyBkmEgZ0fGm0zvyRdyutIdIX3dbh05K7daFqBkR5JHTJ2hitnXcexSnS9qtjAXu%2F1GE5HbSMskm0n1fsDNGz3rxOoFB7xQBziJhdDR1oKtUCGNzcz5YRpQ9Y%2BGeAFOWrxA6VUb%2F3tW4rmHRORkPU11yvfaHO4KPvvLlxLQZ81qtmCDr%2B9Au%2FVjWaOx5%2FpHf98oTqoWOgwd0jwTJFjyAeRFtS0ULJ7eu5YGtZPbSFTmFoceznSUfMXsk8GLnZ%2BaF21wOiG0hSqVAKLxkTEGU8Ms1J77Ic%2B1aaJbmm2kK6%2F9W7Q%3D%3D","pageUrl":"http://hkcww.org/hkplant/readid.php?id=2275"},{"index":52,"label":671,"prob":0.14899224042892456,"chineseName":"木棉","chineseName2":"","englishName":"Tree Cotton","englishName2":"Red Kapok Tree","scientificName":"Bombax ceiba","species":"BOMBACACEAE 木棉科","type":"落葉喬木","previewUrl":"https://storage.googleapis.com/dlhk-flower.appspot.com/preview%2F671.jpg?GoogleAccessId=934086972724-compute@developer.gserviceaccount.com&Expires=1509178726&Signature=Whtk5k5eAHh%2BkiHBfH90d%2BofgFcouOlaOogWhCGLN0q1TMt9GSzLurTvA7fnUXjfjy51z%2BmtIj8Ekkn2GEdseg9y6Dd8mZ%2BfbjuueHOzM1GZRm2%2FLOa0ZYTndM5rPSQZOmosbFm6GkFu8V%2BnRCxbCkwz8V%2FUoF3IyOitejJwrxBaamTDz%2BBval4hwGPC1UOv%2F3wQjhRD1LuQlR5ZDHaiOkpmit3QQodP9QrZXsPEL12aSThzaISZbgUopHkQFUepPZc%2B6%2Be0A%2BQL5PLlIgzd%2FKEVi2ejsAr7x2ciiMNenY5kck9HbNvehZK9plLryezF23QTm71KdTv%2FSfuk5RW99w%3D%3D","pageUrl":"http://hkcww.org/hkplant/readid.php?id=671"},{"index":151,"label":2504,"prob":0.059216056019067764,"chineseName":"勝紅薊、藿香薊","chineseName2":"","englishName":"Billygoat weed","englishName2":"Goatweed","scientificName":"Ageratum conyzo$1 $2es","species":"ASTERACEAE 菊科","type":"草本","previewUrl":"https://storage.googleapis.com/dlhk-flower.appspot.com/preview%2F2504.jpg?GoogleAccessId=934086972724-compute@developer.gserviceaccount.com&Expires=1509178726&Signature=XpFwAO88pzpg0O9njXnkzDg7vRACVOelPfKdGDVHfHEjHSkv3b%2Fwcogl%2BMO1SoNC7PZpy8WPG%2BCIaY68TGi%2FX%2Bmpdx4RwOHK%2F39fh4jfIiXBNQToDcsoQmFUHGDi6NcQKc1PE2yuPozfW1IA0w50tBhg1ziD16US1%2F78sChSfzWHUftRsVg9nZp%2BqN4PjT4kD7pnYnELDuhSWim6Hvynjy%2BeyMNl2csmGit6kG3hpDPMc2lsDX%2Fva%2FzAFJirfnqaw1YRk5SKbA1WOEpXLxQ%2FPtUyKu1ne4lIR0Qf9jMNZwhw2cmclBbzB2V8LENy1cbxJKsC17CIpwgai2FqsCcJwg%3D%3D","pageUrl":"http://hkcww.org/hkplant/readid.php?id=2504"},{"index":135,"label":2078,"prob":0.03595670685172081,"chineseName":"炮仗花","chineseName2":"","englishName":"","englishName2":"","scientificName":"Pyrostegia venusta","species":"BIGNONIACEAE 紫葳科","type":"藤本","previewUrl":"https://storage.googleapis.com/dlhk-flower.appspot.com/preview%2F2078.jpg?GoogleAccessId=934086972724-compute@developer.gserviceaccount.com&Expires=1509178726&Signature=PcNAytJz5AoeSHvFIdieJWp6HVNEK%2B3NxaXF3XHQ2PoTycJaJbmLneVFqLrVQl15syZbTTjXG7hSvmtvWaGEpXnoUDxByjqjzlQXZWx339cflx7zvLzshs%2FoFJFTncfsrqe9Fv7RKeavGRxRA0YSfKJonzOfPswaXEgGSiIunwuncymCy3urQ%2F5Hm43q6TdVLTC2VeJe9LoEf%2FA2kLM3XTqV9kETtKBlI0JZFMgaU7RZzv02ceQHQrqrpAQAd5q27OhIpns%2F1VyJkT7p%2Bqq8egl8uo6o4PfSbACwSiHJ9KemCC8KZ9L1O1k0j4If3V6QznZHXgT0tTqY9A91KFl6Dg%3D%3D","pageUrl":"http://hkcww.org/hkplant/readid.php?id=2078"},{"index":118,"label":1550,"prob":0.027956197038292885,"chineseName":"山菅蘭","chineseName2":"","englishName":"Dianella","englishName2":"","scientificName":"Dianella ensifolia","species":"LILIACEAE 百合科","type":"草本","previewUrl":"https://storage.googleapis.com/dlhk-flower.appspot.com/preview%2F1550.jpg?GoogleAccessId=934086972724-compute@developer.gserviceaccount.com&Expires=1509178726&Signature=TPdFM0MqQ%2FENDzmaAm7aVIdgsDSCPOn%2FnjutpBtOB4K6BUCk4MJiK%2FaUg%2FL3e4rYrc6XPYoD%2F8pzyWsqMe8Qkwg8JU4v%2BaEeGEf8gjVIuZoVM6LooHGeLiOOT1KkIvJbYT07cakHvCPMO7Vxhjv3DoGkN7TmXALqwpt5mRHtqyPBdVAC1SE0HuY5xIxzOqYF2X5AtiEkzqqHQaSOmAvOOtPG1ySp%2BTpQ5%2FzRZddcWj0hGocS%2F110ARfnSbuJ5Mtwp6y8Af5JsvAdVF4cQluOC43yvcNzPCnGZiBgmHaysuYe0752XeqfLUx55kwmvWQ0rBoYJXUM1mYa1Fpo9I21wg%3D%3D","pageUrl":"http://hkcww.org/hkplant/readid.php?id=1550"}],"entityId":"-KxX-Wb43Mi2pfKyFlhY"}'));
      } else {
        req = api({ ...action.payload, method });
      }

      req
        .then(dispatcher.success)
        .then(dispatcher.notify)
        .catch(({ message, response }) => dispatcher.error({
          status: response.status,
          message,
        }));
    }

    return next(action);
  };
};
