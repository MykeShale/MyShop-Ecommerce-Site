// script.js

const productList = document.getElementById('product-list');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');
const cartCount = document.getElementById('cart-count');

let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

// Fetch products from FakeStoreAPI
fetch('https://fakestoreapi.com/products')
  .then(res => res.json())
  .then(data => {
    products = data;
    displayProducts(products);
  });

function displayProducts(productsToShow) {
  if (!productList) return;
  productList.innerHTML = '';
  productsToShow.forEach(product => {
    const col = document.createElement('div');
    col.className = 'col-sm-6 col-md-4 col-lg-3';
    col.innerHTML = `
      <div class="card h-100">
        <img src="${product.image}" class="card-img-top p-3" style="height: 250px; object-fit: contain" alt="${product.title}">
        <div class="card-body d-flex flex-column">
          <h6 class="card-title">${product.title}</h6>
          <p class="card-text fw-bold">$${product.price.toFixed(2)}</p>
          <a href="products.html?id=${product.id}" class="btn btn-sm btn-outline-primary mt-auto">View Details</a>
          <button class="btn btn-sm btn-primary mt-2" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
      </div>`;
    productList.appendChild(col);
  });
}

function addToCart(id) {
  const item = cart.find(p => p.id === id);
  if (item) {
    item.quantity += 1;
  } else {
    const product = products.find(p => p.id === id);
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  if (cartCount) {
    cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
  }
}

// Filtering and Sorting
if (categoryFilter && sortFilter) {
  categoryFilter.addEventListener('change', filterAndSort);
  sortFilter.addEventListener('change', filterAndSort);
  searchInput?.addEventListener('input', filterAndSort);
}

function filterAndSort() {
  let filtered = [...products];

  const category = categoryFilter.value;
  const searchQuery = searchInput?.value.toLowerCase() || '';
  const sortOption = sortFilter.value;

  if (category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }

  if (searchQuery) {
    filtered = filtered.filter(p => p.title.toLowerCase().includes(searchQuery));
  }

  if (sortOption === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  }

  displayProducts(filtered);
}

// Cart page logic (for cart.html)
if (window.location.pathname.includes('cart.html')) {
  const cartContainer = document.getElementById('cart-container');
  const cartTotal = document.getElementById('cart-total');
  const cartTable = document.getElementById('cart-table');

  function renderCart() {
    cartTable.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
      total += item.price * item.quantity;
      cartTable.innerHTML += `
        <tr>
          <td><img src="${item.image}" width="50"></td>
          <td>${item.title}</td>
          <td>$${item.price.toFixed(2)}</td>
          <td>
            <input type="number" value="${item.quantity}" min="1" class="form-control form-control-sm" onchange="updateQuantity(${item.id}, this.value)">
          </td>
          <td>$${(item.price * item.quantity).toFixed(2)}</td>
          <td><button class="btn btn-sm btn-danger" onclick="removeItem(${item.id})">Remove</button></td>
        </tr>`;
    });
    cartTotal.textContent = `$${total.toFixed(2)}`;
  }

  window.updateQuantity = function (id, qty) {
    const item = cart.find(i => i.id === id);
    if (item) {
      item.quantity = parseInt(qty);
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
      updateCartCount();
    }
  }

  window.removeItem = function (id) {
    cart = cart.filter(i => i.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
  }

  renderCart();
}

// Product details page logic (for products.html?id=1)
if (window.location.pathname.includes('products.html')) {
  const productId = new URLSearchParams(window.location.search).get('id');
  const productContainer = document.getElementById('product-details');

  fetch(`https://fakestoreapi.com/products/${productId}`)
    .then(res => res.json())
    .then(product => {
      if (productContainer) {
        productContainer.innerHTML = `
          <div class="row">
            <div class="col-md-6">
              <img src="${product.image}" alt="${product.title}" class="img-fluid">
            </div>
            <div class="col-md-6">
              <h3>${product.title}</h3>
              <p class="fw-bold">$${product.price}</p>
              <p>${product.description}</p>
              <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
          </div>`;
      }
    });
}

// Function to handle "Add to Cart" buttons
function setupAddToCartButtons() {
  const addToCartButtons = document.querySelectorAll('.btn-outline-primary');
  addToCartButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const card = event.target.closest('.card');
      const productName = card.querySelector('.card-title').textContent;
      const productPrice = card.querySelector('.card-text').textContent;
      addToCart(productName, productPrice);
    });
  });
}

// Function to handle carousel controls
function setupCarousel() {
  const carousels = document.querySelectorAll('.carousel');
  carousels.forEach((carousel) => {
    const prevButton = carousel.querySelector('.carousel-control-prev');
    const nextButton = carousel.querySelector('.carousel-control-next');

    if (prevButton && nextButton) {
      prevButton.addEventListener('click', () => {
        carousel.querySelector('.carousel-inner').scrollBy({ left: -300, behavior: 'smooth' });
      });

      nextButton.addEventListener('click', () => {
        carousel.querySelector('.carousel-inner').scrollBy({ left: 300, behavior: 'smooth' });
      });
    }
  });
}

// Function to handle form submissions
function setupForms() {
  const forms = document.querySelectorAll('form');
  forms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      alert('Form submitted successfully!');
    });
  });
}

// Function to handle navigation links
function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = event.target.getAttribute('href');
      if (target) {
        window.location.href = target;
      }
    });
  });
}

// Function to handle dynamic modals
function setupModals() {
  const modalTriggers = document.querySelectorAll('[data-bs-toggle="modal"]');
  modalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const modalId = trigger.getAttribute('data-bs-target');
      const modal = document.querySelector(modalId);
      if (modal) {
        modal.classList.add('show');
        modal.style.display = 'block';
      }
    });
  });

  const modalCloses = document.querySelectorAll('[data-bs-dismiss="modal"]');
  modalCloses.forEach((close) => {
    close.addEventListener('click', () => {
      const modal = close.closest('.modal');
      if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
      }
    });
  });
}

// Function to initialize all features
function initialize() {
  setupAddToCartButtons();
  setupCarousel();
  setupForms();
  setupNavigation();
  setupModals();
  updateCartCount();
}

// Run the initialize function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initialize);
