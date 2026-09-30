<template>
  <header class="site-header">
    <nav class="nav-inner" aria-label="Navegação principal">
      <RouterLink to="/" class="brand" aria-label="WS — início">
        <img class="brand-mark" src="/ws-symbol.png" alt="Logo WS" />
      </RouterLink>
      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="menuOpen"
        aria-controls="nav-links"
        @click="menuOpen = !menuOpen"
      >
        ☰ <span class="sr-only">Abrir menu</span>
      </button>
      <div
        id="nav-links"
        class="nav-links"
        :class="{ open: menuOpen }"
        @click="menuOpen = false"
      >
        <RouterLink to="/" exact-active-class="active">Visão geral</RouterLink>
        <RouterLink to="/atendimentos" active-class="active"
          >Atendimentos</RouterLink
        >
        <RouterLink to="/atendimentos/novo" class="new-link"
          >＋ Novo atendimento</RouterLink
        >
      </div>
      <div class="account">
        <span class="avatar">{{ initials }}</span
        ><span class="account-email" :title="auth.user?.email">{{
          auth.user?.email
        }}</span
        ><button class="logout" type="button" @click="sair">Sair</button>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";
const router = useRouter();
const auth = useAuthStore();
const menuOpen = ref(false);
const initials = computed(() => (auth.user?.email?.[0] || "W").toUpperCase());
async function sair() {
  await auth.logout();
  router.push("/login");
}
</script>

<style scoped>
.site-header {
  background: #42291b;
  color: #fff;
  box-shadow: 0 8px 25px #39251918;
}
.nav-inner {
  max-width: 1320px;
  min-height: 84px;
  margin: auto;
  display: flex;
  align-items: center;
  gap: 42px;
  padding: 0 32px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  color: #fff;
}
.brand,
.brand:hover,
.brand:focus-visible,
.nav-links a,
.nav-links a:hover,
.nav-links a:focus-visible {
  text-decoration: none;
}
.brand-mark {
  display: block;
  width: 52px;
  height: 52px;
  object-fit: contain;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 7px;
  flex: 1;
}
.nav-links a {
  color: #d8cbc0;
  padding: 10px 15px;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}
.nav-links a:hover,
.nav-links a.active {
  background: #ffffff14;
  color: #fff;
}
.nav-links .new-link {
  color: #eac26d;
}
.account {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.avatar {
  background: #c59a49;
  color: #3d291a;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 800;
}
.account-email {
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  color: #d6c7b7;
}
.logout {
  border: 1px solid #816951;
  background: transparent;
  color: #f4e7d5;
  border-radius: 8px;
  padding: 7px 12px;
}
.logout:hover {
  background: #ffffff18;
}
.menu-toggle {
  display: none;
  border: 0;
  background: transparent;
  color: #fff;
  font-size: 24px;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}
@media (max-width: 900px) {
  .nav-inner {
    flex-wrap: wrap;
    gap: 10px;
    padding: 16px;
  }
  .menu-toggle {
    display: block;
    margin-left: auto;
  }
  .nav-links {
    display: none;
    order: 3;
    width: 100%;
    flex: 0 0 100%;
    flex-direction: column;
    align-items: stretch;
  }
  .nav-links.open {
    display: flex;
  }
  .account {
    margin-left: auto;
  }
  .account-email {
    display: none;
  }
}
</style>
