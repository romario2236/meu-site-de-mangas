<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-btn" @click="$emit('close')">×</button>
      <h2>Resultados da Busca</h2>
      <p>Encontramos múltiplos resultados. Por favor, escolha qual você deseja usar:</p>
      <ul class="results-list">
        <li v-for="manga in results" :key="manga.titulo" class="result-item">
          <img :src="manga.capaUrl" alt="Capa" class="result-cover">
          <div class="result-info">
            <span class="result-title">{{ manga.titulo }}</span>
            <span class="result-type">Tipo: {{ manga.tipo }}</span>
          </div>
          <button class="add-result-btn" @click="$emit('mangaSelected', manga)">
            {{ actionText }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  results: {
    type: Array,
    required: true
  },
  // NOVA PROP PARA O TEXTO DO BOTÃO
  actionText: {
    type: String,
    default: 'Adicionar'
  }
});

defineEmits(['close', 'mangaSelected']);
</script>

<style scoped>
.modal-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex; justify-content: center; align-items: center; z-index: 1000;
}
.modal-content {
    background-color: var(--card-bg-color); color: var(--text-color);
    padding: 30px; border-radius: 12px; width: 90%; max-width: 600px;
    max-height: 80vh; overflow-y: auto; position: relative;
}
.close-btn {
    position: absolute; top: 15px; right: 15px; background: none; border: none;
    font-size: 28px; color: var(--subtle-text-color); cursor: pointer;
}
.results-list {
    list-style: none; padding: 0; margin-top: 20px;
}
.result-item {
    display: flex; align-items: center; gap: 15px;
    padding: 10px; border-bottom: 1px solid var(--border-color);
}
.result-item:last-child {
    border-bottom: none;
}
.result-cover {
    width: 50px; height: 75px; object-fit: cover;
    border-radius: 4px; flex-shrink: 0;
}
.result-info {
    display: flex; flex-direction: column; gap: 5px; flex-grow: 1;
}
.result-title {
    font-weight: 600;
}
.result-type {
    font-size: 0.9rem; color: var(--subtle-text-color);
}
.add-result-btn {
    padding: 8px 16px; font-size: 14px; flex-shrink: 0;
}
</style>
