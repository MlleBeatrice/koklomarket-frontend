<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import logo from "../../assets/logo.png";
import Icon from "../../components/ui/Icon.vue";
import LoadingSpinner from "../../components/ui/LoadingSpinner.vue";
import { useAuthStore } from "../../store/auth";
import { useUiStore } from "../../store/ui";

const router = useRouter();
const auth = useAuthStore();
const ui = useUiStore();

const loading = ref(false);
const whatsapp = ref("");
const password = ref("");
const showPassword = ref(false);
const error = ref("");

const doLogin = async (num, pass) => {
  error.value = "";
  loading.value = true;
  try {
    await auth.login(num, pass);
    // On attend que le store ait bien le rôle avant de router
    const route = auth.homeRoute;
    router.push({ name: route });
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};

const login = () => {
  if (!whatsapp.value || !password.value) {
    error.value = "Renseignez votre numéro WhatsApp et votre mot de passe.";
    return;
  }
  doLogin(whatsapp.value, password.value);
};

// Connexions rapides pour la démo
const loginAsDemo = (type) => {
  if (type === 'vendeur') {
    doLogin("0163616901", "demo1234");
  } else {
    doLogin("0146995599", "demo4321");
  }
};
</script>

<template>
  <section class="screen !pb-0">
    <transition name="fade" mode="out-in">
      <LoadingSpinner v-if="loading" label="Connexion à KokloMarket..." />

      <div v-else class="mx-auto w-full max-w-sm px-6 py-8">
        <div class="mb-7 flex flex-col items-center text-center">
          <img :src="logo" alt="KokloMarket" class="h-12 w-auto" />
          <p class="mt-2 text-xs font-semibold text-koklo-ink/50">Achetez local, mangez meilleur.</p>
        </div>

        <div class="animate-slide-up space-y-3">
          <h2 class="text-center font-display text-lg font-extrabold text-koklo-ink">Content de vous revoir</h2>

          <div class="relative">
            <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-koklo-ink/40">+229</span>
            <input
              v-model="whatsapp"
              maxlength="10"
              inputmode="numeric"
              class="input-field pl-14"
              placeholder="01 XX XX XX XX"
              aria-label="Numéro WhatsApp"
              name="koklo-login-id"
              autocomplete="off"
              autocorrect="off"
              spellcheck="false"
            />
          </div>
          <div class="relative">
            <Icon name="lock" :size="14" class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-koklo-ink/30" />
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="input-field pl-10 pr-10"
              placeholder="Mot de passe"
              aria-label="Mot de passe"
              name="koklo-login-secret"
              autocomplete="off"
              @keyup.enter="login"
            />
            <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-koklo-ink/30" @click="showPassword = !showPassword">
              <Icon :name="showPassword ? 'eyeSlash' : 'eye'" :size="14" />
            </button>
          </div>

          <p v-if="error" class="text-xs font-bold text-red-500">{{ error }}</p>

          <button class="btn-primary w-full" @click="login">Se connecter</button>

          <!-- Accès démo rapide -->
          <div class="mt-2 rounded-xl bg-koklo-green/5 p-3 border border-koklo-green/10">
            <p class="mb-2 text-center text-[11px] font-bold text-koklo-ink/50 uppercase tracking-wider">Comptes démo disponibles</p>
            <div class="flex gap-2">
              <button
                class="flex-1 flex items-center justify-center gap-1.5 rounded-xl border-2 border-koklo-green/20 bg-white py-2.5 text-xs font-bold text-koklo-green transition active:scale-95 active:bg-koklo-green/5"
                @click="loginAsDemo('acheteur')"
              >
                <Icon name="user" :size="13" /> Acheteur démo
              </button>
              <button
                class="flex-1 flex items-center justify-center gap-1.5 rounded-xl border-2 border-koklo-orange/20 bg-white py-2.5 text-xs font-bold text-koklo-orange transition active:scale-95 active:bg-koklo-orange/5"
                @click="loginAsDemo('vendeur')"
              >
                <Icon name="store" :size="13" /> Vendeur démo
              </button>
            </div>
          </div>

          <p class="pt-1 text-center text-xs text-koklo-ink/50">
            Pas encore de compte ? <button class="font-bold text-koklo-green" @click="router.push({ name: 'auth-role' })">Créer un compte</button>
          </p>
        </div>
      </div>
    </transition>
  </section>
</template>
