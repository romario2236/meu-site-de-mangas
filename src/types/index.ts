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
  linkLeitura: string;
  tipo: string;
  isManual: boolean;
}
