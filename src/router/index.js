import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../store/auth";

const routes = [
  { path: "/landing", name: "landing", component: () => import("../views/LandingView.vue"), meta: { hideChrome: true, public: true } },
  { path: "/auth", name: "auth", component: () => import("../views/auth/AuthLoginView.vue"), meta: { hideChrome: true, public: true } },
  { path: "/auth/role", name: "auth-role", component: () => import("../views/auth/AuthRoleView.vue"), meta: { hideChrome: true, public: true } },
  { path: "/auth/info", name: "auth-info", component: () => import("../views/auth/AuthInfoView.vue"), meta: { hideChrome: true, public: true } },
  { path: "/auth/welcome", name: "auth-welcome", component: () => import("../views/auth/AuthWelcomeView.vue"), meta: { hideChrome: true, public: true } },

  // Accueil, marché et fiches produits sont consultables par tout le monde, y compris
  // sans compte (le "Visiteur" peut découvrir, chercher et parcourir librement — il ne
  // peut ni publier, ni contacter un vendeur, ni mettre en favori sans être connecté,
  // ce qui est vérifié directement dans chaque écran concerné).
  { path: "/", name: "home", component: () => import("../views/HomeView.vue"), meta: { tab: "home", public: true } },
  { path: "/marche", name: "market", component: () => import("../views/MarketView.vue"), meta: { tab: "market", public: true } },
  {
    path: "/produit/:id",
    name: "product",
    component: () => import("../views/ProductDetailView.vue"),
    meta: { tab: "market", isSub: true, public: true },
  },

  { path: "/profil", name: "profile", component: () => import("../views/ProfileBuyerView.vue"), meta: { tab: "profile" } },
  {
    path: "/profil/vendeur",
    name: "seller-profile",
    component: () => import("../views/ProfileSellerView.vue"),
    meta: { tab: "seller-dashboard" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  // Première navigation : on vérifie auprès du backend si une session existe déjà
  // (cookie valide), avant de décider d'autoriser ou non l'accès.
  if (!auth.checkedSession) {
    await auth.fetchSession();
  }

  if (to.meta.public) {
    // Un utilisateur déjà connecté qui revient sur un écran d'authentification
    // repart directement vers son tableau de bord.
    if (auth.isAuthenticated && ["auth", "auth-role", "landing"].includes(to.name)) {
      return { name: auth.homeRoute };
    }

    // Page d'accueil ("/") : c'est la Landing (première impression du site) pour
    // tout visiteur non connecté. Un vendeur déjà connecté est envoyé directement
    // sur son tableau de bord ; un acheteur déjà connecté reste sur l'accueil
    // marché, qui EST son tableau de bord.
    if (to.name === "home") {
      if (!auth.isAuthenticated) return { name: "landing" };
      if (auth.role === "vendeur") return { name: "seller-profile" };
    }

    return true;
  }

  if (!auth.isAuthenticated) {
    return { name: "landing" };
  }

  // Un acheteur n'a pas accès au tableau de bord vendeur.
  if (to.name === "seller-profile" && auth.role !== "vendeur") {
    return { name: auth.homeRoute };
  }

  return true;
});

export default router;
