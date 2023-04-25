// render product details

const renderProductDetails = (product, fullProductsArray) => {
    const productDetails = document.querySelector('.product__details');
    const similarProducts = document.querySelector('.product__similar');
    const productsTitle = product[0].title.replace(/[^a-z0-9A-Z]/gi, ' ').trim().replace(product[0].title[0], product[0].title[0].toUpperCase());

    let getImages = product[0].images.map((image, i) => {
        return `
        <div class="product__details-slide-small">
            <img src="../${image}" alt="" class="image-${i} carousel-slide-small ${i === 0 ? 'selected-slide' : ''}">
        </div>
        `
    })

const addStars = (product) => {
        const productRating = Math.round(parseFloat(product[0].rating));
        const ratingStars = document.querySelectorAll('.rating-star');
        ratingStars.forEach((star, i) => {
            if(i < productRating) {
                ratingStars[i].name = 'star';
            }
        })
    }

productDetails.insertAdjacentHTML('beforeend', `
        <div class="product__details-carousel">
            <div class="product__details-carousel-slides">
                ${getImages.join('')}
            </div>
            <div class="product__details-carousel-large" data-id="${product[0].id}">
                <img src="../${product[0].images[0]}" alt="Image of ${productsTitle}" class="carousel-slide-large">
            </div>
        </div>
    
        <div class="product__details-full">
            <h2>${productsTitle}</h2>
            <div class="product__details-brand">
                <p class="product__brand">brand:</p>
                <p class="product__brand-text">${product[0].brand}</p>
            </div>
            <div class="product__details-category">
                <p class="product__category">category:</p>
                <p class="product__category-text">${product[0].category.replace(product[0].category[0], product[0].category[0].toUpperCase())}</p>
            </div>
            <div class="product__details-seller">
                <p class="product__seller">seller:</p>
                <p class="product__seller-text">${product[0].seller}</p>
            </div>
            <div class="product__details-description">
                <p class="product__description">description:</p>
                <p class="product__description-text" style="display: inline;">${product[0].description}</p>
            </div>
            <div class="product__details-stock">
                <p class="product__stock">stock:</p>
                <p class="product__stock-text">${Number(product[0].stock) > 1 ? `${product[0].stock} ` + 'pcs.' : `${product[0].stock} ` + 'pc.' }</p>
            </div>
            <div class="product__details-rating">
                <p class="product__rating">rating:</p>
                <ion-icon name="star-outline" class="rating-star"></ion-icon>
                <ion-icon name="star-outline" class="rating-star"></ion-icon>
                <ion-icon name="star-outline" class="rating-star"></ion-icon>
                <ion-icon name="star-outline" class="rating-star"></ion-icon>
                <ion-icon name="star-outline" class="rating-star"></ion-icon>
                <p class="product__rating-text">${product[0].rating}</p>
            </div>
            <div class="product__details-price">
                <p class="product__price">price: </p>
                <p class="product__price-after-discount">${(product[0].price - (product[0].price * (product[0].discountPercentage / 100))).toLocaleString('en-US', {maximumFractionDigits: 2})}&dollar;</p>
                <p class="product__price-before-discount">${product[0].price.toLocaleString('en-US', {maximumFractionDigits: 2})}&dollar;</p>
                <p class="product__price-discount">(${product[0].discountPercentage}% off)</p>
            </div>
            <button class="button__add-to-cart--small" data-id="${product[0].id}">Add to cart</button>
        </div>
    `)
    addStars(product);

    let getSimilarProducts = (product, fullProductsArray) => {
        const productInViewId = document.querySelector('.product__details-carousel-large').dataset.id;
        const productCategory = product[0].category;
        const filteredByCategory = fullProductsArray.filter((product) => {
            if(product.category.includes(productCategory) && product.id !== parseInt(productInViewId)) {
                return product;
            }
        });

        return filteredByCategory.map((similarProduct, i) => {
            return  i < 5 ? `
                <div class="product__similar-card" data-id="${similarProduct.id}">
                    <a href="../product-details/product-details.html" class="product__similar-card-link">
                        <div class="product__similar-card-image">
                            <img class="similar-card-image" src="../${similarProduct.thumbnail}" alt="${similarProduct.title}">
                        </div>
                        <div class="product__similar-card-details">
                            <h3 class="product__similar-title"">${similarProduct.title}</h3>
                            <div class="product__details-brand">
                                <p class="product__brand">brand:</p>
                                <p class="product__brand-text">${similarProduct.brand}</p>
                            </div>
                            <div class="product__details-rating">
                                <p class="product__rating">rating:</p>
                                <p class="product__rating-icon">${similarProduct.rating} <ion-icon name="star"></ion-icon></p>
                            </div>
                            <div class="product__details-price">
                                <p class="product__price">price: </p> 
                                <p class="product__price-after-discount">${(similarProduct.price - (similarProduct.price * (similarProduct.discountPercentage / 100))).toLocaleString('en-US', {maximumFractionDigits: 2})}&dollar;</p>
                                <p class="product__price-before-discount">${similarProduct.price.toLocaleString('en-US', {maximumFractionDigits: 2})}&dollar;</p>
                                <p class="product__price-discount">(${similarProduct.discountPercentage}% off)</p>
                            </div>
                        </div>
                    </a>
                </div>
            ` : ''
        })
    }

    similarProducts.insertAdjacentHTML('beforeend', `
        <div class="product__similar-container">
            ${getSimilarProducts(product, fullProductsArray).join('')}
        </div>
    `)

    const checkIfProductIsInCart = () => {
        const productsIdArr = JSON.parse(localStorage.getItem('productsIdArray'));
        const addToCartButton = document.querySelector('.button__add-to-cart--small');

        if (productsIdArr === null) {
            localStorage.setItem('productsIdArray', JSON.stringify([]))
            return
        }

        if(productsIdArr.includes(String(product[0].id))) {
            addToCartButton.innerHTML = 'Remove from cart';
            addToCartButton.classList.add('remove');
        }
    }
    checkIfProductIsInCart();
}


// add to cart

const addToCart = () => {
    const productDetailsSection = document.querySelector('.product__details');
    const containerProductsInCart = document.querySelector('.navbar__products-in-cart');
    const productsInCart = document.querySelector('.count__products-in-cart');

    productDetailsSection.addEventListener('click', (event) => {
        let currentProductId = event.target.dataset.id;
        if (currentProductId) {
            let isInCart = event.target.classList.contains('remove');
            let productsArray = localStorage.getItem("productsIdArray");

            productsArray === null ? productsArray = [] : productsArray = JSON.parse(productsArray);

            if (!isInCart) {
                event.target.classList.add('remove');
                event.target.innerText = 'Remove from cart';
                containerProductsInCart.classList.remove('count__hidden');
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
                containerProductsInCart.classList.add('count__hidden')
            }
        }
    })
    if (JSON.parse(localStorage.getItem('productsIdArray')) && JSON.parse(localStorage.getItem('productsIdArray')).length > 0) {
        containerProductsInCart.classList.remove('count__hidden');
        productsInCart.innerHTML = JSON.parse(localStorage.getItem("productsIdArray")).length;
    }
}


// create image carousel to choose image from gallery

const imageCarousel = () => {
    const carouselSlideSmall = document.querySelectorAll('.carousel-slide-small');
    const carouselSlideLarge = document.querySelector('.carousel-slide-large');

    carouselSlideSmall.forEach(image => {
        image.addEventListener('click', (event) => {
            carouselSlideSmall.forEach(img => img.classList.remove('selected-slide'))
            let src = event.target.src
            // change the link on the image carousel according to selected slide
            carouselSlideLarge.src = src
            event.target.classList.add('selected-slide')
        })
    })
}


// similar products

const similarProductSelected = () => {
    const similarProductsContainer = document.querySelector('.product__similar-container');

    similarProductsContainer.addEventListener('click', (event) => {
        if(JSON.parse(localStorage.getItem('productId')) !== null) {
            localStorage.setItem('productId', event.target.closest('.product__similar-card').dataset.id);
        }
    })
}


// fetch data

(async () => {
    try {
        const response = await fetch("../data-products.json")
        const data = await response.json();
        const productId = localStorage.getItem('productId');
        const product = data.products.filter(product => product.id === parseInt(productId));
        renderProductDetails(product, data.products);
        imageCarousel();
        similarProductSelected()
    } catch (err) {
        console.warn(err);
    }
    addToCart();
})()

// splide.js

document.addEventListener( 'DOMContentLoaded', function () {
    new Splide('#splide', {
        type: 'loop',
        perPage: 5,
        gap: "5%",
        pagination: false,
        width: "100%",
        height: "100%",
        gap: "5%",
        
        
        breakpoints: {
            640: {
                perPage    : 2,
            },
        },
    }).mount();
});


  