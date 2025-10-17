//Matches localStorage cart key used in main.js
const CART_KEY = 'moonies_cart_v1';
const ORDER_KEY = 'moonies_order_v1';

function $(id) { return document.getElementById(id); }

//get saved cart
let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

//helpers
function getCartTotal() {
    return cart.reduce((s, p) => s + Number(p.price || 0), 0);
}

function getCartTotal() {
    return cart.reduce((s, p) => s + Number(p.price || 0), 0);
}

function formatCurrency(n) {
    return `₦${n}`;
}

//render order summary

function renderMiniCart() {
    const mini = $('mini-cart');
    const summaryEl = document.getElementById('mini-cart');
summaryEl.innerHTML = cart.length === 0
  ? 'Your cart is empty'
  : `${cart.length} item(s) - ${formatCurrency(getCartTotal())}`;


    summaryEl.innerHTML = '';
    if (cart.length === 0) {
        summary.innerHTML = '<p class="empty-note">Your cart is empty</p>';
    }
    else {
        cart.forEach(it => {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.justifyContent = 'space-between';
            row.style.marginBottom = '.5rem';
            row.innerHTML = `<div style="font-weight:600">${it.name}</div> <div class="muted">₦${it.price}</div>`;
            summaryEl.appendChild(row);
        });
    }
    $('checkout-total').textContent = formatCurrency(getCartTotal());
}

//validation helpers
function isNotEmpty(val){ return val && val.trim().length > 0; }
function cardNumberLooksOkay(v){ return /^[0-9\s]{13,19}$/.test(v); } //basic check
function expiryLooksOkay(v){ return /^(0[1-9]|1[0-2])\/\d{2}$/.test(v); } //MM/YY
function cvvLooksOkay(v){ return /^\d{3,4}$/.test(v); } //3 or 4 digits


//enable/disable pay button based on form state
function updatePayButtonState() {
    const payBtn = $('pay-btn');
    const nameOk = isNotEmpty($('full-name').value);
    const isCard = $('pay-card').checked;
    const isBank = $('pay-bank').checked;
    const isDelivery = document.querySelector('input[name="fulfillment"]:checked')?.value === 'delivery';

    let paymentOk = false;
    if (isCard) {
        paymentOk = cardNumberLooksOkay($('card-number').value) && expiryLooksOkay($('card-expiry').value) && cvvLooksOkay($('card-cvv').value);
    } else if (isBank) {
        paymentOk = $('bank-confirm').checked;
    }

    let addressOk = true;
    if (isDelivery) {
        addressOk = isNotEmpty($('address-line1').value) && isNotEmpty($('address-city').value) && isNotEmpty($('address-state').value);
    }

    const cartHasItems = cart.length > 0;

    const enable = nameOk && paymentOk && addressOk && cartHasItems;
    if (enable) {
        payBtn.classList.remove('disabled');
        payBtn.removeAttribute('aria-disabled');
    } else {
        payBtn.classList.add('disabled');
        payBtn.setAttribute('aria-disabled', 'true');
    }
}

//UI toggles (card vs bank) and address
function updatePaymentUI() {
    const cardFields = $('card-fields');
    const bankRow = $('bank-confirm-row');
    const payCard = $('pay-card').checked;
    if (payCard) {
        cardFields.classList.remove('hidden');
        bankRow.classList.add('hidden');
    } else {
        cardFields.classList.add('hidden');
        bankRow.classList.remove('hidden');
    }
    updatePayButtonState();
}

function updateAddressUI() {
    const isDelivery = document.querySelector('input[name="fulfillment"]:checked')?.value === 'delivery';
    const addressBlock = $('address-block');
    if (isDelivery) addressBlock.classList.remove('hidden');
    else addressBlock.classList.add('hidden');
    updatePayButtonState();
}

//on successfull payment, generate order and redirect to thank you page
function finalizeOrder() {
    //generate random order number  (starting with #)
    const n = Math.floor(100000 + Math.random() * 900000); //6-digit
    const orderNumber = `#MOON${n}`;

    //collect customer details
    const customer = {
        fullName: $('full-name').value.trim(),
        paymentMethod: $('pay-card').checked ? 'Card' : 'bank',
        fulfillment: document.querySelector('input[name="fulfillment"]:checked').value,
        address: {}
    };

    if (customer.fulfillment === 'delivery') {
        customer.address = {
            line1: $('address-line1').value.trim(),
            city: $('address-city').value.trim(),
            state: $('address-state').value.trim(),
            postal: $('address-postal').value.trim(),
        };
    }

    //create order object
    const order = {
        orderNumber,
        createdAt: new Date().toISOString(),
        total: getCartTotal(),
        items: cart,
        customer
    };

    //save so thankyou page can access
    localStorage.setItem(ORDER_KEY, JSON.stringify(order));

    //clear cart
    localStorage.removeItem(CART_KEY);

    //redirect to thank you page
    window.location.href = 'thankyou.html';
}

//event wiring
document.addEventListener('DOMContentLoaded', () => {
    renderMiniCart();

    //payment radio change
    document.querySelectorAll('input[name="payMethod"]').forEach(r => r.addEventListener('change', updatePaymentUI));

    //fulfillment radio change
    document.querySelectorAll('input[name="fulfillment"]').forEach(r => r.addEventListener('change', updateAddressUI));

    //form inputs to validate on input
    const watchIds = ['full-name', 'card-number', 'card-expiry', 'card-cvv', 'bank-confirm', 'address-line1', 'address-city', 'address-state'];
    watchIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', updatePayButtonState);
        el.addEventListener('change', updatePayButtonState);
    });

    //click pay button
    $('pay-btn').addEventListener('click', () => {
        if ($('pay-btn').classList.contains('disabled')) return;
        //show a tiny animation / disable while processing
        $('pay-btn').textContent = 'Processing...';
        setTimeout(() => {
            finalizeOrder();
        }, 700); //short fake delay
    });

    //intial UI state
    updatePaymentUI();
    updateAddressUI();
    updatePayButtonState();
});