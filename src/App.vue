<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import BottomNav from "./components/layout/BottomNav.vue";
import ToastStack from "./components/ui/ToastStack.vue";

const route = useRoute();
const showNav = computed(() => !route.meta.hideChrome);
</script>

<template>
  <div class="app-shell">
    <router-view v-slot="{ Component, route: r }">
      <transition :name="r.meta.isSub || r.meta.hideChrome ? 'slide' : 'fade'" mode="out-in">
        <component :is="Component" :key="r.fullPath" />
      </transition>
    </router-view>

    <transition name="fade">
      <BottomNav v-if="showNav" />
    </transition>

    <ToastStack />
  </div>
</template>
