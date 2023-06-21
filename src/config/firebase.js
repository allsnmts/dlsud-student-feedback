import { initializeApp } from 'firebase/app';
import { OAuthProvider, getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA8TkxAdCAwhc1GFUNH9Vl6MXLIBCXAO90",
  authDomain: "test-f26b4.firebaseapp.com",
  projectId: "test-f26b4",
  storageBucket: "test-f26b4.appspot.com",
  messagingSenderId: "1034691099692",
  appId: "1:1034691099692:web:0fcaaf6c5ecead82616589"
};

export const app = initializeApp(firebaseConfig),
  auth = getAuth(),
  microsoftProvider = new OAuthProvider('microsoft.com');

export const db = getFirestore(app);
const usersRef = collection(db, 'users');

export const getUserDocument = async (userUid) => {
  const userRef = doc(usersRef, userUid);

  const userSnapshot = await getDoc(userRef);

  return userSnapshot;
};

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = doc(usersRef, userAuth.uid);

  const userSnapshot = await getUserDocument(userAuth.uid);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(doc(usersRef, userAuth.uid), {
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (err) {}
  }

  return userRef;
};

export const getCurrentUser = () =>
  new Promise((reseolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      unsubscribe();
      reseolve(userAuth);
    }, reject);
  });
