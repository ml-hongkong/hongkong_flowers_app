import * as firebase from 'firebase';
import Config from 'react-native-config';

export default ({ dispatch, getState }) => (next) => {
  // Initialize Firebase
  const firebaseConfig = {
    apiKey: Config.FIREBASE_API_KEY,
    authDomain: Config.FIREBASE_AUTH_DOMAIN,
    databaseURL: Config.FIREBASE_DATABASE_URL,
    storageBucket: Config.FIREBASE_STORAGE_BUCKET,
  };
  const firebaseApp = firebase.initializeApp(firebaseConfig);

  // TODO: Initialization
  return (action) => {
    if (action) {
    }
  };
};
