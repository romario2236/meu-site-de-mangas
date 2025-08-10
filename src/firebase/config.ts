// src/firebase/config.ts

import { initializeApp } from "firebase/app";

// TODO: SUBSTITUA O OBJETO ABAIXO PELAS SUAS CHAVES DO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyBl9S_GLenTIZn9UKwE1Ie9J3N7VEfpDQs",
  authDomain: "gerenciador-de-mangas.firebaseapp.com",
  projectId: "gerenciador-de-mangas",
  storageBucket: "gerenciador-de-mangas.firebasestorage.app",
  messagingSenderId: "966942911050",
  appId: "1:966942911050:web:fe542dc6f5c99cf1dd54b3",
  measurementId: "G-LJQWXXG0W3"
};

// Inicializa o Firebase com as suas configurações
const app = initializeApp(firebaseConfig);

// Exporta a instância do app para que possamos usá-la em outros lugares
export { app };
