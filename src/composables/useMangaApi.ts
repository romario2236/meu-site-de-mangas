// src/composables/useMangaApi.ts

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Manga } from '@/types'

export async function fetchMangaData(nomeManga: string) {
  const jikanUrl = `/api/jikan/manga?q=${encodeURIComponent(nomeManga)}&limit=5`
  const kitsuUrl = `/api/kitsu/manga?filter[text]=${encodeURIComponent(nomeManga)}&page[limit]=5`
  const mangadexUrl = `/api/mangadex/manga?title=${encodeURIComponent(nomeManga)}&limit=5&includes[]=cover_art`

  try {
    const responses = await Promise.allSettled([
      fetch(jikanUrl).then((res) => res.json()),
      fetch(kitsuUrl).then((res) => res.json()),
      fetch(mangadexUrl).then((res) => res.json()),
    ])

    const todosOsResultados: Manga[] = []

    if (responses[0].status === 'fulfilled' && responses[0].value.data) {
      todosOsResultados.push(...responses[0].value.data.map(formatarDadosJikan))
    }

    if (responses[1].status === 'fulfilled' && responses[1].value.data) {
      todosOsResultados.push(...responses[1].value.data.map(formatarDadosKitsu))
    }

    if (responses[2].status === 'fulfilled' && responses[2].value.data) {
      // LINHA DE DEPURAÇÃO ADICIONADA AQUI
      console.log('Resposta da MangaDex:', JSON.parse(JSON.stringify(responses[2].value)))

      // Revertendo para a lógica original temporariamente para depuração
      todosOsResultados.push(...responses[2].value.data.map(formatarDadosMangaDex))
    }

    if (todosOsResultados.length === 0) {
      return { data: null, error: 'Mangá não encontrado.' }
    }

    const resultadosUnicos = Array.from(
      new Map(todosOsResultados.map((item) => [item.titulo.toLowerCase(), item])).values(),
    )
    return { data: resultadosUnicos, error: null }
  } catch (error) {
    return { data: null, error: 'Erro de conexão.' }
  }
}

function formatarDadosJikan(resultado: any): Manga {
  const tipo = resultado.type
    ? resultado.type.charAt(0).toUpperCase() + resultado.type.slice(1)
    : 'Manga'
  return {
    titulo: resultado.title,
    capaUrl: resultado.images.jpg.image_url,
    descricao: resultado.synopsis || 'N/A',
    generos: resultado.genres.map((g: any) => g.name).join(', ') || 'N/A',
    capitulos: resultado.chapters || 'N/A',
    nomesAlternativos:
      resultado.titles
        .filter((t: any) => t.type !== 'Default')
        .map((t: any) => t.title)
        .join(', ') || 'N/A',
    status: 'Quero Ler',
    capitulosLidos: 0,
    tipo,
    isManual: false,
    linksLeitura: [],
  }
}

function formatarDadosKitsu(resultado: any): Manga {
  const tipo = resultado.attributes.mangaType
    ? resultado.attributes.mangaType.charAt(0).toUpperCase() +
      resultado.attributes.mangaType.slice(1)
    : 'Manga'
  return {
    titulo: resultado.attributes.canonicalTitle,
    capaUrl: resultado.attributes.posterImage.original,
    descricao: resultado.attributes.synopsis || 'N/A',
    generos: 'N/A',
    capitulos: resultado.attributes.chapterCount || 'N/A',
    nomesAlternativos: resultado.attributes.titles.ja_jp || 'N/A',
    status: 'Quero Ler',
    capitulosLidos: 0,
    tipo,
    isManual: false,
    linksLeitura: [],
  }
}

// LÓGICA ORIGINAL RESTAURADA PARA DEPURAÇÃO
function formatarDadosMangaDex(resultado: any): Manga {
  const coverArt = resultado.relationships.find((rel: any) => rel.type === 'cover_art')
  const coverFileName = coverArt?.attributes?.fileName
  const capaUrl = coverFileName
    ? `https://uploads.mangadex.org/covers/${resultado.id}/${coverFileName}`
    : ''
  const titles = resultado.attributes.title
  const descriptions = resultado.attributes.description
  const tituloPrincipal =
    titles.en || titles['pt-br'] || titles.es || titles['ja-ro'] || Object.values(titles)[0]
  const descricaoPrincipal =
    descriptions.en ||
    descriptions['pt-br'] ||
    descriptions.es ||
    Object.values(descriptions)[0] ||
    'N/A'
  const tipo = resultado.attributes.publicationDemographic || 'Manga'
  return {
    titulo: tituloPrincipal,
    capaUrl: capaUrl,
    descricao: descricaoPrincipal,
    generos:
      resultado.attributes.tags
        .filter((tag: any) => tag.attributes.group === 'genre')
        .map((tag: any) => tag.attributes.name.en)
        .join(', ') || 'N/A',
    capitulos: resultado.attributes.lastChapter || 'N/A',
    nomesAlternativos:
      resultado.attributes.altTitles.map((t: any) => Object.values(t)[0]).join(', ') || 'N/A',
    status: 'Quero Ler',
    capitulosLidos: 0,
    tipo: tipo.charAt(0).toUpperCase() + tipo.slice(1),
    isManual: false,
    linksLeitura: [],
  }
}
