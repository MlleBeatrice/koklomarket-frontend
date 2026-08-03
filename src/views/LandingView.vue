<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import logoWhite from "../assets/logo-white.png";
import marketBg from "../assets/market-bg.jpeg"; // Importez l'image
import Icon from "../components/ui/Icon.vue";
import { useProductsStore } from "../store/products";

const router = useRouter();
const products = useProductsStore();

// Chiffres réels de la plateforme (aucune valeur inventée) : tant que peu de
// vendeurs/produits sont enregistrés, ces compteurs afficheront des nombres
// modestes, ce qui est normal et honnête pour un lancement.
onMounted(() => {
  products.fetchStats();
});
</script>

<template>
  <div class="screen !pb-0">
    <div class="relative flex h-full min-h-full flex-col overflow-hidden">
      <!-- Image de fond -->
      <div
        class="absolute inset-0 bg-cover bg-center"
        :style="{
          backgroundImage: `url(${marketBg})`,
          backgroundPosition: 'center 30%',
        }"
      >
        <!-- Superposition -->
        <div
          class="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#1a2a1f] via-[#1a2a1f]/70 to-transparent"
        ></div>
        <div
          class="absolute inset-0 bg-gradient-to-b from-[#1a2a1f]/20 via-transparent to-[#1a2a1f]/40"
        ></div>
        <span
          class="absolute left-[8%] top-[8%] h-48 w-48 rounded-full bg-koklo-orange/10 blur-3xl"
        ></span>
        <span
          class="absolute bottom-[10%] right-[5%] h-64 w-64 rounded-full bg-koklo-yellow/15 blur-3xl"
        ></span>
      </div>

      <!-- Contenu -->
      <div class="relative z-10 flex h-full flex-col px-6 pb-10 pt-8">
        <!-- Logo en haut à gauche -->
        <div class="flex items-center justify-start">
          <img
            :src="logoWhite"
            alt="KokloMarket"
            class="h-8 w-auto max-w-[140px] object-contain"
          />
        </div>

        <!-- Contenu central -->
        <div class="flex-1 flex flex-col justify-center mt-2">
          <p
            class="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-sm"
          >
            <Icon name="sparkles" :size="13" class="text-koklo-orange" />
            Le marché numérique 100% béninois
          </p>

          <h1
            class="font-display text-[2.5rem] font-extrabold leading-[1.05] text-white drop-shadow-lg"
          >
            Achetez local,<br />mangez meilleur.
          </h1>

          <p class="mt-4 max-w-md text-[15px] font-medium leading-relaxed text-white/80 drop-shadow">
            Le marché numérique des produits avicoles du Bénin. Volailles, œufs et poussins frais, livrés chez vous.
          </p>

          <button
            class="relative mt-7 flex w-full max-w-sm items-center justify-center gap-2 overflow-visible rounded-full bg-koklo-orange py-3.5 text-base font-extrabold text-koklo-ink shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-koklo-orange/30 active:scale-95"
            @click="router.push({ name: 'market' })"
          >
            <span
              class="absolute inset-0 rounded-full bg-koklo-orange animate-ping-slow opacity-50"
            ></span>
            <span class="relative">Voir le marché</span>
            <Icon name="arrow-right" :size="18" class="relative" />
          </button>

          <div
            class="mt-5 flex flex-wrap items-center justify-start gap-5 text-[12px] font-semibold text-white/80"
          >
            <span class="flex items-center gap-1.5">
              <Icon name="store" :size="16" class="text-koklo-orange" /> {{ products.stats.sellers }} vendeurs
            </span>
            <span class="flex items-center gap-1.5">
              <Icon name="egg" :size="16" class="text-koklo-yellow" /> {{ products.stats.products }} produits
            </span>
            <span class="flex items-center gap-1.5">
              <Icon name="truck" :size="16" class="text-koklo-green-light" /> {{ products.stats.contacts }} mises en relation
            </span>
          </div>

          <button
            class="mt-5 block text-xs font-bold text-white/60 underline transition-colors duration-200 hover:text-white/90"
            @click="router.push({ name: 'auth' })"
          >
            Déjà inscrit ? Se connecter
          </button>
        </div>

        <!-- Décoration en bas -->
        <div class="flex justify-center gap-2 py-2 mt-2">
          <span class="h-1 w-8 rounded-full bg-koklo-orange/60"></span>
          <span class="h-1 w-4 rounded-full bg-white/30"></span>
          <span class="h-1 w-4 rounded-full bg-white/30"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes ping-slow {
  0% {
    transform: scale(1);
    opacity: 0.45;
  }
  70%,
  100% {
    transform: scale(1.12);
    opacity: 0;
  }
}
.animate-ping-slow {
  animation: ping-slow 2.2s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>
