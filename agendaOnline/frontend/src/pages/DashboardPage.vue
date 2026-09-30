<template>
  <div class="dashboard">
    <div class="intro">
      <div>
        <p class="page-kicker">PAINEL DE CONTROLE</p>
        <h1 class="page-title">Visão geral</h1>
        <p class="page-subtitle">
          Acompanhe os atendimentos da equipe e visualize os indicadores de
          desempenho.
        </p>
      </div>
      <span class="today">◷ {{ hoje }}</span>
    </div>
    <section class="hero">
      <div>
        <span class="hero-eyebrow">AGENDA DA EQUIPE</span>
        <h2>Atendimentos da equipe.</h2>
        <p>
          Veja os compromissos cadastrados e acompanhe os atendimentos dos
          clientes.
        </p>
        <RouterLink to="/atendimentos/novo" class="hero-action"
          >＋ Agendar atendimento <span>↗</span></RouterLink
        >
      </div>
      <div class="hero-art" aria-hidden="true">
        <div class="orbit orbit-one"></div>
        <div class="orbit orbit-two"></div>
        <div class="art-card">
          <img class="art-logo" src="/ws-symbol.png" alt="" /><strong>{{
            dia
          }}</strong
          ><small>{{ mes }}</small
          ><i>● ● ●</i>
        </div>
      </div>
    </section>
    <div class="section-heading">
      <div>
        <p class="page-kicker">EM NÚMEROS</p>
        <h2>Resumo dos atendimentos</h2>
      </div>
      <RouterLink to="/atendimentos">Ver todos <span>↗</span></RouterLink>
    </div>
    <div v-if="carregando" class="state" role="status">
      Carregando indicadores...
    </div>
    <div v-else-if="erro" class="state error" role="alert">
      {{ erro }}
      <button type="button" @click="carregar">Tentar novamente</button>
    </div>
    <div v-else class="metric-grid">
      <article
        v-for="item in indicadores"
        :key="item.label"
        class="metric-card"
      >
        <div class="metric-top">
          <span class="metric-icon">{{ item.icon }}</span
          ><span class="metric-arrow">↗</span>
        </div>
        <strong>{{ item.value }}</strong
        ><span class="metric-label">{{ item.label }}</span
        ><small>{{ item.caption }}</small>
      </article>
    </div>
    <div class="bottom-strip">
      <div class="strip-icon">✦</div>
      <div>
        <strong>Precisa registrar um atendimento?</strong
        ><span>Adicione os dados do cliente e o responsável pela visita.</span>
      </div>
      <RouterLink to="/atendimentos/novo">Criar agendamento →</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { atendimentos } from "../services/api";
const dados = ref({
  total_hoje: 0,
  total_semana: 0,
  total_corretora: 0,
  total_colaboradora: 0,
});
const carregando = ref(true);
const erro = ref("");
import { useAuthStore } from "../stores/authStore";
const auth = useAuthStore();
const dataAtual = new Date();
const hoje = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(dataAtual);
const dia = new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(
  dataAtual,
);
const mes = new Intl.DateTimeFormat("pt-BR", { month: "short" })
  .format(dataAtual)
  .toUpperCase()
  .replace(".", "");
const indicadores = computed(() => [
  {
    icon: "◷",
    value: dados.value.total_hoje,
    label: "Atendimentos hoje",
    caption: "Programados para hoje",
  },
  {
    icon: "▦",
    value: dados.value.total_semana,
    label: "Esta semana",
    caption: "Na agenda desta semana",
  },
  {
    icon: "◇",
    value: dados.value.total_corretora,
    label: "Corretora",
    caption: "Atendimentos no mês",
  },
  {
    icon: "✧",
    value: dados.value.total_colaboradora,
    label: "Colaboradora",
    caption: "Atendimentos no mês",
  },
]);
async function carregar() {
  carregando.value = true;
  erro.value = "";
  try {
    dados.value = (await atendimentos.dashboard()).data;
  } catch {
    erro.value = "Não foi possível carregar os indicadores.";
  } finally {
    carregando.value = false;
  }
}
onMounted(carregar);
</script>

<style scoped>
.dashboard a,
.dashboard a:hover,
.dashboard a:focus-visible {
  text-decoration: none;
}
.intro {
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-bottom: 30px;
  gap: 20px;
}
.today {
  border: 1px solid #e9dfd0;
  background: #fffdf9;
  color: #826f5b;
  border-radius: 25px;
  padding: 10px 17px;
  text-transform: capitalize;
  font-size: 13px;
  white-space: nowrap;
}
.hero {
  min-height: 275px;
  background: #4c3020;
  border-radius: 22px;
  color: #fff;
  padding: 38px 48px;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  position: relative;
  box-shadow: 0 20px 32px #4c302020;
}
.hero > div:first-child {
  position: relative;
  z-index: 1;
  max-width: 570px;
}
.hero-eyebrow {
  color: #e7bc69;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.19em;
}
.hero h2 {
  font:
    800 clamp(2rem, 4vw, 3.1rem)/1.15 Manrope,
    sans-serif;
  letter-spacing: -0.06em;
  margin: 17px 0 11px;
}
.hero p {
  max-width: 480px;
  color: #d3c3b6;
  font-size: 14px;
  line-height: 1.7;
  margin-bottom: 23px;
}
.hero-action {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 28px;
  background: #d2a44b;
  padding: 12px 17px;
  border-radius: 9px;
  color: #402a1c;
  font-weight: 800;
  font-size: 13px;
}
.hero-action:hover {
  background: #e3b860;
}
.hero-art {
  width: 300px;
  position: relative;
  flex-shrink: 0;
}
.orbit {
  border: 1px solid #aa84534f;
  border-radius: 50%;
  position: absolute;
}
.orbit-one {
  width: 360px;
  height: 360px;
  top: -120px;
  right: -50px;
}
.orbit-two {
  width: 270px;
  height: 270px;
  top: -74px;
  right: -7px;
}
.art-card {
  position: absolute;
  top: 11px;
  right: 80px;
  width: 155px;
  height: 205px;
  border-radius: 14px;
  background: linear-gradient(140deg, #e3b766, #bf8d39);
  color: #472b19;
  transform: rotate(9deg);
  box-shadow:
    15px 15px 0 #ffffff10,
    0 15px 30px #170d083f;
  padding: 20px;
  display: flex;
  flex-direction: column;
}
.art-card span {
  font-size: 9px;
  letter-spacing: 0.15em;
  font-weight: 800;
}
.art-logo {
  width: 33px;
  height: 33px;
  object-fit: contain;
  filter: brightness(0) saturate(100%) opacity(0.8);
}
.art-card strong {
  font:
    800 75px/1 Manrope,
    sans-serif;
  margin-top: 28px;
}
.art-card small {
  font-size: 20px;
  font-weight: 800;
}
.art-card i {
  margin-top: auto;
  letter-spacing: 0.3em;
  font-size: 8px;
}
.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  margin: 40px 0 19px;
}
.section-heading h2 {
  font:
    800 21px Manrope,
    sans-serif;
  letter-spacing: -0.04em;
  margin: 0;
}
.section-heading a {
  text-decoration: none;
  color: #9d742b;
  font-weight: 800;
  font-size: 13px;
}
.metric-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.metric-card {
  display: flex;
  flex-direction: column;
  min-height: 194px;
  background: #fffefa;
  padding: 21px;
  border: 1px solid #eee7de;
  border-radius: 16px;
  box-shadow: 0 10px 28px #47301b08;
  transition: transform 0.2s;
}
.metric-card:hover {
  transform: translateY(-4px);
}
.metric-top {
  display: flex;
  justify-content: space-between;
}
.metric-icon {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #f7ebd3;
  color: #a3762d;
  font-size: 22px;
}
.metric-arrow {
  color: #c6b8a5;
}
.metric-card strong {
  font:
    800 38px Manrope,
    sans-serif;
  color: #432b1d;
  margin-top: 18px;
  line-height: 1.2;
}
.metric-label {
  font-weight: 800;
  font-size: 13px;
  margin-top: 3px;
}
.metric-card small {
  color: #a69b8f;
  margin-top: 4px;
}
.bottom-strip {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 25px;
  padding: 19px 22px;
  background: #eee7db;
  border-radius: 14px;
}
.strip-icon {
  width: 42px;
  height: 42px;
  background: #fff9ed;
  color: #ad8137;
  border-radius: 11px;
  display: grid;
  place-items: center;
  font-size: 22px;
}
.bottom-strip div:nth-child(2) {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.bottom-strip strong {
  font-size: 13px;
}
.bottom-strip span {
  font-size: 12px;
  color: #887b6d;
}
.bottom-strip a {
  text-decoration: none;
  color: #815b24;
  font-weight: 800;
  font-size: 12px;
}
.state {
  padding: 35px;
  background: #fffefa;
  border-radius: 14px;
  text-align: center;
}
.error {
  color: #a54335;
}
.error button {
  display: block;
  margin: 10px auto 0;
  border: 0;
  background: none;
  color: #a54335;
  text-decoration: underline;
}
@media (max-width: 850px) {
  .metric-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .hero-art {
    display: none;
  }
}
@media (max-width: 550px) {
  .intro {
    align-items: start;
    flex-direction: column;
  }
  .hero {
    padding: 30px 25px;
  }
  .metric-grid {
    gap: 10px;
  }
  .metric-card {
    padding: 16px;
  }
  .bottom-strip {
    flex-wrap: wrap;
  }
  .bottom-strip a {
    margin-left: 57px;
  }
}
</style>
