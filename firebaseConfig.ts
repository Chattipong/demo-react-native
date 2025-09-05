// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey:
    process.env.EXPO_PUBLIC_API_KEY ||
    "AIzaSyCsuJN9gNdwWYDJTUCfXH9CrWB3UGDeEIE",
  authDomain:
    process.env.EXPO_PUBLIC_AUTH_DOMAIN || "customer-18261.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID || "customer-18261",
  storageBucket:
    process.env.EXPO_PUBLIC_STORAGE_BUCKET || "customer-18261.appspot.com",
  messagingSenderId:
    process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID || "45618685713",
  appId:
    process.env.EXPO_PUBLIC_APP_ID ||
    "1:45618685713:web:c2e84027a08ff32bcaceb0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
