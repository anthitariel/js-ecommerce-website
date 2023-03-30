// render cart

const renderCart = (productsArr) => {
    const checkoutContainer = document.querySelector('.checkout__form-container');

    if (!productsArr || productsArr.length < 1) {
        const totalContainer = document.querySelector('.checkout__total');
        totalContainer.classList.add('products__hidden')
        checkoutContainer.insertAdjacentHTML('beforeend', `
            <p class="checkout__no-products" >There are no products in your cart!</p>
        `)
        return;
    }

    if (productsArr) {
        productsArr.forEach(product => {
            const fixedProductTitle = product.title.replace(/[^a-z0-9A-Z]/gi, ' ').trim().replace(product.title[0], product.title[0].toUpperCase());
            const priceAfterDiscount = (product.price - (product.price * (product.discountPercentage / 100)));
            checkoutContainer.insertAdjacentHTML('afterbegin', `
        <div class="checkout__items" data-id="${product.id}">
            <div class="checkout__form-image-container">
                <img src="../${product.thumbnail}" alt="" class="checkout__form-image">
            </div>
            <div class="product">
                    <h3 class="product__details-title">${fixedProductTitle}</h3>
                    <div class="product__details-price">
                        <p class="product__price">price: </p>
                        <p class="product__price-after-discount"">${priceAfterDiscount.toLocaleString('en-US', {maximumFractionDigits: 2})}&dollar;</p>
                        <p class="product__price-before-discount"">${product.price.toLocaleString('en-US', {maximumFractionDigits: 2})}&dollar;</p>
                        <p class="product__price-discount"">(${product.discountPercentage}% off)</p>
                    </div>
                <div class="checkout__remove-from-cart">
                    <a href="checkout-page.html" class="product__details-link">
                        <ion-icon name="trash-outline" class="checkout__remove-from-cart-icon" data-id="${product.id}"></ion-icon>
                    </a>
                    <input type="number" min="1" max="${product.stock}" data-base-price="${priceAfterDiscount}" value="1" class="quantity">
                </div>
            </div>
    </div>
    `)
        })

        const calculateTotalPrice = (products) => {
            const totalPriceElement = document.querySelector('.total-price');

            if (products.length > 0) {
                const productPricesArray = products.map(productPrice => (productPrice.price - (productPrice.price * (productPrice.discountPercentage / 100))));
                const total = productPricesArray.reduce((acc, val) => acc + val, 0)
                totalPriceElement.innerHTML = `${total.toLocaleString('en-US', {maximumFractionDigits: 2})}$`;
                totalPriceElement.dataset.totalPrice = total;
            }
        }
        calculateTotalPrice(productsArr)
    }
}

// fetch data

(async () => {
    try {
        const response = await fetch('../data-products.json');
        const data = await response.json();
        let filteredProductsThatAreInCart;

        if(localStorageGet('productsIdArray')) {
            const getLocalCartArr = localStorageGet('productsIdArray').map(id => parseInt(id))
            filteredProductsThatAreInCart = data.products.filter((product) => getLocalCartArr.some(id => id === product.id))
        }

        renderCart(filteredProductsThatAreInCart);
        removeFromCart();
        checkQuantity();
    } catch (err) {
        console.warn(err);
    }
})()



// remove from cart

const removeFromCart = () => {
    const containerCheckout = document.querySelector('.checkout__form');
    const containerProductsInCart = document.querySelector('.navbar__products-in-cart');
    const productsInCart = document.querySelector('.count__products-in-cart');

    containerCheckout.addEventListener('click', (event) => {
        let currentProductId = event.target.dataset.id;
        if (currentProductId) {
            let productsArray = localStorageGet('productsIdArray');

            productsArray = productsArray ?? [];

            if(productsArray.includes(currentProductId)) {
                const parsedCart = localStorageGet('productsIdArray');
                parsedCart.splice(parsedCart.indexOf(currentProductId), 1)
                localStorageSetJson('productsIdArray', parsedCart);
            }

            productsInCart.innerHTML = localStorageGet('productsIdArray').length;

            if(localStorageGet('productsIdArray').length === 0) {
                containerProductsInCart.classList.add('count__hidden')
            }
        }
    })
    const productsIdArray = localStorageGet('productsIdArray');
    if (productsIdArray && productsIdArray.length > 0) {
    productsInCartContainer.classList.remove('count__hidden');
    productsInCartCount.innerHTML = productsIdArray.length;
    }
}

// check cart

const checkQuantity = () => {
    const quantityInputs = document.querySelectorAll('.quantity');
    const totalPriceElement = document.querySelector('.total-price');

    quantityInputs.forEach(qtyInput => {
        checkSingleInputQuantity(qtyInput, totalPriceElement);
    })
}

const checkSingleInputQuantity = (qtyInput, totalPriceElement) => {
    let minQty = +qtyInput.getAttribute('min');
    let maxQty = +qtyInput.getAttribute('max');
    let previousQty = minQty;
    qtyInput.addEventListener('change', (event) => {
        let input = event.currentTarget;
        let qty = +input.value;

        if (qty >= maxQty) {
            input.value = maxQty;
            qty = maxQty;
        }

        if (qty < minQty) {
            input.value = minQty;
            qty = minQty;
        }

        const basePrice = +input.dataset.basePrice;
        const oldPrice = basePrice * previousQty;
        const totalPrice = +totalPriceElement.dataset.totalPrice;
        const newTotal = ((totalPrice + (basePrice * qty)) - oldPrice);

        totalPriceElement.innerText = `${newTotal.toLocaleString('en-US', {maximumFractionDigits: 2})}$`;
        totalPriceElement.dataset.totalPrice = newTotal;
        previousQty = qty;
    });
}


// local storage

 const localStorageGet = (key) => {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch (err) {
        return null;
    }
};

 const localStorageSet = (key, data) => {
    localStorage.setItem(key, data);
};

 const localStorageSetJson = (key, data) => {
    if (data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
};