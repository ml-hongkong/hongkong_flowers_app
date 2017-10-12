import { Platform } from 'react-native';
import * as firebase from 'firebase';
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'react-native-fetch-blob';
import Config from 'react-native-config';
import createDispatcher from './createDispatcher';
import {
  FIREBASE_AUTH,
  FIREBASE_IMAGE_UPLOAD,
} from '../constants';

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = RNFetchBlob.polyfill.Blob;

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
          let uploadBlob = null;

          if (!uid) {
            promise = Promise.reject(new Error('Please login'));
            return;
          }

          promise = ImageResizer.createResizedImage(action.payload.imageURL, 1024, 1024, 'JPEG', 80).then((img) => {
            RNFetchBlob.fs.readFile(img.path, 'base64').then(data =>
              Blob.build(data, { type: 'image/jpeg;BASE64' })
            )
              .then((blob) => {
                uploadBlob = blob;
                return fileRef.put(blob, { contentType: 'image/jpeg' });
              })
              .then(() => {
                uploadBlob.close();
                return fileRef.getDownloadURL();
              })
              .then(url =>
                firebase.database().ref('/images').push(
                  Object.assign({}, action.payload, {
                    user: uid,
                    imageURL: url,
                  }),
                ),
              );
          });
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
