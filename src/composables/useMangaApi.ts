// src/composables/useMangaApi.ts

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function fetchMangaData(nomeManga: string) {
  try {
    const jikanUrl = `https://api.jikan.moe/v4/manga?q=${encodeURIComponent(nomeManga)}&limit=5`;
    const kitsuUrl = `https://kitsu.io/api/edge/manga?filter[text]=${encodeURIComponent(nomeManga)}&page[limit]=5`;
    const mangadexUrl = `https://api.mangadex.org/manga?title=${encodeURIComponent(nomeManga)}&limit=5&includes[]=cover_art`;
    const responses = await Promise.allSettled([
      fetch(jikanUrl).then(res => res.json()),
      fetch(kitsuUrl).then(res => res.json()),
      fetch(mangadexUrl).then(res => res.json()),
    ]);
    let todosOsResultados: any[] = [];
    if (responses[0].status === 'fulfilled' && responses[0].value.data) {
      todosOsResultados.push(...responses[0].value.data.map(formatarDadosJikan));
    }
    if (responses[1].status === 'fulfilled' && responses[1].value.data) {
      todosOsResultados.push(...responses[1].value.data.map(formatarDadosKitsu));
    }
    if (responses[2].status === 'fulfilled' && responses[2].value.data) {
      todosOsResultados.push(...responses[2].value.data.map((item: any) => {
        const coverArt = item.relationships.find((rel: any) => rel.type === 'cover_art');
        return formatarDadosMangaDex(item, coverArt?.attributes?.fileName || '');
      }));
    }
    if (todosOsResultados.length === 0) {
      return { data: null, error: "Mangá não encontrado em nenhuma das fontes." };
    }
    const resultadosUnicos = Array.from(new Map(todosOsResultados.map(item => [item.titulo.toLowerCase(), item])).values());
    return { data: resultadosUnicos, error: null };
  } catch (error) {
    return { data: null, error: "Ocorreu um erro de conexão. Verifique sua internet." };
  }
}

function formatarDadosJikan(resultado: any) {
  const tipo = resultado.type ? resultado.type.charAt(0).toUpperCase() + resultado.type.slice(1) : 'Manga';
  return {
    titulo: resultado.title,
    capaUrl: resultado.images.jpg.image_url,
    descricao: resultado.synopsis || 'Descrição não disponível.',
    generos: resultado.genres.map((g: any) => g.name).join(', ') || 'N/A',
    capitulos: resultado.chapters || 'N/A',
    nomesAlternativos: resultado.titles.filter((t: any) => t.type !== 'Default').map((t: any) => t.title).join(', ') || 'N/A',
    status: 'Quero Ler', capitulosLidos: 0, linkLeitura: '', tipo,
    isManual: false, // <-- CAMPO ADICIONADO
  };
}

function formatarDadosKitsu(resultado: any) {
  const tipo = resultado.attributes.mangaType ? resultado.attributes.mangaType.charAt(0).toUpperCase() + resultado.attributes.mangaType.slice(1) : 'Manga';
  return {
    titulo: resultado.attributes.canonicalTitle,
    capaUrl: resultado.attributes.posterImage.original,
    descricao: resultado.attributes.synopsis || 'Descrição não disponível.',
    generos: 'N/A',
    capitulos: resultado.attributes.chapterCount || 'N/A',
    nomesAlternativos: resultado.attributes.titles.ja_jp || 'N/A',
    status: 'Quero Ler', capitulosLidos: 0, linkLeitura: '', tipo,
    isManual: false, // <-- CAMPO ADICIONADO
  };
}

function formatarDadosMangaDex(resultado: any, coverFileName: string) {
    const titles = resultado.attributes.title;
    const descriptions = resultado.attributes.description;
    const tituloPrincipal = titles.en || titles['pt-br'] || titles.es || titles['ja-ro'] || Object.values(titles)[0];
    const descricaoPrincipal = descriptions.en || descriptions['pt-br'] || descriptions.es || Object.values(descriptions)[0] || 'Descrição não disponível.';
    const tipo = resultado.attributes.publicationDemographic || 'Manga';
    return {
        titulo: tituloPrincipal,
        capaUrl: coverFileName ? `https://uploads.mangadex.org/covers/${resultado.id}/${coverFileName}` : '',
        descricao: descricaoPrincipal,
        generos: resultado.attributes.tags.filter((tag: any) => tag.attributes.group === 'genre').map((tag: any) => tag.attributes.name.en).join(', ') || 'N/A',
        capitulos: resultado.attributes.lastChapter || 'N/A',
        nomesAlternativos: resultado.attributes.altTitles.map((t: any) => Object.values(t)[0]).join(', ') || 'N/A',
        status: 'Quero Ler', capitulosLidos: 0, linkLeitura: '',
        tipo: tipo.charAt(0).toUpperCase() + tipo.slice(1),
        isManual: false, // <-- CAMPO ADICIONADO
    };
}
