//sample product list (covering categories)

const products = [
    { id: "b001", name: "Classic Jeans", category: "bottoms", sub: "jeans", price: 4000, image: "images/Jeans-Larga-Y2K-Vintage.jpg", description: "High-waist classic blue jeans." },
    { id: "b002", name: "Office Pants", category: "bottoms", sub: "office pants", price: 4500, image: "images/simple-white-office-pants.jpg", description: "Tailored office pants, comfy fit." },
    { id: "b003", name: "Casual Shorts", category: "bottoms", sub: "shorts", price: 2500, image: "images/High-Waisted-Jeans-Cargo.jpg", description: "High Waisted Cargo Jeans." },
    { id: "b004", name: "Summer Skirt", category: "bottoms", sub: "skirts", price: 3000, image: "images/Denim-skirt-with-bows.jpg", description: "Jean skirt with bows and ruffles." },
   
    { id: "t001", name: "Cropped Top", category: "tops", sub: "cropped tops", price: 1800, image: "images/cute-halter-neck-top.jpg", description: "Cute halter neck top." },
    { id: "t002", name: "Elegant Blouse", category: "tops", sub: "elegant tops", price: 3200, image: "images/Cute-off-shoulder-top.jpg", description: "Cute long-sleeved off shoulder top." },
    { id: "t003", name: "Casual T-Shirt", category: "tops", sub: "t-shirts", price: 1500, image: "images/striped-cute-shirt.jpg", description: "Comfortable cotton stripped shirt." },
    { id: "t004", name: "Denim Jacket", category: "tops", sub: "jackets", price: 5000, image: "images/simple-shirt-purple.jpg", description: "Classic purple shirt." },

    { id: "d001", name: "Party Dress", category: "dresses", sub: "party", price: 7200, image: "images/Blue-Elegant-Dress-Long.jpg", description: "Blue prom dress, long sleeved." },
    { id: "d002", name: "Summer Dress", category: "dresses", sub: "summer", price: 6800, image: "images/Womens-Summer-Denim-Dress.jpg", description: "Light and breezy summer dress." },
    { id: "d003", name: "Casual Dress", category: "dresses", sub: "casual", price: 5000, image: "images/Red-Mini-Dress.jpg", description: "Mini dinner dress." },

    { id: "a001", name: "Pearl Necklace", category: "accessories", sub: "necklaces", price: 1300, image: "images/Black-Satin-Ribbon.jpg", description: "Black satin ribbon." },
    { id: "a002", name: "Leather Belt", category: "accessories", sub: "belts", price: 900, image: "images/Peak-Ring.jpg", description: "Cute gold rings" },
    { id: "a003", name: "Sunglasses", category: "accessories", sub: "sunglasses", price: 2200, image: "images/Quartz-Vintage-Ring.jpg", description: "Quarts vintage ring." }
];

const grid = document.getElementById('products-grid');
const modal = document.getElementById('product-modal');
const modalClose = document.getElementById('modal-close');
const modalImage = document.getElementById('modal-image');
const modalName = document.getElementById('modal-name');
const modalCategory = document.getElementById('modal-category');
const modalDesc = document.getElementById('modal-desc');
const modalPrice = document.getElementById('modal-price');
const modalToggleBtn = document.getElementById('modal-toggle-cart');

let activeProductId = null; //current modal product

//render products
function renderProducts(filterFn = "all") {
    grid.innerHTML = '';
    const list = products.filter(p => filterFn === 'all' ? true : p.category === filterFn);

    list.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
        <img src="${p.image}" alt="${p.name}" class="product-thumb" />
        <div class="product-meta">
            <div>
            <div class = "product-name">${p.name}</div>
            <div class = "more-desc">${p.description}</div>
            </div>
            <div class = "product-price">${p.price}</div>
        </div>
        `;
        //open modal on click with product details
        card.addEventListener('click', () => openProductModal(p.id));
        grid.appendChild(card);
    });

}

//open modal
function openProductModal(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;

    activeProductId = id;
    modalImage.src = p.image;
    modalName.textContent = p.name;
    modalCategory.textContent = `${capitalize(p.category)} • ${p.sub}`;
    modalDesc.textContent = p.description;
    modalPrice.textContent = `₦${p.price}`;

    if (isInCart(id)) {
        modalToggleBtn.textContent = 'Remove from Cart';
        modalToggleBtn.dataset.action = 'remove';
    }
    else {
        modalToggleBtn.textContent = 'Add to Cart';
        modalToggleBtn.dataset.action = 'add';
    }

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
}

//close modal
modalClose.addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    activeProductId = null;
});

//handle add/remove cart from modal button
modalToggleBtn.addEventListener('click', () => {
    const p = products.find(x => x.id === activeProductId);
    if (!p) return;

    if(isInCart(p.id)) {
        removeFromCart(p.id);
        modalToggleBtn.textContent = 'Add to Cart';
        modalToggleBtn.dataset.action = 'add';
    }
    else {
        addToCart(p);
        modalToggleBtn.textContent = 'Remove from Cart';
        modalToggleBtn.dataset.action = 'remove';
    }
});

//filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        renderProducts(filter);
    });
});

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

//initial render
document.addEventListener('DOMContentLoaded', () => {
    renderProducts('all');
}); 