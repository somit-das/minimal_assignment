import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBpsIqjxRfinlosewZiBAPtI2gYc-eTfS4',
  authDomain: 'dashboardapp-d2e57.firebaseapp.com',
  databaseURL: 'https://dashboardapp-d2e57-default-rtdb.firebaseio.com',
  projectId: 'dashboardapp-d2e57',
  storageBucket: 'dashboardapp-d2e57.firebasestorage.app',
  messagingSenderId: '679878304332',
  appId: '1:679878304332:web:58ded245149ce05fc10ae9',
  measurementId: 'G-3GVYEXM79E',
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleAuthProvider = new GoogleAuthProvider();