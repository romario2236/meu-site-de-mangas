<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal-content">
      <h3>{{ title }}</h3>
      <p v-html="message"></p>
      <div class="modal-actions">
        <button class="cancel-btn" @click="$emit('cancel')">{{ cancelText }}</button>
        <button class="confirm-btn" @click="$emit('confirm')">{{ confirmText }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, default: 'Você tem certeza?' },
  message: { type: String, required: true },
  confirmText: { type: String, default: 'Confirmar' },
  cancelText: { type: String, default: 'Cancelar' },
});

defineEmits(['confirm', 'cancel']);
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
    text-align: center;
}
.modal-content h3 {
    margin-top: 0;
    font-size: 1.5rem;
}
.modal-content p {
    margin: 20px 0;
    line-height: 1.6;
    color: var(--subtle-text-color);
}
.modal-actions {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 30px;
}
.modal-actions button {
    padding: 10px 25px;
    width: 120px;
}
.confirm-btn {
    background-color: var(--primary-color);
}
.cancel-btn {
    background-color: var(--remove-color);
}
</style>
