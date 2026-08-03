<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import AppHeader from "../components/layout/AppHeader.vue";
import ProductCard from "../components/product/ProductCard.vue";
import Icon from "../components/ui/Icon.vue";
import CountUp from "../components/ui/CountUp.vue";
import { categories } from "../constants";
import { useAuthStore } from "../store/auth";
import { useProductsStore } from "../store/products";

const router = useRouter();
const auth = useAuthStore();
const products = useProductsStore();
const search = ref("");

onMounted(async () => {
  const calls = [products.fetchProducts({ sort: "recent" }), products.fetchStats()];
  if (auth.isAuthenticated && auth.role === "acheteur") calls.push(products.fetchFavorites());
  await Promise.all(calls);
});

const goSearch = () => {
  router.push({ name: "market", query: search.value ? { q: search.value } : {} });
};
const goCategory = (id) => {
  router.push({ name: "market", query: { cat: id } });
};
</script>

<template>
  <section class="screen">
    <!-- En-tête -->
    <AppHeader>
      <template v-if="!auth.isAuthenticated" #actions>
        <button
          class="rounded-full bg-koklo-green px-3.5 py-1.5 text-xs font-bold text-white transition active:scale-90"
          @click="router.push({ name: 'auth' })"
        >
          Se connecter
        </button>
      </template>
    </AppHeader>

    <!-- Salutation -->
    <p class="px-4 pt-3 text-sm font-semibold text-koklo-ink/60">
      {{ auth.isAuthenticated ? `Bonjour ${auth.user?.prenom} 👋` : 'Bienvenue sur KokloMarket 👋' }}
    </p>

    <!-- Barre de recherche -->
    <div class="px-4 pt-2">
      <div
        class="flex items-center gap-2 rounded-2xl border border-koklo-ink/10 bg-white px-4 py-3 shadow-card"
      >
        <Icon name="search" :size="17" class="shrink-0 text-koklo-ink/40" />
        <input
          v-model="search"
          type="text"
          placeholder="Rechercher une volaille, des œufs..."
          class="w-full min-w-0 bg-transparent text-sm font-semibold text-koklo-ink placeholder:font-normal placeholder:text-koklo-ink/40 focus:outline-none"
          @keyup.enter="goSearch"
        />
      </div>
    </div>

    <!-- Hero banner compact -->
    <div class="relative mx-4 mt-4 overflow-hidden rounded-2xl bg-koklo-green px-5 py-4 shadow-card-hover">
      <div class="pointer-events-none absolute -right-6 -top-8 h-32 w-32 rounded-full bg-koklo-green-light/30"></div>
      <div class="pointer-events-none absolute -bottom-10 -left-4 h-24 w-24 rounded-full bg-koklo-orange/20"></div>
      <div class="relative flex items-center justify-between gap-3">
        <div class="flex-1 min-w-0">
          <p class="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-koklo-yellow">
            <Icon name="sparkles" :size="11" class="shrink-0" />
            <span>Marché avicole béninois</span>
          </p>
          <h2 class="mt-1 font-display text-lg font-extrabold leading-tight text-white">
            Achetez local,<br />mangez meilleur.
          </h2>
          <button
            class="mt-3 inline-flex items-center gap-1.5 rounded-full bg-koklo-orange px-4 py-2 text-xs font-extrabold text-white shadow transition active:scale-95"
            @click="router.push({ name: 'market' })"
          >
            Voir les produits <Icon name="arrow-right" :size="12" />
          </button>
        </div>
        <Icon name="bird" :size="48" class="shrink-0 text-white/40" />
      </div>
    </div>

    <!-- Bandeau "rejoindre" pour les visiteurs non connectés -->
    <div
      v-if="!auth.isAuthenticated"
      class="mx-4 mt-3 flex flex-wrap items-center gap-3 rounded-2xl bg-koklo-orange/10 px-4 py-3"
    >
      <p class="min-w-[180px] flex-1 text-xs font-semibold leading-snug text-koklo-ink/70">
        Créez un compte pour contacter les vendeurs et publier vos produits.
      </p>
      <button
        class="shrink-0 rounded-full bg-koklo-orange px-3 py-1.5 text-xs font-bold text-white active:scale-95"
        @click="router.push({ name: 'auth-role' })"
      >
        Rejoindre
      </button>
    </div>

    <!-- Statistiques -->
    <div class="mx-4 mt-4 grid grid-cols-3 gap-2">
      <div class="card relative overflow-hidden py-3 text-center">
        <span class="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-koklo-green"></span>
        <Icon name="store" :size="15" class="mx-auto text-koklo-green" />
        <p class="mt-1 font-display text-sm font-extrabold text-koklo-ink">
          <CountUp :value="products.stats.sellers" />
        </p>
        <p class="text-[9px] font-semibold text-koklo-ink/50">vendeurs</p>
      </div>
      <div class="card relative overflow-hidden py-3 text-center">
        <span class="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-koklo-orange"></span>
        <Icon name="egg" :size="15" class="mx-auto text-koklo-orange" />
        <p class="mt-1 font-display text-sm font-extrabold text-koklo-ink">
          <CountUp :value="products.stats.products" />
        </p>
        <p class="text-[9px] font-semibold text-koklo-ink/50">produits</p>
      </div>
      <div class="card relative overflow-hidden py-3 text-center">
        <span class="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-koklo-green"></span>
        <Icon name="message" :size="15" class="mx-auto text-koklo-green" />
        <p class="mt-1 font-display text-sm font-extrabold text-koklo-ink">
          <CountUp :value="products.stats.contacts" />
        </p>
        <p class="text-[9px] font-semibold text-koklo-ink/50">mises en relation</p>
      </div>
    </div>

    <!-- Explorer par catégorie -->
    <div class="relative z-10 mt-5 border-y border-koklo-ink/5 bg-white/60 px-4 py-3">
      <h3 class="text-sm font-extrabold text-koklo-ink">Explorer par catégorie</h3>
      <div class="mt-3 flex gap-3 overflow-x-auto pb-1 no-scrollbar">
        <button
          v-for="c in categories"
          :key="c.id"
          type="button"
          class="flex shrink-0 flex-col items-center gap-1.5 transition active:scale-90"
          @click="goCategory(c.id)"
        >
          <span class="flex h-14 w-14 items-center justify-center rounded-full bg-koklo-green/10 text-koklo-green">
            <Icon :name="c.icon" :size="22" />
          </span>
          <span class="w-14 text-center text-[10px] font-bold leading-tight text-koklo-ink/80">
            {{ c.label }}
          </span>
        </button>
      </div>
    </div>

    <!-- Annonces récentes -->
    <div class="mt-5 flex items-center justify-between px-4">
      <h3 class="text-sm font-extrabold text-koklo-ink">Annonces récentes</h3>
      <button
        class="flex shrink-0 items-center gap-0.5 text-xs font-bold text-koklo-green active:opacity-70"
        @click="router.push({ name: 'market' })"
      >
        Voir tout <Icon name="chevron-right" :size="13" />
      </button>
    </div>

    <div v-if="products.loading" class="mt-4 flex justify-center py-8">
      <span class="h-7 w-7 animate-spin rounded-full border-[3px] border-koklo-green/20 border-t-koklo-green"></span>
    </div>
    <div v-else-if="products.list.length" class="mt-3 grid grid-cols-2 gap-3 px-4">
      <ProductCard
        v-for="(p, i) in products.list.slice(0, 4)"
        :key="p.id"
        :product="p"
        class="animate-slide-up"
        :style="{ animationDelay: i * 70 + 'ms' }"
      />
    </div>
    <div v-else class="mx-4 mt-3 rounded-2xl border border-dashed border-koklo-ink/15 p-6 text-center">
      <Icon name="store" :size="26" class="mx-auto text-koklo-ink/20" />
      <p class="mt-2 text-xs font-semibold text-koklo-ink/50">
        Aucune annonce pour l'instant. Soyez le premier vendeur !
      </p>
    </div>

    <!-- CTA vendeur (masqué pour les vendeurs connectés) -->
    <div
      v-if="auth.role !== 'vendeur'"
      class="mx-4 mb-6 mt-6 flex items-center justify-between gap-3 rounded-2xl bg-koklo-ink px-4 py-4 shadow-card"
    >
      <div class="min-w-0 pr-2">
        <p class="text-sm font-extrabold text-white">Vous êtes éleveur ou distributeur ?</p>
        <p class="mt-0.5 text-[11px] text-white/60">
          {{ auth.isAuthenticated
            ? 'Créez un compte vendeur pour publier vos produits.'
            : 'Rejoignez KokloMarket pour vendre vos produits.' }}
        </p>
      </div>
      <button
        v-if="!auth.isAuthenticated"
        class="shrink-0 rounded-full bg-koklo-orange px-3 py-1.5 text-xs font-bold text-white active:scale-95"
        @click="router.push({ name: 'auth-role' })"
      >
        Vendre
      </button>
    </div>
  </section>
</template>
