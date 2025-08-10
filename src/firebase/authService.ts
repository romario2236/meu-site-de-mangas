// src/firebase/authService.ts
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { app } from "./config";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const registrarComEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginComEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const loginComGoogle = () => {
  return signInWithPopup(auth, provider);
};

export const fazerLogout = () => {
  return signOut(auth);
};

export const getUsuarioAtual = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};
