import { defineStore } from "pinia";
import { apiGet, apiPost, apiPostForm } from "../api";

const homeRouteByRole = {
  acheteur: "home",
  vendeur: "seller-profile",
};

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    user: null, // { id, role, nom, prenom, name, whatsapp, ville }
    checkedSession: false, // true une fois la vérification initiale de session effectuée
    draft: { role: null }, // rôle choisi à l'étape 1 de l'inscription, avant le formulaire
  }),
  getters: {
    role: (state) => state.user?.role || null,
    homeRoute: (state) => homeRouteByRole[state.user?.role] || "landing",
  },
  actions: {
    // Vérifie auprès du backend si une session est déjà active (cookie de session valide).
    async fetchSession() {
      try {
        const data = await apiGet("/api/me.php");
        this.user = data.user;
        this.isAuthenticated = !!data.user;
      } catch {
        this.user = null;
        this.isAuthenticated = false;
      } finally {
        this.checkedSession = true;
      }
    },
    async login(whatsapp, password) {
      const data = await apiPost("/api/login.php", { whatsapp, password });
      this.user = data.user;
      this.isAuthenticated = true;
    },
    async register(payload) {
      const data = await apiPost("/api/register.php", payload);
      this.user = data.user;
      this.isAuthenticated = true;
    },
    async logout() {
      try {
        await apiPost("/api/logout.php", {});
      } catch {
        // même en cas d'erreur réseau, on nettoie l'état local
      }
      this.user = null;
      this.isAuthenticated = false;
    },
    setDraftRole(role) {
      this.draft.role = role;
    },
    async updateProfile(formValues, avatarFile) {
      const fd = new FormData();
      Object.entries(formValues).forEach(([k, v]) => fd.append(k, v ?? ""));
      if (avatarFile) fd.append("avatar", avatarFile);
      const data = await apiPostForm("/api/update-profile.php", fd);
      this.user = data.user;
      return data.user;
    },
  },
});
