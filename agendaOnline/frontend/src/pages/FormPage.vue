<template>
  <div class="form-wrap">
    <RouterLink to="/atendimentos" class="back-link"
      >← Voltar para atendimentos</RouterLink
    >

    <h1 class="page-title">
      {{ editando ? "Editar atendimento" : "Novo atendimento" }}
    </h1>

    <form class="form" @submit.prevent="salvar">
      <div class="campo">
        <label>Nome do cliente *</label>

        <input v-model="form.nome_cliente" type="text" required />
      </div>

      <div class="campo">
        <label>Telefone *</label>

        <input
          :value="form.telefone"
          type="tel"
          inputmode="numeric"
          autocomplete="tel"
          maxlength="15"
          placeholder="(85) 99999-9999"
          @input="formatarTelefone"
          @blur="validarTelefone"
          required
        />
        <small v-if="erroTelefone" class="erro-data" role="alert">{{
          erroTelefone
        }}</small>
      </div>

      <div class="campo">
        <label>Endereço da visita *</label>

        <input v-model="form.endereco_visita" type="text" required />
      </div>

      <div class="linha">
        <div class="campo">
          <label>Data *</label>

          <input
            v-model="form.data"
            type="date"
            :min="editando ? undefined : dataMinima"
            max="9999-12-31"
            @focus="dataMinima = dataHoje()"
            @change="validarData"
            @invalid="mostrarErroData"
            required
          />
          <small v-if="erroData" class="erro-data" role="alert">{{
            erroData
          }}</small>
        </div>

        <div class="campo">
          <label>Horário *</label>

          <input v-model="form.horario" type="time" required />
        </div>
      </div>

      <div class="campo">
        <label>Responsável *</label>

        <select v-model="form.responsavel_id" required>
          <option value="">Selecione...</option>

          <option v-for="r in responsaveisList" :key="r.id" :value="r.id">
            {{ r.nome }}
          </option>
        </select>
        <small v-if="carregandoResponsaveis" class="aviso-responsaveis"
          >Carregando responsáveis...</small
        >
        <div
          v-else-if="erroResponsaveis"
          class="aviso-responsaveis"
          role="alert"
        >
          {{ erroResponsaveis }}
          <button type="button" @click="carregarResponsaveis">
            Tentar novamente
          </button>
        </div>
        <small
          v-else-if="responsaveisList.length === 0"
          class="aviso-responsaveis"
        >
          Nenhum responsável cadastrado.
        </small>
      </div>

      <div class="campo">
        <label>Status</label>

        <select v-model="form.status">
          <option>Agendado</option>
          <option>Concluído</option>
          <option>Cancelado</option>
        </select>
      </div>

      <div class="campo">
        <label>Observações</label>

        <textarea v-model="form.observacoes" rows="4"></textarea>
      </div>

      <div class="form-acoes">
        <RouterLink to="/atendimentos" class="btn btn-cancelar">
          Cancelar
        </RouterLink>

        <button type="submit" class="btn btn-salvar">
          {{ editando ? "Salvar alterações" : "Cadastrar" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { atendimentos, responsaveis } from "../services/api";

const route = useRoute();
const router = useRouter();

const editando = computed(() => !!route.params.id);

const form = ref({
  nome_cliente: "",
  telefone: "",
  endereco_visita: "",
  data: "",
  horario: "",
  responsavel_id: "",
  observacoes: "",
  status: "Agendado",
});

const responsaveisList = ref([]);
const carregandoResponsaveis = ref(false);
const erroResponsaveis = ref("");
const erroData = ref("");
const erroTelefone = ref("");
const dataMinima = ref(dataHoje());

function mascaraTelefone(valor) {
  const numeros = valor.replace(/\D/g, "").slice(0, 11);
  if (!numeros) return "";
  if (numeros.length <= 2) return `(${numeros}`;
  const ddd = numeros.slice(0, 2);
  const local = numeros.slice(2);
  const tamanhoGrupo = numeros.length === 11 ? 5 : 4;
  const grupo = local.slice(0, tamanhoGrupo);
  const final = local.slice(tamanhoGrupo);
  return `(${ddd}) ${grupo}${final ? `-${final}` : ""}`;
}

function formatarTelefone(event) {
  form.value.telefone = mascaraTelefone(event.target.value);
  event.target.value = form.value.telefone;
  erroTelefone.value = "";
}

function validarTelefone() {
  const numeros = form.value.telefone.replace(/\D/g, "");
  erroTelefone.value = /^[1-9]{2}\d{8,9}$/.test(numeros)
    ? ""
    : "Informe um telefone com DDD e 10 ou 11 dígitos.";
  return !erroTelefone.value;
}

function validarData(event) {
  const valor = event.target.value;
  if (
    (valor && !/^\d{4}-\d{2}-\d{2}$/.test(valor)) ||
    event.target.validity.badInput ||
    event.target.validity.rangeOverflow
  ) {
    form.value.data = "";
    event.target.value = "";
    erroData.value = "O ano deve ter quatro dígitos.";
    return;
  }
  erroData.value =
    !editando.value && valor && valor < dataHoje()
      ? "Não é possível agendar para uma data anterior a hoje."
      : "";
}

function mostrarErroData(event) {
  if (
    !editando.value &&
    event.target.value < dataHoje() &&
    event.target.value
  ) {
    erroData.value = "Não é possível agendar para uma data anterior a hoje.";
    event.preventDefault();
  }
}

function dataHoje() {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Fortaleza",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

async function carregarResponsaveis() {
  carregandoResponsaveis.value = true;
  erroResponsaveis.value = "";
  try {
    const res = await responsaveis.listar();
    responsaveisList.value = res.data;
  } catch {
    erroResponsaveis.value = "Não foi possível carregar os responsáveis.";
  } finally {
    carregandoResponsaveis.value = false;
  }
}

onMounted(async () => {
  await carregarResponsaveis();

  if (editando.value) {
    const r = await atendimentos.buscar(route.params.id);

    const a = r.data;

    form.value = {
      nome_cliente: a.nome_cliente,
      telefone: mascaraTelefone(a.telefone || ""),
      endereco_visita: a.endereco_visita,
      data: a.data,
      horario: a.horario.slice(0, 5),
      responsavel_id: a.responsavel_id,
      observacoes: a.observacoes || "",
      status: a.status,
    };
  }
});

async function salvar() {
  if (!validarTelefone()) return;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(form.value.data)) {
    erroData.value = "O ano deve ter quatro dígitos.";
    return;
  }

  if (!editando.value && form.value.data < dataHoje()) {
    erroData.value = "Não é possível agendar para uma data anterior a hoje.";
    return;
  }

  erroData.value = "";

  if (editando.value) {
    await atendimentos.atualizar(route.params.id, form.value);
  } else {
    await atendimentos.criar(form.value);
  }

  router.push("/atendimentos");
}
</script>

<style scoped>
.form-wrap {
  max-width: 860px;
  margin: auto;
}
.back-link {
  color: #9b7434;
  font-size: 13px;
  font-weight: 800;
}
.form-kicker {
  color: #a07936;
  font-size: 11px;
  letter-spacing: 0.16em;
  font-weight: 800;
  margin: 22px 0 8px;
}
.page-title {
  color: #392519;
  font:
    800 clamp(1.8rem, 3vw, 2.3rem) Manrope,
    sans-serif;
  letter-spacing: -0.055em;
  margin: 0 0 26px;
}
.form {
  background: #fffefa;
  border: 1px solid #eee6db;
  border-radius: 17px;
  padding: clamp(23px, 4vw, 42px);
  box-shadow: 0 15px 35px #422b1509;
}
.campo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}
.erro-data {
  color: #a54335;
  font-size: 12px;
}
.aviso-responsaveis {
  color: #8d6a36;
  font-size: 12px;
}
.aviso-responsaveis button {
  border: 0;
  background: none;
  color: #805820;
  font-weight: 800;
  text-decoration: underline;
  cursor: pointer;
}
.linha {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}
label {
  color: #514032;
  font-size: 12px;
  font-weight: 800;
}
input,
select,
textarea {
  width: 100%;
  background: #fff;
  border: 1px solid #e5ddd2;
  border-radius: 9px;
  padding: 12px 13px;
  color: #443124;
  outline: none;
}
input:focus,
select:focus,
textarea:focus {
  border-color: #ba8d3c;
  box-shadow: 0 0 0 4px #ba8d3c25;
}
.form-acoes {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #f0e9df;
  margin-top: 30px;
  padding-top: 25px;
}
.form-acoes .btn {
  border: 0;
  border-radius: 9px;
  padding: 12px 18px;
  font-size: 13px;
  font-weight: 800;
}
.btn-salvar {
  background: #b88b36;
  color: #fff;
}
.btn-salvar:hover {
  background: #9d742b;
}
.btn-cancelar {
  background: #f4f0ea;
  color: #6e5f50;
}
@media (max-width: 600px) {
  .linha {
    grid-template-columns: 1fr;
  }
  .form-acoes {
    flex-direction: column;
  }
  .form-acoes .btn {
    text-align: center;
  }
}
</style>
