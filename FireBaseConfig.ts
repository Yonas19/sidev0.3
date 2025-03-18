// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { ExpoRoot } from "expo-router";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";




// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries




// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNBPqVk4i8-kghJYrFRKtlHoL7ullKRBE",
  authDomain: "side-auth.firebaseapp.com",
  projectId: "side-auth",
  storageBucket: "side-auth.firebasestorage.app",
  messagingSenderId: "120845101828",
  appId: "1:120845101828:web:5c7069e99ca3243cfabe51",
  measurementId: "G-ZEKT1ZXCHM",
};




// Initialize Firebase




const firebaseApp = initializeApp(firebaseConfig);




// Get instances of Firestore and Storage
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);








export { firebaseApp, db, storage ,auth,firestore};









