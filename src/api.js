// Client API centralisé : toutes les requêtes vers le backend PHP passent par ici.
// En développement, le backend tourne sur un port différent (voir README) : on utilise
// donc `credentials: "include"` partout pour que le cookie de session PHP soit envoyé.

const BASE_URL = import.meta.env.VITE_API_URL || "https://beatrice.alwaysdata.net";

async function handle(res) {
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok) {
    const message = data?.error || "Une erreur est survenue.";
    throw new Error(message);
  }
  return data;
}

export async function apiGet(path) {
  const res = await fetch(BASE_URL + path, { credentials: "include" });
  return handle(res);
}

export async function apiPost(path, body) {
  const res = await fetch(BASE_URL + path, {
    method: "POST",
    credentials: "include",
    // "text/plain" est un content-type "simple" au sens CORS : ça évite la requête
    // OPTIONS de préflight, que certains hébergeurs mutualisés gèrent mal (les
    // en-têtes CORS personnalisés n'atteignent alors jamais le script PHP).
    // Le backend lit le corps brut avec file_get_contents("php://input") et le
    // décode en JSON quel que soit le Content-Type déclaré ici.
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: JSON.stringify(body || {}),
  });
  return handle(res);
}

// Pour l'upload de photo produit (multipart/form-data) : ne PAS fixer Content-Type,
// le navigateur ajoute automatiquement la boundary correcte.
export async function apiPostForm(path, formData) {
  const res = await fetch(BASE_URL + path, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  return handle(res);
}

export function assetUrl(path) {
  if (!path) return null;
  return path.startsWith("http") ? path : BASE_URL + path;
}
