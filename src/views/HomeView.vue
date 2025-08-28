<template>
  <div class="home-wrapper">
    <div class="header-section">
      <div class="header-top">
        <h1>Gerenciador de Mangás</h1>
        <button @click="handleLogout" class="btn-logout">Sair</button>
      </div>
      <div class="add-manga-container">
        <input
          type="text"
          id="manga-input"
          placeholder="Digite o nome do mangá"
          v-model="mangaInput"
          @keyup.enter="buscarManga"
        />
        <button id="add-button" @click="buscarManga" :disabled="isLoading">
          {{ isLoading ? 'Buscando...' : 'Buscar' }}
        </button>
        <button id="manual-add-button" @click="showManualAddModal = true">
          Adicionar Manualmente
        </button>
      </div>
      <p class="search-tip">
        Dica: Se não encontrar, tente o título em inglês ou no idioma original.
      </p>
    </div>

    <div class="page-container">
      <aside class="sidebar">
        <div class="list-management-section">
          <h3>Minhas Listas</h3>
          <div class="organize-group">
            <label for="list-select">Lista Atual:</label>
            <select id="list-select" v-model="listaAtiva">
              <option v-for="listName in nomesDasListas" :key="listName" :value="listName">
                {{ listName }}
              </option>
            </select>
          </div>
          <div class="organize-group">
            <label for="new-list-name">Criar Nova Lista:</label>
            <div class="new-list-form">
              <input
                type="text"
                id="new-list-name"
                v-model="novaListaNome"
                placeholder="Nome da nova lista"
                @keyup.enter="criarNovaLista"
              />
              <button @click="criarNovaLista">+</button>
            </div>
          </div>
        </div>
        <h3>Filtros e Ordenação</h3>
        <div class="organize-group">
          <label for="search-local">Pesquisar por Nome:</label>
          <input
            type="search"
            id="search-local"
            placeholder="Filtrar na sua lista..."
            v-model="filtroNome"
          />
        </div>
        <div class="organize-group">
          <label>Gerenciar Lista</label>
          <div class="io-buttons">
            <button @click="exportarLista">Exportar Lista</button>
            <button @click="triggerImportar">Importar Lista</button>
            <input
              type="file"
              ref="fileInput"
              @change="importarLista"
              accept=".json"
              style="display: none"
            />
          </div>
        </div>
        <div class="organize-group">
          <label for="sort-by">Ordenar por:</label>
          <select id="sort-by" v-model="sortBy">
            <option value="titulo-asc">Título (A-Z)</option>
            <option value="titulo-desc">Título (Z-A)</option>
            <option value="capitulos-asc">Capítulos (Crescente)</option>
            <option value="capitulos-desc">Capítulos (Decrescente)</option>
          </select>
        </div>
        <div class="organize-group">
          <label>Filtrar por Tipo:</label>
          <div class="filter-container">
            <span
              class="filter-tag"
              :class="{ selected: tipoSelecionado === 'todos' }"
              @click="setTipo('todos')"
              >Todos</span
            >
            <span
              class="filter-tag"
              :class="{ selected: tipoSelecionado === 'Manga' }"
              @click="setTipo('Manga')"
              >Manga</span
            >
            <span
              class="filter-tag"
              :class="{ selected: tipoSelecionado === 'Manhwa' }"
              @click="setTipo('Manhwa')"
              >Manhwa</span
            >
            <span
              class="filter-tag"
              :class="{ selected: tipoSelecionado === 'Manhua' }"
              @click="setTipo('Manhua')"
              >Manhua</span
            >
            <span
              class="filter-tag"
              :class="{ selected: tipoSelecionado === 'Novel' }"
              @click="setTipo('Novel')"
              >Novel</span
            >
          </div>
        </div>
        <div class="organize-group">
          <label>Filtrar por Status:</label>
          <div class="filter-container">
            <span
              class="filter-status-tag"
              :class="{ selected: statusSelecionado === 'todos' }"
              @click="setStatus('todos')"
              data-status="todos"
              >Todos</span
            >
            <span
              class="filter-status-tag"
              :class="{ selected: statusSelecionado === 'Quero Ler' }"
              @click="setStatus('Quero Ler')"
              data-status="Quero Ler"
              >Quero Ler</span
            >
            <span
              class="filter-status-tag"
              :class="{ selected: statusSelecionado === 'Lendo' }"
              @click="setStatus('Lendo')"
              data-status="Lendo"
              >Lendo</span
            >
            <span
              class="filter-status-tag"
              :class="{ selected: statusSelecionado === 'Lido' }"
              @click="setStatus('Lido')"
              data-status="Lido"
              >Lido</span
            >
            <span
              class="filter-status-tag"
              :class="{ selected: statusSelecionado === 'Abandonado' }"
              @click="setStatus('Abandonado')"
              data-status="Abandonado"
              >Abandonado</span
            >
          </div>
        </div>
        <div class="organize-group">
          <label>Filtrar por Gênero:</label>
          <div class="filter-container">
            <span
              class="filter-tag"
              :class="{ selected: generoSelecionado.length === 0 }"
              @click="setGenero([])"
              >Todos</span
            >
            <span
              class="filter-tag"
              v-for="genero in todosOsGenerosOrdenados"
              :key="genero"
              :class="{ selected: generoSelecionado.includes(genero) }"
              @click="toggleGenero(genero)"
            >
              {{ genero }}
            </span>
          </div>
        </div>
      </aside>

      <main class="main-content">
        <h2>{{ listaAtiva }}</h2>
        <ul id="manga-list">
          <template v-if="isLoading && mangasDaListaAtiva.length === 0">
            <CardSkeleton v-for="n in 3" :key="n" />
          </template>
          <template v-else>
            <MangaCard
              v-for="manga in mangasFiltradosEOrdenados"
              :key="manga.titulo"
              :manga="manga"
              @removerManga="removerManga"
            />
          </template>
        </ul>
      </main>
    </div>

    <MangaSelectionModal
      v-if="showSelectionModal"
      :results="searchResults"
      @close="closeSelectionModal"
      @mangaSelected="adicionarMangaSelecionado"
    />
    <ManualAddModal
      v-if="showManualAddModal"
      :existing-genres="todosOsGenerosOrdenados"
      @close="showManualAddModal = false"
      @save="adicionarMangaManual"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { fazerLogout } from '@/firebase/authService'
import { escutarColecaoDeMangas, salvarColecaoDeMangas } from '@/firebase/firestoreService'
import MangaCard from '@/components/MangaCard.vue'
import CardSkeleton from '@/components/CardSkeleton.vue'
import MangaSelectionModal from '@/components/MangaSelectionModal.vue'
import ManualAddModal from '@/components/ManualAddModal.vue'
import { useToast } from 'vue-toastification'
import { fetchMangaData } from '@/composables/useMangaApi'
import type { Manga, MangaCollection } from '@/types'

const router = useRouter()
const toast = useToast()

const searchResults = ref<Manga[]>([])
const showSelectionModal = ref(false)
const showManualAddModal = ref(false)

// ALTERADO: Gerenciamento de múltiplas listas
const colecaoDeMangas = ref<MangaCollection>({})
const listaAtiva = ref<string>('')
const novaListaNome = ref('')

const mangaInput = ref('')
const todosOsGeneros = ref(new Set<string>())
const generoSelecionado = ref<string[]>([])
const statusSelecionado = ref('todos')
const tipoSelecionado = ref('todos')
const sortBy = ref('titulo-asc')
const isLoading = ref(false)
const filtroNome = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

let pararDeEscutar: () => void

onMounted(() => {
  pararDeEscutar = escutarColecaoDeMangas((novaColecao) => {
    // Se não houver nenhuma lista, cria a primeira
    if (Object.keys(novaColecao).length === 0) {
      novaColecao['Minha Lista Principal'] = []
    }
    colecaoDeMangas.value = novaColecao

    // Se a lista ativa não existir mais (ex: foi deletada), seleciona a primeira
    if (!colecaoDeMangas.value[listaAtiva.value]) {
      listaAtiva.value = Object.keys(novaColecao)[0] || ''
    }
  })
})

// Observa a coleção para atualizar a lista de gêneros
watch(
  colecaoDeMangas,
  (novaColecao) => {
    todosOsGeneros.value.clear()
    Object.values(novaColecao)
      .flat()
      .forEach((manga) => {
        if (manga.generos && manga.generos !== 'N/A') {
          manga.generos.split(', ').forEach((g: string) => todosOsGeneros.value.add(g.trim()))
        }
      })
  },
  { deep: true },
)

onUnmounted(() => {
  if (pararDeEscutar) {
    pararDeEscutar()
  }
})

// NOVAS FUNÇÕES de gerenciamento de lista
const nomesDasListas = computed(() => Object.keys(colecaoDeMangas.value))

const mangasDaListaAtiva = computed(() => {
  if (!listaAtiva.value || !colecaoDeMangas.value[listaAtiva.value]) {
    return []
  }
  return colecaoDeMangas.value[listaAtiva.value]
})

const criarNovaLista = () => {
  const nome = novaListaNome.value.trim()
  if (!nome) {
    toast.warning('O nome da lista não pode ser vazio.')
    return
  }
  if (colecaoDeMangas.value[nome]) {
    toast.warning(`A lista "${nome}" já existe.`)
    return
  }
  const novaColecao = { ...colecaoDeMangas.value, [nome]: [] }
  salvarColecaoDeMangas(novaColecao)
    .then(() => {
      listaAtiva.value = nome // Seleciona a nova lista criada
      novaListaNome.value = ''
      toast.success(`Lista "${nome}" criada com sucesso!`)
    })
    .catch(() => {
      toast.error('Erro ao criar a nova lista.')
    })
}

// LÓGICA DE ADIÇÃO E REMOÇÃO ALTERADA
const adicionarMangaSelecionado = (manga: Manga) => {
  if (
    mangasDaListaAtiva.value.some(
      (item) => item.titulo.toLowerCase() === manga.titulo.toLowerCase(),
    )
  ) {
    toast.info(`"${manga.titulo}" já está na lista "${listaAtiva.value}".`)
  } else {
    const novaListaDeMangas = [...mangasDaListaAtiva.value, manga]
    const novaColecao = { ...colecaoDeMangas.value, [listaAtiva.value]: novaListaDeMangas }
    salvarColecaoDeMangas(novaColecao)
      .then(() => {
        toast.success(`"${manga.titulo}" foi adicionado à lista "${listaAtiva.value}"!`)
      })
      .catch((err) => {
        toast.error('Erro ao salvar o mangá.')
        console.error(err)
      })
  }
  mangaInput.value = ''
  closeSelectionModal()
}

const removerManga = (mangaParaRemover: Manga) => {
  const novaListaDeMangas = mangasDaListaAtiva.value.filter(
    (manga) => manga.titulo !== mangaParaRemover.titulo,
  )
  const novaColecao = { ...colecaoDeMangas.value, [listaAtiva.value]: novaListaDeMangas }
  salvarColecaoDeMangas(novaColecao)
    .then(() => {
      toast.info(`"${mangaParaRemover.titulo}" foi removido da lista "${listaAtiva.value}".`)
    })
    .catch((err) => {
      toast.error('Erro ao remover o mangá.')
      console.error(err)
    })
}

// O resto das funções (logout, busca, etc.) permanece praticamente igual
const handleLogout = async () => {
  await fazerLogout()
  router.push('/login')
}
const adicionarMangaManual = (novoManga: Manga) => {
  adicionarMangaSelecionado(novoManga)
  showManualAddModal.value = false
}
const closeSelectionModal = () => {
  showSelectionModal.value = false
  searchResults.value = []
}
const triggerImportar = () => {
  fileInput.value?.click()
}

const buscarManga = async () => {
  const nomeManga = mangaInput.value.trim()
  if (nomeManga === '') return
  isLoading.value = true
  const { data: resultados, error } = await fetchMangaData(nomeManga)
  isLoading.value = false
  if (error) {
    toast.warning(error)
  } else if (resultados && resultados.length > 0) {
    if (resultados.length > 1) {
      searchResults.value = resultados
      showSelectionModal.value = true
    } else {
      adicionarMangaSelecionado(resultados[0])
    }
  } else {
    toast.info('Nenhum resultado encontrado para sua busca.')
  }
}

const exportarLista = () => {
  if (mangasDaListaAtiva.value.length === 0) {
    toast.info('A lista atual está vazia. Adicione mangás para exportar.')
    return
  }
  const dataStr = JSON.stringify(mangasDaListaAtiva.value, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${listaAtiva.value}.json`
  link.click()
  URL.revokeObjectURL(url)
  toast.success(`Lista "${listaAtiva.value}" exportada com sucesso!`)
}

const importarLista = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = e.target?.result
      if (typeof content !== 'string') throw new Error('Conteúdo do arquivo inválido.')
      const novaListaImportada: Manga[] = JSON.parse(content)
      if (
        !Array.isArray(novaListaImportada) ||
        (novaListaImportada.length > 0 && !novaListaImportada[0].titulo)
      ) {
        throw new Error('Formato do arquivo JSON inválido.')
      }

      const novaColecao = { ...colecaoDeMangas.value, [listaAtiva.value]: novaListaImportada }
      salvarColecaoDeMangas(novaColecao)
        .then(() => {
          toast.success(`Lista importada para "${listaAtiva.value}" com sucesso!`)
        })
        .catch((err) => {
          toast.error('Erro ao salvar a lista importada.')
          console.error(err)
        })
    } catch (error) {
      toast.error('Falha ao importar. Verifique se o arquivo é um JSON válido.')
    } finally {
      if (target) target.value = ''
    }
  }
  reader.readAsText(file)
}

const mangasFiltradosEOrdenados = computed(() => {
  let mangas = [...mangasDaListaAtiva.value]
  const termoBusca = filtroNome.value.trim().toLowerCase()
  if (termoBusca) {
    mangas = mangas.filter((manga) => manga.titulo.toLowerCase().includes(termoBusca))
  }
  if (tipoSelecionado.value !== 'todos') {
    mangas = mangas.filter((manga) => manga.tipo === tipoSelecionado.value)
  }
  if (generoSelecionado.value.length > 0) {
    mangas = mangas.filter((manga) => {
      if (!manga.generos || manga.generos === 'N/A') return false
      const mangaGeneros = manga.generos.split(', ').map((g: string) => g.trim())
      return generoSelecionado.value.every((g) => mangaGeneros.includes(g))
    })
  }
  if (statusSelecionado.value !== 'todos') {
    mangas = mangas.filter((manga) => manga.status === statusSelecionado.value)
  }
  mangas.sort((a: Manga, b: Manga) => {
    if (sortBy.value === 'titulo-asc') return a.titulo.localeCompare(b.titulo)
    if (sortBy.value === 'titulo-desc') return b.titulo.localeCompare(a.titulo)
    const capsA = a.capitulos === 'N/A' ? Infinity : Number(a.capitulos)
    const capsB = b.capitulos === 'N/A' ? Infinity : Number(b.capitulos)
    if (sortBy.value === 'capitulos-asc') return capsA - capsB
    if (sortBy.value === 'capitulos-desc') return capsB - capsA
    return 0
  })
  return mangas
})

const todosOsGenerosOrdenados = computed(() => Array.from(todosOsGeneros.value).sort())
const toggleGenero = (genero: string) => {
  const index = generoSelecionado.value.indexOf(genero)
  if (index > -1) {
    generoSelecionado.value.splice(index, 1)
  } else {
    generoSelecionado.value.push(genero)
  }
}
const setGenero = (generos: string[]) => {
  generoSelecionado.value = generos
}
const setStatus = (status: string) => {
  statusSelecionado.value = status
}
const setTipo = (tipo: string) => {
  tipoSelecionado.value = tipo
}
</script>

<style scoped>
/* NOVOS ESTILOS PARA GERENCIAMENTO DE LISTAS */
.list-management-section {
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 20px;
  margin-bottom: 20px;
}
.new-list-form {
  display: flex;
  gap: 10px;
}
.new-list-form input {
  flex-grow: 1;
}
.new-list-form button {
  flex-shrink: 0;
  width: 50px;
  font-size: 1.5rem;
}

/* ESTILOS EXISTENTES */
.header-top {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 0 50px;
}
.header-top h1 {
  margin: 0;
}
.btn-logout {
  position: absolute;
  right: 0;
  background-color: var(--remove-color);
  padding: 8px 16px;
  font-size: 14px;
}
#search-local {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-color);
  color: var(--text-color);
  border-radius: 8px;
}
.home-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}
.header-section {
  text-align: center;
  margin-bottom: 30px;
}
.add-manga-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}
#manual-add-button {
  background-color: var(--card-bg-color);
  border: 1px solid var(--border-color);
  color: var(--text-color);
}
#manual-add-button:hover {
  background-color: var(--border-color);
}
.page-container {
  display: flex;
  align-items: flex-start;
  gap: 30px;
}
.sidebar {
  flex: 0 0 280px;
  background-color: var(--card-bg-color);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
.sidebar h3 {
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
}
.organize-group {
  margin-bottom: 25px;
}
.organize-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: var(--subtle-text-color);
}
select {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-color);
  color: var(--text-color);
  font-size: 14px;
  cursor: pointer;
  outline: none;
}
.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.filter-tag,
.filter-status-tag {
  background-color: var(--border-color);
  color: var(--subtle-text-color);
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
  transition:
    background-color 0.2s,
    color 0.2s;
}
.filter-tag:hover,
.filter-status-tag:hover {
  background-color: var(--subtle-text-color);
  color: white;
}
.filter-tag.selected {
  background-color: var(--primary-color);
  color: white;
  font-weight: bold;
}
.filter-status-tag.selected[data-status='todos'] {
  background-color: var(--primary-color);
  color: white;
  font-weight: bold;
}
.filter-status-tag.selected[data-status='Lendo'] {
  background-color: var(--status-reading-color);
  color: white;
  font-weight: bold;
}
.filter-status-tag.selected[data-status='Lido'] {
  background-color: var(--status-read-color);
  color: white;
  font-weight: bold;
}
.filter-status-tag.selected[data-status='Quero Ler'] {
  background-color: var(--status-planned-color);
  color: white;
  font-weight: bold;
}
.filter-status-tag.selected[data-status='Abandonado'] {
  background-color: var(--status-abandoned-color);
  color: white;
  font-weight: bold;
}
.main-content {
  flex: 1;
}
.main-content h2 {
  text-align: center;
  margin-top: 0;
}
#manga-list {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
}
.search-tip {
  margin-top: 15px;
  font-size: 0.9rem;
  color: var(--subtle-text-color);
}
.io-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
</style>
