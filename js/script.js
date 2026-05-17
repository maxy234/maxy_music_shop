// ========== PRODUCT DATA (12 items in GHS) ==========
const productsData = [
    { id: 1, name: "FL Studio 21 Producer Edition", category: "Music Software", price: 0.2, image: "images/FL Studio 21 Producer.jpg" },
    { id: 2, name: "Ableton Live 11 Suite", category: "Music Software", price: 1299, image: "images/Ableton Live 11 Suite.jpg" },
    { id: 3, name: "Logic Pro X", category: "Music Software", price: 1499, image: "images/Logic Pro X.jpg" },
    { id: 4, name: "Yamaha P-125 Digital Piano", category: "Instruments", price: 4250, image: "images/Yamaha P-125 Digital Piano.jpg" },
    { id: 5, name: "Roland FP-30X Keyboard", category: "Instruments", price: 3899, image: "images/Roland FP-30X Keyboard.jpg" },
    { id: 6, name: "Fender Stratocaster Guitar", category: "Instruments", price: 3299, image: "images/Fender Stratocaster Guitar.jpg" },
    { id: 7, name: "Shure SM7B Microphone", category: "Accessories", price: 1899, image: "images/Shure SM7B Microphone.jpg" },
    { id: 8, name: "Audio-Technica ATH-M50x", category: "Accessories", price: 999, image: "images/Audio-Technica ATH-M50x.jpg" },
    { id: 9, name: "Focusrite Scarlett 2i2", category: "Accessories", price: 1199, image: "images/Focusrite Scarlett 2i2.jpg" },
    { id: 10, name: "NI Komplete Kontrol M32", category: "Music Software", price: 2799, image: "images/NI Komplete Kontrol M32.jpg" },
    { id: 11, name: "Gibson Les Paul Electric", category: "Instruments", price: 4999, image: "images/Gibson Les Paul Electric.jpg" },
    { id: 12, name: "KRK Rokit 5 Monitors", category: "Accessories", price: 1599, image: "images/KRK Rokit 5 Monitors.jpg" }
];

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
    document.getElementById("cartCount").innerText = count;
}

function getProductById(id) {
    return productsData.find(p => p.id == id);
}

// ========== RENDER PRODUCTS ==========
function renderProducts() {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;
    
    let filtered = productsData.filter(p => currentFilter === "all" ? true : p.category === currentFilter);
    
    if (searchTerm.trim() !== "") {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term));
    }
    
    grid.innerHTML = filtered.map(p => {
        const cartItem = cart.find(item => item.id === p.id);
        const inCart = !!cartItem;
        return `
            <div class="product-card" data-id="${p.id}">
                <img src="${p.image}" class="product-img" alt="${p.name}" onerror="this.src='https://placehold.co/400x300?text=Music+Gear'">
                <h3 class="product-title">${p.name}</h3>
                <p class="product-price">GHS ${p.price.toLocaleString()}</p>
                <button class="add-to-cart ${inCart ? 'remove-mode' : ''}" data-id="${p.id}">${inCart ? 'Remove from Cart' : 'Add to Cart'}</button>
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
        return `
            <div class="cart-item" data-id="${item.id}">
                <img src="${prod.image}" class="cart-item-img" onerror="this.src='https://placehold.co/70x70?text=gear'">
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
    document.getElementById("cartTotalGHS").innerText = `GHS ${total.toLocaleString()}`;
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
    const handler = PaystackPop.setup({
        key: 'pk_live_eaccd6908452f06a64169fc02a9cc4b266e3f486', // 🔴 REPLACE WITH YOUR LIVE PAYSTACK KEY
        email: userData.email,
        amount: totalAmount * 100,
        currency: 'GHS',
        ref: 'MAXY_' + Math.floor(Math.random() * 1000000000),
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
            <i class="fas fa-check-circle" style="font-size: 4rem; color: #28a745;"></i>
            <h2>Payment Successful! 🎉</h2>
            <p>Thank you <strong>${userData.fullName}</strong> for shopping with MaxyKeys!</p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 16px; margin: 20px 0; text-align: left;">
                <h4>Order Summary:</h4>
                <ul style="margin-top: 10px;">
                    ${cartItems.map(item => {
                        const p = getProductById(item.id);
                        return `<li>${p.name} x ${item.quantity} = GHS ${(p.price * item.quantity).toLocaleString()}</li>`;
                    }).join('')}
                </ul>
                <hr>
                <p><strong>Total: GHS ${cartItems.reduce((s, i) => s + (getProductById(i.id).price * i.quantity), 0).toLocaleString()}</strong></p>
            </div>
            <p><i class="fas fa-truck"></i> Contact admin for delivery:</p>
            <a href="https://wa.me/233503139412?text=Hello! I just paid for my order. My name is ${encodeURIComponent(userData.fullName)}. Order items: ${encodeURIComponent(cartItems.map(i => getProductById(i.id).name).join(', '))}" target="_blank" class="btn-primary" style="margin: 10px 0; display: inline-block;">📱 Send Order on WhatsApp</a>
        </div>
    `;
    document.getElementById("summaryContent").innerHTML = summaryHtml;
    document.getElementById("summaryModal").style.display = "flex";
    
    cart = [];
    saveCart();
    renderProducts();
    renderCartModal();
    document.getElementById("userForm").reset();
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
        cartBtn.onclick = () => { renderCartModal(); cartModal.style.display = "flex"; };
    }
    
    closeBtns.forEach(btn => {
        btn.onclick = () => { cartModal.style.display = "none"; summaryModal.style.display = "none"; };
    });
    
    if (continueBtn) continueBtn.onclick = () => cartModal.style.display = "none";
    
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
            cartModal.style.display = "none";
            payWithPaystack(total, user, [...cart]);
        };
    }
    
    if (okBtn) okBtn.onclick = () => { summaryModal.style.display = "none"; location.reload(); };
    
    window.onclick = (e) => {
        if (e.target === cartModal) cartModal.style.display = "none";
        if (e.target === summaryModal) summaryModal.style.display = "none";
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
            searchInput.value = "";
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

// ========== ACTIVE NAVIGATION ==========
function initActiveNav() {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-links a");
    
    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (scrollY >= sectionTop) {
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
    initActiveNav();
});