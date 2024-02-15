import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAJSqQj2ytdrXUqoUY9MS2LEbl_lwKAfr0",
  authDomain: "we-meet-e4f58.firebaseapp.com",
  projectId: "we-meet-e4f58",
  storageBucket: "we-meet-e4f58.appspot.com",
  messagingSenderId: "237635630466",
  appId: "1:237635630466:web:a68012b2424d30d8920b9b",
  measurementId: "G-8BBC2YRR55",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
