import { defineStore } from "pinia";

let toastId = 0;

// Store UI minimal pour le MVP : uniquement les notifications toast éphémères
// (retour d'action immédiat). Les favoris et contacts vivent désormais côté
// backend réel (voir store/products.js).
export const useUiStore = defineStore("ui", {
  state: () => ({
    toasts: [],
  }),
  actions: {
    notify(message, tone = "success") {
      const id = ++toastId;
      this.toasts.push({ id, message, tone });
      setTimeout(() => this.dismiss(id), 3200);
    },
    dismiss(id) {
      this.toasts = this.toasts.filter((t) => t.id !== id);
    },
  },
});
