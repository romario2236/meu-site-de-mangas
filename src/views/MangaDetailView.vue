<template>
  <div class="detail-wrapper">
    <router-link to="/" class="back-button">&larr; Voltar para a lista</router-link>

    <div v-if="manga" class="manga-detail-content">
      <img :src="manga.capaUrl" :alt="manga.titulo" class="detail-cover" />
      <div class="detail-info">
        <div v-if="!isEditing">
          <h1>{{ manga.titulo }}</h1>
          <div class="info-group">
            <div><strong>Tipo:</strong> {{ manga.tipo }}</div>
            <div>
              <strong>Status:</strong>
              <div class="status-selector">
                <span
                  class="status-tag"
                  :class="{ selected: editedManga.status === 'Quero Ler' }"
                  @click="changeStatus('Quero Ler')"
                  >Quero Ler</span
                >
                <span
                  class="status-tag"
                  :class="{ selected: editedManga.status === 'Lendo' }"
                  @click="changeStatus('Lendo')"
                  >Lendo</span
                >
                <span
                  class="status-tag"
                  :class="{ selected: editedManga.status === 'Lido' }"
                  @click="changeStatus('Lido')"
                  >Lido</span
                >
                <span
                  class="status-tag"
                  :class="{ selected: editedManga.status === 'Abandonado' }"
                  @click="changeStatus('Abandonado')"
                  >Abandonado</span
                >
              </div>
            </div>

            <div class="list-management">
              <strong>Listas:</strong>
              <div class="list-selector">
                <span
                  v-for="listName in allListNames"
                  :key="listName"
                  class="list-tag"
                  :class="{ selected: mangaInLists.includes(listName) }"
                  @click="toggleMangaInList(listName)"
                >
                  {{ listName }}
                </span>
              </div>
            </div>
            <div><strong>Capítulos:</strong> {{ manga.capitulos }}</div>
            <div class="info-field">
              <strong class="info-label">Capítulos Lidos:</strong>
              <div class="chapter-counter">
                <button class="count-btn" @click="decrementarCapitulo">-</button>
                <span class="chapters-read-count">{{ editedManga.capitulosLidos || 0 }}</span>
                <button class="count-btn" @click="incrementarCapitulo">+</button>
              </div>
            </div>
            <div><strong>Gêneros:</strong> {{ manga.generos }}</div>
            <div><strong>Nomes Alternativos:</strong> {{ manga.nomesAlternativos }}</div>
            <div v-if="manga.linksLeitura && manga.linksLeitura.length > 0">
              <strong>Onde Ler:</strong>
              <div class="read-links-container">
                <a
                  v-for="(link, index) in manga.linksLeitura"
                  :key="index"
                  :href="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="read-link"
                >
                  {{ link.nome }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div v-else>
          <h1>Editar Mangá</h1>
          <label>Título</label>
          <input
            type="text"
            v-model="editedManga.titulo"
            class="modal-input"
            placeholder="Título"
          />
          <label>URL da Imagem de Capa</label>
          <input
            type="url"
            v-model="editedManga.capaUrl"
            class="modal-input"
            placeholder="https://exemplo.com/imagem.jpg"
          />
          <label>Links para Leitura</label>
          <div
            v-for="(link, index) in editedManga.linksLeitura"
            :key="index"
            class="link-edit-group"
          >
            <input
              type="text"
              v-model="link.nome"
              placeholder="Nome do Site"
              class="modal-input"
              required
            />
            <input
              type="url"
              v-model="link.url"
              placeholder="URL do Link"
              class="modal-input"
              required
            />
            <button class="remove-link-btn" @click="removeLink(index)">×</button>
          </div>
          <button type="button" class="add-link-btn" @click="addLink">Adicionar outro link</button>
          <label>Gêneros (separados por vírgula)</label>
          <input
            type="text"
            v-model="editedManga.generos"
            class="modal-input"
            placeholder="Ação, Aventura, Fantasia..."
          />
          <div class="form-grid">
            <div>
              <label>Total de Capítulos</label>
              <input
                type="number"
                v-model.number="editedManga.capitulos"
                class="modal-input"
                placeholder="Total de Capítulos"
              />
            </div>
            <div>
              <label>Capítulos Lidos</label>
              <input
                type="number"
                v-model.number="editedManga.capitulosLidos"
                class="modal-input"
                placeholder="Capítulos Lidos"
              />
            </div>
          </div>
          <label>Nomes Alternativos</label>
          <input
            type="text"
            v-model="editedManga.nomesAlternativos"
            class="modal-input"
            placeholder="Nomes Alternativos"
          />
          <div class="form-grid">
            <div>
              <label>Tipo</label>
              <select v-model="editedManga.tipo" class="modal-input">
                <option>Manga</option>
                <option>Manhwa</option>
                <option>Manhua</option>
                <option>Novel</option>
                <option>Light Novel</option>
                <option>One-shot</option>
                <option>Doujinshi</option>
              </select>
            </div>
            <div>
              <label>Status</label>
              <select v-model="editedManga.status" class="modal-input">
                <option>Quero Ler</option>
                <option>Lendo</option>
                <option>Lido</option>
                <option>Abandonado</option>
              </select>
            </div>
          </div>
          <label>Descrição</label>
          <textarea
            v-model="editedManga.descricao"
            class="modal-textarea"
            placeholder="Descrição"
          ></textarea>
        </div>

        <div class="modal-actions">
          <template v-if="!isEditing && hasUnsavedChanges">
            <button class="cancel-btn" @click="cancelarAlteracoesRapidas">Cancelar</button>
            <button class="save-btn" @click="salvarAlteracoesRapidas">Salvar Alterações</button>
          </template>
          <template v-if="!isEditing && !hasUnsavedChanges">
            <button id="update-btn" @click="openUpdateConfirmation" :disabled="isUpdating">
              {{ isUpdating ? 'Atualizando...' : 'Atualizar Automaticamente' }}
            </button>
            <button id="edit-btn" @click="toggleEditMode">Editar Detalhes</button>
          </template>
          <template v-else-if="isEditing">
            <button class="cancel-btn" @click="toggleEditMode">Cancelar Edição</button>
            <button id="save-edit-btn" @click="salvarEdicaoCompleta">Salvar Detalhes</button>
          </template>
        </div>
      </div>
      <div class="description" v-if="!isEditing">
        <h2>Sinopse</h2>
        <p>{{ manga.descricao }}</p>
      </div>
    </div>
    <div v-else class="not-found"><h1>Mangá não encontrado</h1></div>
    <ConfirmationModal
      v-if="showConfirmationModal"
      :title="confirmationTitle"
      :message="confirmationMessage"
      confirm-text="Atualizar"
      @confirm="handleConfirmUpdate"
      @cancel="showConfirmationModal = false"
    />
    <MangaSelectionModal
      v-if="showSelectionModal"
      :results="searchResults"
      action-text="Selecionar"
      @close="closeSelectionModal"
      @mangaSelected="handleMangaSelectedForUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { fetchMangaData } from '@/composables/useMangaApi'
import { getColecaoDeMangas, salvarColecaoDeMangas } from '@/firebase/firestoreService'
import type { Manga, MangaCollection } from '@/types'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import MangaSelectionModal from '@/components/MangaSelectionModal.vue'

const manga = ref<Manga | null>(null)
const editedManga = ref<Partial<Manga>>({})
const isEditing = ref(false)
const isUpdating = ref(false)
const showConfirmationModal = ref(false)
const confirmationTitle = ref('')
const confirmationMessage = ref('')
const showSelectionModal = ref(false)
const searchResults = ref<Manga[]>([])
const hasUnsavedChanges = ref(false)

// NOVO: States para gerir as listas
const allListNames = ref<string[]>([])
const mangaInLists = ref<string[]>([])

const route = useRoute()
const toast = useToast()

const carregarManga = async () => {
  const colecao = await getColecaoDeMangas()
  const mangaSlug = route.params.id as string
  let encontrado: Manga | undefined

  // NOVO: Popula a lista com todos os nomes de listas existentes
  allListNames.value = Object.keys(colecao)
  mangaInLists.value = [] // Limpa a lista de participação do mangá

  for (const listName in colecao) {
    const mangaNaLista = colecao[listName].find((m: Manga) => {
      if (!m || !m.titulo) return false
      const slug = m.titulo
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      return slug === mangaSlug
    })

    if (mangaNaLista) {
      encontrado = mangaNaLista
      // NOVO: Se encontrou o mangá nesta lista, adiciona o nome da lista ao nosso state
      mangaInLists.value.push(listName)
    }
  }

  if (encontrado) {
    if (!Array.isArray(encontrado.linksLeitura)) {
      encontrado.linksLeitura = []
    }
    manga.value = encontrado
    editedManga.value = JSON.parse(JSON.stringify(encontrado))
  } else {
    manga.value = null
    editedManga.value = {}
  }
  hasUnsavedChanges.value = false
}

// NOVO: Função para adicionar/remover o mangá de uma lista
const toggleMangaInList = async (listName: string) => {
  if (!manga.value) return

  const colecao = await getColecaoDeMangas()
  const targetList = colecao[listName]
  const mangaIndex = targetList.findIndex((item) => item.titulo === manga.value?.titulo)

  if (mangaIndex > -1) {
    // Se o mangá existe na lista, remove-o
    targetList.splice(mangaIndex, 1)
    toast.info(`"${manga.value.titulo}" removido da lista "${listName}".`)
  } else {
    // Se o mangá não existe, adiciona-o
    targetList.push(manga.value)
    toast.success(`"${manga.value.titulo}" adicionado à lista "${listName}".`)
  }

  // Salva a coleção inteira com a modificação
  try {
    await salvarColecaoDeMangas(colecao)
    // Atualiza a UI localmente para refletir a mudança
    await carregarManga()
  } catch {
    toast.error('Erro ao atualizar as listas.')
  }
}

// --- O restante do script permanece o mesmo ---
const updateMangaInDatabase = async () => {
  const colecao = await getColecaoDeMangas()
  const mangaOriginalTitulo = manga.value?.titulo
  let mangaEncontrado = false
  if (!mangaOriginalTitulo) {
    toast.error('Não foi possível encontrar o título original do mangá para salvar.')
    return
  }
  for (const listName in colecao) {
    const index = colecao[listName].findIndex((m: Manga) => m.titulo === mangaOriginalTitulo)
    if (index !== -1) {
      colecao[listName][index] = editedManga.value as Manga
      mangaEncontrado = true
    }
  }
  if (mangaEncontrado) {
    try {
      await salvarColecaoDeMangas(colecao)
      manga.value = { ...editedManga.value } as Manga
    } catch {
      toast.error('Erro ao salvar alterações no banco de dados.')
      throw new Error('Falha ao salvar a coleção')
    }
  } else {
    toast.error('Erro ao encontrar o mangá para salvar nas suas listas.')
    throw new Error('Manga não encontrado na coleção para atualização.')
  }
}
const salvarAlteracoesRapidas = async () => {
  try {
    await updateMangaInDatabase()
    hasUnsavedChanges.value = false
    toast.success('Alterações salvas com sucesso!')
  } catch {
    /* erro já tratado */
  }
}
const cancelarAlteracoesRapidas = () => {
  editedManga.value = JSON.parse(JSON.stringify(manga.value || {}))
}
const salvarEdicaoCompleta = async () => {
  try {
    await updateMangaInDatabase()
    isEditing.value = false
    toast.success('Mangá atualizado com sucesso!')
  } catch {
    /* erro já tratado */
  }
}
const openUpdateConfirmation = () => {
  if (!manga.value) return
  confirmationTitle.value = 'Confirmar Atualização'
  if (manga.value.isManual) {
    confirmationMessage.value = `Este item foi adicionado <strong>manualmente</strong>. Atualizar com dados da internet pode sobrescrever as suas informações.<br><br>Deseja continuar?`
  } else {
    confirmationMessage.value = `Isto buscará as informações mais recentes e as atualizará. Os seus dados pessoais serão mantidos.<br><br>Deseja continuar?`
  }
  showConfirmationModal.value = true
}
const handleConfirmUpdate = async () => {
  showConfirmationModal.value = false
  if (!manga.value) return
  isUpdating.value = true
  toast.info(`A procurar por atualizações para "${manga.value.titulo}"...`)
  const { data: resultados } = await fetchMangaData(manga.value.titulo)
  isUpdating.value = false
  if (resultados && resultados.length > 0) {
    searchResults.value = resultados
    showSelectionModal.value = true
  } else {
    toast.warning('Nenhuma atualização encontrada para este título.')
  }
}
const handleMangaSelectedForUpdate = async (selectedManga: Manga) => {
  if (!manga.value) return
  const mangaParaSalvar: Manga = {
    ...selectedManga,
    status: manga.value.status,
    capitulosLidos: manga.value.capitulosLidos,
    linksLeitura: manga.value.linksLeitura,
    isManual: false,
  }
  editedManga.value = mangaParaSalvar
  try {
    await updateMangaInDatabase()
    toast.success(`"${manga.value.titulo}" foi atualizado com sucesso!`)
  } catch {
    /* erro já tratado */
  }
  closeSelectionModal()
}
const closeSelectionModal = () => {
  showSelectionModal.value = false
  searchResults.value = []
}
const toggleEditMode = () => {
  isEditing.value = !isEditing.value
  if (!isEditing.value) {
    cancelarAlteracoesRapidas()
  }
}
const changeStatus = (newStatus: Manga['status']) => {
  if (editedManga.value) {
    editedManga.value.status = newStatus
  }
}
const incrementarCapitulo = () => {
  if (
    editedManga.value &&
    editedManga.value.capitulosLidos !== undefined &&
    editedManga.value.capitulos
  ) {
    const totalCapitulos = Number(editedManga.value.capitulos)
    if (isNaN(totalCapitulos) || editedManga.value.capitulosLidos < totalCapitulos) {
      editedManga.value.capitulosLidos++
    }
  }
}
const decrementarCapitulo = () => {
  if (
    editedManga.value &&
    editedManga.value.capitulosLidos &&
    editedManga.value.capitulosLidos > 0
  ) {
    editedManga.value.capitulosLidos--
  }
}
const addLink = () => {
  if (!editedManga.value.linksLeitura) {
    editedManga.value.linksLeitura = []
  }
  editedManga.value.linksLeitura.push({ nome: '', url: '' })
}
const removeLink = (index: number) => {
  if (editedManga.value.linksLeitura) {
    editedManga.value.linksLeitura.splice(index, 1)
  }
}
watch(
  editedManga,
  (newValue) => {
    if (!manga.value || isEditing.value) {
      hasUnsavedChanges.value = false
      return
    }
    const originalMangaString = JSON.stringify(manga.value)
    const editedMangaString = JSON.stringify(newValue)
    hasUnsavedChanges.value = originalMangaString !== editedMangaString
  },
  { deep: true },
)
onMounted(() => {
  carregarManga()
})
watch(
  () => route.params.id,
  () => {
    carregarManga()
  },
)
</script>

<style scoped>
/* NOVOS ESTILOS PARA AS TAGS DE LISTA */
.list-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.list-tag {
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 600;
  color: var(--subtle-text-color);
  background-color: var(--border-color);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.list-tag:hover {
  color: white;
  background-color: var(--subtle-text-color);
}
.list-tag.selected {
  background-color: var(--primary-color);
  color: white;
  font-weight: bold;
}

/* ESTILOS EXISTENTES (resumido) */
.save-btn {
  background-color: var(--save-color);
  color: white;
}
.link-edit-group {
  display: grid;
  grid-template-columns: 1fr 1.5fr auto;
  gap: 10px;
  align-items: center;
  margin-bottom: 15px;
}
.remove-link-btn {
  background-color: var(--remove-color);
  color: white;
  border: none;
  border-radius: 8px;
  width: 45px;
  height: 45px;
  font-size: 1.5rem;
  cursor: pointer;
}
.add-link-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 5px;
  margin-bottom: 15px;
  display: inline-block;
  width: auto;
}
.read-links-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
}
.read-link {
  background-color: var(--primary-color);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s;
}
.read-link:hover {
  background-color: #2980b9;
}
.status-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.status-tag {
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 600;
  color: var(--subtle-text-color);
  background-color: var(--border-color);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: 2px solid transparent;
}
.status-tag:hover {
  color: white;
  background-color: var(--subtle-text-color);
}
.status-tag.selected {
  color: white;
  border: 2px solid white;
}
.status-tag.selected[class*='Quero Ler'] {
  background-color: var(--status-planned-color);
  border-color: var(--status-planned-color);
}
.status-tag.selected[class*='Lendo'] {
  background-color: var(--status-reading-color);
  border-color: var(--status-reading-color);
}
.status-tag.selected[class*='Lido'] {
  background-color: var(--status-read-color);
  border-color: var(--status-read-color);
}
.status-tag.selected[class*='Abandonado'] {
  background-color: var(--status-abandoned-color);
  border-color: var(--status-abandoned-color);
}
.detail-wrapper {
  max-width: 900px;
  margin: 40px auto;
  padding: 30px;
  color: var(--text-color);
  background-color: var(--card-bg-color);
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
.back-button {
  display: inline-block;
  margin-bottom: 30px;
  background-color: var(--bg-color);
  padding: 10px 25px;
  border-radius: 10px;
  color: var(--text-color);
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s ease;
}
.back-button:hover {
  background-color: var(--border-color);
}
.manga-detail-content {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 40px;
  align-items: start;
}
.detail-cover {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
.detail-info h1 {
  margin-top: 0;
  margin-bottom: 25px;
  font-size: 2.5rem;
  color: var(--primary-color);
  line-height: 1.2;
}
.info-group > div {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.info-group > div:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}
.info-group strong {
  font-weight: 600;
  color: var(--subtle-text-color);
  margin-right: 8px;
  min-width: 150px;
  flex-shrink: 0;
}
.description {
  grid-column: 1 / -1;
  line-height: 1.8;
  text-align: justify;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}
.description h2 {
  margin-top: 0;
}
.not-found {
  text-align: center;
  margin-top: 50px;
}
.info-field {
  display: flex;
  align-items: center;
  gap: 15px;
}
.chapter-counter {
  display: flex;
  align-items: center;
  gap: 10px;
}
.count-btn {
  background-color: var(--border-color);
  color: var(--text-color);
  border: none;
  border-radius: 8px;
  width: 35px;
  height: 35px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.count-btn:hover {
  background-color: var(--subtle-text-color);
}
.chapters-read-count {
  font-size: 1.2rem;
  font-weight: bold;
  min-width: 40px;
  text-align: center;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
}
.modal-actions button {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s ease;
}
#edit-btn {
  background-color: var(--edit-color);
  color: #333;
}
#edit-btn:hover {
  background-color: #d35400;
}
#save-edit-btn {
  background-color: var(--save-color);
  color: white;
}
#save-edit-btn:hover {
  background-color: #27ae60;
}
.cancel-btn {
  background-color: var(--remove-color);
  color: white;
}
.cancel-btn:hover {
  background-color: #c0392b;
}
.modal-input,
.modal-textarea,
select {
  width: 100%;
  margin-bottom: 10px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-color);
  color: var(--text-color);
  font-size: 16px;
  box-sizing: border-box;
}
.modal-textarea {
  resize: vertical;
  min-height: 120px;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
</style>
