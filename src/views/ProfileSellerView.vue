<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import AppHeader from "../components/layout/AppHeader.vue";
import ProductThumb from "../components/product/ProductThumb.vue";
import AvailabilityBadge from "../components/product/AvailabilityBadge.vue";
import Icon from "../components/ui/Icon.vue";
import CountUp from "../components/ui/CountUp.vue";
import { categories, units, cities } from "../constants";
import { assetUrl } from "../api";
import { useUiStore } from "../store/ui";
import { useAuthStore } from "../store/auth";
import { useProductsStore } from "../store/products";

const router = useRouter();
const ui = useUiStore();
const auth = useAuthStore();
const products = useProductsStore();

const tab = ref("produits");
const showForm = ref(false);
const saving = ref(false);
const savingProfile = ref(false);
const confirmLogout = ref(false);
const imageFile = ref(null);
const imagePreview = ref(null);
const avatarFile = ref(null);
const avatarPreview = ref(null);

const form = reactive({
  name: "",
  category: "vivantes",
  price: "",
  unit: "pièce",
  negotiable: false,
  description: "",
  city: auth.user?.ville || "",
  quantity: 1,
  availability: "disponible",
});

const profileForm = reactive({
  nom: auth.user?.nom || "",
  prenom: auth.user?.prenom || "",
  ville: auth.user?.ville || "",
  companyName: auth.user?.companyName || "",
  companyBio: auth.user?.companyBio || "",
});

const pendingCount = computed(() => products.receivedContacts.filter((c) => c.status === "en_attente").length);
const acceptedCount = computed(() => products.receivedContacts.filter((c) => c.status === "acceptee").length);

const statusLabels = {
  en_attente: { label: "En attente", cls: "bg-koklo-orange/15 text-koklo-orange" },
  acceptee: { label: "Acceptée", cls: "bg-koklo-green-light/15 text-koklo-green" },
  refusee: { label: "Refusée", cls: "bg-red-50 text-red-500" },
};

onMounted(async () => {
  await Promise.all([products.fetchMyProducts(), products.fetchReceivedContacts()]);
});

const onImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  imageFile.value = file;
  imagePreview.value = URL.createObjectURL(file);
};

const onAvatarChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  avatarFile.value = file;
  avatarPreview.value = URL.createObjectURL(file);
};

const resetForm = () => {
  form.name = "";
  form.category = "vivantes";
  form.price = "";
  form.unit = "pièce";
  form.negotiable = false;
  form.description = "";
  form.city = auth.user?.ville || "";
  form.quantity = 1;
  form.availability = "disponible";
  imageFile.value = null;
  imagePreview.value = null;
};

const submitProduct = async () => {
  if (!form.name.trim() || !form.price) {
    ui.notify("Le nom et le prix sont obligatoires", "error");
    return;
  }
  saving.value = true;
  try {
    await products.createProduct(
      { ...form, negotiable: form.negotiable ? "true" : "false" },
      imageFile.value
    );
    ui.notify("Produit publié !", "success");
    resetForm();
    showForm.value = false;
  } catch (e) {
    ui.notify(e.message, "error");
  } finally {
    saving.value = false;
  }
};

const saveProfile = async () => {
  savingProfile.value = true;
  try {
    await auth.updateProfile(profileForm, avatarFile.value);
    ui.notify("Profil mis à jour !", "success");
    avatarFile.value = null;
  } catch (e) {
    ui.notify(e.message, "error");
  } finally {
    savingProfile.value = false;
  }
};

const removeProduct = async (id) => {
  try {
    await products.deleteProduct(id);
    ui.notify("Produit supprimé");
  } catch (e) {
    ui.notify(e.message, "error");
  }
};

const cycleAvailability = async (p) => {
  const order = ["disponible", "stock-limite", "rupture"];
  const next = order[(order.indexOf(p.availability) + 1) % order.length];
  await products.updateProduct(p.id, { availability: next, quantity: p.quantity, price: p.price });
  p.availability = next;
};

const respondToRequest = async (contactId, status) => {
  try {
    await products.updateContactStatus(contactId, status);
    ui.notify(status === "acceptee" ? "Demande acceptée" : "Demande refusée");
  } catch (e) {
    ui.notify(e.message, "error");
  }
};

const openWhatsapp = (whatsapp, buyerName, productName) => {
  const message = `Bonjour ${buyerName}, merci pour votre intérêt pour "${productName}" sur KokloMarket.`;
  window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, "_blank");
};

const doLogout = async () => {
  await auth.logout();
  router.push({ name: "landing" });
};

const fmt = (n) => n.toLocaleString("fr-FR");
</script>

<template>
  <section class="screen">
    <AppHeader title="Tableau de bord" />

    <div class="card mx-4 mt-3 p-4">
      <div class="flex items-center gap-3">
        <img v-if="auth.user?.avatar" :src="assetUrl(auth.user.avatar)" class="h-14 w-14 shrink-0 rounded-2xl object-cover" />
        <span v-else class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-koklo-green/10 text-koklo-green"><Icon name="store" :size="24" /></span>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-extrabold text-koklo-ink">{{ auth.user?.companyName || auth.user?.name }}</p>
          <p v-if="auth.user?.companyName" class="truncate text-[11px] text-koklo-ink/50">{{ auth.user?.name }}</p>
          <p class="flex items-center gap-1 text-[11px] text-koklo-ink/50"><Icon name="pin" :size="11" />{{ auth.user?.ville }}</p>
        </div>
      </div>

      <!-- Vue d'ensemble de l'activité -->
      <div class="mt-3 grid grid-cols-3 gap-2 border-t border-koklo-ink/5 pt-3">
        <div class="text-center">
          <p class="text-base font-extrabold text-koklo-ink"><CountUp :value="products.myProducts.length" /></p>
          <p class="text-[10px] font-semibold text-koklo-ink/40">produits</p>
        </div>
        <div class="text-center">
          <p class="text-base font-extrabold text-koklo-orange"><CountUp :value="pendingCount" /></p>
          <p class="text-[10px] font-semibold text-koklo-ink/40">en attente</p>
        </div>
        <div class="text-center">
          <p class="text-base font-extrabold text-koklo-green"><CountUp :value="acceptedCount" /></p>
          <p class="text-[10px] font-semibold text-koklo-ink/40">acceptées</p>
        </div>
      </div>
    </div>

    <div class="mt-4 flex gap-2 overflow-x-auto px-4 no-scrollbar">
      <button class="chip" :class="tab === 'produits' ? 'chip-active' : ''" @click="tab = 'produits'">Mes produits</button>
      <button class="chip" :class="tab === 'demandes' ? 'chip-active' : ''" @click="tab = 'demandes'">
        Demandes reçues
        <span v-if="pendingCount" class="ml-0.5 rounded-full bg-koklo-orange px-1.5 text-white">{{ pendingCount }}</span>
      </button>
      <button class="chip" :class="tab === 'compte' ? 'chip-active' : ''" @click="tab = 'compte'">Mon entreprise</button>
    </div>

    <!-- Mes produits -->
    <div v-if="tab === 'produits'" class="mt-3 space-y-2.5 px-4">
      <button class="btn-primary w-full !gap-1.5" @click="showForm = !showForm">
        <Icon name="plus" :size="13" /> {{ showForm ? "Fermer le formulaire" : "Ajouter un produit" }}
      </button>

      <form v-if="showForm" class="card animate-slide-up space-y-3 p-4" @submit.prevent="submitProduct">
        <div>
          <label class="mb-1 block text-xs font-bold text-koklo-ink">Photo du produit</label>
          <label class="flex h-32 w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-koklo-ink/15 bg-koklo-gray">
            <img v-if="imagePreview" :src="imagePreview" class="h-full w-full object-cover" />
            <span v-else class="flex flex-col items-center gap-1 text-koklo-ink/40">
              <Icon name="camera" :size="22" />
              <span class="text-[11px] font-semibold">Ajouter une photo réelle</span>
            </span>
            <input type="file" accept="image/png, image/jpeg, image/webp" class="hidden" @change="onImageChange" />
          </label>
        </div>

        <input v-model="form.name" class="input-field" placeholder="Nom du produit (ex: Poulet de chair)" required />

        <select v-model="form.category" class="input-field">
          <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.label }}</option>
        </select>

        <div class="flex gap-2">
          <input v-model.number="form.price" type="number" min="1" class="input-field" placeholder="Prix (FCFA)" required />
          <select v-model="form.unit" class="input-field !w-32">
            <option v-for="u in units" :key="u" :value="u">{{ u }}</option>
          </select>
        </div>

        <div class="flex gap-2">
          <input v-model.number="form.quantity" type="number" min="1" class="input-field" placeholder="Quantité disponible" />
          <select v-model="form.city" class="input-field" aria-label="Ville">
            <option value="" disabled>Ville</option>
            <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>

        <textarea v-model="form.description" rows="3" class="input-field resize-none" placeholder="Décrivez votre produit..."></textarea>

        <label class="flex items-center gap-2 text-xs font-semibold text-koklo-ink/70">
          <input v-model="form.negotiable" type="checkbox" class="h-4 w-4 accent-koklo-green" />
          Prix négociable
        </label>

        <button type="submit" class="btn-primary w-full disabled:opacity-50" :disabled="saving">
          {{ saving ? "Publication..." : "Publier l'annonce" }}
        </button>
      </form>

      <div v-if="!products.myProducts.length && !showForm" class="mt-6 rounded-xl2 border border-dashed border-koklo-ink/15 p-6 text-center">
        <Icon name="store" :size="26" class="mx-auto text-koklo-ink/20" />
        <p class="mt-2 text-xs font-semibold text-koklo-ink/50">Vous n'avez encore publié aucun produit.</p>
      </div>

      <div v-for="p in products.myProducts" :key="p.id" class="card flex gap-3 p-3">
        <div class="h-16 w-16 shrink-0 overflow-hidden rounded-xl"><ProductThumb :image="p.image" :category="p.category" :size="24" /></div>
        <div class="min-w-0 flex-1">
          <p class="line-clamp-1 text-xs font-bold text-koklo-ink">{{ p.name }}</p>
          <p class="text-xs font-extrabold text-koklo-green">{{ fmt(p.price) }} FCFA</p>
          <button @click="cycleAvailability(p)">
            <AvailabilityBadge :status="p.availability" />
          </button>
        </div>
        <button class="shrink-0 self-start text-koklo-ink/30 transition hover:text-red-500" @click="removeProduct(p.id)">
          <Icon name="trash" :size="15" />
        </button>
      </div>
    </div>

    <!-- Demandes reçues -->
    <div v-else-if="tab === 'demandes'" class="mt-3 space-y-2.5 px-4">
      <div v-if="!products.receivedContacts.length" class="mt-6 rounded-xl2 border border-dashed border-koklo-ink/15 p-6 text-center">
        <Icon name="message" :size="26" class="mx-auto text-koklo-ink/20" />
        <p class="mt-2 text-xs font-semibold text-koklo-ink/50">Aucune demande reçue pour l'instant.</p>
      </div>
      <div v-for="c in products.receivedContacts" :key="c.contactId" class="card p-3">
        <button class="flex w-full items-center gap-3 text-left" @click="openWhatsapp(c.buyerWhatsapp, c.buyerName, c.productName)">
          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-koklo-green/10 text-koklo-green"><Icon name="user" :size="18" /></span>
          <div class="min-w-0 flex-1">
            <p class="truncate text-xs font-bold text-koklo-ink">{{ c.buyerName }}</p>
            <p class="truncate text-[11px] text-koklo-ink/50">Intéressé(e) par : {{ c.productName }}</p>
          </div>
          <Icon name="message" :size="16" class="shrink-0 text-koklo-green" />
        </button>
        <div class="mt-2 flex items-center gap-2">
          <template v-if="c.status === 'en_attente'">
            <button class="flex-1 rounded-full border-2 border-red-200 py-1.5 text-xs font-bold text-red-500" @click="respondToRequest(c.contactId, 'refusee')">Refuser</button>
            <button class="flex-1 rounded-full bg-koklo-green py-1.5 text-xs font-bold text-white" @click="respondToRequest(c.contactId, 'acceptee')">Accepter</button>
          </template>
          <span v-else class="rounded-full px-2.5 py-1 text-[11px] font-bold" :class="statusLabels[c.status]?.cls">{{ statusLabels[c.status]?.label }}</span>
        </div>
      </div>
    </div>

    <!-- Mon entreprise -->
    <form v-else class="mt-3 space-y-3 px-4" @submit.prevent="saveProfile">
      <label class="mx-auto flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-koklo-ink/15 bg-koklo-gray">
        <img v-if="avatarPreview || auth.user?.avatar" :src="avatarPreview || assetUrl(auth.user.avatar)" class="h-full w-full object-cover" />
        <Icon v-else name="camera" :size="22" class="text-koklo-ink/40" />
        <input type="file" accept="image/png, image/jpeg, image/webp" class="hidden" @change="onAvatarChange" />
      </label>
      <p class="text-center text-[11px] text-koklo-ink/40">Photo de vous ou de votre entreprise</p>

      <div class="grid grid-cols-2 gap-2">
        <input v-model="profileForm.nom" class="input-field" placeholder="Nom" />
        <input v-model="profileForm.prenom" class="input-field" placeholder="Prénoms" />
      </div>
      <select v-model="profileForm.ville" class="input-field" aria-label="Ville">
        <option value="" disabled>Ville</option>
        <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
      </select>

      <div class="pt-2">
        <p class="mb-2 text-xs font-bold text-koklo-ink">Informations affichées aux acheteurs</p>
        <input v-model="profileForm.companyName" class="input-field" placeholder="Nom de l'entreprise ou de la ferme" />
        <textarea v-model="profileForm.companyBio" rows="3" class="input-field mt-2 resize-none" placeholder="Décrivez votre activité (élevage, spécialités, depuis quand...)"></textarea>
      </div>

      <button type="submit" class="btn-primary w-full disabled:opacity-50" :disabled="savingProfile">
        {{ savingProfile ? "Enregistrement..." : "Enregistrer" }}
      </button>
    </form>

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
