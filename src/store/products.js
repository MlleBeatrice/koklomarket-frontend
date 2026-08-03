import { defineStore } from "pinia";
import { apiGet, apiPost, apiPostForm } from "../api";

export const useProductsStore = defineStore("products", {
  state: () => ({
    list: [], // catalogue courant (marché, filtré côté serveur)
    myProducts: [], // annonces du vendeur connecté
    favorites: [], // produits favoris de l'acheteur connecté
    myContacts: [], // historique des contacts envoyés (acheteur)
    receivedContacts: [], // demandes reçues (vendeur)
    stats: { sellers: 0, products: 0, contacts: 0 },
    loading: false,
  }),
  getters: {
    favoriteIds: (state) => new Set(state.favorites.map((p) => p.id)),
  },
  actions: {
    async fetchProducts(filters = {}) {
      this.loading = true;
      try {
        const params = new URLSearchParams();
        if (filters.category && filters.category !== "tous") params.set("category", filters.category);
        if (filters.city) params.set("city", filters.city);
        if (filters.q) params.set("q", filters.q);
        if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
        if (filters.sort) params.set("sort", filters.sort);
        const qs = params.toString();
        const data = await apiGet("/api/products.php" + (qs ? "?" + qs : ""));
        this.list = data.products;
      } finally {
        this.loading = false;
      }
    },
    async fetchProduct(id) {
      const data = await apiGet("/api/product.php?id=" + id);
      return data.product;
    },
    async fetchMyProducts() {
      const data = await apiGet("/api/my-products.php");
      this.myProducts = data.products;
    },
    async createProduct(formValues, imageFile) {
      const fd = new FormData();
      Object.entries(formValues).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);
      const data = await apiPostForm("/api/products.php", fd);
      this.myProducts.unshift(data.product);
      return data.product;
    },
    async deleteProduct(id) {
      await apiPost("/api/delete-product.php", { id });
      this.myProducts = this.myProducts.filter((p) => p.id !== id);
    },
    async updateProduct(id, patch) {
      await apiPost("/api/update-product.php", { id, ...patch });
      const p = this.myProducts.find((p) => p.id === id);
      if (p) Object.assign(p, patch);
    },
    async fetchFavorites() {
      const data = await apiGet("/api/favorites.php");
      this.favorites = data.products;
    },
    async toggleFavorite(productId) {
      const data = await apiPost("/api/favorites.php", { productId });
      if (data.favorited) {
        await this.fetchFavorites();
      } else {
        this.favorites = this.favorites.filter((p) => p.id !== productId);
      }
      return data.favorited;
    },
    async contactSeller(productId) {
      const data = await apiPost("/api/contact.php", { productId });
      return data.whatsappLink;
    },
    async fetchMyContacts() {
      const data = await apiGet("/api/my-contacts.php");
      this.myContacts = data.contacts;
    },
    async fetchReceivedContacts() {
      const data = await apiGet("/api/received-contacts.php");
      this.receivedContacts = data.contacts;
    },
    async updateContactStatus(contactId, status) {
      await apiPost("/api/update-contact-status.php", { contactId, status });
      const c = this.receivedContacts.find((c) => c.contactId === contactId);
      if (c) c.status = status;
    },
    async fetchStats() {
      this.stats = await apiGet("/api/stats.php");
    },
  },
});
