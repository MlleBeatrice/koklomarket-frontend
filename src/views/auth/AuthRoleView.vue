<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import logo from "../../assets/logo.png";
import Icon from "../../components/ui/Icon.vue";
import { useAuthStore } from "../../store/auth";

const router = useRouter();
const auth = useAuthStore();

const role = ref(auth.draft.role);

const roles = [
  { id: "vendeur", label: "Vendeur", desc: "Publiez vos volailles, œufs et poussins et trouvez des acheteurs.", icon: "store", color: "#1B6B3A" },
  { id: "acheteur", label: "Acheteur", desc: "Parcourez le marché et contactez les vendeurs près de chez vous.", icon: "basket", color: "#F9A826" },
];

const canContinue = computed(() => !!role.value);

const next = () => {
  auth.setDraftRole(role.value);
  router.push({ name: "auth-info" });
};
</script>

<template>
  <section class="screen !pb-0">
    <div class="mx-auto w-full max-w-sm px-6 py-8">
      <div class="mb-6 flex items-center gap-3">
        <img :src="logo" alt="KokloMarket" class="h-9 w-auto" />
      </div>

      <h1 class="font-display text-2xl font-extrabold text-koklo-ink">Choisissez votre rôle</h1>
      <p class="mt-1 text-sm text-koklo-ink/50">Sélectionnez comment vous souhaitez utiliser KokloMarket.</p>

      <div class="mt-6 space-y-3">
        <button
          v-for="r in roles"
          :key="r.id"
          class="relative flex w-full items-center gap-4 rounded-2xl border-2 bg-white p-5 text-left shadow-card transition-all duration-300"
          :class="role === r.id ? 'border-koklo-green bg-koklo-green/5' : 'border-transparent hover:-translate-y-0.5 hover:shadow-card-hover'"
          @click="role = r.id"
        >
          <span v-if="role === r.id" class="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-koklo-green text-white">
            <Icon name="check" :size="12" />
          </span>
          <span class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl" :style="{ background: r.color + '1A', color: r.color }">
            <Icon :name="r.icon" :size="30" />
          </span>
          <div class="min-w-0 flex-1 pr-6">
            <p class="text-base font-extrabold text-koklo-ink">{{ r.label }}</p>
            <p class="mt-0.5 text-xs leading-snug text-koklo-ink/50">{{ r.desc }}</p>
          </div>
        </button>
      </div>

      <transition name="fade-up">
        <button v-if="canContinue" class="btn-primary mt-6 w-full" @click="next">Continuer</button>
      </transition>

      <p class="mt-6 text-center text-xs text-koklo-ink/50">
        Déjà inscrit ? <button class="font-bold text-koklo-green" @click="router.push({ name: 'auth' })">Se connecter</button>
      </p>
    </div>
  </section>
</template>

<style scoped>
.fade-up-enter-active {
  animation: fadeUp 0.5s ease forwards;
}
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
