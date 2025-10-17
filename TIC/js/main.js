//shared cart logic and helpers

const CART_KEY = 'moonies_cart_v1';
let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

//save cart to local storage
function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCartSidebar();
}

//add product object to cart (no quantity complexity)
function addToCart(product) {
    if (!cart.find(p => p.id === product.id)) {
        cart.push(product);
        saveCart();
    }
}

//remove by id 
function removeFromCart(productId) {
    cart = cart.filter(p => p.id !== productId);
    saveCart();
}

//check if in cart
function isInCart(productId) {
    return !!cart.find(p => p.id === productId);
}

//total price 
function getCartTotal() {
    return cart.reduce((s, p) => s + Number(p.price || 0), 0);
}

//UI: render the cart sidebar
function renderCartSidebar() {
    const container = document.getElementById('cart-items');
    const totalE1 = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    container.innerHTML = '';
    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-note">Your cart is empty</p>';
        checkoutBtn.classList.add('disabled');
        checkoutBtn.setAttribute('aria-disabled', 'true');
    }
    else {
        cart.forEach(item => {
            const row = document.createElement('div');
            row.className = 'cart-row';
            row.innerHTML = ` 
            <div>
                <div style="font-weight:600">${item.name}</div>
                <div class="muted" style="font-size:.85rem">${item.price}</div>
            </div>
            <div>
                <button class="remove" data-id="${item.id}">X</button>
            </div>
            `;
            container.appendChild(row);
        });

        checkoutBtn.classList.remove('disabled');
        checkoutBtn.removeAttribute('aria-disabled');
    }
    totalE1.textContent = `₦${getCartTotal()}`;
}

//handle remove click
document.addEventListener('click', (e) => {
    if (e.target.matches('.remove')) {
        const id = e.target.dataset.id;
        removeFromCart(id);
    }
});

//run once on load
document.addEventListener('DOMContentLoaded', () => {
    renderCartSidebar();
});
