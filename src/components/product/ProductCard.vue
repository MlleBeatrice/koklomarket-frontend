<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import ProductThumb from "./ProductThumb.vue";
import AvailabilityBadge from "./AvailabilityBadge.vue";
import Icon from "../ui/Icon.vue";
import { useAuthStore } from "../../store/auth";
import { useProductsStore } from "../../store/products";
import { useUiStore } from "../../store/ui";

const props = defineProps({
  product: { type: Object, required: true },
});
const router = useRouter();
const auth = useAuthStore();
const products = useProductsStore();
const ui = useUiStore();

const favBounce = ref(false);

const open = () => router.push({ name: "product", params: { id: props.product.id } });
const fmt = (n) => n.toLocaleString("fr-FR");

const toggleFav = async (e) => {
  e.stopPropagation();
  if (!auth.isAuthenticated) {
    ui.notify("Connectez-vous pour sauvegarder vos favoris", "info");
    setTimeout(() => router.push({ name: "auth" }), 900);
    return;
  }
  favBounce.value = true;
  setTimeout(() => (favBounce.value = false), 400);
  await products.toggleFavorite(props.product.id);
};
</script>

<template>
  <div
    class="card group flex cursor-pointer flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover active:scale-[0.98]"
    @click="open"
  >
    <div class="relative aspect-[4/3] w-full">
      <ProductThumb :image="product.image" :category="product.category" rounded="rounded-none" :size="34" />
      <div class="absolute left-2 top-2">
        <AvailabilityBadge :status="product.availability" />
      </div>
      <button
        class="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow transition active:scale-90"
        :class="{ 'scale-125': favBounce }"
        @click="toggleFav"
        aria-label="Ajouter aux favoris"
      >
        <Icon
          name="heart"
          :size="15"
          :solid="products.favoriteIds.has(product.id)"
          :class="products.favoriteIds.has(product.id) ? 'text-red-500' : 'text-koklo-ink/30'"
        />
      </button>
    </div>
    <div class="flex flex-1 flex-col gap-1 p-3">
      <h3 class="line-clamp-1 text-sm font-bold text-koklo-ink">{{ product.name }}</h3>
      <p class="text-base font-extrabold text-koklo-green">
        {{ fmt(product.price) }} FCFA
        <span class="text-[11px] font-semibold text-koklo-ink/40">/{{ product.unit }}</span>
      </p>
      <p class="flex items-center gap-1 text-[11px] text-koklo-ink/50">
        <Icon name="pin" :size="11" />{{ product.city || "Bénin" }}
      </p>
      <div class="mt-1 flex items-center justify-between">
        <span class="truncate text-[11px] text-koklo-ink/40">{{ product.sellerName }}</span>
        <span
          v-if="product.negotiable"
          class="shrink-0 rounded-full bg-koklo-yellow/40 px-2 py-0.5 text-[10px] font-bold text-koklo-ink/70"
          >Négociable</span
        >
      </div>
    </div>
  </div>
</template>
