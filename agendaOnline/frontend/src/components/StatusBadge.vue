<template>
  <span class="status" :class="status?.toLowerCase()">● {{ status }}</span>
</template>
<script setup>
defineProps({ status: String });
</script>
<style scoped>
.status {
  display: inline-block;
  border-radius: 20px;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 800;
}
.agendado {
  background: #fff2dc;
  color: #a57525;
}
.concluído {
  background: #e5f4e8;
  color: #34704a;
}
.cancelado {
  background: #ffebe8;
  color: #a4493a;
}
</style>
