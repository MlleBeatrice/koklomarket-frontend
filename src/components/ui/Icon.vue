<script setup>
// Système d'icônes unique de l'application : FontAwesome 6 chargé via CDN (voir index.html).
// Ce composant ne fait que mapper un nom sémantique interne vers la classe FontAwesome
// correspondante, afin de garder des appels cohérents partout (<Icon name="cart" />)
// sans jamais recourir à un émoji ou à une image générée.
import { computed } from "vue";

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 16 },
  solid: { type: Boolean, default: true },
});

const map = {
  home: "house",
  store: "store",
  cart: "cart-shopping",
  truck: "truck",
  user: "user",
  bell: "bell",
  search: "magnifying-glass",
  heart: "heart",
  check: "check",
  "check-circle": "circle-check",
  star: "star",
  phone: "phone",
  message: "comment-dots",
  settings: "gear",
  logout: "right-from-bracket",
  plus: "plus",
  minus: "minus",
  trash: "trash",
  package: "box",
  pin: "location-dot",
  shield: "shield-halved",
  clock: "clock",
  "arrow-left": "arrow-left",
  "arrow-right": "arrow-right",
  "chevron-right": "chevron-right",
  filter: "sliders",
  sparkles: "wand-magic-sparkles",
  wallet: "wallet",
  gift: "gift",
  building: "building",
  bike: "motorcycle",
  egg: "egg",
  feather: "feather",
  menu: "bars",
  close: "xmark",
  eye: "eye",
  basket: "basket-shopping",
  drumstick: "drumstick-bite",
  bird: "kiwi-bird",
  camera: "camera",
  image: "image",
  scale: "scale-balanced",
  calendar: "calendar-days",
  tag: "tag",
  info: "circle-info",
  warning: "triangle-exclamation",
  sms: "comment-sms",
  lock: "lock",
  eyeSlash: "eye-slash",
};

const faClass = computed(() => `fa-${props.solid ? "solid" : "regular"} fa-${map[props.name] || "circle"}`);
const fontSize = computed(() => (typeof props.size === "number" ? `${props.size}px` : props.size));
</script>

<template>
  <i :class="faClass" :style="{ fontSize: fontSize, lineHeight: 1 }" aria-hidden="true"></i>
</template>
