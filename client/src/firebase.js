import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC0H8xBBqNnXdFJ3DjrYYYjp5Dor0mXVK4",
    authDomain: "ecommerce-19ad1.firebaseapp.com",
    projectId: "ecommerce-19ad1",
    storageBucket: "ecommerce-19ad1.appspot.com",
    messagingSenderId: "337250813727",
    appId: "1:337250813727:web:f6fcd49578b0297e3a522a"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
