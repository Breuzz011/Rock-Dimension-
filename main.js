document.addEventListener('DOMContentLoaded', () => {
    const buyButtons = document.querySelectorAll('.buy-btn');
    const cartContainer = document.querySelector('.cart-container');
    const checkoutContainer = document.querySelector('.checkout-container');

    // Lógica para a página principal (index.html)
    if (buyButtons.length > 0) {
        buyButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const card = event.target.closest('.vinyl-card');
                
                const product = {
                    id: card.dataset.id,
                    title: card.querySelector('h2').textContent,
                    price: card.querySelector('.price').textContent,
                    image: card.querySelector('.album-cover').src,
                };

                addToCart(product);
            });
        });
    }

    // Lógica para a página do carrinho (cart.html)
    if (cartContainer) {
        displayCartItems();
    }

    // Lógica para a página de checkout (checkout.html)
    if (checkoutContainer) {
        displayOrderSummary();
        const paymentForm = document.getElementById('payment-form');
        if (paymentForm) {
            paymentForm.addEventListener('submit', (event) => {
                event.preventDefault();
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                if (cart.length > 0) {
                    localStorage.removeItem('cart');
                    alert('Pedido confirmado! Obrigado por comprar na Rock Dimension.');
                    window.location.href = 'index.html';
                } else {
                    alert('Seu carrinho está vazio.');
                }
            });
        }
    }

    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProduct = cart.find(item => item.id === product.id);
        if (!existingProduct) {
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            alert('Disco adicionado ao carrinho!');
        } else {
            alert('Este disco já está no seu carrinho.');
        }
    }

    function displayCartItems() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartItemsContainer = document.querySelector('.cart-items-list');
        const cartTotalContainer = document.querySelector('.cart-total');
        const checkoutSection = document.querySelector('.checkout-section');

        if (!cartItemsContainer) return;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 2rem 0;">Seu carrinho está vazio.</p>';
            if (cartTotalContainer) cartTotalContainer.style.display = 'none';
            if (checkoutSection) checkoutSection.style.display = 'none';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="Capa do Álbum">
                    <div class="cart-item-details">
                        <h3>${item.title}</h3>
                        <p class="cart-item-price">${item.price}</p>
                    </div>
                    <i class="fas fa-trash-alt remove-btn"></i>
                </div>
            `).join('');

            updateCartTotal();
            addRemoveListeners();
        }
    }

    function updateCartTotal() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalElement = document.querySelector('.cart-total p');
        const total = cart.reduce((sum, item) => {
            const price = parseFloat(item.price.replace('R$', '').replace(',', '.'));
            return sum + price;
        }, 0);

        if (totalElement) {
            totalElement.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
        }
    }

    function addRemoveListeners() {
        const removeButtons = document.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const itemElement = event.target.closest('.cart-item');
                const productId = itemElement.dataset.id;
                removeFromCart(productId);
            });
        });
    }

    function removeFromCart(productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
    }

    function displayOrderSummary() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const orderItemsContainer = document.querySelector('.order-items-list');
        const orderTotalElement = document.querySelector('.order-total p');
        const placeOrderBtn = document.querySelector('.place-order-btn');

        if (cart.length === 0) {
            if (orderItemsContainer) {
                orderItemsContainer.innerHTML = '<p>Nenhum item para finalizar.</p>';
            }
            if (placeOrderBtn) {
                placeOrderBtn.disabled = true;
                placeOrderBtn.style.backgroundColor = '#ccc';
                placeOrderBtn.style.cursor = 'not-allowed';
            }
        } else {
            if (orderItemsContainer) {
                orderItemsContainer.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="Capa do Álbum">
                        <div class="cart-item-details">
                            <h3>${item.title}</h3>
                            <p class="cart-item-price">${item.price}</p>
                        </div>
                    </div>
                `).join('');
            }
        }

        const total = cart.reduce((sum, item) => {
            const price = parseFloat(item.price.replace('R$', '').replace(',', '.'));
            return sum + price;
        }, 0);

        if (orderTotalElement) {
            orderTotalElement.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
        }
    }
});
