// Affichage du catalogue
function renderProducts(items) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';
    document.getElementById('product-count').textContent = `${items.length} produit${items.length > 1 ? 's' : ''}`;

    items.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.onclick = () => showDetails(prod.id);
        card.innerHTML = `
            <div class="image-container">
                <img class="product-img" src="${prod.image}" alt="${prod.title}">
            </div>
            <div class="product-details">
                <div class="product-title">${prod.title}</div>
                <div class="product-price">${prod.price.toFixed(2)} €</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterProducts() {
    const cat = document.getElementById('category-filter').value;
    renderProducts(cat === 'all' ? products : products.filter(p => p.category === cat));
}

function setActiveNav(id) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    if(id) document.getElementById(id).classList.add('active');
}

function showCatalog() {
    document.querySelectorAll('.page-view').forEach(el => el.style.display = 'none');
    document.getElementById('catalog-view').style.display = 'block';
    setActiveNav('nav-home');
    tg.BackButton.hide();
}

function showDetails(id) {
    const prod = products.find(p => p.id === id);
    if (!prod) return;

    document.getElementById('details-img').src = prod.image;
    document.getElementById('details-title').textContent = prod.title;
    document.getElementById('details-price').textContent = `${prod.price.toFixed(2)} €`;
    document.getElementById('details-desc').textContent = prod.description;
    
    document.getElementById('add-to-cart-btn').onclick = () => {
        addToCart(prod.id);
        showCart();
    };

    document.getElementById('catalog-view').style.display = 'none';
    document.getElementById('cart-view').style.display = 'none';
    document.getElementById('infos-view').style.display = 'none';
    document.getElementById('contact-view').style.display = 'none';
    document.getElementById('details-view').style.display = 'block';

    tg.BackButton.show();
    tg.BackButton.onClick(showCatalog);
}

function showCart() {
    renderCart();
    document.getElementById('catalog-view').style.display = 'none';
    document.getElementById('details-view').style.display = 'none';
    document.getElementById('infos-view').style.display = 'none';
    document.getElementById('contact-view').style.display = 'none';
    document.getElementById('cart-view').style.display = 'block';
    setActiveNav('nav-cart');

    tg.BackButton.show();
    tg.BackButton.onClick(showCatalog);
}

function showInfos() {
    document.getElementById('catalog-view').style.display = 'none';
    document.getElementById('details-view').style.display = 'none';
    document.getElementById('cart-view').style.display = 'none';
    document.getElementById('contact-view').style.display = 'none';
    document.getElementById('infos-view').style.display = 'block';
    setActiveNav('nav-infos');

    tg.BackButton.show();
    tg.BackButton.onClick(showCatalog);
}

function showContact() {
    document.getElementById('catalog-view').style.display = 'none';
    document.getElementById('details-view').style.display = 'none';
    document.getElementById('cart-view').style.display = 'none';
    document.getElementById('infos-view').style.display = 'none';
    document.getElementById('contact-view').style.display = 'block';
    setActiveNav('nav-contact');

    tg.BackButton.show();
    tg.BackButton.onClick(showCatalog);
}

renderProducts(products);
