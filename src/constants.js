// Catégories et villes : simple référentiel statique utilisé pour les formulaires et
// les filtres. Ce ne sont pas des données utilisateur — les produits, eux, viennent
// entièrement de la base de données via l'API.

export const categories = [
  { id: "vivantes", label: "Volailles vivantes", icon: "bird" },
  { id: "oeufs", label: "Œufs", icon: "egg" },
  { id: "poussins", label: "Poussins", icon: "bird" },
  { id: "chair", label: "Poulets de chair", icon: "drumstick" },
  { id: "pintades", label: "Pintades", icon: "bird" },
  { id: "canards", label: "Canards & dindes", icon: "bird" },
];

export const cities = ["Cotonou", "Calavi", "Ouidah", "Parakou", "Porto-Novo", "Abomey-Calavi"];

export const units = ["pièce", "plateau de 30", "plateau de 24", "kg", "lot"];
