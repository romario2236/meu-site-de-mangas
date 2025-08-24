<template>
  <router-link :to="mangaDetailUrl" class="manga-link">
    <li class="manga-item">
      <div class="chapter-overlay">
        <span class="chapter-count">
          {{ manga.capitulosLidos }} / {{ manga.capitulos === 'N/A' ? '?' : manga.capitulos }}
        </span>
        <span class="chapter-label">Lidos / Total</span>
      </div>
      <img :src="manga.capaUrl" :alt="'Capa do mangá ' + manga.titulo">
      <span class="manga-nome">{{ manga.titulo }}</span>
      <button class="remover-btn" @click.prevent="$emit('removerManga', manga)">×</button>
    </li>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Manga } from '@/types';

const props = defineProps<{
  manga: Manga
}>();

defineEmits(['removerManga']);

const mangaDetailUrl = computed(() => {
  // A lógica para criar a URL permanece a mesma
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
    position: relative; /* Essencial para o posicionamento da camada */
    cursor: pointer;
    overflow: hidden; /* Garante que a camada não passe das bordas arredondadas */
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
    z-index: 2; /* Garante que o botão de remover fique sobre a camada */
}
.manga-item:hover .remover-btn {
    opacity: 1;
}

/* INÍCIO DA ALTERAÇÃO: Estilos para a nova camada de capítulos */
.chapter-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75); /* Fundo escuro semitransparente */
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0; /* Começa invisível */
  transition: opacity 0.3s ease-in-out; /* Transição suave */
  z-index: 1; /* Para ficar acima da imagem mas abaixo do botão de remover */
  padding: 16px; /* Adiciona um respiro nas laterais */
  box-sizing: border-box;
}

.manga-item:hover .chapter-overlay {
  opacity: 1; /* Fica visível no hover */
}

.chapter-count {
  font-size: 2rem; /* Tamanho para os números */
  font-weight: 700;
  line-height: 1.2;
}

.chapter-label {
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
/* FIM DA ALTERAÇÃO */
</style>
