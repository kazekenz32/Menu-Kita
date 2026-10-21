
/* ========================================
   MENUKITA - JAVASCRIPT
   File: script.js
======================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. MENGAMBIL ELEMEN HTML
  const menuGrid = document.querySelector("#menuGrid, .menu-grid");
  const searchInput = document.querySelector(
    "#searchInput, #menuSearch, .menu-search input"
  );

  const cartDrawer = document.querySelector("#cartDrawer, .cart-drawer");
  const cartOverlay = document.querySelector("#cartOverlay, .cart-overlay");
  const cartItemsContainer = document.querySelector("#cartItems, .cart-items");
  const cartTotalElement = document.querySelector("#cartTotal, .cart-total-price");
  const cartCountElement = document.querySelector("#cartCount, .cart-count");

  const closeCartButton = document.querySelector("#closeCart, .close-cart");
  const checkoutButton = document.querySelector("#checkoutBtn, .checkout-btn");

  const adminModal = document.querySelector("#adminModal, .modal-overlay");
  const adminForm = document.querySelector("#adminForm, #menuForm");
  const toast = document.querySelector("#toast, .toast");

  const menuToggle = document.querySelector("#menuToggle, .menu-toggle");
  const navLinks = document.querySelector("#navLinks, .nav-links");

  // 2. DATA MENU
  // Ganti nama, harga, deskripsi, atau gambar sesuai kebutuhan.
  const defaultMenus = [
    {
      id: 1,
      name: "Signature Coffee",
      category: "Minuman",
      price: 25000,
      description: "Kopi pilihan dengan aroma yang kaya dan rasa seimbang.",
      image:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=85",
      badge: "Favorit",
    },
    {
      id: 2,
      name: "Creamy Latte",
      category: "Minuman",
      price: 28000,
      description: "Perpaduan espresso dan susu lembut yang nikmat.",
      image:
        "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=85",
      badge: "",
    },
    {
      id: 3,
      name: "Fresh Matcha",
      category: "Minuman",
      price: 27000,
      description: "Matcha dengan cita rasa khas dan sensasi menyegarkan.",
      image:
        "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=85",
      badge: "Baru",
    },
    {
      id: 4,
      name: "Butter Croissant",
      category: "Makanan",
      price: 22000,
      description: "Pastry renyah di luar dengan tekstur lembut di dalam.",
      image:
        "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=85",
      badge: "",
    },
    {
      id: 5,
      name: "Classic Pancake",
      category: "Makanan",
      price: 32000,
      description: "Pancake lembut dengan pelengkap manis pilihan.",
      image:
        "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=900&q=85",
      badge: "Favorit",
    },
    {
      id: 6,
      name: "Chocolate Cake",
      category: "Dessert",
      price: 30000,
      description: "Kue cokelat lembut untuk menemani waktu santai.",
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
      badge: "",
    },
  ];

  // 3. PENYIMPANAN DATA
  // localStorage menyimpan data pada browser yang digunakan.
  function readStorage(key, fallback) {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  let menus = readStorage("menukita-menus", defaultMenus);
  let cart = readStorage("menukita-cart", []);
  let activeCategory = "Semua";
  let searchTerm = "";
  let nextId = Math.max(0, ...menus.map((item) => Number(item.id) || 0)) + 1;

  function saveMenus() {
    try {
      localStorage.setItem("menukita-menus", JSON.stringify(menus));
    } catch (error) {
      showToast("Menu tidak dapat disimpan di browser.");
    }
  }

  function saveCart() {
    try {
      localStorage.setItem("menukita-cart", JSON.stringify(cart));
    } catch (error) {
      showToast("Keranjang tidak dapat disimpan di browser.");
    }
  }

  // 4. FORMAT HARGA RUPIAH
  function formatRupiah(price) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  }

  // Mencegah teks menu dimasukkan sebagai HTML yang tidak aman.
  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };

      return entities[character];
    });
  }

  // 5. MENAMPILKAN MENU
  function renderMenus() {
    if (!menuGrid) return;

    const filteredMenus = menus.filter((menu) => {
      const matchesCategory =
        activeCategory === "Semua" ||
        menu.category.toLowerCase() === activeCategory.toLowerCase();

      const searchableText =
        `${menu.name} ${menu.category} ${menu.description}`.toLowerCase();

      const matchesSearch = searchableText.includes(searchTerm);

      return matchesCategory && matchesSearch;
    });

    if (filteredMenus.length === 0) {
      menuGrid.innerHTML = `
        <div class="no-results">
          <h3>Menu tidak ditemukan</h3>
          <p>Coba kata kunci atau kategori lainnya.</p>
        </div>
      `;
      return;
    }

    menuGrid.innerHTML = filteredMenus
      .map(
        (menu) => `
          <article class="menu-card">
            <div class="menu-card-image">
              <img
                src="${escapeHTML(menu.image)}"
                alt="${escapeHTML(menu.name)}"
                loading="lazy"
                onerror="this.style.opacity='0.25'"
              >
              ${
                menu.badge
                  ? `<span class="menu-badge">${escapeHTML(menu.badge)}</span>`
                  : ""
              }
            </div>

            <div class="menu-card-content">
              <p class="menu-card-category">
                ${escapeHTML(menu.category)}
              </p>

              <h3>${escapeHTML(menu.name)}</h3>

              <p class="menu-card-description">
                ${escapeHTML(menu.description)}
              </p>

              <div class="menu-card-footer">
                <span class="menu-price">
                  ${formatRupiah(menu.price)}
                </span>

                <button
                  class="add-cart-btn"
                  type="button"
                  data-add-cart="${Number(menu.id)}"
                  aria-label="Tambah ${escapeHTML(menu.name)} ke keranjang"
                  title="Tambah ke keranjang"
                >+</button>
              </div>
            </div>
          </article>
        `
      )
      .join("");
  }

  // 6. FILTER KATEGORI MENU
  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      // Mendukung tombol dengan data-category atau teks tombol.
      activeCategory =
        button.dataset.category ||
        button.textContent.trim();

      renderMenus();
    });
  });

  // 7. PENCARIAN MENU
  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      searchTerm = event.target.value.trim().toLowerCase();
      renderMenus();
    });
  }

  // 8. NOTIFIKASI
  let toastTimeout;

  function showToast(message) {
    if (!toast) {
      console.info(message);
      return;
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  // 9. MENAMBAHKAN ITEM KE KERANJANG
  function addToCart(menuId) {
    const menu = menus.find((item) => item.id === menuId);
    if (!menu) return;

    const existingItem = cart.find((item) => item.id === menuId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: menu.id,
        name: menu.name,
        price: menu.price,
        image: menu.image,
        quantity: 1,
      });
    }

    saveCart();
    renderCart();
    showToast(`${menu.name} ditambahkan ke keranjang.`);
  }

  // Event delegation: tombol tetap bekerja setelah menu dirender ulang.
  if (menuGrid) {
    menuGrid.addEventListener("click", (event) => {
      const button = event.target.closest("[data-add-cart]");
      if (!button) return;

      addToCart(Number(button.dataset.addCart));
    });
  }

  // 10. MENAMPILKAN KERANJANG
  function renderCart() {
    const totalQuantity = cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const totalPrice = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (cartCountElement) {
      cartCountElement.textContent = totalQuantity;
    }

    if (cartTotalElement) {
      cartTotalElement.textContent = formatRupiah(totalPrice);
    }

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty">
          <span class="empty-icon">🛍️</span>
          <h3>Keranjang masih kosong</h3>
          <p>Yuk, pilih menu favoritmu!</p>
        </div>
      `;
      return;
    }

    cartItemsContainer.innerHTML = cart
      .map(
        (item) => `
          <div class="cart-item">
            <img
              src="${escapeHTML(item.image)}"
              alt="${escapeHTML(item.name)}"
              loading="lazy"
            >

            <div>
              <h4>${escapeHTML(item.name)}</h4>
              <p class="cart-item-price">
                ${formatRupiah(item.price)}
              </p>

              <div class="quantity-controls">
                <button
                  type="button"
                  data-cart-action="minus"
                  data-id="${Number(item.id)}"
                  aria-label="Kurangi jumlah"
                >−</button>

                <span>${item.quantity}</span>

                <button
                  type="button"
                  data-cart-action="plus"
                  data-id="${Number(item.id)}"
                  aria-label="Tambah jumlah"
                >+</button>

                <button
                  type="button"
                  data-cart-action="remove"
                  data-id="${Number(item.id)}"
                  aria-label="Hapus ${escapeHTML(item.name)}"
                  title="Hapus item"
                >×</button>
              </div>
            </div>

            <span class="cart-item-total">
              ${formatRupiah(item.price * item.quantity)}
            </span>
          </div>
        `
      )
      .join("");
  }

  // 11. MENGUBAH JUMLAH ITEM DI KERANJANG
  if (cartItemsContainer) {
    cartItemsContainer.addEventListener("click", (event) => {
      const button = event.target.closest("[data-cart-action]");
      if (!button) return;

      const id = Number(button.dataset.id);
      const action = button.dataset.cartAction;
      const item = cart.find((product) => product.id === id);

      if (!item) return;

      if (action === "plus") {
        item.quantity += 1;
      } else if (action === "minus") {
        item.quantity -= 1;

        if (item.quantity <= 0) {
          cart = cart.filter((product) => product.id !== id);
        }
      } else if (action === "remove") {
        cart = cart.filter((product) => product.id !== id);
      }

      saveCart();
      renderCart();
    });
  }

  // 12. MEMBUKA DAN MENUTUP KERANJANG
  function openCart() {
    if (cartDrawer) {
      cartDrawer.classList.add("active");
      cartDrawer.setAttribute("aria-hidden", "false");
    }

    if (cartOverlay) {
      cartOverlay.classList.add("active");
    }

    document.body.style.overflow = "hidden";
  }

  function closeCart() {
    if (cartDrawer) {
      cartDrawer.classList.remove("active");
      cartDrawer.setAttribute("aria-hidden", "true");
    }

    if (cartOverlay) {
      cartOverlay.classList.remove("active");
    }

    if (!adminModal?.classList.contains("active")) {
      document.body.style.overflow = "";
    }
  }

  // Mendukung beberapa kemungkinan ID tombol keranjang.
  document
    .querySelectorAll("#openCart, #cartButton, .cart-button")
    .forEach((button) => {
      button.addEventListener("click", openCart);
    });

  if (closeCartButton) {
    closeCartButton.addEventListener("click", closeCart);
  }

  if (cartOverlay) {
    cartOverlay.addEventListener("click", closeCart);
  }

  // 13. CHECKOUT SEDERHANA
  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      if (cart.length === 0) {
        showToast("Keranjang kamu masih kosong.");
        return;
      }

      const orderLines = cart
        .map(
          (item) =>
            `${item.name} x${item.quantity} = ${formatRupiah(
              item.price * item.quantity
            )}`
        )
        .join("\n");

      const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const confirmed = window.confirm(
        `Ringkasan pesanan:\n\n${orderLines}\n\nTotal: ${formatRupiah(
          total
        )}\n\nLanjutkan pesanan ini?`
      );

      if (!confirmed) return;

      // Ini hanya simulasi checkout di browser.
      // Belum mengirim pesanan ke server atau kasir.
      cart = [];
      saveCart();
      renderCart();
      closeCart();

      showToast("Pesanan simulasi berhasil dibuat!");
    });
  }

  // 14. NAVIGASI RESPONSIF HP
  if (menuToggle && navLinks) {
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("active");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"
      );
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 15. MODAL ADMIN
  function openAdminModal() {
    if (!adminModal) {
      showToast("Modal admin belum tersedia di HTML.");
      return;
    }

    adminModal.classList.add("active");
    adminModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeAdminModal() {
    if (!adminModal) return;

    adminModal.classList.remove("active");
    adminModal.setAttribute("aria-hidden", "true");

    if (!cartDrawer?.classList.contains("active")) {
      document.body.style.overflow = "";
    }
  }

  document
    .querySelectorAll("#openAdmin, #adminButton, .admin-button")
    .forEach((button) => {
      button.addEventListener("click", openAdminModal);
    });

  if (adminModal) {
    adminModal
      .querySelectorAll("#closeAdmin, .close-modal")
      .forEach((button) => {
        button.addEventListener("click", closeAdminModal);
      });

    // Menutup modal jika pengguna menekan area luar kotak modal.
    adminModal.addEventListener("click", (event) => {
      if (event.target === adminModal) {
        closeAdminModal();
      }
    });
  }

  // 16. MENAMBAHKAN MENU MELALUI FORM ADMIN
  if (adminForm) {
    adminForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(adminForm);

      function getField(names) {
        for (const name of names) {
          const element = adminForm.querySelector(
            `[name="${name}"], #${name}`
          );

          const value = formData.get(name);
          if (value !== null && String(value).trim() !== "") {
            return String(value).trim();
          }

          if (element && element.value.trim() !== "") {
            return element.value.trim();
          }
        }

        return "";
      }

      const name = getField(["name", "menuName", "nama"]);
      const category = getField([
        "category",
        "menuCategory",
        "kategori",
      ]);
      const priceText = getField(["price", "menuPrice", "harga"]);
      const description = getField([
        "description",
        "menuDescription",
        "deskripsi",
      ]);
      const image = getField(["image", "menuImage", "gambar"]);
      const badge = getField(["badge", "menuBadge", "label"]);

      const price = Number(priceText);

      if (!name || !category || !priceText || !description || !image) {
        showToast("Lengkapi semua kolom menu terlebih dahulu.");
        return;
      }

      if (!Number.isFinite(price) || price <= 0) {
        showToast("Masukkan harga yang valid.");
        return;
      }

      // URL gambar harus berupa HTTP(S).
      let imageURL;

      try {
        imageURL = new URL(image);

        if (!["http:", "https:"].includes(imageURL.protocol)) {
          throw new Error("URL tidak valid");
        }
      } catch (error) {
        showToast("Masukkan URL gambar yang valid.");
        return;
      }

      const newMenu = {
        id: nextId++,
        name,
        category,
        price,
        description,
        image: imageURL.href,
        badge,
      };

      menus.push(newMenu);
      saveMenus();
      renderMenus();

      // Reset pencarian agar menu baru dapat terlihat.
      searchTerm = "";

      if (searchInput) {
        searchInput.value = "";
      }

      activeCategory = "Semua";

      document.querySelectorAll(".filter-btn").forEach((button) => {
        button.classList.toggle(
          "active",
          (button.dataset.category || button.textContent.trim()) === "Semua"
        );
      });

      renderMenus();
      adminForm.reset();
      closeAdminModal();

      showToast(`${name} berhasil ditambahkan!`);
    });
  }

  // 17. MENUTUP PANEL DENGAN TOMBOL ESCAPE
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCart();
      closeAdminModal();
    }
  });

  // 18. NAVIGASI AKTIF BERDASARKAN BAGIAN YANG DIBUKA
  const pageSections = document.querySelectorAll("main section[id]");
  const navigationLinks = document.querySelectorAll(".nav-links a[href^='#']");

  if ("IntersectionObserver" in window && pageSections.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navigationLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
      }
    );

    pageSections.forEach((section) => sectionObserver.observe(section));
  }

  // 19. MENAMPILKAN DATA SAAT WEBSITE DIBUKA
  renderMenus();
  renderCart();

  console.log("MenuKita berhasil dijalankan!");
});
