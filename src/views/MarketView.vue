<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import AppHeader from "../components/layout/AppHeader.vue";
import ProductCard from "../components/product/ProductCard.vue";
import Icon from "../components/ui/Icon.vue";
import { categories, cities } from "../constants";
import { useProductsStore } from "../store/products";

const route = useRoute();
const products = useProductsStore();

const search = ref(route.query.q || "");
const activeCat = ref(route.query.cat || "tous");
const showFilters = ref(false);
const sortBy = ref("recent");
const priceMax = ref(10000);
const activeCity = ref("toutes");

const catTabs = [{ id: "tous", label: "Tous", icon: "basket" }, ...categories];

const load = () => {
  products.fetchProducts({
    category: activeCat.value,
    city: activeCity.value !== "toutes" ? activeCity.value : undefined,
    q: search.value || undefined,
    maxPrice: priceMax.value,
    sort: sortBy.value,
  });
};

onMounted(load);
watch([activeCat, activeCity, sortBy, priceMax], load);

let searchTimer = null;
watch(search, () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(load, 350);
});

watch(
  () => route.query,
  (q) => {
    if (q.cat) activeCat.value = q.cat;
    if (q.q) search.value = q.q;
  }
);
</script>

<template>
  <section class="screen">
    <AppHeader title="Le Marché" />

    <div class="px-4 pt-3">
      <div class="flex items-center gap-2 rounded-2xl border border-koklo-ink/10 bg-white px-4 py-3 shadow-card">
        <Icon name="search" :size="17" class="text-koklo-ink/40" />
        <input
          v-model="search"
          type="text"
          placeholder="Rechercher un produit, une localisation..."
          class="w-full bg-transparent text-sm font-semibold text-koklo-ink placeholder:font-normal placeholder:text-koklo-ink/40 focus:outline-none"
        />
        <button class="flex shrink-0 items-center gap-1 rounded-full bg-koklo-green px-3 py-1.5 text-xs font-bold text-white transition active:scale-90" @click="showFilters = !showFilters">
          <Icon name="filter" :size="13" /> Filtres
        </button>
      </div>
    </div>

    <div class="relative mt-3 border-y border-koklo-ink/5 bg-white/60 py-2.5">
      <div class="flex gap-2 overflow-x-auto px-4 no-scrollbar" role="tablist" aria-label="Catégories de produits">
        <button
          v-for="c in catTabs"
          :key="c.id"
          type="button"
          role="tab"
          :aria-selected="activeCat === c.id"
          class="chip shrink-0"
          :class="activeCat === c.id ? 'chip-active' : ''"
          @click="activeCat = c.id"
        >
          <Icon :name="c.icon" :size="11" /> {{ c.label }}
        </button>
      </div>
    </div>

    <transition name="slide-down">
      <div v-if="showFilters" class="mx-4 mt-3 space-y-4 rounded-xl2 border border-koklo-ink/10 bg-white p-4 shadow-card">
        <div>
          <div class="mb-1.5 flex items-center justify-between">
            <label class="text-xs font-bold text-koklo-ink">Prix maximum</label>
            <span class="text-xs font-bold text-koklo-green">{{ priceMax.toLocaleString("fr-FR") }} FCFA</span>
          </div>
          <input v-model.number="priceMax" type="range" min="450" max="10000" step="50" class="w-full accent-koklo-green" />
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-bold text-koklo-ink">Localisation</label>
          <div class="flex flex-wrap gap-1.5">
            <button class="chip !px-2.5 !py-1" :class="activeCity === 'toutes' ? 'chip-active' : ''" @click="activeCity = 'toutes'">Toutes les villes</button>
            <button v-for="c in cities" :key="c" class="chip !px-2.5 !py-1" :class="activeCity === c ? 'chip-active' : ''" @click="activeCity = c">{{ c }}</button>
          </div>
        </div>
      </div>
    </transition>

    <div class="mt-3 flex items-center justify-between px-4">
      <p class="text-xs font-semibold text-koklo-ink/50">{{ products.list.length }} produit(s) trouvé(s)</p>
      <select v-model="sortBy" class="rounded-full border border-koklo-ink/10 bg-white px-3 py-1.5 text-xs font-bold text-koklo-ink">
        <option value="recent">Plus récent</option>
        <option value="prix-asc">Prix croissant</option>
        <option value="prix-desc">Prix décroissant</option>
      </select>
    </div>

    <div v-if="products.list.length" class="mt-3 grid grid-cols-2 gap-3 px-4">
      <ProductCard v-for="(p, i) in products.list" :key="p.id" :product="p" class="animate-slide-up" :style="{ animationDelay: Math.min(i, 7) * 60 + 'ms' }" />
    </div>
    <div v-else class="mt-16 flex flex-col items-center gap-2 px-8 text-center">
      <Icon name="search" :size="34" class="mx-auto text-koklo-ink/20" />
      <p class="text-sm font-bold text-koklo-ink">Aucun produit ne correspond</p>
      <p class="text-xs text-koklo-ink/50">Essayez d'élargir vos filtres ou votre recherche.</p>
    </div>
  </section>
</template>

<style scoped>
/* Un fondu simple : la précédente animation basée sur max-height ne pouvait pas
   interpoler correctement vers une hauteur "auto" et finissait par masquer le
   panneau de filtres derrière le reste du contenu. Cette version est fiable. */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
