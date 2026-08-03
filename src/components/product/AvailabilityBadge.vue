<script setup>
import { computed } from "vue";

const props = defineProps({
  status: { type: String, required: true }, // disponible | stock-limite | rupture | bientot | indisponible
});

const map = {
  disponible: { label: "Disponible", dot: "bg-koklo-green-light", text: "text-koklo-green", bg: "bg-koklo-green-light/15" },
  "stock-limite": { label: "Stock limité", dot: "bg-koklo-orange", text: "text-koklo-orange", bg: "bg-koklo-orange/15" },
  rupture: { label: "Rupture de stock", dot: "bg-red-500", text: "text-red-600", bg: "bg-red-50" },
  bientot: { label: "Bientôt indisponible", dot: "bg-koklo-orange", text: "text-koklo-orange", bg: "bg-koklo-orange/15" },
  indisponible: { label: "Indisponible", dot: "bg-red-500", text: "text-red-600", bg: "bg-red-50" },
};

const info = computed(() => map[props.status] ?? map.disponible);
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold"
    :class="[info.bg, info.text]"
  >
    <span class="h-1.5 w-1.5 rounded-full" :class="info.dot"></span>
    {{ info.label }}
  </span>
</template>
