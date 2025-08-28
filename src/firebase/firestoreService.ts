// src/firebase/firestoreService.ts
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "./config";
import type { Manga, MangaCollection } from "@/types";

const db = getFirestore(app);
const auth = getAuth(app);

// ALTERADO: A função agora salva toda a coleção de listas
export const salvarColecaoDeMangas = (collection: MangaCollection) => {
  const usuario = auth.currentUser;
  if (usuario) {
    const docRef = doc(db, 'usuarios', usuario.uid);
    return setDoc(docRef, { listas: collection });
  }
  return Promise.reject(new Error("Usuário não está logado para salvar a coleção."));
};

// ALTERADO: A função agora busca a coleção inteira de listas
export const getColecaoDeMangas = async (): Promise<MangaCollection> => {
    const usuario = auth.currentUser;
    if(usuario) {
        const docRef = doc(db, 'usuarios', usuario.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            // LÓGICA DE MIGRAÇÃO: Se o formato antigo (array 'mangas') existir,
            // ele será convertido para o novo formato e salvo.
            if (data.mangas && Array.isArray(data.mangas)) {
                console.log("Migrando dados antigos para o novo formato de listas...");
                const colecaoAntiga: MangaCollection = {
                    "Minha Lista Principal": data.mangas as Manga[]
                };
                await setDoc(docRef, { listas: colecaoAntiga });
                return colecaoAntiga;
            }
            return (data.listas || {}) as MangaCollection;
        }
        return {};
    }
    return {};
};

// ALTERADO: A função agora escuta por mudanças em toda a coleção
export const escutarColecaoDeMangas = (callback: (collection: MangaCollection) => void) => {
  const usuario = auth.currentUser;
  if (usuario) {
    const docRef = doc(db, 'usuarios', usuario.uid);
    const unsubscribe = onSnapshot(docRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
         if (data.mangas && Array.isArray(data.mangas)) {
            const colecaoAntiga: MangaCollection = {
                "Minha Lista Principal": data.mangas as Manga[]
            };
            await setDoc(docRef, { listas: colecaoAntiga });
            callback(colecaoAntiga);
        } else {
           callback((data.listas || {}) as MangaCollection);
        }
      } else {
        callback({});
      }
    });
    return unsubscribe;
  }
  return () => {};
};
