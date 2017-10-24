import * as firebase from 'firebase';
import Config from 'react-native-config';
import createDispatcher from './createDispatcher';
import { FIREBASE_AUTH } from '../constants';

export default ({ dispatch }) => (next) => {
  const isFirebaseAction = type => [FIREBASE_AUTH].includes(type);
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

          promise = firebaseApp.auth().signInWithCredential(credential)
            .then(data => ({
              displayName: data.displayName,
              photoURL: data.photoURL,
              userId: firebase.auth().currentUser.uid,
            }));
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
    return next(action);
  };
};
