<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-btn" @click="$emit('close')">×</button>
      <h2>Adicionar Novo Item Manualmente</h2>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="titulo">Título *</label>
          <input type="text" id="titulo" v-model="novoManga.titulo" required />
        </div>
        <div class="form-group">
          <label for="capaUrl">URL da Imagem de Capa</label>
          <input type="url" id="capaUrl" v-model="novoManga.capaUrl" placeholder="https://..." />
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label for="tipo">Tipo</label>
            <select id="tipo" v-model="novoManga.tipo">
              <option>Manga</option>
              <option>Manhwa</option>
              <option>Manhua</option>
              <option>Novel</option>
              <option>Light Novel</option>
              <option>One-shot</option>
            </select>
          </div>
          <div class="form-group">
            <label for="status">Status</label>
            <select id="status" v-model="novoManga.status">
              <option>Quero Ler</option>
              <option>Lendo</option>
              <option>Lido</option>
              <option>Abandonado</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label for="generos">Gêneros (clique para selecionar)</label>
          <div class="genre-selector">
            <span
              v-for="genre in existingGenres"
              :key="genre"
              class="genre-tag"
              :class="{ selected: selectedGenres.includes(genre) }"
              @click="toggleGenre(genre)"
            >
              {{ genre }}
            </span>
          </div>
          <input
            type="text"
            id="generos"
            v-model="newGenreInput"
            @keydown.enter.prevent="addNewGenre"
            placeholder="Ou adicione um novo gênero e tecle Enter"
            class="new-genre-input"
          />
        </div>

        <div class="form-group">
          <label for="linkLeitura">Links para Leitura</label>
          <div class="link-input-group">
            <input
              type="url"
              id="linkLeitura"
              v-model="newLinkInput"
              placeholder="https://..."
              @keydown.enter.prevent="addLink"
            />
            <button type="button" @click="addLink">+</button>
          </div>
          <ul class="link-list" v-if="links.length > 0">
            <li v-for="(link, index) in links" :key="index">
              <span>{{ link }}</span>
              <button type="button" @click="removeLink(index)">×</button>
            </li>
          </ul>
        </div>

        <div class="form-group">
          <label for="descricao">Descrição</label>
          <textarea id="descricao" v-model="novoManga.descricao" rows="4"></textarea>
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="$emit('close')">Cancelar</button>
          <button type="submit" class="save-btn">Salvar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Manga } from '@/types'

const props = defineProps<{ existingGenres: string[] }>()
const emit = defineEmits(['close', 'save'])

const novoManga = ref<
  Omit<
    Manga,
    'capitulos' | 'capitulosLidos' | 'nomesAlternativos' | 'isManual' | 'generos' | 'linksLeitura'
  >
>({
  titulo: '',
  capaUrl: '',
  descricao: '',
  status: 'Quero Ler',
  tipo: 'Manga',
})

const selectedGenres = ref<string[]>([])
const newGenreInput = ref('')
const links = ref<string[]>([])
const newLinkInput = ref('')

const addLink = () => {
  const newLink = newLinkInput.value.trim()
  if (newLink && links.value.indexOf(newLink) === -1) {
    links.value.push(newLink)
  }
  newLinkInput.value = ''
}

const removeLink = (index: number) => {
  links.value.splice(index, 1)
}

const toggleGenre = (genre: string) => {
  const index = selectedGenres.value.indexOf(genre)
  if (index > -1) {
    selectedGenres.value.splice(index, 1)
  } else {
    selectedGenres.value.push(genre)
  }
}

const addNewGenre = () => {
  const newGenre = newGenreInput.value.trim()
  if (newGenre && !selectedGenres.value.includes(newGenre)) {
    selectedGenres.value.push(newGenre)
  }
  newGenreInput.value = ''
}

const handleSubmit = () => {
  const generosTratado = selectedGenres.value.length > 0 ? selectedGenres.value.join(', ') : 'N/A'
  const mangaCompleto: Manga = {
    ...novoManga.value,
    generos: generosTratado,
    linksLeitura: links.value,
    capitulos: 'N/A',
    capitulosLidos: 0,
    nomesAlternativos: 'N/A',
    isManual: true,
  }
  emit('save', mangaCompleto)
}

watch(
  () => props.existingGenres,
  () => {
    selectedGenres.value = []
    links.value = []
  },
)
</script>

<style scoped>
/* ESTILOS PARA O CAMPO DE LINKS */
.link-input-group {
  display: flex;
  gap: 10px;
}
.link-input-group input {
  flex-grow: 1;
}
.link-input-group button {
  flex-shrink: 0;
  width: 50px;
  font-size: 1.5rem;
}
.link-list {
  list-style: none;
  padding: 0;
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.link-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-color);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
}
.link-list li button {
  background: none;
  border: none;
  color: var(--remove-color);
  font-size: 1.2rem;
  padding: 0 5px;
}

/* ESTILOS EXISTENTES */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background-color: var(--card-bg-color);
  color: var(--text-color);
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}
.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 28px;
  color: var(--subtle-text-color);
  cursor: pointer;
}
.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--subtle-text-color);
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
input,
select,
textarea {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-color);
  color: var(--text-color);
  border-radius: 8px;
  box-sizing: border-box;
}
textarea {
  resize: vertical;
  min-height: 80px;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}
.form-actions button {
  padding: 10px 25px;
}
.save-btn {
  background-color: var(--save-color);
}
.cancel-btn {
  background-color: var(--remove-color);
}
.genre-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  background-color: var(--bg-color);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  margin-bottom: 10px;
}
.genre-tag {
  background-color: var(--border-color);
  color: var(--subtle-text-color);
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.genre-tag.selected {
  background-color: var(--primary-color);
  color: white;
  font-weight: bold;
}
.new-genre-input {
  margin-top: 10px;
}
</style>
