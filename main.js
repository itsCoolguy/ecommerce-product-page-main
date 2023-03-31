// Element variables

const desktopNavbarLinks = document.querySelectorAll('.desktop-navbar-link');

const normalGallery = document.querySelector('#product-image-gallery');
const mainProductImage = document.querySelector('#product-image')
const lightboxProductImage = document.querySelector('#lightbox-main-image');

const lightbox = document.querySelector('#lightbox')
const openLightboxButton = document.querySelector('.main-product-image-button');
const closeLightboxButton = document.querySelector('#exit-lightbox-button');

const lightboxGallery = document.querySelector('#lightbox-gallery');
const nextButtons = document.querySelectorAll('.next-button');
const previousButtons = document.querySelectorAll('.previous-button');

const basketFrame = document.querySelector('#basket-frame');
const basketButton = document.querySelector('#basket-button');
const addToBasketButton = document.querySelector('#add-to-cart-button');
const basketTemplate = basketFrame.querySelector('#template-basket');
const emptyCartText = basketFrame.querySelector('#empty-cart-text');
const mainBasket = basketFrame.querySelector('#main-basket');

const quantityUpButton = document.querySelector('#add-quantity-button');
const quantityDownButton = document.querySelector('#minus-quantity-button');
const quantityText = document.querySelector('#quantity-text');

// Value variables

let basket = {};

let mainPageCurrentPicture = 1;
let lightboxCurrentPicture = 1;

let quantity = 1;
let currentBasket = 0;

// Navbar handling

desktopNavbarLinks.forEach(link => {
    link.addEventListener('click', navbarLinkClicked)
})

function navbarLinkClicked() {
    const oldSelection = document.querySelector('.selected-navbar');
    const oldSlider = oldSelection.querySelector('.desktop-navbar-selection');
    const newSelection = this.parentElement;
    const newSlider = newSelection.querySelector('.desktop-navbar-selection');
    const oldId = Number(oldSelection.id.split('-')[1]);
    const newId = Number(newSelection.id.split('-')[1]);
    let addedPx = 0;
    if (oldId < newId) {
        oldSlider.style.left = '17.5px'
        for (let i = oldId+1; i < newId; i++) {
            addedPx += (document.querySelector('#nav-'+i).offsetWidth + 20);
        }
    } else {
        oldSlider.style.left = '-17.5px'
        for (let i = newId+1; i < oldId; i++) {
            addedPx += (document.querySelector('#nav-'+i).offsetWidth + 20);
        }
    }
    if (oldSelection.offsetWidth > newSelection.offsetWidth) {
        if (oldId < newId) {
            oldSlider.style.left = (((oldSelection.offsetWidth) - newSelection.offsetWidth / 2) + 25 + addedPx) + 'px';
        } else {
            oldSlider.style.left = -(((oldSelection.offsetWidth) - newSelection.offsetWidth / 2) + 25 + addedPx) + 'px';
        }
    } else {
        if (oldId < newId) {
            oldSlider.style.left = (((newSelection.offsetWidth) - oldSelection.offsetWidth / 4) + addedPx) + 'px';
        } else {
            oldSlider.style.left = -(((newSelection.offsetWidth) - oldSelection.offsetWidth / 4) + 25 + addedPx) + 'px';
        }
    }
    setTimeout(() => {
        oldSelection.classList.remove('selected-navbar');
        newSelection.classList.add('selected-navbar');
        oldSlider.style.removeProperty('left');
    }, 150)
}


// Picture gallery handling

normalGallery.querySelectorAll('.product-thumbnail-button').forEach(button => {
    button.addEventListener('click', selectGalleryPicture)
})

function selectGalleryPicture() {
    const newId = Number(this.querySelector('img').id.toString().split('thumbnail-')[1]);
    if (this.parentElement.id == 'lightbox-gallery') {
        lightboxCurrentPicture = newId;
        lightboxProductImage.src = './images/image-product-' + newId + '.jpg';
    } else {
        mainPageCurrentPicture = newId;
        mainProductImage.src = './images/image-product-' + newId + '.jpg';
    }
    this.parentElement.querySelector('.selected-thumbnail').classList.remove('selected-thumbnail');
    this.classList.add('selected-thumbnail')
}

function productButtonClicked() {
    if (this.parentElement.id == 'product-images') {
        const equation = this.classList.contains('next-button') ? eval(mainPageCurrentPicture + 1) : eval(mainPageCurrentPicture - 1)
        mainPageCurrentPicture = Math.min(Math.max(equation, 1), 4);
        mainProductImage.src = './images/image-product-' + mainPageCurrentPicture + '.jpg';
    }
    if (this.parentElement.id == 'lightbox-center-image-frame') {
        const equation = this.classList.contains('next-button') ? eval(lightboxCurrentPicture + 1) : eval(lightboxCurrentPicture - 1)
        lightboxCurrentPicture = Math.min(Math.max(equation, 1), 4);
        lightboxProductImage.src = './images/image-product-' + lightboxCurrentPicture + '.jpg';
        this.parentElement.parentElement.parentElement.querySelector('.selected-thumbnail').classList.remove('selected-thumbnail');
        this.parentElement.parentElement.parentElement.querySelector('#product-thumbnail-' + lightboxCurrentPicture).parentElement.classList.add('selected-thumbnail')
    }

}

// Lightbox handling

lightboxGallery.querySelectorAll('.product-thumbnail-button').forEach(button => {
    button.addEventListener('click', selectGalleryPicture)
})

nextButtons.forEach(element => {
    element.addEventListener('click', productButtonClicked)
})
previousButtons.forEach(element => {
    element.addEventListener('click', productButtonClicked)
})

function openLightbox() {
    lightbox.style.display = 'flex';
}

function closeLightbox() {
    lightbox.style.removeProperty('display');
}

// Basket handling

basketButton.addEventListener('click', () => {
    if (!basketFrame.style.visibility) {
        basketFrame.style.visibility = 'visible';
    } else {
        basketFrame.style.removeProperty('visibility')
    }
})

function addToBasket() {
    currentBasket ++;
    basket[currentBasket] = {
        'name': 'Fall Limited Edition Sneakers',
        'price': 125,
        'quantity': quantity,
        'totalPrice': 125 * Number(quantity),
    };

    const newBasketItem = basketTemplate.cloneNode(true);
    newBasketItem.id = 'basket-item-' + currentBasket;
    newBasketItem.querySelector('.product-name').textContent = basket[currentBasket].name;
    newBasketItem.querySelector('.product-quantity').textContent = '$' + basket[currentBasket].price + ' x ' + basket[currentBasket].quantity;
    newBasketItem.querySelector('strong').textContent = '$' + basket[currentBasket].totalPrice;

    newBasketItem.querySelector('.delete-basket-item-button').addEventListener('click', removeFromBasket);

    mainBasket.querySelector('#basket-items').appendChild(newBasketItem);
    mainBasket.style.display = 'block';
    emptyCartText.style.display = 'none';
}
addToBasketButton.addEventListener('click', addToBasket);

function removeFromBasket() {
    const basketItem = this.closest('.basket-item');
    const basketItemId = Number(basketItem.id.split('basket-item-')[1])
    try {
        delete basket[basketItemId]
        basketItem.remove();
        for (let i = 0; i < Object.keys(basket).length; i++) {
            return;
        }
        mainBasket.style.display = 'none';
        emptyCartText.style.display = 'block';
    } catch(err) {
        console.log(err)
    }
}

// Quantity handling

quantityUpButton.addEventListener('click', () => {
    quantity = Math.min(Math.max(quantity + 1, 1), 1000);
    quantityText.textContent = quantity;
})
quantityDownButton.addEventListener('click', () => {
    quantity = Math.min(Math.max(quantity - 1, 1), 1000);
    quantityText.textContent = quantity;
})