<template>
  <div class="login-wrapper">
    <div class="login-box">
      <h1>Bem-vindo!</h1>
      <p>Acesse sua conta para continuar</p>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" placeholder="seu@email.com">
      </div>
      <div class="form-group">
        <label for="password">Senha</label>
        <input type="password" id="password" v-model="password" placeholder="••••••••">
      </div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div class="actions">
        <button @click="handleLogin" class="btn-primary">Entrar</button>
        <button @click="handleRegister" class="btn-secondary">Registrar</button>
      </div>
      <div class="divider">ou</div>
      <button @click="handleGoogleLogin" class="btn-google">
        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google logo" />
        Entrar com Google
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { registrarComEmail, loginComEmail, loginComGoogle } from '@/firebase/authService';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    await loginComEmail(email.value, password.value);
    errorMessage.value = '';
    router.push('/'); // Redireciona para a home após o login
  } catch (error) {
    errorMessage.value = 'Email ou senha inválidos.';
    console.error("Erro de login:", error);
  }
};

const handleRegister = async () => {
  try {
    await registrarComEmail(email.value, password.value);
    errorMessage.value = '';
    router.push('/'); // Redireciona para a home após o registro
  } catch (error) {
    errorMessage.value = 'Erro ao registrar. A senha precisa ter no mínimo 6 caracteres.';
    console.error("Erro de registro:", error);
  }
};

const handleGoogleLogin = async () => {
  try {
    await loginComGoogle();
    errorMessage.value = '';
    router.push('/'); // Redireciona para a home após o login com Google
  } catch (error) {
    errorMessage.value = 'Erro ao fazer login com Google.';
    console.error("Erro de login com Google:", error);
  }
};
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--bg-color);
}
.login-box {
  background-color: var(--card-bg-color);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
}
h1 {
  color: var(--primary-color);
  margin-bottom: 10px;
}
p {
  color: var(--subtle-text-color);
  margin-bottom: 30px;
}
.form-group {
  text-align: left;
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}
input { width: 100%; }
.error-message {
  color: var(--remove-color);
  margin-bottom: 20px;
  font-weight: 600;
}
.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}
button {
  width: 100%;
}
.btn-primary { background-color: var(--primary-color); }
.btn-secondary { background-color: var(--border-color); }
.divider {
  margin: 25px 0;
  color: var(--subtle-text-color);
  font-weight: 600;
}
.btn-google {
  background-color: #fff;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.btn-google:hover {
  background-color: #f1f1f1;
}
.btn-google img {
  width: 20px;
  height: 20px;
}
</style>
