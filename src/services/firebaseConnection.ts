import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyC8fzVev_9wHGlDjMoON7QTOdEVONhZ7dY",
    authDomain: "app-linktree-11638.firebaseapp.com",
    projectId: "app-linktree-11638",
    storageBucket: "app-linktree-11638.firebasestorage.app",
    messagingSenderId: "889606216551",
    appId: "1:889606216551:web:4e3e4a4b050e2d0a6aedc2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }