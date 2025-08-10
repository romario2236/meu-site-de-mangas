<template>
  <router-link :to="mangaDetailUrl" class="manga-link">
    <li class="manga-item">
      <img :src="manga.capaUrl" :alt="'Capa do mangá ' + manga.titulo">
      <span class="manga-nome">{{ manga.titulo }}</span>
      <button class="remover-btn" @click.prevent="$emit('removerManga', manga)">×</button>
    </li>
  </router-link>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  manga: {
    type: Object,
    required: true
  }
});

defineEmits(['removerManga']);

const mangaDetailUrl = computed(() => {
  const slug = props.manga.titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `/manga/${slug}`;
});
</script>

<style scoped>
.manga-link {
  text-decoration: none;
}
.manga-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--card-bg-color);
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
    width: 200px;
    text-align: center;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    position: relative;
    cursor: pointer;
}
.manga-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.25);
}
.manga-item img {
    width: 170px;
    height: 255px;
    border-radius: 8px;
    object-fit: cover;
    margin-bottom: 12px;
}
.manga-item .manga-nome {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    padding: 0 5px;
}
.remover-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: var(--remove-color);
    color: white;
    border: none;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    z-index: 2;
}
.manga-item:hover .remover-btn {
    opacity: 1;
}
</style>
