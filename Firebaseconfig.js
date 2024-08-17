// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore/lite";
import { getReactNativePersistence } from "@firebase/auth/dist/rn/index.js";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAoQuKRORnyoH9mEfCCSdL0Sf-RC49MMWY",
  authDomain: "shayri-app-9ec76.firebaseapp.com",
  projectId: "shayri-app-9ec76",
  storageBucket: "shayri-app-9ec76.appspot.com",
  messagingSenderId: "715875182918",
  appId: "1:715875182918:web:14081f5808333758971d47",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with React Native persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);
export { auth, app, db };
