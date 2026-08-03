# 🐔 KokloMarket — Frontend

Le marché numérique des produits avicoles locaux du Bénin.
**Achetez local, mangez meilleur.**

Vue.js 3 (Composition API) + Vue Router + Pinia + Tailwind CSS.

---

## 📁 Ce dossier EST le déploiement Netlify

Tout ce dont Netlify a besoin (`package.json`, `index.html`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `netlify.toml`, `src/`, `public/`) vit **exclusivement dans ce dossier `frontend/`**. Rien d'important ne doit exister en dehors, dans le dossier parent du dépôt Git — s'il y a un doublon là-bas, c'est un résidu à supprimer, pas une version à jour.

Sur Netlify, dans **Site settings → Build & deploy → Base directory**, indique bien `frontend` si le dépôt Git contient aussi d'autres dossiers au même niveau.

## 🔌 Connexion au backend (AlwaysData)

Le frontend appelle le backend PHP via la variable d'environnement `VITE_API_URL`. **C'est la cause la plus fréquente de bugs qui semblent aléatoires** (connexion qui ne prend pas, rôle qui ne change pas, "Non authentifié" partout) : si cette variable n'est pas définie sur Netlify, le code retombe sur une valeur par défaut codée en dur — qui doit pointer vers ton vrai domaine AlwaysData.

**À vérifier sur Netlify → Site settings → Environment variables :**
```
VITE_API_URL=https://beatrice.alwaysdata.net
```
(remplace par ton domaine AlwaysData exact s'il diffère). Après avoir défini ou modifié cette variable, il faut **redéployer** (Trigger deploy) — une variable Vite est figée dans le build au moment de la compilation, la changer seule sans redéployer ne fait rien.

---

## 🚀 Développement local

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # → dossier dist/
npm run preview   # prévisualiser le build de production
```

## 🧪 Comptes de démonstration

| Rôle | Numéro à saisir | Mot de passe |
|---|---|---|
| Vendeur | `0163616901` | `demo1234` |
| Acheteur | `0146995599` | `demo4321` |

Aucun bouton de raccourci démo n'est affiché sur l'écran de connexion : ces identifiants se saisissent manuellement, comme un compte normal (le `+229` est ajouté automatiquement par le serveur).

---

## 🎨 Identité visuelle

| Rôle | Couleur | Hex |
|---|---|---|
| Vert profond (primaire) | 🟩 | `#1B6B3A` |
| Vert clair (secondaire) | 🟩 | `#4CAF50` |
| Orange dynamique (CTA) | 🟧 | `#F9A826` |
| Jaune doux (accent) | 🟨 | `#FFD54F` |
| Beige crème (fond) | ⬜ | `#FDF9F0` |
| Noir/brun (texte) | ⬛ | `#2D2A24` |

Polices : Plus Jakarta Sans (titres), Nunito Sans (texte). Détails complets dans `STYLEGUIDE.md`.

## 🗂️ Structure

```
frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── netlify.toml
├── .env.example
├── public/
└── src/
    ├── assets/
    ├── components/{layout,product,ui}/
    ├── store/            # Pinia : auth, products, ui
    ├── views/{auth/}
    ├── constants.js       # catégories, villes, unités — référentiels fermés
    ├── api.js             # client API (voir section ci-dessus sur VITE_API_URL)
    └── router/index.js    # routes + garde de navigation par rôle
```

## 🔒 Notes techniques

- **Ville en liste fermée.** Tous les champs "Ville" utilisent la même liste (`constants.js`) pour rester compatibles avec le filtre exact-match du marché côté serveur.
- **Cookies cross-domaine.** Frontend (Netlify) et backend (AlwaysData) sont sur deux domaines différents : la session PHP utilise `SameSite=None; Secure`, indispensable pour que l'authentification survive au rechargement de page — voir `backend/config.php`.
- **Landing en première impression.** `/` redirige vers `/landing` pour tout visiteur non connecté, et vers le tableau de bord (`/profil/vendeur` ou accueil) pour un utilisateur déjà connecté.

## 🛣️ Pistes pour la suite

- Édition complète d'une annonce déjà publiée (aujourd'hui : prix, quantité, disponibilité seulement).
- Mot de passe oublié.
- Intégration réelle Mobile Money.
