<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-btn" @click="$emit('close')">×</button>
      <h2>Adicionar Novo Item Manualmente</h2>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="titulo">Título *</label>
          <input type="text" id="titulo" v-model="novoManga.titulo" required>
        </div>
        <div class="form-group">
          <label for="capaUrl">URL da Imagem de Capa</label>
          <input type="url" id="capaUrl" v-model="novoManga.capaUrl" placeholder="https://...">
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
          <label for="generos">Gêneros</label>
          <input type="text" id="generos" v-model="novoManga.generos" placeholder="Ação, Aventura, Fantasia...">
        </div>
        <div class="form-group">
          <label for="linkLeitura">Link para Leitura</label>
          <input type="url" id="linkLeitura" v-model="novoManga.linkLeitura" placeholder="https://...">
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
import { ref } from 'vue';
import type { Manga } from '@/types';

const emit = defineEmits(['close', 'save']);

// Objeto reativo para guardar os dados do formulário, agora incluindo gêneros
const novoManga = ref<Omit<Manga, 'capitulos' | 'capitulosLidos' | 'nomesAlternativos'>>({
  titulo: '',
  capaUrl: '',
  descricao: '',
  status: 'Quero Ler',
  linkLeitura: '',
  tipo: 'Manga',
  generos: '', // <-- CAMPO ADICIONADO
});

// Dentro de <script setup> em src/components/ManualAddModal.vue
const handleSubmit = () => {
  const generosTratado = novoManga.value.generos.trim() === '' ? 'N/A' : novoManga.value.generos;
  const mangaCompleto: Manga = {
    ...novoManga.value,
    generos: generosTratado,
    capitulos: 'N/A',
    capitulosLidos: 0,
    nomesAlternativos: 'N/A',
    isManual: true, // <-- CAMPO ADICIONADO
  };
  emit('save', mangaCompleto);
};
</script>

<style scoped>
.modal-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex; justify-content: center; align-items: center; z-index: 1000;
}
.modal-content {
    background-color: var(--card-bg-color); color: var(--text-color);
    padding: 30px; border-radius: 12px; width: 90%; max-width: 500px;
    max-height: 90vh; overflow-y: auto; position: relative;
}
.close-btn {
    position: absolute; top: 15px; right: 15px; background: none; border: none;
    font-size: 28px; color: var(--subtle-text-color); cursor: pointer;
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
input, select, textarea {
    width: 100%; padding: 12px; font-size: 16px; border: 1px solid var(--border-color);
    background-color: var(--bg-color); color: var(--text-color); border-radius: 8px;
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
</style>
