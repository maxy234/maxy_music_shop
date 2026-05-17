// ========== PRODUCT DATA (12 items in GHS) ==========
// YOU CAN EDIT THIS ARRAY TO ADD YOUR OWN IMAGES
// Just replace the image URLs with your own image paths or URLs

const productsData = [
    { id: 1, name: "FL Studio 21 Producer Edition", category: "Music Software", price: 0.1, image: "images/fl-studio.jpg" },
    { id: 2, name: "Ableton Live 11 Suite", category: "Music Software", price: 1299, image: "images/ableton-live.jpg" },
    { id: 3, name: "Logic Pro X", category: "Music Software", price: 1499, image: "images/logic-pro.jpg" },
    { id: 4, name: "Yamaha P-125 Digital Piano", category: "Instruments", price: 4250, image: "images/yamaha-p125.jpg" },
    { id: 5, name: "Roland FP-30X Keyboard", category: "Instruments", price: 3899, image: "images/rol.jpg" },
    { id: 6, name: "Fender Stratocaster Guitar", category: "Instruments", price: 3299, image: "images/fender-strat.jpg" },
    { id: 7, name: "Shure SM7B Microphone", category: "Accessories", price: 1899, image: "images/shure-sm7b.jpg" },
    { id: 8, name: "Audio-Technica ATH-M50x", category: "Accessories", price: 999, image: "images/ath-m50x.jpg" },
    { id: 9, name: "Focusrite Scarlett 2i2", category: "Accessories", price: 1199, image: "images/scarlett-2i2.jpg" },
    { id: 10, name: "NI Komplete Kontrol M32", category: "Music Software", price: 2799, image: "images/komplete-kontrol.jpg" },
    { id: 11, name: "Gibson Les Paul Electric", category: "Instruments", price: 4999, image: "images/gibson-les-paul.jpg" },
    { id: 12, name: "KRK Rokit 5 Monitors", category: "Accessories", price: 1599, image: "images/krk-rokit5.jpg" }
];

// ========== IMAGE CONFIGURATION SECTION ==========
// ⭐ EASY IMAGE INSERTION GUIDE ⭐
// 
// OPTION 1: Use local images (recommended)
//   1. Create an "images" folder in your project directory
//   2. Put your product images inside the "images" folder
//   3. Update the image paths above like: "images/your-image-name.jpg"
//
// OPTION 2: Use online image URLs
//   1. Upload your images to a free hosting service (Imgur, PostImage, etc.)
//   2. Copy the direct image URL
//   3. Paste it in the image field above like: "https://example.com/image.jpg"
//
// OPTION 3: Use placeholder images (temporary)
//   Currently using placeholders - replace with your actual images
//
// DEFAULT FALLBACK: If an image fails to load, a placeholder will appear automatically

// Image fallback settings
const DEFAULT_IMAGE = "https://placehold.co/400x300/e09112/white?text=Music+Gear";
const IMAGE_FOLDER = "images/"; // Change this if your images are in a different folder

// Helper function to handle image loading errors
function handleImageError(imgElement, productName) {
    if (!imgElement.src.includes("placehold.co")) {
        imgElement.src = `https://placehold.co/400x300/2a2a3e/white?text=${encodeURIComponent(productName.substring(0, 20))}`;
    }
}

// ========== CART STATE ==========
let cart = JSON.parse(localStorage.getItem("maxyKeysCart")) || [];
let currentFilter = "all";
let searchTerm = "";

// Helper Functions
function saveCart() {
    localStorage.setItem("maxyKeysCart", JSON.stringify(cart));
    updateCartCount();
    renderCartModal();
    renderProducts();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountSpan = document.getElementById("cartCount");
    if (cartCountSpan) cartCountSpan.innerText = count;
}

function getProductById(id) {
    return productsData.find(p => p.id == id);
}

// ========== RENDER PRODUCTS (with image handling) ==========
function renderProducts() {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;
    
    let filtered = productsData.filter(p => currentFilter === "all" ? true : p.category === currentFilter);
    
    if (searchTerm.trim() !== "") {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term));
    }
    
    if (filtered.length === 0) {
        grid.innerHTML = '<p style="text-align:center; grid-column:1/-1;">No products found. Try another search!</p>';
        return;
    }
    
    grid.innerHTML = filtered.map(p => {
        const cartItem = cart.find(item => item.id === p.id);
        const inCart = !!cartItem;
        // Ensure image path is valid
        const imageSrc = p.image && p.image.trim() !== "" ? p.image : DEFAULT_IMAGE;
        return `
            <div class="product-card" data-id="${p.id}">
                <img src="${imageSrc}" class="product-img" alt="${p.name}" onerror="this.onerror=null; this.src='${DEFAULT_IMAGE}'">
                <h3 class="product-title">${p.name}</h3>
                <p class="product-price">GHS ${p.price.toLocaleString()}</p>
                <button class="add-to-cart ${inCart ? 'remove-mode' : ''}" data-id="${p.id}">${inCart ? 'Remove' : 'Add to Cart'}</button>
            </div>
        `;
    }).join("");
    
    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const pid = parseInt(btn.dataset.id);
            const existingIndex = cart.findIndex(i => i.id === pid);
            if (existingIndex !== -1) {
                cart.splice(existingIndex, 1);
            } else {
                cart.push({ id: pid, quantity: 1 });
            }
            saveCart();
            renderProducts();
            renderCartModal();
        });
    });
}

// ========== RENDER CART MODAL ==========
function renderCartModal() {
    const container = document.getElementById("cartItemsList");
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart-msg"><i class="fas fa-shopping-bag"></i> Your cart is empty. Start shopping!</p>';
        updateTotal();
        return;
    }
    
    container.innerHTML = cart.map(item => {
        const prod = getProductById(item.id);
        const imageSrc = prod.image && prod.image.trim() !== "" ? prod.image : DEFAULT_IMAGE;
        return `
            <div class="cart-item" data-id="${item.id}">
                <img src="${imageSrc}" class="cart-item-img" onerror="this.src='${DEFAULT_IMAGE}'">
                <div style="flex:2">
                    <strong>${prod.name}</strong><br>
                    <small>GHS ${prod.price}</small>
                </div>
                <div class="quantity-controls">
                    <button class="qty-down" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-up" data-id="${item.id}">+</button>
                </div>
                <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
    }).join("");
    
    document.querySelectorAll(".qty-up").forEach(btn => {
        btn.addEventListener("click", () => changeQuantity(parseInt(btn.dataset.id), 1));
    });
    document.querySelectorAll(".qty-down").forEach(btn => {
        btn.addEventListener("click", () => changeQuantity(parseInt(btn.dataset.id), -1));
    });
    document.querySelectorAll(".remove-item").forEach(btn => {
        btn.addEventListener("click", () => {
            cart = cart.filter(i => i.id !== parseInt(btn.dataset.id));
            saveCart();
            renderCartModal();
            renderProducts();
        });
    });
    updateTotal();
}

function changeQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        saveCart();
        renderCartModal();
        renderProducts();
    }
}

function updateTotal() {
    const total = cart.reduce((sum, item) => sum + (getProductById(item.id).price * item.quantity), 0);
    const totalSpan = document.getElementById("cartTotalGHS");
    if (totalSpan) totalSpan.innerText = `GHS ${total.toLocaleString()}`;
}

// ========== FORM VALIDATION ==========
function validateUserForm() {
    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const region = document.getElementById("region").value.trim();
    const town = document.getElementById("town").value.trim();
    const area = document.getElementById("area").value.trim();
    const address = document.getElementById("houseAddress").value.trim();
    
    if (!name) { showError("Please enter your full name"); return false; }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) { showError("Please enter a valid email address"); return false; }
    if (!phone || phone.length < 9) { showError("Please enter a valid phone number (min 9 digits)"); return false; }
    if (!region || !town || !area || !address) { showError("Please fill all address fields"); return false; }
    
    return true;
}

function showError(msg) {
    const errorSpan = document.getElementById("formError");
    if (errorSpan) {
        errorSpan.innerText = msg;
        setTimeout(() => errorSpan.innerText = "", 3000);
    } else {
        alert(msg);
    }
}

// ========== PAYSTACK INTEGRATION ==========
function payWithPaystack(totalAmount, userData, cartItems) {
    // ⚠️ IMPORTANT: Replace this key with your actual Paystack public key
    // For testing: Use 'pk_test_...' (test key)
    // For live: Use 'pk_live_...' (live key)
    const PAYSTACK_PUBLIC_KEY = 'pk_live_eaccd6908452f06a64169fc02a9cc4b266e3f486';
    
    const handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: userData.email,
        amount: totalAmount * 100,
        currency: 'GHS',
        ref: 'MAXY_' + Math.floor(Math.random() * 1000000000) + '_' + Date.now(),
        callback: function(response) {
            onPaymentSuccess(userData, cartItems);
        },
        onClose: function() {
            alert('Transaction cancelled.');
        }
    });
    handler.openIframe();
}

function onPaymentSuccess(userData, cartItems) {
    const summaryHtml = `
        <div style="text-align: center;">
            <i class="fas fa-check-circle" style="font-size: 3rem; color: #28a745;"></i>
            <h2>Payment Successful! 🎉</h2>
            <p>Thank you <strong>${escapeHtml(userData.fullName)}</strong> for shopping with MaxyKeys!</p>
            <div style="background: #f8f9fa; padding: 16px; border-radius: 16px; margin: 16px 0; text-align: left;">
                <h4>Order Summary:</h4>
                <ul style="margin-top: 10px;">
                    ${cartItems.map(item => {
                        const p = getProductById(item.id);
                        return `<li>${escapeHtml(p.name)} x ${item.quantity} = GHS ${(p.price * item.quantity).toLocaleString()}</li>`;
                    }).join('')}
                </ul>
                <hr>
                <p><strong>Total: GHS ${cartItems.reduce((s, i) => s + (getProductById(i.id).price * i.quantity), 0).toLocaleString()}</strong></p>
            </div>
            <p><i class="fas fa-truck"></i> Contact admin for delivery:</p>
            <a href="https://wa.me/233503139412?text=Hello! I just paid for my order. My name is ${encodeURIComponent(userData.fullName)}. Order items: ${encodeURIComponent(cartItems.map(i => getProductById(i.id).name).join(', '))}" target="_blank" class="btn-primary" style="margin: 10px 0; display: inline-block;">📱 Send Order on WhatsApp</a>
        </div>
    `;
    const summaryContent = document.getElementById("summaryContent");
    if (summaryContent) summaryContent.innerHTML = summaryHtml;
    const summaryModal = document.getElementById("summaryModal");
    if (summaryModal) summaryModal.style.display = "flex";
    
    cart = [];
    saveCart();
    renderProducts();
    renderCartModal();
    const userForm = document.getElementById("userForm");
    if (userForm) userForm.reset();
}

// Helper function to prevent XSS
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ========== MODAL CONTROLS ==========
function initModals() {
    const cartModal = document.getElementById("cartModal");
    const summaryModal = document.getElementById("summaryModal");
    const cartBtn = document.getElementById("cartBtn");
    const closeBtns = document.querySelectorAll(".close-modal, .close-summary");
    const continueBtn = document.getElementById("continueShoppingBtn");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const okBtn = document.getElementById("okSummaryBtn");
    
    if (cartBtn) {
        cartBtn.onclick = () => { renderCartModal(); if(cartModal) cartModal.style.display = "flex"; };
    }
    
    closeBtns.forEach(btn => {
        btn.onclick = () => { 
            if(cartModal) cartModal.style.display = "none"; 
            if(summaryModal) summaryModal.style.display = "none"; 
        };
    });
    
    if (continueBtn) continueBtn.onclick = () => { if(cartModal) cartModal.style.display = "none"; };
    
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            if (cart.length === 0) { alert("Your cart is empty!"); return; }
            if (!validateUserForm()) return;
            
            const user = {
                fullName: document.getElementById("fullName").value,
                email: document.getElementById("email").value,
                phone: document.getElementById("phone").value,
                region: document.getElementById("region").value,
                town: document.getElementById("town").value,
                area: document.getElementById("area").value,
                houseAddress: document.getElementById("houseAddress").value,
            };
            const total = cart.reduce((s, i) => s + (getProductById(i.id).price * i.quantity), 0);
            if(cartModal) cartModal.style.display = "none";
            payWithPaystack(total, user, [...cart]);
        };
    }
    
    if (okBtn) okBtn.onclick = () => { if(summaryModal) summaryModal.style.display = "none"; };
    
    window.onclick = (e) => {
        if (e.target === cartModal && cartModal) cartModal.style.display = "none";
        if (e.target === summaryModal && summaryModal) summaryModal.style.display = "none";
    };
}

// ========== SEARCH & FILTER ==========
function initSearchFilter() {
    const searchInput = document.getElementById("searchInput");
    const clearSearch = document.getElementById("clearSearch");
    const filterBtns = document.querySelectorAll(".filter-btn");
    
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchTerm = e.target.value;
            renderProducts();
        });
    }
    
    if (clearSearch) {
        clearSearch.onclick = () => {
            if(searchInput) searchInput.value = "";
            searchTerm = "";
            renderProducts();
        };
    }
    
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.dataset.category;
            renderProducts();
        });
    });
}

// ========== CONTACT FORM ==========
function initContactForm() {
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Thank you! Your message has been sent. We'll get back to you soon.");
            contactForm.reset();
        });
    }
}

// ========== MOBILE MENU ==========
function initMobileMenu() {
    const menuBtn = document.getElementById("mobileMenuBtn");
    const navLinks = document.getElementById("navLinks");
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener("click", () => {
            navLinks.classList.toggle("show");
        });
        
        // Close menu when a link is clicked (mobile)
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("show");
            });
        });
    }
}

// ========== ACTIVE NAVIGATION ==========
function initActiveNav() {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-links a");
    
    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute("id");
            }
        });
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    });
}

// ========== INITIALIZE ==========
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    updateCartCount();
    renderCartModal();
    initModals();
    initSearchFilter();
    initContactForm();
    initMobileMenu();
    initActiveNav();
});

// ========== HELPER FUNCTION: PRODUCT MANAGER (Console Tool) ==========
// Open browser console (F12) and type:
// - addProduct(name, category, price, imageUrl) - Add a new product
// - updateProductImage(productId, newImageUrl) - Update product image
// - listProducts() - See all products
// - removeProduct(productId) - Remove a product

window.productManager = {
    addProduct: function(name, category, price, imageUrl) {
        const newId = Math.max(...productsData.map(p => p.id)) + 1;
        productsData.push({
            id: newId,
            name: name,
            category: category,
            price: price,
            image: imageUrl || DEFAULT_IMAGE
        });
        renderProducts();
        console.log(`✅ Product "${name}" added with ID: ${newId}`);
        return newId;
    },
    
    updateProductImage: function(productId, newImageUrl) {
        const product = productsData.find(p => p.id === productId);
        if (product) {
            product.image = newImageUrl;
            renderProducts();
            console.log(`✅ Image updated for "${product.name}"`);
        } else {
            console.log(`❌ Product with ID ${productId} not found`);
        }
    },
    
    listProducts: function() {
        console.table(productsData.map(p => ({ id: p.id, name: p.name, category: p.category, price: p.price, image: p.image })));
    },
    
    removeProduct: function(productId) {
        const index = productsData.findIndex(p => p.id === productId);
        if (index !== -1) {
            const removed = productsData.splice(index, 1);
            renderProducts();
            console.log(`✅ Removed "${removed[0].name}"`);
        } else {
            console.log(`❌ Product with ID ${productId} not found`);
        }
    }
};

console.log("🎵 MaxyKeys Music Store Loaded!");
console.log("📷 To add your own images, edit the 'productsData' array at the top of this file");
console.log("💡 Or use the productManager in console: productManager.listProducts()");
console.log("📁 Create an 'images' folder and put your product images there");