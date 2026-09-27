let cart = [];

function addToCart(productId) {
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        const prod = products.find(p => p.id === productId);
        cart.push({ id: prod.id, title: prod.title, price: prod.price, quantity: 1 });
    }
    updateCartBadge();
}

function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
    }
    updateCartBadge();
    renderCart();
}

function updateCartBadge() {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    document.getElementById('cart-badge').textContent = totalItems;
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 20px 0;">Votre panier est vide.</p>`;
        document.getElementById('cart-total-price').textContent = '0.00 €';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
            <div class="cart-item-info">
                <span class="cart-item-title">${item.title}</span>
                <span class="cart-item-price">${item.price.toFixed(2)} € x ${item.quantity} = ${itemTotal.toFixed(2)} €</span>
            </div>
            <div class="cart-controls">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
        `;
        container.appendChild(row);
    });

    document.getElementById('cart-total-price').textContent = `${total.toFixed(2)} €`;
}

async function submitOrder() {
    if (cart.length === 0) {
        tg.showAlert("Votre panier est vide !");
        return;
    }

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    let buyerTag = telegramUser.username 
        ? `@${telegramUser.username}` 
        : `[${telegramUser.first_name}](tg://user?id=${telegramUser.id})`;
    
    let message = `🚨 *NOUVELLE COMMANDE*\n\n`;
    message += `👤 *Acheteur :* ${buyerTag}\n`;
    message += `🆔 *ID Telegram :* \`${telegramUser.id}\`\n\n`;
    message += `📦 *Articles :*\n`;
    
    cart.forEach(item => {
        message += `• ${item.title} x${item.quantity} — ${(item.price * item.quantity).toFixed(2)} €\n`;
    });
    
    message += `\n💰 *Total :* ${totalAmount.toFixed(2)} €`;

    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: ORDERS_CHANNEL_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        tg.showAlert("Commande confirmée !", () => {
            tg.close();
        });

    } catch (err) {
        console.error("Erreur d'envoi :", err);
        tg.showAlert("Erreur lors de la validation. Veuillez réessayer.");
    }
}
