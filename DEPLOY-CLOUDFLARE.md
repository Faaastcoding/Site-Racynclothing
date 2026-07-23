# Déployer sur Cloudflare Pages — RACYN.

Ce site est 100 % statique : **aucun build, aucune commande**. Il suffit d'uploader les fichiers.

## Méthode 1 — Upload direct (la plus simple)

1. Va sur **[dash.cloudflare.com](https://dash.cloudflare.com)** → **Workers & Pages** → **Create** → **Pages** → **Upload assets**.
2. Donne un nom au projet (ex. `racyn`).
3. **Glisse-dépose le contenu de ce dossier** (tous les fichiers/dossiers : `index.html`, `css/`, `js/`, `assets/`, etc.).
   - ⚠️ Dépose **le contenu**, pas le dossier zippé. Si tu pars du ZIP, dézippe-le d'abord et sélectionne les fichiers à l'intérieur.
4. Clique **Deploy**. Ton site est en ligne en ~30 s sur `https://racyn.pages.dev`.

## Méthode 2 — Depuis GitHub (mises à jour automatiques)

1. **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Choisis le dépôt `Site-Racynclothing`, branche `main` (ou ta branche).
3. Build settings : **Framework preset = None**, **Build command = (vide)**, **Output directory = `/`**.
4. **Save and Deploy**. À chaque `git push`, Cloudflare redéploie tout seul.

## Nom de domaine perso

Dans le projet Pages → **Custom domains** → ajoute `racynclothing.com` (ou autre) et suis les instructions DNS.

---

## ✅ Avant / après la mise en ligne — à ne pas oublier

- **Numéro WhatsApp** : ouvre `js/data.js` et renseigne `whatsapp: "33XXXXXXXXX"` (format international, sans `+`) pour activer le bouton « Commander sur WhatsApp ». Sans numéro, la commande part en DM Instagram.
- **Pages légales** : complète les champs surlignés dans `mentions-legales.html`, `cgv.html`, `confidentialite.html` une fois le SIRET obtenu.
- **Photos / prix / produits** : tout se modifie dans `js/data.js`.

Fait main avec 🤎
