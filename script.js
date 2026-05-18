const products = [
  {
    id: 1,
    name: "Oud Royal",
    category: "mixte",
    price: 499,
    badge: "Best seller",
    description: "Parfum oriental intense avec oud, ambre et épices nobles.",
    image: "https://images.pexels.com/photos/30981935/pexels-photo-30981935.jpeg?auto=compress&cs=tinysrgb&w=900"
  },
  {
    id: 2,
    name: "Noir Élégance",
    category: "homme",
    price: 349,
    badge: "Homme",
    description: "Signature masculine profonde avec notes boisées et cuir.",
    image: "https://images.pexels.com/photos/7487831/pexels-photo-7487831.jpeg?auto=compress&cs=tinysrgb&w=900"
  },
  {
    id: 3,
    name: "Rose Divine",
    category: "femme",
    price: 289,
    badge: "Doux",
    description: "Fragrance féminine florale, musquée et très raffinée.",
    image: "https://images.pexels.com/photos/15097508/pexels-photo-15097508.jpeg?auto=compress&cs=tinysrgb&w=900"
  },
  {
    id: 4,
    name: "Amber Luxe",
    category: "mixte",
    price: 379,
    badge: "Premium",
    description: "Mélange chaud d’ambre, musc blanc et bois précieux.",
    image: "https://images.pexels.com/photos/11711832/pexels-photo-11711832.jpeg?auto=compress&cs=tinysrgb&w=900"
  },
  {
    id: 5,
    name: "Fresh Blue",
    category: "homme",
    price: 259,
    badge: "Frais",
    description: "Parfum frais avec notes marines, citronnées et aromatiques.",
    image: "https://images.pexels.com/photos/31132401/pexels-photo-31132401.jpeg?auto=compress&cs=tinysrgb&w=900"
  },
  {
    id: 6,
    name: "Vanilla Night",
    category: "femme",
    price: 319,
    badge: "Nouveau",
    description: "Notes chaudes de vanille, jasmin et bois blanc.",
    image: "https://images.pexels.com/photos/12528067/pexels-photo-12528067.jpeg?auto=compress&cs=tinysrgb&w=900"
  },
  {
    id: 7,
    name: "Golden Touch",
    category: "femme",
    price: 299,
    badge: "Élégant",
    description: "Parfum lumineux avec notes fruitées, florales et poudrées.",
    image: "https://images.pexels.com/photos/34154866/pexels-photo-34154866.jpeg?auto=compress&cs=tinysrgb&w=900"
  },
  {
    id: 8,
    name: "Mystic Wood",
    category: "homme",
    price: 429,
    badge: "Intense",
    description: "Parfum puissant avec bois de santal, tabac et musc.",
    image: "https://images.pexels.com/photos/35488878/pexels-photo-35488878.jpeg?auto=compress&cs=tinysrgb&w=900"
  }
];

const productsGrid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const openCart = document.getElementById("openCart");
const openCartHero = document.getElementById("openCartHero");
const openCartContact = document.getElementById("openCartContact");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const whatsappOrder = document.getElementById("whatsappOrder");

const toast = document.getElementById("toast");
const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");

let cart = [];

function formatCategory(category) {
  if (category === "homme") return "Homme";
  if (category === "femme") return "Femme";
  return "Mixte";
}

function renderProducts() {
  const searchValue = searchInput.value.toLowerCase().trim();
  const selectedCategory = categoryFilter.value;

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchValue) ||
      product.description.toLowerCase().includes(searchValue) ||
      product.category.toLowerCase().includes(searchValue);

    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  productsGrid.innerHTML = "";

  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = `
      <div class="empty-message">
        Aucun parfum trouvé. Essayez une autre recherche.
      </div>
    `;
    return;
  }

  filteredProducts.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
        <span class="product-badge">${product.badge}</span>
      </div>

      <div class="product-content">
        <span class="product-category">${formatCategory(product.category)}</span>
        <h3>${product.name}</h3>
        <p>${product.description}</p>

        <div class="rating">★★★★★</div>

        <div class="product-bottom">
          <span class="price">${product.price} DH</span>
          <button class="add-button" onclick="addToCart(${product.id})" aria-label="Ajouter ${product.name} au panier">+</button>
        </div>
      </div>
    `;

    productsGrid.appendChild(card);
  });
}

function addToCart(productId) {
  const product = products.find(item => item.id === productId);
  const existingProduct = cart.find(item => item.id === productId);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  updateCart();
  showToast();
}

function increaseQuantity(productId) {
  const product = cart.find(item => item.id === productId);

  if (product) {
    product.quantity += 1;
    updateCart();
  }
}

function decreaseQuantity(productId) {
  const product = cart.find(item => item.id === productId);

  if (!product) return;

  if (product.quantity > 1) {
    product.quantity -= 1;
  } else {
    cart = cart.filter(item => item.id !== productId);
  }

  updateCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
}

function updateCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-message">
        Votre panier est vide.
      </div>
    `;
  }

  let total = 0;
  let count = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
    count += item.quantity;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">

      <div class="cart-info">
        <h4>${item.name}</h4>
        <p>${item.price} DH — ${formatCategory(item.category)}</p>

        <div class="cart-controls">
          <button class="qty-button" onclick="decreaseQuantity(${item.id})" aria-label="Réduire la quantité">−</button>
          <strong>${item.quantity}</strong>
          <button class="qty-button" onclick="increaseQuantity(${item.id})" aria-label="Augmenter la quantité">+</button>
          <button class="remove-button" onclick="removeFromCart(${item.id})" aria-label="Retirer du panier">×</button>
        </div>
      </div>
    `;

    cartItems.appendChild(cartItem);
  });

  cartCount.textContent = count;
  cartTotal.textContent = `${total} DH`;
}

function showCart() {
  cartDrawer.classList.add("active");
  overlay.classList.add("active");
}

function hideCart() {
  cartDrawer.classList.remove("active");
  overlay.classList.remove("active");
}

function showToast() {
  toast.classList.add("active");

  setTimeout(() => {
    toast.classList.remove("active");
  }, 1800);
}

function sendOrderToWhatsApp() {
  if (cart.length === 0) {
    alert("Votre panier est vide.");
    return;
  }

  const phoneNumber = "212699890818";

  let message = "Bonjour, je souhaite commander :\n\n";

  cart.forEach(item => {
    message += `- ${item.name} x${item.quantity} : ${item.price * item.quantity} DH\n`;
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  message += `\nTotal : ${total} DH\n`;
  message += "\nMerci.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank");
}

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);

openCart.addEventListener("click", showCart);
openCartHero.addEventListener("click", showCart);
openCartContact.addEventListener("click", showCart);
closeCart.addEventListener("click", hideCart);
overlay.addEventListener("click", hideCart);
whatsappOrder.addEventListener("click", sendOrderToWhatsApp);

menuButton.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

renderProducts();
updateCart();
