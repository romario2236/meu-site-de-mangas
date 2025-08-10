// src/firebase/firestoreService.ts
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "./config";
import type { Manga } from "@/types";

const db = getFirestore(app);
const auth = getAuth(app);

/**
 * Salva a lista completa de mangás para o usuário atualmente logado.
 * @param lista A lista de mangás a ser salva.
 */
export const salvarListaDeMangas = (lista: Manga[]) => {
  const usuario = auth.currentUser;
  if (usuario) {
    const docRef = doc(db, 'usuarios', usuario.uid);
    return setDoc(docRef, { mangas: lista }, { merge: true });
  }
  return Promise.reject(new Error("Usuário não está logado para salvar a lista."));
};

/**
 * Carrega a lista de mangás do usuário UMA ÚNICA VEZ.
 * @returns Uma promessa que resolve para a lista de mangás do usuário.
 */
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

/**
 * Inicia um listener em tempo real para a lista de mangás do usuário.
 * @param callback A função que será chamada com a nova lista sempre que ela mudar.
 * @returns Uma função para parar de escutar (unsubscribe).
 */
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
