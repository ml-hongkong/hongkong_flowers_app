import * as firebase from 'firebase';
import RNFetchBlob from 'react-native-fetch-blob';
import ImageResizer from 'react-native-image-resizer';
import Config from 'react-native-config';
import createDispatcher from './createDispatcher';
import {
  FIREBASE_AUTH,
  FIREBASE_IMAGE_UPLOAD,
} from '../constants';

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = RNFetchBlob.polyfill.Blob;

const IMAGE_SIZE = parseInt(Config.IMAGE_SIZE, 10);
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

          // resize image
          promise = ImageResizer.createResizedImage(imageURL, IMAGE_SIZE, IMAGE_SIZE, 'JPEG', 80).then(img =>
            // convert to base64
            RNFetchBlob.fs.readFile(img.path, 'base64')
              .then(base64Data =>
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
                  .then(({ top_n }) => Promise.all(top_n.map((item) => {
                    return firebase.database().ref(`info/${item.label}`).once('value')
                      .then(snapshot =>
                        Object.assign({}, item, snapshot.val()),
                      );
                  }))),
              ),
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
