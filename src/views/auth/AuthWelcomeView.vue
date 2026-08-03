<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import Icon from "../../components/ui/Icon.vue";
import { useAuthStore } from "../../store/auth";

const router = useRouter();
const auth = useAuthStore();

onMounted(() => {
  if (!auth.isAuthenticated) router.replace({ name: "auth-role" });
});

const confettiPieces = Array.from({ length: 26 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 0.6,
  duration: 2.2 + Math.random() * 1.4,
  color: ["#1B6B3A", "#F9A826", "#4CAF50", "#FFD54F"][i % 4],
  rotate: Math.random() * 360,
}));

const start = () => {
  router.push({ name: auth.homeRoute });
};
</script>

<template>
  <section class="screen !pb-0">
    <div class="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center">
      <span
        v-for="p in confettiPieces"
        :key="p.id"
        class="confetti-piece absolute top-[-5%] h-2.5 w-1.5 rounded-sm"
        :style="{
          left: p.left + '%',
          background: p.color,
          animationDelay: p.delay + 's',
          animationDuration: p.duration + 's',
          transform: `rotate(${p.rotate}deg)`,
        }"
      ></span>

      <span class="flex h-20 w-20 items-center justify-center rounded-full bg-koklo-green-light/15 text-koklo-green-light animate-pop-in">
        <Icon name="check-circle" :size="52" />
      </span>

      <h1 class="mt-5 font-display text-2xl font-extrabold text-koklo-ink">Bienvenue {{ auth.user?.prenom }} !</h1>
      <p class="mt-2 text-sm text-koklo-ink/60">KokloMarket vous ouvre ses portes.</p>

      <button class="btn-secondary mt-8 w-full max-w-xs" @click="start">Commencer l'aventure</button>
      <button class="mt-3 text-xs font-bold text-koklo-ink/40" @click="start">Plus tard</button>
    </div>
  </section>
</template>

<style scoped>
.confetti-piece {
  animation-name: confetti-fall;
  animation-timing-function: ease-in;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  opacity: 0.9;
}
@keyframes confetti-fall {
  0% {
    transform: translateY(-10%) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(650px) rotate(340deg);
    opacity: 0;
  }
}
</style>
