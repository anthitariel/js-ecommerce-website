// render products

const renderProductCatalog = (products) => {
    
    const productsCatalog = document.querySelector('.product__catalog');
    productsCatalog.innerHTML = '';
    let productsInCart = JSON.parse(localStorage.getItem('productsIdArray'));

    products.forEach(product => {
        let countDiscount = product.discountPercentage / 100;
        let productId = String(product.id);
        let isProductInCart = productsInCart && productsInCart.includes(productId);
        const productTitle = product.title.replace(/[^a-z0-9A-Z]/gi, ' ').trim().replace(product.title[0], product.title[0].toUpperCase());
        product.title = productTitle;

    productsCatalog.insertAdjacentHTML('beforeend', `
        <div class="product" data-price="${product.price - (product.price * countDiscount)}">
            <a href="product-details/product-details.html" class="product__details-link" data-id="${productId}">
                <div class="product__image">
                    <img src="${product.thumbnail}" alt="Photo of ${product.title}"">
                </div>
                <div class="product__details-container">
                    <h3 class="product__details-title" data-title="${product.title.toLowerCase()}" ">${product.title}</h3>
                    <p><span class="product__category">category:</span> ${product.category.replace(product.category[0], product.category[0].toUpperCase())}</p>
                    <div class="product__details-brand">
                        <p><span class="product__brand">brand:</span> ${product.brand}</p>
                    </div>                
                       <div class="product__details-price">
                           <span class="product__price">price:</span>
                           <p class="product__price-after-discount"><strong>${(product.price - (product.price * countDiscount)).toLocaleString('en-US', {maximumFractionDigits: 2})} &dollar;</strong></p>
                           <p class="product__price-before-discount">${product.price.toLocaleString('en-US', {maximumFractionDigits: 2})} &dollar;</p>
                           <p class="product__price-discount">(${product.discountPercentage}% off)</p>
                       </div>                
                    <p><span class="product__seller">seller:</span> ${product.seller}</p>
                </div>
                <div class="product__details-button">
                    <a class="button__add-to-cart ${isProductInCart && 'remove'}" data-id="${productId}">${isProductInCart ? 'Remove from cart' : 'Add to cart'}</a>
                </div>
            </a>
        </div>
        `)
    })
    searchNotFound(productsCatalog);
}

// receive a not found message with a search value 

const searchNotFound = (container) => {
    const searchInput = document.querySelector('.navbar__search-input');
    if(container.innerHTML === '') container.insertAdjacentHTML('beforeend', `
    <div class="search__not-found-text">
        <h1>No matching product found for: ${searchInput.value}</h1>
    </div>
   `)
}

const getProductDetailsId = () => {
    const productsSection = document.querySelector('.product__catalog');
    productsSection.addEventListener('click', (event) => {
        if(event.target.closest('.product__details-link')) {
            localStorage.setItem('productId', event.target.closest('.product__details-link').dataset.id)
        }
    })
}

// sort products

const sortByCondition = (arr, sortCondition = undefined) => {
    if (sortCondition) {
        arr.sort((a, b) => {
            const priceAscending = a.price - (a.price * a.discountPercentage) / 100;
            const priceDescending = b.price - (b.price * b.discountPercentage) / 100;
            return sortCondition === 'Ascending' ? priceAscending - priceDescending : priceDescending - priceAscending;
        });
    }
}

// add-to-cart

const addToCart = () => {
    
    const productsSection = document.querySelector('.product__catalog');
    const basket = document.querySelector('.navbar__products-in-cart');
    const productsInCart = document.querySelector('.count__products-in-cart');

    productsSection.addEventListener('click', (event) => {
        let currentProductId = event.target.dataset.id;
        if (currentProductId) {
            let isInCart = event.target.classList.contains('remove');
            let productsArray = localStorage.getItem("productsIdArray");

            productsArray === null ? productsArray = [] : productsArray = JSON.parse(productsArray);

        if (!isInCart) {
                event.target.classList.add('remove');
                event.target.innerText = 'Remove from cart';
                basket.classList.remove('count__hidden');
                if (!productsArray.includes(currentProductId)) {
                    productsArray.push(currentProductId);
                }
        } else {
                event.target.classList.remove('remove')
                event.target.innerText = 'Add to cart';
                if (productsArray.includes(currentProductId)) {
                    productsArray.splice(productsArray.indexOf(currentProductId), 1);
                }
        }

        productsArray = JSON.stringify(productsArray);
        localStorage.setItem("productsIdArray", productsArray);

            productsInCart.innerHTML = JSON.parse(localStorage.getItem("productsIdArray")).length;

        if(JSON.parse(localStorage.getItem('productsIdArray')).length === 0) {
                basket.classList.add('count__hidden')
        }
        }
    })
    if (JSON.parse(localStorage.getItem('productsIdArray')) && JSON.parse(localStorage.getItem('productsIdArray')).length > 0) {
        basket.classList.remove('count__hidden');
        productsInCart.innerHTML = JSON.parse(localStorage.getItem("productsIdArray")).length;
    }
}

// debounce data

const debounce = (func, time) => {
    let timeout;

    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func(...args)
        }, time)
    }
}

// fetch data

(async () => {
    try {
        const request = await fetch('data-products.json')
        const data = await request.json();
        const dataInitialState = data.products;
        let clonedArr;
        let currentSortCondition = 'Ascending';
        const sortButton = document.querySelector('#sort-by-price');
        const searchInput = document.querySelector('.navbar__search-input');

        sortByCondition(dataInitialState, currentSortCondition);
        clonedArr = [...dataInitialState];

        renderProductCatalog(dataInitialState);

        currentSortCondition = sortButton.value;
        sortButton.addEventListener('change', (e) => {
            currentSortCondition = e.target.value;
            sortByCondition(dataInitialState, currentSortCondition);
            sortByCondition(clonedArr, currentSortCondition);
            renderProductCatalog(clonedArr);
        })

        // Search on the homepage

        searchInput.addEventListener('input', debounce((e) => {
            let userInputValue = e.target.value;
            
            clonedArr = dataInitialState.filter(product => product.title.toLowerCase().includes(userInputValue.toLowerCase()))
            renderProductCatalog(clonedArr);

            if(userInputValue === '') {
                sortByCondition(dataInitialState, currentSortCondition);
                clonedArr = dataInitialState;
                renderProductCatalog(clonedArr);
            }
        }, 500))
    } catch (err) {
        console.warn(err);
    }
    getProductDetailsId();
    addToCart();
})();