<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import Icon from "../../components/ui/Icon.vue";
import LoadingSpinner from "../../components/ui/LoadingSpinner.vue";
import { useAuthStore } from "../../store/auth";
import { cities } from "../../constants";

const router = useRouter();
const auth = useAuthStore();

onMounted(() => {
  if (!auth.draft.role) router.replace({ name: "auth-role" });
});

const lastName = ref("");
const firstName = ref("");
const phone = ref("");
const password = ref("");
const confirm = ref("");
const city = ref("");
const showPassword = ref(false);
const showConfirm = ref(false);
const submitting = ref(false);
const error = ref("");

const phoneValid = computed(() => /^01\d{8}$/.test(phone.value.replace(/\s/g, "")));

const strength = computed(() => {
  const p = password.value;
  if (p.length === 0) return { level: 0, label: "", color: "" };
  const hasDigit = /\d/.test(p);
  const hasSpecial = /[^A-Za-z0-9]/.test(p);
  if (p.length >= 10 && hasDigit && hasSpecial) return { level: 3, label: "Fort", color: "bg-koklo-green-light" };
  if (p.length >= 6 && hasDigit) return { level: 2, label: "Moyen", color: "bg-koklo-orange" };
  return { level: 1, label: "Faible", color: "bg-red-500" };
});

const canContinue = computed(
  () =>
    lastName.value.trim().length > 1 &&
    firstName.value.trim().length > 1 &&
    phoneValid.value &&
    password.value.length >= 4 &&
    password.value === confirm.value &&
    !submitting.value
);

const submit = async () => {
  error.value = "";
  submitting.value = true;
  try {
    await auth.register({
      role: auth.draft.role,
      nom: lastName.value.trim(),
      prenom: firstName.value.trim(),
      whatsapp: phone.value.replace(/\s/g, ""),
      password: password.value,
      ville: city.value.trim(),
    });
    router.push({ name: "auth-welcome" });
  } catch (e) {
    error.value = e.message;
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <section class="screen !pb-0">
    <transition name="fade" mode="out-in">
      <LoadingSpinner v-if="submitting" label="Création de votre compte..." />

      <div v-else class="mx-auto w-full max-w-sm px-6 py-8">
        <div class="mb-5 flex items-center gap-3">
          <button class="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow transition active:scale-90" @click="router.push({ name: 'auth-role' })">
            <Icon name="arrow-left" :size="16" />
          </button>
        </div>

        <h1 class="font-display text-2xl font-extrabold text-koklo-ink">Vos informations</h1>
        <p class="mt-1 text-sm text-koklo-ink/50">Créez votre compte KokloMarket ({{ auth.draft.role }}).</p>

        <div class="mt-6 space-y-4">
          <div>
            <label class="mb-1 block text-xs font-bold text-koklo-ink">Numéro WhatsApp</label>
            <div class="flex items-center gap-2 rounded-2xl border border-koklo-ink/10 bg-white px-4 py-3">
              <span class="text-sm font-bold text-koklo-ink/50">+229</span>
              <input
                v-model="phone"
                type="tel"
                inputmode="numeric"
                maxlength="10"
                class="w-full bg-transparent text-sm font-semibold text-koklo-ink placeholder:font-normal placeholder:text-koklo-ink/40 focus:outline-none"
                placeholder="01 XX XX XX XX"
                aria-label="Numéro WhatsApp"
                name="koklo-register-phone"
                autocomplete="off"
              />
              <span v-if="phoneValid" class="flex items-center gap-1 text-[10px] font-bold text-koklo-green">
                <Icon name="check-circle" :size="13" />
              </span>
            </div>
            <p class="mt-1 text-[10px] text-koklo-ink/40">Ce numéro sera utilisé par les acheteurs pour vous contacter sur WhatsApp.</p>
          </div>

          <div>
            <label class="mb-1 block text-xs font-bold text-koklo-ink">Nom</label>
            <input v-model="lastName" class="input-field" placeholder="Votre nom de famille" aria-label="Nom" name="koklo-register-lastname" autocomplete="off" />
          </div>

          <div>
            <label class="mb-1 block text-xs font-bold text-koklo-ink">Prénoms</label>
            <input v-model="firstName" class="input-field" placeholder="Vos prénoms" aria-label="Prénoms" name="koklo-register-firstname" autocomplete="off" />
          </div>

          <div>
            <label class="mb-1 block text-xs font-bold text-koklo-ink">Ville</label>
            <select v-model="city" class="input-field" aria-label="Ville" name="koklo-register-city" autocomplete="off">
              <option value="" disabled>Choisissez votre ville</option>
              <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>

          <div>
            <label class="mb-1 block text-xs font-bold text-koklo-ink">Mot de passe</label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="input-field pr-10"
                placeholder="Créez un mot de passe sécurisé"
                aria-label="Mot de passe"
                name="koklo-register-secret"
                autocomplete="off"
              />
              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-koklo-ink/30" @click="showPassword = !showPassword">
                <Icon :name="showPassword ? 'eyeSlash' : 'eye'" :size="14" />
              </button>
            </div>
            <div v-if="password" class="mt-2">
              <div class="flex gap-1">
                <span v-for="i in 3" :key="i" class="h-1.5 flex-1 rounded-full transition-colors" :class="i <= strength.level ? strength.color : 'bg-koklo-gray'"></span>
              </div>
              <p class="mt-1 text-[10px] font-bold" :class="strength.level === 3 ? 'text-koklo-green' : strength.level === 2 ? 'text-koklo-orange' : 'text-red-500'">{{ strength.label }}</p>
            </div>
          </div>

          <div>
            <label class="mb-1 block text-xs font-bold text-koklo-ink">Confirmer le mot de passe</label>
            <div class="relative">
              <input
                v-model="confirm"
                :type="showConfirm ? 'text' : 'password'"
                class="input-field pr-10"
                placeholder="Confirmez votre mot de passe"
                aria-label="Confirmer le mot de passe"
                name="koklo-register-secret-confirm"
                autocomplete="off"
              />
              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-koklo-ink/30" @click="showConfirm = !showConfirm">
                <Icon :name="showConfirm ? 'eyeSlash' : 'eye'" :size="14" />
              </button>
            </div>
            <p v-if="confirm && confirm !== password" class="mt-1 text-[10px] font-bold text-red-500">Les mots de passe ne correspondent pas.</p>
          </div>

          <p v-if="error" class="text-xs font-bold text-red-500">{{ error }}</p>
        </div>

        <button class="btn-primary mt-6 w-full disabled:opacity-40" :disabled="!canContinue" @click="submit">Créer mon compte</button>
      </div>
    </transition>
  </section>
</template>
