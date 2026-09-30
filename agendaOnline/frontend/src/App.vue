<template>
  <div class="app-shell">
    <AppHeader v-if="route.path !== '/login'" />
    <main :class="route.path === '/login' ? 'login-main' : 'app-main'">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import AppHeader from "./components/AppHeader.vue";
const route = useRoute();
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap");
:root {
  font-family: "DM Sans", sans-serif;
  color: #352519;
  background: #f7f4ee;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  min-width: 320px;
}
button,
input,
select,
textarea {
  font: inherit;
}
a {
  text-decoration: none;
}
.app-shell {
  min-height: 100vh;
  background:
    radial-gradient(circle at 80% -10%, #efe4ce 0, transparent 32%), #f7f4ee;
}
.app-main {
  max-width: 1320px;
  padding: 42px 32px 80px;
  margin: 0 auto;
}
.login-main {
  min-height: 100vh;
}
.page-kicker {
  color: #a07936;
  font-size: 0.76rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 800;
  margin-bottom: 10px;
}
.page-title {
  color: #392519;
  font-family: Manrope, sans-serif;
  font-size: clamp(1.7rem, 3vw, 2.4rem);
  letter-spacing: -0.055em;
  font-weight: 800;
  margin: 0;
}
.page-subtitle {
  color: #8c8176;
  margin: 10px 0 0;
}
.btn-primary,
.btn-salvar {
  background: #b88b36 !important;
  border-color: #b88b36 !important;
  color: #fff !important;
  box-shadow: 0 7px 18px #b88b3630;
}
.btn-primary:hover,
.btn-salvar:hover {
  background: #9d742b !important;
}
.btn {
  transition:
    transform 0.2s,
    box-shadow 0.2s,
    background 0.2s;
}
.btn:hover {
  transform: translateY(-2px);
}
:focus-visible {
  outline: 3px solid #d8ab55;
  outline-offset: 3px;
}
@media (max-width: 700px) {
  .app-main {
    padding: 28px 17px 56px;
  }
}
</style>
