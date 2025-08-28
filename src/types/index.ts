// src/types/index.ts

export interface LinkLeitura {
  nome: string;
  url: string;
}

export interface Manga {
  titulo: string;
  capaUrl: string;
  descricao: string;
  generos: string;
  capitulos: number | string;
  nomesAlternativos: string;
  status: 'Quero Ler' | 'Lendo' | 'Lido' | 'Abandonado';
  capitulosLidos: number;
  linksLeitura: LinkLeitura[];
  tipo: string;
  isManual: boolean;
}

// NOVO: Definimos como será a estrutura de todas as suas listas
export interface MangaCollection {
  [listName: string]: Manga[];
}
