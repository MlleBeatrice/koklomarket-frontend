<script setup>
import logo from "../../assets/logo.png";
defineProps({ label: { type: String, default: "" } });
</script>

<template>
  <div class="flex h-full flex-col items-center justify-center gap-4 bg-koklo-cream">
    <div class="relative flex h-20 w-20 items-center justify-center">
      <span class="absolute inset-0 animate-spin rounded-full border-[3px] border-koklo-green/15 border-t-koklo-orange"></span>
      <img :src="logo" alt="KokloMarket" class="h-10 w-10 object-contain" />
    </div>
    <p v-if="label" class="text-xs font-bold text-koklo-ink/50">{{ label }}</p>
  </div>
</template>
