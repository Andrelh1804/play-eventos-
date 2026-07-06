import { initializeApp } from "firebase/app";
import { initializeFirestore, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: "gen-lang-client-0959926343",
  appId: "1:830728155695:web:ba94b44900dd0bceb1ccda",
  apiKey: "AIzaSyDgAKIiZMnUGx6t0NcWLzlhAl81qCFczU8",
  authDomain: "gen-lang-client-0959926343.firebaseapp.com",
  storageBucket: "gen-lang-client-0959926343.firebasestorage.app",
  messagingSenderId: "830728155695",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore using the specific database ID from the config
const db = initializeFirestore(app, {}, "ai-studio-playeventos-eb230966-063c-4b57-8558-579dfc19cd0c");

// Initialize Firebase Auth
const auth = getAuth(app);

export { app, db, auth };
