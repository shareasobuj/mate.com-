// ১. মক প্রোডাক্ট ডেটা (প্রাইস ও ইমেজ সহ)
const products = [
    { id: 1, title: "Wireless Bluetooth Headphones", price: 1250, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" },
    { id: 2, title: "Smart Watch Series 7 with AMOLED", price: 3400, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" },
    { id: 3, title: "Premium Leather Wallet for Men", price: 850, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500" },
    { id: 4, title: "Ergonomic Gaming Mouse RGB", price: 1500, image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500" },
    { id: 5, title: "Sports Running Shoes", price: 2200, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" },
    { id: 6, title: "Waterproof Travel Backpack", price: 1800, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500" }
];

let cart = [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// ২. পেজ লোড হলে প্রোডাক্ট জেনারেট করা ও ইউজার স্টেট চেক করা
window.onload = function() {
    renderProducts();
    updateAuthState();
};

function renderProducts() {
    const container = document.getElementById('productsContainer');
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.title}">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-price">৳${product.price}</p>
            <button class="add-btn" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `).join('');
}

// ৩. সাইন-আপ ও লগইন ফাংশনালিটি (LocalStorage ব্যবহার করে)
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
}

function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signUpName').value;
    const email = document.getElementById('signUpEmail').value;
    const pass = document.getElementById('signUpPass').value;

    const user = { name, email, pass };
    localStorage.setItem('user_' + email, JSON.stringify(user));
    alert('Registration Successful! Please Login.');
    toggleModal('signupModal');
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;

    const storedUser = JSON.parse(localStorage.getItem('user_' + email));

    if (storedUser && storedUser.pass === pass) {
        currentUser = storedUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        alert('Welcome back, ' + currentUser.name);
        toggleModal('loginModal');
        updateAuthState();
    } else {
        alert('Invalid Email or Password!');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthState();
    document.getElementById('userDashboard').classList.add('hidden');
}

function updateAuthState() {
    if (currentUser) {
        document.getElementById('loginBtn').classList.add('hidden');
        document.getElementById('signupBtn').classList.add('hidden');
        document.getElementById('dashboardBtn').classList.remove('hidden');
        document.getElementById('logoutBtn').classList.remove('hidden');
        document.getElementById('welcomeMsg').innerText = `Hello, ${currentUser.name} | `;
        
        // Update Dashboard Data
        document.getElementById('dbName').innerText = currentUser.name;
        document.getElementById('dbEmail').innerText = currentUser.email;
    } else {
        document.getElementById('loginBtn').classList.remove('hidden');
        document.getElementById('signupBtn').classList.remove('hidden');
        document.getElementById('dashboardBtn').classList.add('hidden');
        document.getElementById('logoutBtn').classList.add('hidden');
        document.getElementById('welcomeMsg').innerText = '';
    }
}

function toggleDashboard() {
    const db = document.getElementById('userDashboard');
    db.classList.toggle('hidden');
    db.scrollIntoView({ behavior: 'smooth' });
}

// ৪. কার্ট (Cart) ফাংশনালিটি
function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('active');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    updateCartUI();
}

function updateCartUI() {
    document.getElementById('cartCount').innerText = cart.length;
    const cartItemsContainer = document.getElementById('cartItems');
    
    let total = 0;
    cartItemsContainer.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `
            <div class="flex-space" style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">
                <img src="${item.image}" style="width: 40px; height: 40px; object-fit: contain;">
                <span style="font-size: 12px; width: 60%;">${item.title}</span>
                <span style="font-weight: bold;">৳${item.price}</span>
            </div>
        `;
    }).join('');

    document.getElementById('cartTotal').innerText = total;
}

// ৫. মক পেমেন্ট গেটওয়ে (Mock Payment Prompt)
function processPayment() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    if (!currentUser) {
        alert("Please login first to checkout!");
        toggleModal('loginModal');
        return;
    }

    const totalAmount = document.getElementById('cartTotal').innerText;
    const paymentMethod = prompt(`Your total bill is ৳${totalAmount}.\nChoose Payment Method:\n1. bKash\n2. Rocket\n3. Cash on Delivery`);

    if (paymentMethod === '1' || paymentMethod === '2' || paymentMethod.toLowerCase() === 'bkash' || paymentMethod.toLowerCase() === 'rocket') {
        const phone = prompt("Enter your Account Number:");
        const pin = prompt("Enter 4-digit PIN (Mock Demo):");
        if(phone && pin) {
            alert(`⚡ Payment Successful via Mobile Banking!\nThank you ${currentUser.name}, your order has been placed successfully.`);
            clearCart();
        }
    } else if (paymentMethod === '3' || paymentMethod.toLowerCase().includes('cash')) {
        alert(`📦 Order Confirmed!\nYou will pay ৳${totalAmount} on Cash on Delivery.`);
        clearCart();
    } else {
        alert("Payment Cancelled or Invalid Choice.");
    }
}

function clearCart() {
    cart = [];
    updateCartUI();
    toggleCart();
  }
