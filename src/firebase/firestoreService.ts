// src/firebase/firestoreService.ts
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore"; // Importa o onSnapshot
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
    // Usamos { merge: true } para não apagar outros campos do documento no futuro
    return setDoc(docRef, { mangas: lista }, { merge: true });
  }
  return Promise.reject(new Error("Usuário não está logado para salvar a lista."));
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
    // onSnapshot cria o listener em tempo real
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().mangas) {
        // Se o documento existe, chama o callback com a lista
        callback(docSnap.data().mangas as Manga[]);
      } else {
        // Se o usuário não tem lista, chama o callback com uma lista vazia
        callback([]);
      }
    });
    return unsubscribe; // Retorna a função de cancelamento
  }
  // Se não há usuário, retorna uma função vazia
  return () => {};
};
