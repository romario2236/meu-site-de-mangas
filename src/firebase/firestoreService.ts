// src/firebase/firestoreService.ts
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "./config";
import type { Manga } from "@/types";

const db = getFirestore(app);
const auth = getAuth(app);

export const salvarListaDeMangas = (lista: Manga[]) => {
  const usuario = auth.currentUser;
  if (usuario) {
    const docRef = doc(db, 'usuarios', usuario.uid);
    return setDoc(docRef, { mangas: lista }, { merge: true });
  }
  return Promise.reject(new Error("Usuário não está logado para salvar a lista."));
};

export const getListaDeMangas = async (): Promise<Manga[]> => {
    const usuario = auth.currentUser;
    if(usuario) {
        const docRef = doc(db, 'usuarios', usuario.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().mangas) {
            return docSnap.data().mangas as Manga[];
        }
        return [];
    }
    return [];
};

export const escutarListaDeMangas = (callback: (lista: Manga[]) => void) => {
  const usuario = auth.currentUser;
  if (usuario) {
    const docRef = doc(db, 'usuarios', usuario.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().mangas) {
        callback(docSnap.data().mangas as Manga[]);
      } else {
        callback([]);
      }
    });
    return unsubscribe;
  }
  return () => {};
};
