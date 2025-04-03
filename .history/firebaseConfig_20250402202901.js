/ Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6OtroeyRkoYFQp7GR1n89HpD91-FUKRc",
  authDomain: "nosic-a658c.firebaseapp.com",
  projectId: "nosic-a658c",
  storageBucket: "nosic-a658c.firebasestorage.app",
  messagingSenderId: "490012252198",
  appId: "1:490012252198:web:a04dfbb7863757e5b72ee7",
  measurementId: "G-97TFMCJ9QT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { db };