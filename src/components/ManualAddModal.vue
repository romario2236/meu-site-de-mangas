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
          <label>Links para Leitura</label>
          <div v-if="links.length === 0" class="no-links-message">Nenhum link adicionado.</div>
          <div v-for="(link, index) in links" :key="index" class="link-input-group">
            <input
              type="text"
              v-model="link.nome"
              placeholder="Nome do Site (ex: MangaLivre)"
              required
            />
            <input type="url" v-model="link.url" placeholder="URL do link (https://...)" required />
            <button type="button" class="remove-link-btn" @click="removeLink(index)">×</button>
          </div>
          <button type="button" class="add-link-btn" @click="addLink">Adicionar Link</button>
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
import type { Manga, LinkLeitura } from '@/types'

const props = defineProps<{
  existingGenres: string[]
}>()
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

// ALTERADO: A variável 'links' agora é uma lista de objetos
const links = ref<LinkLeitura[]>([])

const addLink = () => {
  // ALTERADO: Adiciona um objeto com nome e url vazios
  links.value.push({ nome: '', url: '' })
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
    linksLeitura: links.value, // ALTERADO: Já está no formato correto
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
/* ESTILOS ALTERADOS E NOVOS */
.link-input-group {
  display: grid;
  grid-template-columns: 1fr 1.5fr auto;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
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
  margin-top: 10px;
  display: inline-block;
  width: auto;
}
.no-links-message {
  color: var(--subtle-text-color);
  margin-bottom: 10px;
  font-style: italic;
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
