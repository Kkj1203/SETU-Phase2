import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  projectId: "studio-6190191270-7f6fd",
  appId: "1:930493505132:web:aef3fc581e262fd3a30249",
  apiKey: "AIzaSyCGXi87mUsh-YIdBRAuGQNVc9tpQvb0pjU",
  authDomain: "studio-6190191270-7f6fd.firebaseapp.com",
  messagingSenderId: "930493505132",
};

export const app = initializeApp(firebaseConfig); // ✅ EXPORT APP
export const auth = getAuth(app);
export const db = getFirestore(app);
