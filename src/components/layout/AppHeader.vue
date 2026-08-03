<script setup>
import { useRouter } from "vue-router";
import logo from "../../assets/logo.png";
import Icon from "../ui/Icon.vue";

defineProps({
  showBack: { type: Boolean, default: false },
  title: { type: String, default: "" },
});
const router = useRouter();
</script>

<template>
  <header
    class="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-koklo-ink/5 bg-koklo-cream/95 px-4 py-3 backdrop-blur"
  >
    <div class="flex min-w-0 items-center gap-2">
      <button
        v-if="showBack"
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-koklo-ink shadow transition active:scale-90"
        @click="router.back()"
        aria-label="Retour"
      >
        <Icon name="arrow-left" :size="18" />
      </button>
      <img v-if="!showBack" :src="logo" alt="KokloMarket" class="h-8 w-auto shrink-0" />
      <h1 v-if="title" class="truncate text-base font-extrabold text-koklo-ink">{{ title }}</h1>
    </div>
    <div class="flex shrink-0 items-center gap-2">
      <slot name="actions"></slot>
    </div>
  </header>
</template>
