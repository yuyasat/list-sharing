
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCnlBdtQ0NIPbT3P2ENz8BqV1kKWWL5fs4",
  authDomain: "list-sharing-2e970.firebaseapp.com",
  projectId: "list-sharing-2e970",
  storageBucket: "list-sharing-2e970.appspot.com",
  messagingSenderId: "214069526831",
  appId: "1:214069526831:web:f9312583eff7ca989461da",
  measurementId: "G-3HR5XJ0VF7"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, db };