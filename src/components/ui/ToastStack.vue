<script setup>
import { useUiStore } from "../../store/ui";
import Icon from "./Icon.vue";
const ui = useUiStore();
</script>

<template>
  <div class="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex flex-col items-end gap-2 px-4">
    <transition-group name="toast">
      <div
        v-for="t in ui.toasts"
        :key="t.id"
        class="pointer-events-auto flex w-full max-w-[300px] animate-toast-in items-center gap-2.5 rounded-2xl bg-koklo-ink px-4 py-3 text-sm font-semibold text-white shadow-xl"
      >
        <span
          class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
          :class="{
            'bg-koklo-green-light': t.tone === 'success',
            'bg-koklo-orange': t.tone === 'info',
            'bg-red-500': t.tone === 'error',
          }"
        >
          <Icon
            :name="t.tone === 'success' ? 'check' : t.tone === 'info' ? 'sparkles' : 'warning'"
            :size="11"
            class="text-white"
          />
        </span>
        <span class="leading-snug">{{ t.message }}</span>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-leave-active {
  transition: all 0.25s ease;
  position: absolute;
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(24px);
}
</style>
