/* ==========================================================================
   RACYN. — Données boutique (produits + configuration)
   Tout est en JS (pas de fetch) pour fonctionner même en ouverture locale.
   ========================================================================== */

/* --- CONFIGURATION MARQUE ---------------------------------------------------
   👉 À PERSONNALISER : remplace les valeurs ci-dessous par tes vraies infos.
----------------------------------------------------------------------------*/
window.RACYN_CONFIG = {
  brand: "RACYN.",
  instagram: "racynclothing",              // ton @ Instagram (sans le @)
  // Numéro WhatsApp au format international SANS "+" ni espaces (ex: "33612345678").
  // Laisse vide ("") si tu n'as pas de WhatsApp : la commande partira alors en DM Instagram.
  whatsapp: "",
  // Email de commande de secours. Laisse vide pour ne pas l'afficher publiquement.
  email: "",
  currency: "€",
  // Livraison
  shippingFrom: { fr: "France", en: "France" },
  freeShippingThreshold: 120,              // livraison offerte dès ce montant (€)
  shippingFlat: 6                          // frais de port forfaitaires (€)
};

/* --- PRODUITS ---------------------------------------------------------------
   Chaque produit peut avoir plusieurs coloris (colorways).
----------------------------------------------------------------------------*/
window.RACYN_PRODUCTS = [
  {
    id: "signature-tote",
    slug: "signature-tote",
    name: { fr: "Le Tote Signature", en: "The Signature Tote" },
    tagline: {
      fr: "Notre pièce iconique, au crochet main, portée du matin au soir.",
      en: "Our iconic hand-crocheted piece, worn from morning to night."
    },
    price: 69,
    badge: { fr: "Best-seller", en: "Best-seller" },
    image: "assets/products/bags-group.jpeg",
    images: ["assets/products/bags-group.jpeg", "assets/products/olive-bucket.jpeg", "assets/products/espresso-tote.jpeg"],
    colors: [
      { key: "ecru",     name: { fr: "Écru",     en: "Ecru" },     hex: "#E9DEC8" },
      { key: "sauge",    name: { fr: "Sauge",    en: "Sage" },     hex: "#8A9179" },
      { key: "espresso", name: { fr: "Espresso", en: "Espresso" }, hex: "#4A3728" }
    ],
    stock: 6,
    details: {
      fr: [
        "Crochet main en fil de coton recyclé (trapilho)",
        "Anses tressées renforcées + perles en bois véritable",
        "Doublure intérieure avec poche",
        "≈ 32 × 28 cm — format quotidien",
        "Pièce unique / petite série"
      ],
      en: [
        "Hand-crocheted from recycled cotton yarn (trapilho)",
        "Reinforced braided handles + real wooden beads",
        "Lined interior with pocket",
        "≈ 32 × 28 cm — everyday size",
        "One-of-a-kind / small batch"
      ]
    }
  },
  {
    id: "olive-bucket",
    slug: "sac-seau-olive",
    name: { fr: "Le Sac Seau Olive", en: "The Olive Bucket Bag" },
    tagline: {
      fr: "Volume généreux, vert profond, finitions perles ambrées.",
      en: "Generous volume, deep green, amber bead finishes."
    },
    price: 65,
    badge: { fr: "", en: "" },
    image: "assets/products/olive-bucket.jpeg",
    images: ["assets/products/olive-bucket.jpeg", "assets/products/bags-group.jpeg"],
    colors: [
      { key: "olive", name: { fr: "Olive", en: "Olive" }, hex: "#7C846B" }
    ],
    stock: 3,
    details: {
      fr: [
        "Crochet main, maille épaisse et structurée",
        "Cordon de serrage + perles en bois",
        "Grande capacité — parfait au quotidien ou à la plage",
        "≈ 30 × 30 cm",
        "Pièce unique"
      ],
      en: [
        "Hand-crocheted, thick structured stitch",
        "Drawstring closure + wooden beads",
        "Large capacity — perfect for everyday or the beach",
        "≈ 30 × 30 cm",
        "One-of-a-kind"
      ]
    }
  },
  {
    id: "espresso-mini",
    slug: "sac-espresso",
    name: { fr: "Le Mini Espresso", en: "The Espresso Mini" },
    tagline: {
      fr: "Rayures écru & espresso, format mini, allure rétro.",
      en: "Ecru & espresso stripes, mini size, retro allure."
    },
    price: 55,
    badge: { fr: "Nouveau", en: "New" },
    image: "assets/products/espresso-tote.jpeg",
    images: ["assets/products/espresso-tote.jpeg", "assets/products/bags-group.jpeg"],
    colors: [
      { key: "bicolore", name: { fr: "Écru / Espresso", en: "Ecru / Espresso" }, hex: "#6B4A32" }
    ],
    stock: 4,
    details: {
      fr: [
        "Crochet main bicolore, rayures franches",
        "Perles en bois multicolores en breloque",
        "Format mini structuré",
        "≈ 24 × 15 cm",
        "Pièce unique"
      ],
      en: [
        "Two-tone hand crochet, bold stripes",
        "Multicolour wooden bead charms",
        "Structured mini size",
        "≈ 24 × 15 cm",
        "One-of-a-kind"
      ]
    }
  }
];
