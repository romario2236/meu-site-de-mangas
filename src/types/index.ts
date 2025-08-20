// src/types/index.ts
export interface Manga {
  titulo: string;
  capaUrl: string;
  descricao: string;
  generos: string;
  capitulos: number | string;
  nomesAlternativos: string;
  status: 'Quero Ler' | 'Lendo' | 'Lido' | 'Abandonado';
  capitulosLidos: number;
  linksLeitura: string[]; // <-- MUDANÇA: De string para uma lista de strings
  tipo: string;
  isManual: boolean;
}
