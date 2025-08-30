<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-btn" @click="$emit('close')">×</button>
      <h3>Gerir Lista "{{ listName }}"</h3>

      <div class="action-section">
        <label for="rename-input">Renomear lista:</label>
        <div class="input-group">
          <input
            id="rename-input"
            type="text"
            v-model="newListName"
            placeholder="Novo nome da lista"
          />
          <button class="rename-btn" @click="handleRename" :disabled="!newListName || newListName === listName">
            Renomear
          </button>
        </div>
      </div>

      <div class="action-section delete-section">
        <label>Deletar lista:</label>
        <p class="warning-text">
          Atenção: Esta ação não pode ser desfeita. Todos os mangás nesta lista serão perdidos.
        </p>
        <button class="delete-btn" @click="handleDelete">
          Deletar Lista "{{ listName }}"
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  listName: string;
}>();

const emit = defineEmits(['close', 'rename', 'delete']);

const newListName = ref(props.listName);

const handleRename = () => {
  const trimmedName = newListName.value.trim();
  if (trimmedName && trimmedName !== props.listName) {
    emit('rename', trimmedName);
  }
};

const handleDelete = () => {
  // A confirmação será feita na HomeView, aqui apenas emitimos o evento
  emit('delete');
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
    padding: 30px; border-radius: 12px; width: 90%; max-width: 500px;
    text-align: left; position: relative;
}
.close-btn {
    position: absolute; top: 15px; right: 15px; background: none; border: none;
    font-size: 28px; color: var(--subtle-text-color); cursor: pointer;
}
.modal-content h3 {
    margin-top: 0; margin-bottom: 30px;
    font-size: 1.5rem; text-align: center;
}
.action-section {
    margin-bottom: 25px;
    padding-bottom: 25px;
    border-bottom: 1px solid var(--border-color);
}
.action-section:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
}
label {
    display: block;
    margin-bottom: 10px;
    font-weight: 600;
    color: var(--subtle-text-color);
}
.input-group {
    display: flex;
    gap: 10px;
}
.input-group input {
    flex-grow: 1;
}
.rename-btn {
    background-color: var(--primary-color);
}
.rename-btn:disabled {
    background-color: var(--border-color);
    cursor: not-allowed;
    opacity: 0.7;
}
.delete-section {
    text-align: center;
}
.warning-text {
    font-size: 0.9rem;
    color: var(--subtle-text-color);
    margin-bottom: 20px;
}
.delete-btn {
    width: 100%;
    background-color: var(--remove-color);
    padding: 12px;
    font-size: 1rem;
}
</style>
