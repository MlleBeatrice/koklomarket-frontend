<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  value: { type: Number, required: true }, // numeric target (e.g. 150)
  suffix: { type: String, default: "" }, // e.g. "+"
  duration: { type: Number, default: 1100 },
});

const display = ref(0);

onMounted(() => {
  const start = performance.now();
  const from = 0;
  const to = props.value;
  const step = (now) => {
    const progress = Math.min(1, (now - start) / props.duration);
    // easeOutCubic
    const eased = 1 - Math.pow(1 - progress, 3);
    display.value = Math.round(from + (to - from) * eased);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
});
</script>

<template>
  <span>{{ display }}{{ suffix }}</span>
</template>
