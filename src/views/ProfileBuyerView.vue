<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import AppHeader from "../components/layout/AppHeader.vue";
import ProductCard from "../components/product/ProductCard.vue";
import Icon from "../components/ui/Icon.vue";
import { assetUrl } from "../api";
import { cities } from "../constants";
import { useUiStore } from "../store/ui";
import { useAuthStore } from "../store/auth";
import { useProductsStore } from "../store/products";

const router = useRouter();
const ui = useUiStore();
const auth = useAuthStore();
const products = useProductsStore();
const tab = ref("favoris");
const confirmLogout = ref(false);
const saving = ref(false);
const avatarFile = ref(null);
const avatarPreview = ref(null);

const form = reactive({
  nom: auth.user?.nom || "",
  prenom: auth.user?.prenom || "",
  ville: auth.user?.ville || "",
});

const statusLabels = {
  en_attente: { label: "En attente", cls: "bg-koklo-orange/15 text-koklo-orange" },
  acceptee: { label: "Acceptée", cls: "bg-koklo-green-light/15 text-koklo-green" },
  refusee: { label: "Refusée", cls: "bg-red-50 text-red-500" },
};

onMounted(async () => {
  await Promise.all([products.fetchFavorites(), products.fetchMyContacts()]);
});

const onAvatarChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  avatarFile.value = file;
  avatarPreview.value = URL.createObjectURL(file);
};

const saveProfile = async () => {
  saving.value = true;
  try {
    await auth.updateProfile(form, avatarFile.value);
    ui.notify("Profil mis à jour !", "success");
    avatarFile.value = null;
  } catch (e) {
    ui.notify(e.message, "error");
  } finally {
    saving.value = false;
  }
};

const doLogout = async () => {
  await auth.logout();
  router.push({ name: "landing" });
};

const openWhatsapp = (whatsapp, sellerName) => {
  const message = `Bonjour ${sellerName}, je vous recontacte suite à notre échange sur KokloMarket.`;
  window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, "_blank");
};

const fmt = (n) => n.toLocaleString("fr-FR");
</script>

<template>
  <section class="screen">
    <AppHeader title="Mon profil" />

    <div class="card mx-4 mt-3 flex items-center gap-3 p-4">
      <img v-if="auth.user?.avatar" :src="assetUrl(auth.user.avatar)" class="h-14 w-14 shrink-0 rounded-full object-cover" />
      <span v-else class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-koklo-green/10 text-koklo-green"><Icon name="user" :size="26" /></span>
      <div class="min-w-0 flex-1">
        <p class="flex items-center gap-1.5 text-sm font-extrabold text-koklo-ink">
          <span class="truncate">{{ auth.user?.name }}</span>
          <span class="shrink-0 rounded-full bg-koklo-green/10 px-2 py-0.5 text-[10px] font-bold capitalize text-koklo-green">{{ auth.role }}</span>
        </p>
        <p class="text-[11px] text-koklo-ink/50">{{ auth.user?.ville }}</p>
        <p class="flex items-center gap-1 text-[11px] text-koklo-ink/50"><Icon name="phone" :size="11" /> +{{ auth.user?.whatsapp }}</p>
      </div>
    </div>

    <div class="mt-4 flex gap-2 px-4">
      <button class="chip" :class="tab === 'favoris' ? 'chip-active' : ''" @click="tab = 'favoris'">Mes favoris</button>
      <button class="chip" :class="tab === 'contacts' ? 'chip-active' : ''" @click="tab = 'contacts'">Mes contacts</button>
      <button class="chip" :class="tab === 'compte' ? 'chip-active' : ''" @click="tab = 'compte'">Mon compte</button>
    </div>

    <div class="mt-3 px-4">
      <div v-if="tab === 'favoris'">
        <div v-if="products.favorites.length" class="grid grid-cols-2 gap-3">
          <ProductCard v-for="p in products.favorites" :key="p.id" :product="p" />
        </div>
        <p v-else class="mt-6 text-center text-xs text-koklo-ink/50">Aucun favori pour le moment. Appuyez sur le cœur sur un produit.</p>
      </div>

      <div v-else-if="tab === 'contacts'" class="space-y-2">
        <div v-if="!products.myContacts.length" class="mt-4 text-center text-xs text-koklo-ink/50">
          Vous n'avez contacté aucun vendeur pour l'instant.
        </div>
        <div v-for="c in products.myContacts" :key="c.contactId" class="card flex items-center gap-3 p-3">
          <button class="flex min-w-0 flex-1 items-center gap-3 text-left" @click="openWhatsapp(c.sellerWhatsapp, c.sellerName)">
            <img v-if="c.image" :src="assetUrl(c.image)" class="h-12 w-12 shrink-0 rounded-xl object-cover" />
            <span v-else class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-koklo-green/10 text-koklo-green"><Icon name="bird" :size="20" /></span>
            <div class="min-w-0 flex-1">
              <p class="truncate text-xs font-bold text-koklo-ink">{{ c.productName }}</p>
              <p class="truncate text-[11px] text-koklo-ink/50">Vendeur : {{ c.sellerName }}</p>
              <p class="text-[11px] font-bold text-koklo-green">{{ fmt(c.price) }} FCFA</p>
            </div>
          </button>
          <span class="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold" :class="statusLabels[c.status]?.cls">{{ statusLabels[c.status]?.label }}</span>
        </div>
      </div>

      <form v-else class="space-y-3" @submit.prevent="saveProfile">
        <label class="mx-auto flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-koklo-ink/15 bg-koklo-gray">
          <img v-if="avatarPreview || auth.user?.avatar" :src="avatarPreview || assetUrl(auth.user.avatar)" class="h-full w-full object-cover" />
          <Icon v-else name="camera" :size="22" class="text-koklo-ink/40" />
          <input type="file" accept="image/png, image/jpeg, image/webp" class="hidden" @change="onAvatarChange" />
        </label>
        <p class="text-center text-[11px] text-koklo-ink/40">Touchez la photo pour la modifier</p>

        <input v-model="form.nom" class="input-field" placeholder="Nom" />
        <input v-model="form.prenom" class="input-field" placeholder="Prénoms" />
        <select v-model="form.ville" class="input-field" aria-label="Ville">
          <option value="" disabled>Ville</option>
          <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
        </select>

        <button type="submit" class="btn-primary w-full disabled:opacity-50" :disabled="saving">
          {{ saving ? "Enregistrement..." : "Enregistrer" }}
        </button>
      </form>
    </div>

    <div class="mx-4 mb-6 mt-8">
      <button
        v-if="!confirmLogout"
        class="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 py-3 text-center text-sm font-bold text-red-500 transition active:scale-95"
        @click="confirmLogout = true"
      >
        <Icon name="logout" :size="16" /> Se déconnecter
      </button>
      <div v-else class="animate-pop-in rounded-2xl border border-red-100 bg-red-50 p-3 text-center">
        <p class="text-xs font-bold text-red-600">Confirmer la déconnexion ?</p>
        <div class="mt-2 flex gap-2">
          <button class="flex-1 rounded-full border border-red-200 py-2 text-xs font-bold text-red-500" @click="confirmLogout = false">Annuler</button>
          <button class="flex-1 rounded-full bg-red-500 py-2 text-xs font-bold text-white" @click="doLogout">Déconnexion</button>
        </div>
      </div>
    </div>
  </section>
</template>
