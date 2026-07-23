/* ==========================================================================
   RACYN. — Logique boutique : langue, panier, rendu, commande
   ========================================================================== */
(function () {
  "use strict";
  const CFG = window.RACYN_CONFIG;
  const I18N = window.RACYN_I18N;
  const PRODUCTS = window.RACYN_PRODUCTS;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- Langue ---------- */
  const LANG_KEY = "racyn_lang";
  function getLang() {
    let l = localStorage.getItem(LANG_KEY);
    if (!l) l = (navigator.language || "fr").toLowerCase().startsWith("en") ? "en" : "fr";
    return l === "en" ? "en" : "fr";
  }
  let LANG = getLang();
  const t = (key) => (I18N[LANG] && I18N[LANG][key]) || (I18N.fr[key]) || key;
  const tv = (obj) => (obj ? (obj[LANG] || obj.fr || "") : "");

  function applyI18n() {
    document.documentElement.lang = LANG;
    $$("[data-i18n]").forEach((el) => { el.innerHTML = t(el.getAttribute("data-i18n")); });
    $$("[data-i18n-attr]").forEach((el) => {
      // format: "placeholder:home.news.placeholder|aria-label:nav.cart"
      el.getAttribute("data-i18n-attr").split("|").forEach((pair) => {
        const [attr, key] = pair.split(":");
        if (attr && key) el.setAttribute(attr, t(key.trim()));
      });
    });
    $$("[data-lang-btn]").forEach((b) =>
      b.classList.toggle("is-active", b.getAttribute("data-lang-btn") === LANG)
    );
    document.dispatchEvent(new CustomEvent("racyn:lang", { detail: { lang: LANG } }));
  }
  function setLang(l) {
    LANG = l === "en" ? "en" : "fr";
    localStorage.setItem(LANG_KEY, LANG);
    applyI18n();
    renderAll();
  }

  /* ---------- Panier ---------- */
  const CART_KEY = "racyn_cart";
  function readCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch (e) { return []; }
  }
  function writeCart(c) { localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCartCount(); }
  function cartKey(id, color) { return id + "::" + (color || ""); }

  function addToCart(id, color, qty) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    const cart = readCart();
    const key = cartKey(id, color);
    const existing = cart.find((i) => i.key === key);
    if (existing) existing.qty += (qty || 1);
    else cart.push({ key, id, color: color || "", qty: qty || 1 });
    writeCart(cart);
    openCart();
    renderCart();
  }
  function setQty(key, qty) {
    let cart = readCart();
    const it = cart.find((i) => i.key === key);
    if (!it) return;
    it.qty = qty;
    if (it.qty <= 0) cart = cart.filter((i) => i.key !== key);
    writeCart(cart);
    renderCart();
  }
  function removeItem(key) {
    writeCart(readCart().filter((i) => i.key !== key));
    renderCart();
  }
  function cartCount() { return readCart().reduce((n, i) => n + i.qty, 0); }
  function cartSubtotal() {
    return readCart().reduce((sum, i) => {
      const p = PRODUCTS.find((x) => x.id === i.id);
      return sum + (p ? p.price * i.qty : 0);
    }, 0);
  }
  function shippingFor(sub) {
    if (sub === 0) return 0;
    return sub >= CFG.freeShippingThreshold ? 0 : CFG.shippingFlat;
  }
  function money(n) { return CFG.currency + Number(n).toFixed(0); }

  function updateCartCount() {
    const n = cartCount();
    $$("[data-cart-count]").forEach((el) => {
      el.textContent = n;
      el.classList.toggle("is-empty", n === 0);
    });
  }

  /* ---------- Rendu panier (drawer) ---------- */
  function colorName(p, key) {
    const c = p.colors.find((x) => x.key === key);
    return c ? tv(c.name) : "";
  }
  function renderCart() {
    const wrap = $("[data-cart-items]");
    if (!wrap) return;
    const cart = readCart();
    if (cart.length === 0) {
      wrap.innerHTML =
        '<div class="cart-empty"><p>' + t("cart.empty") + "</p>" +
        '<a class="btn btn-primary" href="boutique.html">' + t("cart.emptyCta") + "</a></div>";
      $("[data-cart-summary]").hidden = true;
      return;
    }
    $("[data-cart-summary]").hidden = false;
    wrap.innerHTML = cart.map((i) => {
      const p = PRODUCTS.find((x) => x.id === i.id);
      if (!p) return "";
      const cn = colorName(p, i.color);
      return (
        '<div class="cart-item">' +
          '<img src="' + p.image + '" alt="" loading="lazy">' +
          '<div class="cart-item__info">' +
            '<div class="cart-item__top">' +
              '<span class="cart-item__name">' + tv(p.name) + "</span>" +
              '<button class="cart-item__remove" data-remove="' + i.key + '" aria-label="' + t("cart.remove") + '">&times;</button>' +
            "</div>" +
            (cn ? '<span class="cart-item__variant">' + cn + "</span>" : "") +
            '<div class="cart-item__bottom">' +
              '<div class="qty">' +
                '<button data-dec="' + i.key + '" aria-label="-">&minus;</button>' +
                "<span>" + i.qty + "</span>" +
                '<button data-inc="' + i.key + '" aria-label="+">+</button>' +
              "</div>" +
              '<span class="cart-item__price">' + money(p.price * i.qty) + "</span>" +
            "</div>" +
          "</div>" +
        "</div>"
      );
    }).join("");

    const sub = cartSubtotal();
    const ship = shippingFor(sub);
    $("[data-sub]").textContent = money(sub);
    $("[data-ship]").innerHTML = ship === 0
      ? '<span class="free">' + t("cart.free") + "</span>"
      : money(ship);
    $("[data-total]").textContent = money(sub + ship);

    wrap.querySelectorAll("[data-inc]").forEach((b) => b.onclick = () => {
      const k = b.getAttribute("data-inc");
      const it = readCart().find((i) => i.key === k);
      setQty(k, it.qty + 1);
    });
    wrap.querySelectorAll("[data-dec]").forEach((b) => b.onclick = () => {
      const k = b.getAttribute("data-dec");
      const it = readCart().find((i) => i.key === k);
      setQty(k, it.qty - 1);
    });
    wrap.querySelectorAll("[data-remove]").forEach((b) => b.onclick = () => removeItem(b.getAttribute("data-remove")));
  }

  /* ---------- Commande (WhatsApp / Instagram) ---------- */
  function buildOrderMessage() {
    const cart = readCart();
    const lines = [t("wa.hello"), ""];
    cart.forEach((i) => {
      const p = PRODUCTS.find((x) => x.id === i.id);
      if (!p) return;
      const cn = colorName(p, i.color);
      lines.push("• " + i.qty + "× " + tv(p.name) + (cn ? " (" + cn + ")" : "") + " — " + money(p.price * i.qty));
    });
    const sub = cartSubtotal();
    const ship = shippingFor(sub);
    lines.push("");
    lines.push(t("wa.total") + " : " + money(sub + ship) + (ship === 0 ? "" : " (" + t("cart.shipping").toLowerCase() + " " + money(ship) + ")"));
    lines.push("");
    lines.push(t("wa.name") + " ");
    lines.push(t("wa.address") + " ");
    return lines.join("\n");
  }
  function checkoutWhatsApp() {
    if (readCart().length === 0) return;
    const msg = encodeURIComponent(buildOrderMessage());
    if (CFG.whatsapp) window.open("https://wa.me/" + CFG.whatsapp + "?text=" + msg, "_blank");
    else checkoutInstagram();
  }
  function checkoutInstagram() {
    if (readCart().length === 0) return;
    // Instagram n'accepte pas de texte pré-rempli : on copie le récap et on ouvre le DM.
    const msg = buildOrderMessage();
    if (navigator.clipboard) navigator.clipboard.writeText(msg).catch(() => {});
    window.open("https://ig.me/m/" + CFG.instagram, "_blank");
  }

  /* ---------- Drawer ouverture/fermeture ---------- */
  function openCart() {
    const d = $("[data-cart-drawer]");
    if (!d) return;
    d.classList.add("is-open");
    $("[data-overlay]").classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    const d = $("[data-cart-drawer]");
    if (!d) return;
    d.classList.remove("is-open");
    $("[data-overlay]").classList.remove("is-open");
    document.body.style.overflow = "";
  }

  /* ---------- Rendu grille produits ---------- */
  function productCard(p) {
    const sold = p.stock <= 0;
    const badge = tv(p.badge);
    return (
      '<a class="card" href="produit.html?id=' + p.id + '">' +
        '<div class="card__media">' +
          '<img src="' + p.image + '" alt="' + tv(p.name) + '" loading="lazy">' +
          (badge ? '<span class="card__badge">' + badge + "</span>" : "") +
          (sold ? '<span class="card__soldout">' + t("shop.soldout") + "</span>" : "") +
          '<span class="card__cta">' + t("product.view") + "</span>" +
        "</div>" +
        '<div class="card__body">' +
          '<h3 class="card__name">' + tv(p.name) + "</h3>" +
          '<p class="card__tag">' + tv(p.tagline) + "</p>" +
          '<div class="card__row">' +
            '<span class="card__price">' + money(p.price) + "</span>" +
            '<span class="card__swatches">' +
              p.colors.map((c) => '<span class="swatch" style="background:' + c.hex + '" title="' + tv(c.name) + '"></span>').join("") +
            "</span>" +
          "</div>" +
        "</div>" +
      "</a>"
    );
  }
  function renderGrids() {
    $$("[data-grid]").forEach((grid) => {
      const limit = parseInt(grid.getAttribute("data-limit") || "0", 10);
      const list = limit ? PRODUCTS.slice(0, limit) : PRODUCTS;
      grid.innerHTML = list.map(productCard).join("");
    });
  }

  /* ---------- Page produit ---------- */
  let selectedColor = null;
  function renderProductPage() {
    const root = $("[data-product]");
    if (!root) return;
    const params = new URLSearchParams(location.search);
    const p = PRODUCTS.find((x) => x.id === params.get("id")) || PRODUCTS[0];
    document.title = tv(p.name) + " — RACYN.";
    selectedColor = selectedColor || (p.colors[0] && p.colors[0].key);

    const imgs = p.images && p.images.length ? p.images : [p.image];
    const sold = p.stock <= 0;
    root.innerHTML =
      '<a class="pd-back" href="boutique.html">' + t("product.back") + "</a>" +
      '<div class="pd">' +
        '<div class="pd__gallery">' +
          '<div class="pd__main"><img id="pdMain" src="' + imgs[0] + '" alt="' + tv(p.name) + '"></div>' +
          (imgs.length > 1 ? '<div class="pd__thumbs">' +
            imgs.map((src, idx) => '<button class="pd__thumb' + (idx === 0 ? " is-active" : "") + '" data-thumb="' + src + '"><img src="' + src + '" alt="" loading="lazy"></button>').join("") +
          "</div>" : "") +
        "</div>" +
        '<div class="pd__info">' +
          (tv(p.badge) ? '<span class="pd__badge">' + tv(p.badge) + "</span>" : "") +
          '<h1 class="pd__name">' + tv(p.name) + "</h1>" +
          '<p class="pd__tag">' + tv(p.tagline) + "</p>" +
          '<div class="pd__price">' + money(p.price) + "</div>" +
          '<div class="pd__colors">' +
            '<span class="pd__label">' + t("product.color") + ' : <b id="pdColorName">' + colorName(p, selectedColor) + "</b></span>" +
            '<div class="pd__swatches">' +
              p.colors.map((c) => '<button class="pd__swatch' + (c.key === selectedColor ? " is-active" : "") + '" data-color="' + c.key + '" style="--sw:' + c.hex + '" title="' + tv(c.name) + '" aria-label="' + tv(c.name) + '"></button>').join("") +
            "</div>" +
          "</div>" +
          (sold ? '<button class="btn btn-primary btn-block" disabled>' + t("shop.soldout") + "</button>"
                : '<button class="btn btn-primary btn-block" id="pdAdd">' + t("product.add") + "</button>") +
          (!sold && p.stock <= 5 ? '<p class="pd__stock">' + p.stock + " " + t("product.left") + "</p>" : "") +
          '<p class="pd__ship">' + t("product.ship") + "</p>" +
          '<div class="pd__details">' +
            "<h3>" + t("product.details") + "</h3>" +
            "<ul>" + tv(p.details).map((d) => "<li>" + d + "</li>").join("") + "</ul>" +
            '<p class="pd__unique">' + t("product.unique") + "</p>" +
          "</div>" +
        "</div>" +
      "</div>" +
      '<section class="related"><h2 class="section__title">' + t("product.related") + "</h2>" +
        '<div class="grid grid--3">' + PRODUCTS.filter((x) => x.id !== p.id).slice(0, 3).map(productCard).join("") + "</div>" +
      "</section>";

    root.querySelectorAll("[data-thumb]").forEach((b) => b.onclick = () => {
      $("#pdMain").src = b.getAttribute("data-thumb");
      root.querySelectorAll("[data-thumb]").forEach((x) => x.classList.remove("is-active"));
      b.classList.add("is-active");
    });
    root.querySelectorAll("[data-color]").forEach((b) => b.onclick = () => {
      selectedColor = b.getAttribute("data-color");
      root.querySelectorAll("[data-color]").forEach((x) => x.classList.remove("is-active"));
      b.classList.add("is-active");
      $("#pdColorName").textContent = colorName(p, selectedColor);
    });
    const addBtn = $("#pdAdd");
    if (addBtn) addBtn.onclick = () => {
      addToCart(p.id, selectedColor, 1);
      addBtn.textContent = t("product.added");
      setTimeout(() => { addBtn.textContent = t("product.add"); }, 1400);
    };
  }

  /* ---------- Newsletter ---------- */
  function bindNewsletter() {
    $$("[data-newsletter]").forEach((form) => {
      form.onsubmit = (e) => {
        e.preventDefault();
        const email = form.querySelector("input[type=email]").value.trim();
        if (!email) return;
        const list = JSON.parse(localStorage.getItem("racyn_news") || "[]");
        list.push({ email, at: Date.now() });
        localStorage.setItem("racyn_news", JSON.stringify(list));
        form.innerHTML = '<p class="news-ok">' + t("home.news.ok") + "</p>";
      };
    });
  }

  /* ---------- FAQ accordéon ---------- */
  function bindFaq() {
    $$("[data-faq] .faq-item__q").forEach((q) => {
      q.onclick = () => q.parentElement.classList.toggle("is-open");
    });
  }

  /* ---------- Rendu global ---------- */
  function renderAll() {
    renderGrids();
    renderProductPage();
    renderCart();
    updateCartCount();
  }

  /* ---------- Init ---------- */
  function bindGlobal() {
    $$("[data-lang-btn]").forEach((b) => b.onclick = () => setLang(b.getAttribute("data-lang-btn")));
    $$("[data-open-cart]").forEach((b) => b.onclick = (e) => { e.preventDefault(); openCart(); });
    $$("[data-close-cart]").forEach((b) => b.onclick = closeCart);
    const ov = $("[data-overlay]");
    if (ov) ov.onclick = closeCart;
    const wa = $("[data-checkout-wa]");
    if (wa) wa.onclick = checkoutWhatsApp;
    const ig = $("[data-checkout-ig]");
    if (ig) ig.onclick = checkoutInstagram;
    // Mobile menu
    const burger = $("[data-burger]");
    if (burger) burger.onclick = () => $("[data-nav]").classList.toggle("is-open");
    // Config-based checkout button labels
    document.addEventListener("racyn:lang", updateCheckoutButtons);
    updateCheckoutButtons();
    // Header shrink on scroll
    const header = $(".site-header");
    if (header) {
      const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
    // Reveal on scroll
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
      }, { threshold: 0.12 });
      $$("[data-reveal]").forEach((el) => io.observe(el));
    } else {
      $$("[data-reveal]").forEach((el) => el.classList.add("is-in"));
    }
    // Set social links
    $$("[data-ig-link]").forEach((a) => a.href = "https://instagram.com/" + CFG.instagram);
  }
  function updateCheckoutButtons() {
    const wa = $("[data-checkout-wa]");
    const ig = $("[data-checkout-ig]");
    if (CFG.whatsapp) {
      if (wa) { wa.hidden = false; wa.textContent = t("cart.checkout"); }
      if (ig) ig.hidden = true;
    } else {
      if (wa) wa.hidden = true;
      if (ig) { ig.hidden = false; ig.textContent = t("cart.checkoutIg"); }
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyI18n();
    bindGlobal();
    bindNewsletter();
    bindFaq();
    renderAll();
    document.addEventListener("racyn:lang", () => { bindFaq(); });
  });
})();
