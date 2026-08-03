<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppHeader from "../components/layout/AppHeader.vue";
import ProductThumb from "../components/product/ProductThumb.vue";
import AvailabilityBadge from "../components/product/AvailabilityBadge.vue";
import Icon from "../components/ui/Icon.vue";
import { assetUrl } from "../api";
import { useAuthStore } from "../store/auth";
import { useProductsStore } from "../store/products";
import { useUiStore } from "../store/ui";

const route    = useRoute();
const router   = useRouter();
const auth     = useAuthStore();
const products = useProductsStore();
const ui       = useUiStore();

const product    = ref(null);
const loading    = ref(true);
const contacting = ref(false);

onMounted(async () => {
  try {
    product.value = await products.fetchProduct(route.params.id);
    if (auth.isAuthenticated && auth.role === "acheteur") {
      await products.fetchFavorites();
    }
  } catch (e) {
    ui.notify(e.message, "error");
  } finally {
    loading.value = false;
  }
});

const fmt = (n) => n.toLocaleString("fr-FR");

const toggleFav = async () => {
  if (!auth.isAuthenticated) {
    ui.notify("Connectez-vous pour sauvegarder ce produit", "info");
    setTimeout(() => router.push({ name: "auth" }), 900);
    return;
  }
  await products.toggleFavorite(product.value.id);
};

/**
 * Contacter le vendeur via WhatsApp.
 *
 * - Si l'utilisateur EST connecté : appel API /contact.php qui enregistre
 *   la mise en relation et retourne le lien WhatsApp du vendeur réel.
 * - Si l'utilisateur N'EST PAS connecté : on redirige quand même vers
 *   WhatsApp avec un message pré-rempli (aucun "Non authentifié" affiché),
 *   puis on propose de se connecter.
 */
const contactSeller = async () => {
  if (!auth.isAuthenticated) {
    // Redirection directe vers WhatsApp sans login obligatoire
    // pour ne jamais bloquer l'utilisateur sur la page démo.
    if (product.value?.sellerWhatsapp) {
      const msg  = `Bonjour, je suis intéressé(e) par votre annonce "${product.value.name}" sur KokloMarket (${fmt(product.value.price)} FCFA). Est-elle toujours disponible ?`;
      const link = `https://wa.me/${product.value.sellerWhatsapp}?text=${encodeURIComponent(msg)}`;
      ui.notify("Ouverture de WhatsApp...", "success");
      window.open(link, "_blank");
    }
    return;
  }

  contacting.value = true;
  try {
    const link = await products.contactSeller(product.value.id);
    ui.notify("Ouverture de WhatsApp...", "success");
    window.open(link, "_blank");
  } catch (e) {
    ui.notify(e.message, "error");
  } finally {
    contacting.value = false;
  }
};
</script>

<template>
  <section class="screen">
    <AppHeader :show-back="true" />

    <!-- Chargement -->
    <div v-if="loading" class="flex flex-1 items-center justify-center py-24">
      <span class="h-8 w-8 animate-spin rounded-full border-[3px] border-koklo-green/20 border-t-koklo-green"></span>
    </div>

    <template v-else-if="product">
      <!-- Image produit -->
      <div class="relative aspect-square w-full shrink-0">
        <ProductThumb
          :image="product.image"
          :category="product.category"
          rounded="rounded-none"
          :size="64"
        />
        <div class="absolute left-3 top-3 flex gap-1.5">
          <AvailabilityBadge :status="product.availability" />
          <span
            v-if="product.negotiable"
            class="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-koklo-ink shadow"
          >Négociable</span>
        </div>
        <button
          class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow transition active:scale-90"
          @click="toggleFav"
          aria-label="Ajouter aux favoris"
        >
          <Icon
            name="heart"
            :size="16"
            :solid="products.favoriteIds.has(product.id)"
            :class="products.favoriteIds.has(product.id) ? 'text-red-500' : 'text-koklo-ink/40'"
          />
        </button>
      </div>

      <!-- Détails -->
      <div class="px-4 pt-4 pb-36">
        <h1 class="font-display text-xl font-extrabold text-koklo-ink">{{ product.name }}</h1>
        <p class="mt-2 font-display text-2xl font-extrabold text-koklo-green">
          {{ fmt(product.price) }} FCFA
          <span class="text-sm font-semibold text-koklo-ink/40">/{{ product.unit }}</span>
        </p>
        <p class="mt-0.5 flex items-center gap-1 text-xs text-koklo-ink/50">
          <Icon name="pin" :size="13" /> {{ product.city || product.sellerCity || "Bénin" }}
        </p>

        <!-- Description -->
        <div v-if="product.description" class="mt-4">
          <p class="mb-1 text-xs font-bold text-koklo-ink">À propos du produit</p>
          <p class="text-sm leading-relaxed text-koklo-ink/70">{{ product.description }}</p>
        </div>

        <!-- Infos rapides -->
        <div class="mt-4 grid grid-cols-2 gap-2">
          <div class="card px-3 py-2.5">
            <p class="text-[10px] font-bold uppercase text-koklo-ink/40">Quantité disponible</p>
            <p class="text-sm font-bold text-koklo-ink">{{ product.quantity }} {{ product.unit }}</p>
          </div>
          <div class="card px-3 py-2.5">
            <p class="text-[10px] font-bold uppercase text-koklo-ink/40">Catégorie</p>
            <p class="text-sm font-bold capitalize text-koklo-ink">{{ product.category }}</p>
          </div>
        </div>

        <!-- Vendeur -->
        <div class="card mt-4 p-3">
          <div class="flex items-center gap-3">
            <img
              v-if="product.sellerAvatar"
              :src="assetUrl(product.sellerAvatar)"
              class="h-11 w-11 shrink-0 rounded-full object-cover"
              alt="Photo vendeur"
            />
            <span v-else class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-koklo-green/10 text-koklo-green">
              <Icon name="user" :size="19" />
            </span>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-bold text-koklo-ink">
                {{ product.sellerCompanyName || product.sellerName }}
              </p>
              <p v-if="product.sellerCompanyName" class="truncate text-[11px] text-koklo-ink/50">
                {{ product.sellerName }} · {{ product.sellerCity || product.city }}
              </p>
              <p v-else class="text-[11px] text-koklo-ink/50">{{ product.sellerCity || product.city }}</p>
            </div>
          </div>
          <p v-if="product.sellerCompanyBio" class="mt-2 text-xs leading-relaxed text-koklo-ink/60">
            {{ product.sellerCompanyBio }}
          </p>
        </div>

        <!-- Paiement (informatif) -->
        <div class="card mt-4 p-3">
          <p class="mb-2 text-xs font-bold text-koklo-ink">Moyens de paiement (bientôt disponibles)</p>
          <div class="flex flex-wrap gap-2">
            <span class="flex items-center gap-1.5 rounded-xl bg-koklo-gray px-3 py-2 text-[11px] font-bold text-koklo-ink/50">
              <Icon name="wallet" :size="13" /> MTN Mobile Money
            </span>
            <span class="flex items-center gap-1.5 rounded-xl bg-koklo-gray px-3 py-2 text-[11px] font-bold text-koklo-ink/50">
              <Icon name="wallet" :size="13" /> Moov Money
            </span>
          </div>
          <p class="mt-2 text-[11px] text-koklo-ink/40">
            Pour l'instant, finalisez votre achat directement avec le vendeur via WhatsApp.
          </p>
        </div>
      </div>

      <!-- Bouton WhatsApp (sticky) -->
      <div class="fixed bottom-0 left-0 right-0 z-40 border-t border-koklo-ink/5 bg-white/95 px-4 py-3 backdrop-blur">
        <button
          class="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3.5 text-sm font-extrabold text-white shadow-lg transition active:scale-95 disabled:opacity-60"
          :disabled="contacting"
          @click="contactSeller"
        >
          <span v-if="contacting" class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          {{ contacting ? "Ouverture de WhatsApp..." : "Contacter le vendeur sur WhatsApp" }}
        </button>
        <p v-if="!auth.isAuthenticated" class="mt-1.5 text-center text-[11px] text-koklo-ink/40">
          <button class="font-bold text-koklo-green underline" @click="router.push({ name: 'auth' })">Connectez-vous</button>
          pour enregistrer cette mise en relation
        </p>
      </div>
    </template>

    <!-- Produit introuvable -->
    <div v-else class="flex flex-col items-center justify-center py-24 px-8 text-center">
      <Icon name="search" :size="36" class="text-koklo-ink/20" />
      <p class="mt-3 text-sm font-bold text-koklo-ink">Produit introuvable</p>
      <button class="btn-primary mt-4" @click="router.push({ name: 'market' })">Retour au marché</button>
    </div>
  </section>
</template>
