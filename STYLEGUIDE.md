# 🎨 Guide de style — KokloMarket

Design system de référence pour toute évolution future de l'application.

## Couleurs

| Token Tailwind | Hex | Usage |
|---|---|---|
| `koklo-green` | `#1B6B3A` | Couleur primaire — boutons de confirmation, header vendeur, éléments de confiance |
| `koklo-green-light` | `#4CAF50` | Accents secondaires, états "disponible" |
| `koklo-orange` | `#F9A826` | Actions principales (CTA), badges promo, pulsations |
| `koklo-yellow` | `#FFD54F` | Accents décoratifs, surlignage discret |
| `koklo-cream` | `#FDF9F0` | Fond général de l'application |
| `koklo-gray` | `#F5F2EB` | Surfaces secondaires (inputs, steppers) |
| `koklo-ink` | `#2D2A24` | Texte principal, fonds sombres (footer, hero) |

**Règle d'or** : orange = action principale (« je fais quelque chose de nouveau »), vert = confirmation / validation / statut positif.

## Typographie

- **Titres** : Plus Jakarta Sans, 700–800.
- **Texte courant** : Nunito Sans, 400–700.
- Échelle : `text-[11px]` (métadonnées) → `text-sm` (corps) → `text-lg`/`text-2xl` (titres d'écran) → `text-[2.15rem]` (hero landing).

## Composants

- **Boutons** : toujours `rounded-full`, feedback tactile `active:scale-95`.
  - `.btn-primary` (orange) — action principale / conversion.
  - `.btn-secondary` (vert) — action de confirmation.
  - `.btn-outline` — action secondaire, contour vert.
- **Cartes** (`.card`) : fond blanc, coins arrondis `rounded-xl2` (1.25rem), ombre douce `shadow-card`, `hover:shadow-card-hover` avec légère élévation.
- **Chips/filtres** (`.chip`) : pilule, état actif en vert plein.
- **Badges de disponibilité** : voir `AvailabilityBadge.vue` — 🟢 disponible / 🟡 stock limité / 🔴 rupture, décliné aussi pour le statut vendeur (🟢/🟠/🔴).
- **Icônes** : système vectoriel maison (`components/ui/Icon.vue`), style *outlined*, 2px de trait, cohérent sur toute l'application — plus aucun émoji dans la navigation, les headers ou les actions (les émojis subsistent uniquement comme visuels de produits en attendant les photos IA, et dans quelques messages de célébration ponctuels).

## Animations

- Transition d'écran : glissement horizontal (`.slide-*`) pour les écrans "poussés" (fiche produit, commande, suivi), fondu pour la navigation par onglets.
- Cartes produits : légère élévation + ombre accentuée au survol (`hover:-translate-y-1 hover:shadow-card-hover`, 0.3s).
- Apparition progressive (stagger) des grilles de produits via `animation-delay` incrémental.
- Compteurs animés (`CountUp.vue`) pour toutes les statistiques chiffrées.
- Notifications toast : glissement depuis la droite, empilables, auto-dismiss après 3,2s.
- Modals : fondu + léger zoom (`animate-pop-in` / `animate-slide-up` selon le contexte).
- Statut de commande actif : pastille orange pulsante (`animate-pulse-ring`).
- Chargement : spinner circulaire autour du logo KokloMarket (`LoadingSpinner.vue`).

## Appellations (copywriting produit)

| Ancien texte | Nouveau texte |
|---|---|
| Explorer le marché | Trouver des produits près de chez moi |
| Devenir vendeur | Vendre mes produits sur KokloMarket |
| Ajouter au panier | Commander |
| Passer la commande | Confirmer et payer |
| En savoir plus | Voir les détails du produit |
| — | Rejoindre KokloMarket (CTA principal de la landing, orange pulsant) |

## Logo

- Fichier officiel fourni par le client, retravaillé en **transparence** (`src/assets/logo.png`) pour s'intégrer sur fond crème comme sur fond sombre.
- Variante monochrome blanche (`src/assets/logo-white.png`) pour la page de garde (hero sombre) et tout fond à forte saturation.
