<template>
  <div class="login-page">
    <section class="login-story" aria-label="WS Assessoria Comercial">
      <img
        class="story-logo"
        src="/ws-logo.png"
        alt="WS Assessoria Comercial"
      />
      <div class="story-content">
        <span class="story-label">WS ASSESSORIA COMERCIAL</span>
        <h1>Agenda de<br /><em>atendimentos.</em></h1>
        <p>
          Consulte os horários, acompanhe os atendimentos e mantenha os dados
          dos clientes organizados.
        </p>
      </div>
      <div class="story-orbit one"></div>
      <div class="story-orbit two"></div>
    </section>
    <main class="login-panel">
      <div class="login-box">
        <img
          class="mobile-logo"
          src="/ws-logo.png"
          alt="WS Assessoria Comercial"
        />
        <h2>Entrar na agenda</h2>
        <p class="login-hint">Use seu e-mail e senha para continuar.</p>
        <form @submit.prevent="entrar">
          <label for="email">E-mail</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="seuemail@exemplo.com"
            autocomplete="email"
            required
          />
          <label for="password">Senha</label>
          <input
            id="password"
            v-model="senha"
            type="password"
            placeholder="Digite sua senha"
            autocomplete="current-password"
            required
          />
          <p v-if="erro" class="login-error" role="alert">{{ erro }}</p>
          <button type="submit" :disabled="enviando">
            {{ enviando ? "Entrando..." : "Entrar" }} <span>→</span>
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";
const router = useRouter();
const auth = useAuthStore();
const email = ref("");
const senha = ref("");
const erro = ref("");
const enviando = ref(false);
async function entrar() {
  erro.value = "";
  enviando.value = true;
  try {
    await auth.login(email.value, senha.value);
    router.push("/");
  } catch (err) {
    erro.value = err.message || "Não foi possível entrar. Tente novamente.";
  } finally {
    enviando.value = false;
  }
}
</script>

<style scoped>
.login-page {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
  background: #faf7f1;
}
.login-story {
  display: grid;
  place-items: center;
  position: relative;
  min-height: 100vh;
  padding: 45px clamp(40px, 6vw, 100px);
  overflow: hidden;
  background: #442b1e;
  color: #fff;
}
.story-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  width: 100%;
  text-align: center;
}
.story-logo {
  position: absolute;
  z-index: 1;
  top: 28px;
  left: clamp(28px, 4vw, 64px);
  display: block;
  width: 165px;
  height: auto;
}
.login-story h1 {
  font:
    800 clamp(2.8rem, 5.2vw, 5rem)/1.13 Manrope,
    sans-serif;
  letter-spacing: -0.07em;
  margin: 0;
}
.login-story h1 em {
  color: #e2b65e;
  font-style: normal;
}
.story-content p {
  max-width: 340px;
  margin: 0;
  color: #d6c8bd;
  font-size: 15px;
  line-height: 1.6;
}
.story-label {
  color: #d9aa55;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
}
.story-orbit {
  position: absolute;
  border: 1px solid #9a75483b;
  border-radius: 50%;
}
.story-orbit.one {
  width: 550px;
  height: 550px;
  right: -340px;
  top: 15%;
}
.story-orbit.two {
  width: 390px;
  height: 390px;
  right: -245px;
  top: 26%;
}
.login-panel {
  display: grid;
  place-items: center;
  padding: 40px;
}
.login-box {
  width: min(100%, 410px);
}
.mobile-logo {
  display: none;
}
.login-box h2 {
  color: #3e291c;
  font:
    800 38px Manrope,
    sans-serif;
  letter-spacing: -0.06em;
  margin: 0 0 10px;
}
.login-hint {
  margin: 0 0 30px;
  color: #8e8175;
  font-size: 14px;
}
form {
  display: flex;
  flex-direction: column;
}
label {
  color: #493628;
  font-size: 13px;
  font-weight: 800;
  margin-bottom: 9px;
}
input {
  width: 100%;
  padding: 14px 15px;
  margin-bottom: 20px;
  background: #fff;
  border: 1px solid #e2d8cb;
  border-radius: 10px;
  outline: none;
}
input:focus {
  border-color: #be8f3d;
  box-shadow: 0 0 0 4px #c99d4930;
}
button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 11px;
  padding: 15px 17px;
  border: 0;
  border-radius: 10px;
  background: #b78a39;
  color: #fff;
  font-weight: 800;
  box-shadow: 0 10px 20px #b78a3928;
}
button:hover {
  background: #9f752b;
}
button:disabled {
  opacity: 0.6;
  cursor: wait;
}
.login-error {
  margin: 0 0 12px;
  padding: 11px;
  border-radius: 8px;
  background: #fff0ed;
  color: #ad3e2f;
  font-size: 13px;
}
@media (max-width: 800px) {
  .login-page {
    grid-template-columns: 1fr;
  }
  .login-story {
    display: none;
  }
  .login-panel {
    min-height: 100vh;
    padding: 30px;
  }
  .mobile-logo {
    display: block;
    width: 200px;
    height: 110px;
    object-fit: contain;
    padding: 12px;
    margin-bottom: 35px;
    border-radius: 12px;
    background: #442b1e;
  }
  .login-box h2 {
    font-size: 31px;
  }
}
</style>
