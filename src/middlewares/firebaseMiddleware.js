import * as firebase from 'firebase';
import RNFetchBlob from 'react-native-fetch-blob';
import Config from 'react-native-config';
import createDispatcher from './createDispatcher';
import {
  FIREBASE_AUTH,
  FIREBASE_IMAGE_UPLOAD,
} from '../constants';

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = RNFetchBlob.polyfill.Blob;

const API_URL = Config.API_URL;

export default ({ dispatch }) => (next) => {
  const isFirebaseAction = type => [
    FIREBASE_AUTH,
    FIREBASE_IMAGE_UPLOAD,
  ].includes(type);
  const firebaseApp = firebase.initializeApp({
    apiKey: Config.FIREBASE_API_KEY,
    authDomain: Config.FIREBASE_AUTH_DOMAIN,
    databaseURL: Config.FIREBASE_DATABASE_URL,
    storageBucket: Config.FIREBASE_STORAGE_BUCKET,
  });

  return (action) => {
    const dispatcher = createDispatcher(dispatch, action);

    if (isFirebaseAction(action.type)) {
      let promise;
      dispatcher.start();

      switch (action.type) {
        case FIREBASE_AUTH: {
          const credential = firebase.auth.FacebookAuthProvider.credential(
            action.payload.accessToken,
          );

          promise = firebaseApp.auth().signInWithCredential(credential);
          break;
        }
        case FIREBASE_IMAGE_UPLOAD: { // save user image
          if (!firebase.auth().currentUser) {
            return;
          }

          const uid = firebase.auth().currentUser.uid;
          const storage = firebase.storage();
          const storageRef = storage.ref();
          const imagesRef = storageRef.child('images');
          const fileRef = imagesRef.child(`${new Date().getTime()}.jpg`);
          const { lat, lng, imageURL } = action.payload;
          let uploadBlob = null;

          if (!uid) {
            promise = Promise.reject(new Error('Please login'));
            return;
          }

          // for testing...
          // promise = Promise.all([{
          //   index: 158,
          //   label: 2275,
          //   prob: 0.19152985513210297,
          //   chineseName: '白菜',
          //   chineseName2: '青菜',
          //   englishName: 'Chinese White Cabbage',
          //   englishName2: '',
          //   scientificName: 'Brassica chinensis',
          //   species: 'BRASSICACEAE 十字花科',
          //   type: '草本',
          // }, {
          //   index: 52,
          //   label: 671,
          //   prob: 0.1885039061307907,
          //   chineseName: '木棉',
          //   chineseName2: '',
          //   englishName: 'Tree Cotton',
          //   englishName2: 'Red Kapok Tree',
          //   scientificName: 'Bombax ceiba',
          //   species: 'BOMBACACEAE 木棉科',
          //   type: '落葉喬木',
          // }, {
          //   index: 81,
          //   label: 538,
          //   prob: 0.06063483655452728,
          //   chineseName: '象牙花',
          //   chineseName2: '',
          //   englishName: 'Ivory Coral Tree',
          //   englishName2: '',
          //   scientificName: 'Erythrina speciosa',
          //   species: 'FABACEAE 蝶形花科',
          //   type: '落葉喬木',
          // }, {
          //   index: 135,
          //   label: 2078,
          //   prob: 0.06042947620153427,
          //   chineseName: '炮仗花',
          //   chineseName2: '',
          //   englishName: '',
          //   englishName2: '',
          //   scientificName: 'Pyrostegia venusta',
          //   species: 'BIGNONIACEAE 紫葳科',
          //   type: '藤本',
          // }, {
          //   index: 118,
          //   label: 1550,
          //   prob: 0.060244444757699966,
          //   chineseName: '山菅蘭',
          //   chineseName2: '',
          //   englishName: 'Dianella',
          //   englishName2: '',
          //   scientificName: 'Dianella ensifolia',
          //   species: 'LILIACEAE 百合科',
          //   type: '草本',
          // }].map((item) => {
          //   const previewRef = storageRef.child('preview');
          //   return previewRef.child(`${item.label}.jpg`).getDownloadURL().then(previewUrl =>
          //     Object.assign({}, item, { previewUrl })
          //   );
          // }));

          // resize image
          promise = RNFetchBlob.fs.readFile(imageURL, 'base64').then(base64Data => // convert to base64
            Blob.build(base64Data, { type: 'image/jpeg;BASE64' })
              .then((blob) => {
                uploadBlob = blob;
                // upload to firebase storage
                return fileRef.put(blob, { contentType: 'image/jpeg' });
              })
              .then(() => {
                uploadBlob.close();
                return fileRef.getDownloadURL();
              })
              .then(url =>
                // save image url to db
                firebase.database().ref('/images').push({
                  user: uid,
                  imageURL: url,
                  lat,
                  lng,
                }),
              )
              .then(() =>
                RNFetchBlob.fetch('POST', API_URL, {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                }, JSON.stringify({
                  image: base64Data,
                })),
              )
              .then(res => res.json())
              .then(({ top_n }) => Promise.all(top_n.map(item =>
                firebase.database().ref(`info/${item.label}`).once('value')
                  .then((snapshot) => {
                    const previewRef = storageRef.child('preview');
                    return previewRef.child(`${item.label}.jpg`).getDownloadURL().then(previewUrl =>
                      Object.assign({}, item, snapshot.val(), { previewUrl }),
                    );
                  }),
              ))),
          );
          break;
        }
        default:
          break;
      }

      promise
        .then(dispatcher.success)
        .then(dispatcher.notify)
        .catch(dispatcher.error);
    }

    next(action);
  };
};
