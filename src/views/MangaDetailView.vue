<template>
  <h1 style="color: yellow; font-size: 32px; background: black; text-align: center; padding: 10px">
    TESTE DE VERSÃO - SE ESTÁ VENDO ISSO, O ARQUIVO FOI ATUALIZADO
  </h1>

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
            <div v-if="manga.linkLeitura">
              <strong>Onde Ler:</strong>
              <a
                :href="manga.linkLeitura"
                target="_blank"
                rel="noopener noreferrer"
                class="read-link"
                >Acessar Link</a
              >
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

          <label>Link para Leitura</label>
          <input
            type="url"
            v-model="editedManga.linkLeitura"
            class="modal-input"
            placeholder="https://exemplo.com/manga/.."
          />

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
          <template v-if="!isEditing">
            <button id="update-btn" @click="openUpdateConfirmation" :disabled="isUpdating">
              {{ isUpdating ? 'Atualizando...' : 'Atualizar Automaticamente' }}
            </button>
            <button id="edit-btn" @click="toggleEditMode">Editar Detalhes</button>
          </template>
          <template v-else>
            <button class="cancel-btn" @click="toggleEditMode">Cancelar</button>
            <button id="save-edit-btn" @click="salvarEdicao(true)">Salvar Detalhes</button>
          </template>
        </div>
      </div>
      <div class="description" v-if="!isEditing">
        <h2>Sinopse</h2>
        <p>{{ manga.descricao }}</p>
      </div>
    </div>

    <div v-else class="not-found">
      <h1>Mangá não encontrado</h1>
    </div>

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
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { fetchMangaData } from '@/composables/useMangaApi'
import type { Manga } from '@/types'
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

const route = useRoute()
const toast = useToast()

const openUpdateConfirmation = () => {
  if (!manga.value) return
  confirmationTitle.value = 'Confirmar Atualização'
  if (manga.value.isManual) {
    confirmationMessage.value = `Este item foi adicionado <strong>manualmente</strong>. Atualizar com dados da internet pode sobrescrever suas informações com as de outro mangá com nome parecido.<br><br>Deseja continuar?`
  } else {
    confirmationMessage.value =
      'Isso buscará as informações mais recentes nas APIs e atualizará os dados deste item. Seus dados pessoais (status, capítulos lidos) serão mantidos.<br><br>Deseja continuar?'
  }
  showConfirmationModal.value = true
}

const handleConfirmUpdate = async () => {
  showConfirmationModal.value = false
  if (!manga.value) return

  isUpdating.value = true
  toast.info(`Buscando por atualizações para "${manga.value.titulo}"...`)

  const { data: resultados, error } = await fetchMangaData(manga.value.titulo)
  isUpdating.value = false

  if (error) {
    toast.error('Falha ao buscar atualizações.')
    return
  }

  // Lógica corrigida para SEMPRE mostrar a seleção
  if (resultados && resultados.length > 0) {
    searchResults.value = resultados
    showSelectionModal.value = true
  } else {
    toast.warning('Nenhuma atualização encontrada para este título.')
  }
}

const handleMangaSelectedForUpdate = (selectedManga: Manga) => {
  if (!manga.value) return
  const mangaParaSalvar: Manga = {
    ...selectedManga,
    status: manga.value.status,
    capitulosLidos: manga.value.capitulosLidos,
    linkLeitura: manga.value.linkLeitura,
    isManual: false,
  }

  editedManga.value = mangaParaSalvar
  salvarEdicao(false)
  toast.success(`"${manga.value.titulo}" foi atualizado com sucesso!`)
  closeSelectionModal()
}

const closeSelectionModal = () => {
  showSelectionModal.value = false
  searchResults.value = []
}

const carregarManga = () => {
  const mangasSalvos: Manga[] = JSON.parse(localStorage.getItem('mangasLidos') || '[]')
  const mangaSlug = route.params.id as string
  const encontrado = mangasSalvos.find((m) => {
    if (!m || !m.titulo) return false
    const slug = m.titulo
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    return slug === mangaSlug
  })
  manga.value = encontrado || null
  editedManga.value = { ...encontrado }
}

const toggleEditMode = () => {
  isEditing.value = !isEditing.value
  if (!isEditing.value) {
    editedManga.value = { ...manga.value }
  }
}

const salvarEdicao = (showToast = false) => {
  const mangasSalvos: Manga[] = JSON.parse(localStorage.getItem('mangasLidos') || '[]')
  const index = mangasSalvos.findIndex((m) => m.titulo === manga.value?.titulo)
  if (index !== -1 && manga.value) {
    mangasSalvos[index] = editedManga.value as Manga
    localStorage.setItem('mangasLidos', JSON.stringify(mangasSalvos))
    manga.value = { ...editedManga.value } as Manga
    if (showToast) {
      isEditing.value = false
      toast.success('Mangá atualizado com sucesso!')
    }
  } else {
    toast.error('Erro ao encontrar o mangá para salvar.')
  }
}

const changeStatus = (newStatus: Manga['status']) => {
  if (editedManga.value) {
    editedManga.value.status = newStatus
    salvarEdicao()
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
      salvarEdicao()
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
    salvarEdicao()
  }
}

const statusClass = computed(() => {
  if (!manga.value) return ''
  switch (manga.value.status) {
    case 'Lendo':
      return 'reading'
    case 'Lido':
      return 'read'
    case 'Quero Ler':
      return 'planned'
    case 'Abandonado':
      return 'abandoned'
    default:
      return ''
  }
})

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
/* Estilos existentes */
#update-btn {
  background-color: var(--primary-color);
  color: white;
}
#update-btn:hover {
  background-color: #2980b9;
}
#update-btn:disabled {
  background-color: var(--border-color);
  cursor: not-allowed;
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
  margin-bottom: 15px;
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
div[v-else] label {
  display: block;
  margin-bottom: 5px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--subtle-text-color);
}
div[v-else] > label {
  margin-top: 15px;
}
</style>
