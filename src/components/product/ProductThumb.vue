<script setup>
import Icon from "../ui/Icon.vue";
import { assetUrl } from "../../api";
import { categories } from "../../constants";

const props = defineProps({
  image: { type: String, default: null },
  category: { type: String, default: "vivantes" },
  size: { type: [Number, String], default: 40 },
  rounded: { type: String, default: "rounded-xl2" },
});

const categoryIcon = categories.find((c) => c.id === props.category)?.icon || "bird";
const categoryColors = {
  vivantes: "#1B6B3A",
  oeufs: "#FFD54F",
  poussins: "#F9A826",
  chair: "#F9A826",
  pintades: "#4CAF50",
  canards: "#1B6B3A",
};
</script>

<template>
  <div class="relative flex h-full w-full items-center justify-center overflow-hidden" :class="rounded">
    <!-- Photo réelle envoyée par le vendeur -->
    <img v-if="image" :src="assetUrl(image)" :alt="category" class="h-full w-full object-cover" />
    <!-- Repère visuel tant qu'aucune photo n'a été ajoutée -->
    <div
      v-else
      class="flex h-full w-full items-center justify-center"
      :style="{ background: `linear-gradient(155deg, ${categoryColors[category]}26, ${categoryColors[category]}4D)` }"
    >
      <Icon :name="categoryIcon" :size="size" :style="{ color: categoryColors[category] }" />
    </div>
  </div>
</template>
