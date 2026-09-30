<template>
  <div class="appointments">
    <div class="top">
      <div>
        <p class="page-kicker">AGENDA DA WS</p>
        <h1 class="page-title">Atendimentos</h1>
        <p class="page-subtitle">
          Visualize e gerencie todos os seus compromissos.
        </p>
      </div>
      <RouterLink to="/atendimentos/novo" class="btn btn-primary"
        >＋ Novo atendimento</RouterLink
      >
    </div>
    <div class="toolbar">
      <div class="search">
        <span>⌕</span
        ><input
          v-model="busca"
          type="search"
          placeholder="Buscar por cliente ou responsável..."
          aria-label="Buscar atendimentos"
        />
      </div>
      <select v-model="filtro" aria-label="Filtrar por status">
        <option value="">Todos os status</option>
        <option>Agendado</option>
        <option>Concluído</option>
        <option>Cancelado</option></select
      ><span class="count"
        >{{ filtrados.length }}
        {{ filtrados.length === 1 ? "atendimento" : "atendimentos" }}</span
      >
    </div>
    <div v-if="carregando" class="feedback" role="status">
      Carregando atendimentos...
    </div>
    <div v-else-if="erro" class="feedback error" role="alert">
      {{ erro }} <button @click="carregar">Tentar novamente</button>
    </div>
    <div v-else-if="filtrados.length === 0" class="feedback">
      <span class="empty-icon">▦</span
      ><strong>Nenhum atendimento encontrado</strong>
      <p>
        {{
          lista.length
            ? "Tente mudar os filtros de busca."
            : "Comece cadastrando o primeiro atendimento."
        }}
      </p>
      <RouterLink v-if="!lista.length" to="/atendimentos/novo"
        >Cadastrar atendimento →</RouterLink
      >
    </div>
    <div v-else class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>CLIENTE</th>
            <th>DATA E HORÁRIO</th>
            <th>RESPONSÁVEL</th>
            <th>STATUS</th>
            <th><span class="sr-only">Ações</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in filtrados" :key="a.id">
            <td>
              <strong>{{ a.nome_cliente }}</strong
              ><small>{{ a.telefone }}</small>
            </td>
            <td>
              <strong>{{ formatarData(a.data) }}</strong
              ><small>{{ a.horario?.slice(0, 5) }}</small>
            </td>
            <td>{{ a.responsaveis?.nome || "—" }}</td>
            <td><StatusBadge :status="a.status" /></td>
            <td class="actions">
              <RouterLink :to="`/atendimentos/${a.id}`">Editar</RouterLink
              ><button @click="excluir(a.id)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { atendimentos } from "../services/api";
import StatusBadge from "../components/StatusBadge.vue";
const lista = ref([]),
  carregando = ref(true),
  erro = ref(""),
  busca = ref(""),
  filtro = ref("");
const filtrados = computed(() =>
  lista.value.filter(
    (a) =>
      (!filtro.value || a.status === filtro.value) &&
      `${a.nome_cliente} ${a.responsaveis?.nome || ""}`
        .toLocaleLowerCase("pt-BR")
        .includes(busca.value.toLocaleLowerCase("pt-BR")),
  ),
);
async function carregar() {
  carregando.value = true;
  erro.value = "";
  try {
    lista.value = (await atendimentos.listar()).data;
  } catch {
    erro.value = "Não foi possível carregar os atendimentos.";
  } finally {
    carregando.value = false;
  }
}
function formatarData(data) {
  if (!data) return "";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}
async function excluir(id) {
  if (!confirm("Deseja excluir este atendimento?")) return;
  try {
    await atendimentos.remover(id);
    lista.value = lista.value.filter((a) => a.id !== id);
  } catch {
    erro.value = "Não foi possível excluir o atendimento.";
  }
}
onMounted(carregar);
</script>

<style scoped>
.top {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 32px;
}
.top .btn {
  padding: 12px 18px;
  font-weight: 800;
  font-size: 13px;
  border-radius: 9px;
  white-space: nowrap;
}
.toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 18px;
}
.search {
  display: flex;
  align-items: center;
  flex: 1;
  background: #fffefa;
  border: 1px solid #e9e0d6;
  border-radius: 10px;
  padding: 0 14px;
}
.search span {
  color: #a58554;
  font-size: 25px;
  line-height: 1;
}
.search input {
  border: 0;
  outline: 0;
  width: 100%;
  padding: 12px;
  background: transparent;
  font-size: 13px;
}
.toolbar select {
  background: #fffefa;
  border: 1px solid #e9e0d6;
  border-radius: 10px;
  padding: 12px;
  color: #5a4737;
  font-size: 13px;
}
.count {
  color: #94887b;
  font-size: 12px;
  white-space: nowrap;
}
.table-wrap {
  background: #fffefa;
  border: 1px solid #eee7de;
  border-radius: 15px;
  overflow-x: auto;
  box-shadow: 0 10px 30px #422b1508;
}
table {
  width: 100%;
  min-width: 700px;
  border-collapse: collapse;
}
th {
  padding: 17px 20px;
  background: #f5f0e8;
  color: #8f7f6d;
  font-size: 10px;
  letter-spacing: 0.11em;
  font-weight: 800;
}
td {
  padding: 20px;
  border-top: 1px solid #f0eae2;
  color: #5d5044;
  font-size: 13px;
}
tbody tr:hover {
  background: #fdfaf5;
}
td strong,
td small {
  display: block;
}
td strong {
  color: #433023;
  font-weight: 800;
}
td small {
  color: #9d9185;
  margin-top: 3px;
}
.actions {
  white-space: nowrap;
  text-align: right;
}
.actions a,
.actions button {
  border: 0;
  background: transparent;
  color: #a77b33;
  font-size: 12px;
  font-weight: 800;
  padding: 7px;
}
.actions button {
  color: #b65243;
}
.feedback {
  min-height: 260px;
  background: #fffefa;
  border: 1px solid #eee7de;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #817466;
}
.feedback strong {
  color: #442d1d;
  font-size: 18px;
}
.feedback p {
  margin-top: 6px;
}
.feedback a,
.feedback button {
  color: #a77b33;
  border: 0;
  background: transparent;
  font-weight: 800;
}
.feedback.error {
  color: #ad3e2f;
}
.empty-icon {
  display: grid;
  place-items: center;
  width: 60px;
  height: 60px;
  background: #f7ebd3;
  border-radius: 16px;
  font-size: 30px;
  color: #ac7e33;
  margin-bottom: 15px;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}
@media (max-width: 650px) {
  .top {
    align-items: stretch;
    flex-direction: column;
  }
  .top .btn {
    align-self: flex-start;
  }
  .toolbar {
    flex-wrap: wrap;
  }
  .search {
    min-width: 100%;
  }
  .count {
    margin-left: auto;
  }
}
</style>
