<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-btn" @click="$emit('close')">×</button>
      <h3 v-if="mangaToMove">
        Mover/Copiar <span class="manga-title">"{{ mangaToMove.titulo }}"</span>
      </h3>

      <div class="form-group" v-if="availableLists.length > 0">
        <label for="destination-list">Selecione a lista de destino:</label>
        <select id="destination-list" v-model="destinationList">
          <option disabled value="">Escolha uma lista...</option>
          <option v-for="listName in availableLists" :key="listName" :value="listName">
            {{ listName }}
          </option>
        </select>
      </div>
      <div v-else class="no-lists-message">
        Não há outras listas para mover ou copiar. Crie uma nova lista primeiro.
      </div>

      <div class="modal-actions">
        <button class="cancel-btn" @click="$emit('close')">Cancelar</button>
        <button
          class="action-btn copy-btn"
          @click="handleCopy"
          :disabled="!destinationList"
        >
          Copiar
        </button>
        <button
          class="action-btn move-btn"
          @click="handleMove"
          :disabled="!destinationList"
        >
          Mover
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Manga } from '@/types';

const props = defineProps<{
  mangaToMove: Manga | null;
  allListNames: string[];
  currentListName: string;
}>();

const emit = defineEmits(['close', 'copy', 'move']);

const destinationList = ref('');

const availableLists = computed(() => {
  return props.allListNames.filter(name => name !== props.currentListName);
});

const handleCopy = () => {
  if (destinationList.value) {
    emit('copy', destinationList.value);
  }
};

const handleMove = () => {
  if (destinationList.value) {
    emit('move', destinationList.value);
  }
};
</script>

<style scoped>
.modal-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex; justify-content: center; align-items: center; z-index: 1001;
}
.modal-content {
    background-color: var(--card-bg-color); color: var(--text-color);
    padding: 30px; border-radius: 12px; width: 90%; max-width: 450px;
    text-align: center; position: relative;
}
.close-btn {
    position: absolute; top: 15px; right: 15px; background: none; border: none;
    font-size: 28px; color: var(--subtle-text-color); cursor: pointer;
}
.modal-content h3 {
    margin-top: 0;
    font-size: 1.5rem;
    line-height: 1.4;
}
.manga-title {
    color: var(--primary-color);
    font-style: italic;
}
.form-group {
    margin: 25px 0;
    text-align: left;
}
.form-group label {
    display: block;
    margin-bottom: 10px;
    font-weight: 600;
}
select {
    width: 100%;
}
.no-lists-message {
    margin: 25px 0;
    padding: 15px;
    background-color: var(--bg-color);
    color: var(--subtle-text-color);
    border-radius: 8px;
}
.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 30px;
}
.modal-actions button {
    padding: 10px 20px;
    width: 110px;
}
.action-btn:disabled {
    background-color: var(--border-color);
    cursor: not-allowed;
    opacity: 0.7;
}
.copy-btn {
    background-color: var(--primary-color);
}
.move-btn {
    background-color: var(--save-color);
}
.cancel-btn {
    margin-right: auto;
    background-color: var(--remove-color);
}
</style>
