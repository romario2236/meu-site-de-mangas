// src/types/index.ts

// NOVO: Criamos uma interface específica para os links
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
  linksLeitura: LinkLeitura[]; // <-- MUDANÇA PRINCIPAL AQUI
  tipo: string;
  isManual: boolean;
}
