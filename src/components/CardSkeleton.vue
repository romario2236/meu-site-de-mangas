<template>
  <li class="skeleton-item">
    <div class="skeleton-image"></div>
    <div class="skeleton-text"></div>
  </li>
</template>

<style scoped>
@keyframes pulse-bg {
  0% { background-color: #2a2a2a; }
  50% { background-color: #3a3a3a; }
  100% { background-color: #2a2a2a; }
}

.skeleton-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--card-bg-color);
  padding: 16px;
  border-radius: 12px;
  width: 200px;
  height: 311px; /* Altura aproximada do card normal */
  box-sizing: border-box;
}

.skeleton-image {
  width: 170px;
  height: 255px;
  border-radius: 8px;
  margin-bottom: 12px;
  animation: pulse-bg 1.5s infinite ease-in-out;
}

.skeleton-text {
  width: 80%;
  height: 16px;
  border-radius: 4px;
  animation: pulse-bg 1.5s infinite ease-in-out;
}
</style>
