# RACYN. — Boutique en ligne

Boutique e-commerce bilingue (FR/EN) pour **RACYN. Clothing** — sacs au crochet faits main.
Site statique, rapide, sans dépendance ni build. Prêt à héberger partout (GitHub Pages, Netlify, Vercel, OVH…).

> *Rooted in culture. Designed for today.*

---

## ✨ Ce que contient le site

- **Accueil** (`index.html`) : hero, réassurance, produits, histoire, étapes de fabrication, avis, sur-mesure, newsletter
- **Boutique** (`boutique.html`) : catalogue complet
- **Fiche produit** (`produit.html?id=...`) : galerie, coloris, ajout au panier, produits liés
- **L'histoire** (`histoire.html`) : storytelling de la marque + valeurs
- **FAQ** (`faq.html`) : questions fréquentes en accordéon
- **Panier** : tiroir latéral (localStorage), calcul livraison, **commande envoyée en message pré-rempli WhatsApp ou DM Instagram**
- **Bilingue FR / EN** avec sélecteur de langue (mémorisé)
- 100 % responsive / mobile-first, animations au scroll, SEO de base + Open Graph

---

## 🚀 Lancer en local

Ouvrir simplement `index.html` dans un navigateur, **ou** servir le dossier :

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

## 🌍 Mettre en ligne

Pousse le dossier sur ta plateforme préférée :
- **GitHub Pages** : Settings → Pages → branche `main` (ou ta branche) → `/root`
- **Netlify / Vercel** : glisse-dépose le dossier, aucun build à configurer

---

## ⚙️ Personnalisation (important)

### 1. Tes coordonnées de commande → `js/data.js`

```js
window.RACYN_CONFIG = {
  instagram: "racynclothing",   // ton @ Instagram
  whatsapp:  "",                // ex: "33612345678" (format international SANS +). Vide = commande en DM Insta
  email:     "",                // email de secours (optionnel)
  freeShippingThreshold: 120,   // livraison offerte dès ce montant
  shippingFlat: 6               // frais de port sinon
};
```

> 💡 **Ajoute ton numéro WhatsApp** dans `whatsapp` pour activer la commande WhatsApp
> (le récap de commande part pré-rempli). Sans numéro, la commande ouvre ton DM Instagram
> et copie le récap dans le presse-papier.

### 2. Tes produits → `js/data.js` (`window.RACYN_PRODUCTS`)

Chaque produit : nom (FR/EN), prix, photos, coloris, stock, description. Ajoute/retire librement.

### 3. Tes photos → `assets/products/`

Remplace les images par les tiennes (idéalement format portrait 4:5, compressées < 300 Ko).
Puis mets à jour les chemins `image` / `images` dans `js/data.js`.

### 4. Les textes → `js/i18n.js`

Tous les textes du site (FR et EN) sont centralisés ici. Modifie ce que tu veux.

---

## 📁 Structure

```
├── index.html          Accueil
├── boutique.html       Catalogue
├── produit.html        Fiche produit (?id=)
├── histoire.html       À propos
├── faq.html            FAQ
├── css/style.css       Design system (palette, typo, composants)
├── js/
│   ├── data.js         Config marque + produits  ← à personnaliser
│   ├── i18n.js         Textes FR/EN
│   └── store.js        Panier, langue, rendu, commande
└── assets/
    ├── products/       Photos produits
    └── images/         Autres visuels
```

---

## 🎨 Direction artistique

Palette earthy (écru, espresso, sauge, terracotta), typographies serif élégante + manuscrite,
inspirée des matières et couleurs des sacs. Variables CSS modifiables en haut de `css/style.css`.

---

Fait main avec 🤎
