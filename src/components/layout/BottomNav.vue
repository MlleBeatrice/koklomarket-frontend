<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../store/auth";
import Icon from "../ui/Icon.vue";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const tabsByRole = {
  acheteur: [
    { key: "home", label: "Accueil", icon: "home", to: { name: "home" } },
    { key: "market", label: "Marché", icon: "store", to: { name: "market" } },
    { key: "profile", label: "Profil", icon: "user", to: { name: "profile" } },
  ],
  vendeur: [
    { key: "home", label: "Accueil", icon: "home", to: { name: "home" } },
    { key: "market", label: "Marché", icon: "store", to: { name: "market" } },
    { key: "seller-dashboard", label: "Tableau de bord", icon: "package", to: { name: "seller-profile" } },
    { key: "profile", label: "Compte", icon: "user", to: { name: "profile" } },
  ],
};

const tabs = computed(() => tabsByRole[auth.role] || tabsByRole.acheteur);
const activeKey = computed(() => route.meta.tab);
</script>

<template>
  <nav
    class="absolute inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-koklo-ink/5 bg-white px-2 pb-[max(env(safe-area-inset-bottom),10px)] pt-2 shadow-nav"
  >
    <button
      v-for="tab in tabs"
      :key="tab.key"
      class="relative flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-1.5 transition-all duration-200 active:scale-90"
      @click="router.push(tab.to)"
    >
      <span
        class="flex h-8 w-11 items-center justify-center rounded-full transition-all duration-300"
        :class="activeKey === tab.key ? 'bg-koklo-green/10 text-koklo-green' : 'text-koklo-ink/50'"
      >
        <Icon :name="tab.icon" :size="19" />
      </span>
      <span
        class="text-[10px] font-bold transition-colors"
        :class="activeKey === tab.key ? 'text-koklo-green' : 'text-koklo-ink/40'"
        >{{ tab.label }}</span
      >
      <span
        class="absolute -top-2 h-1 w-6 rounded-full bg-koklo-green transition-all duration-300"
        :class="activeKey === tab.key ? 'opacity-100' : 'opacity-0'"
      ></span>
    </button>
  </nav>
</template>
