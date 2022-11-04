const cartWrapper = document.querySelector('.cart-wrapper')
const alertEmptyCart = document.querySelector('[data-cart-empty]')
const orderForm = document.querySelector('#order-form')
const totalEl = document.querySelector('.total-price')


window.addEventListener('click', (e)=> { // отслеживаем клики по всему экрану
    // Plus, minus, counter
    incrementing(e)
    // Add to cart
    addToCart(e)
})

function incrementing(e) {
    let counter
    const cardInCart = e.target.closest('.cart-item')

    if(e.target.dataset.action === 'plus' || e.target.dataset.action === 'minus'){ 
        const counterWrapper = e.target.closest('.counter-wrapper') 
        counter = counterWrapper.querySelector('[data-counter]')
    }

    if(e.target.dataset.action === 'plus'){ //если дата атрибут равен плюсу, то действуем
        const counterWrapper = e.target.closest('.counter-wrapper') // ищем ближайшего родителя с нужным классом
        const counter = counterWrapper.querySelector('[data-counter]')
        counter.innerText = ++counter.innerText
        isCartEmpty()
        calcCartPriceAndDelivery()
    }

    if(e.target.dataset.action === 'minus'){
        const counterWrapper = e.target.closest('.counter-wrapper') 
        const counter = counterWrapper.querySelector('[data-counter]')
        
        if(cardInCart){
            if(parseInt(counter.innerText) > 0){
                counter.innerText = --counter.innerText
                if(counter.innerText == 0){
                    cardInCart.remove()
                }
            }
        }
         else if(parseInt(counter.innerText) > 1){
            counter.innerText = --counter.innerText
        }
        isCartEmpty()
        calcCartPriceAndDelivery()
    }
}

function addToCart(e) {
    if(e.target.dataset.cart === ''){
        const card = e.target.closest('.card')
        
        const productItem = {
            id: card.dataset.id,
            img: card.querySelector('.product-img').getAttribute('src'),
            title: card.querySelector('.item-title').innerText,
            itemsInBox: card.querySelector('[data-items-in-box]').innerText,
            counter: card.querySelector('[data-counter]').innerText,
            weight: card.querySelector('.price__weight').innerText,
            price: card.querySelector('.price__currency').innerText
        }

        const itemInCart = cartWrapper.querySelector(`[data-id="${productItem.id}"]`)
       
        if(itemInCart){
            increaseItemsInCart(productItem, itemInCart)
        } else{
            appendItemToCart(productItem)
        }

        card.querySelector('[data-counter]').innerText = 1

        isCartEmpty()
        calcCartPriceAndDelivery()
    }
}

function appendItemToCart(addedProduct){
    const cartItemHTML = `
    <div class="cart-item" data-id="${addedProduct.id}">
    <div class="cart-item__top">
        <div class="cart-item__img">
            <img src="${addedProduct.img}" alt="">
        </div>
        <div class="cart-item__desc">
            <div class="cart-item__title">${addedProduct.title}</div>
            <div class="cart-item__weight">${addedProduct.itemsInBox} / ${addedProduct.weight}</div>

            <!-- cart-item__details -->
            <div class="cart-item__details">

                <div class="items items--small counter-wrapper">
                    <div class="items__control" data-action="minus">-</div>
                    <div class="items__current" data-counter="">${addedProduct.counter}</div>
                    <div class="items__control" data-action="plus">+</div>
                </div>

                <div class="price">
                    <div class="price__currency">${addedProduct.price}</div>
                </div>

            </div>
            <!-- // cart-item__details -->

        </div>
    </div>
</div>
    `
    cartWrapper.insertAdjacentHTML('beforeend', cartItemHTML)
}

function increaseItemsInCart(addedProduct, itemInCart){
    const currentQuantity = itemInCart.querySelector('[data-counter]')
    currentQuantity.innerText = parseInt(currentQuantity.innerText) + parseInt(addedProduct.counter)
    isCartEmpty()
    calcCartPriceAndDelivery()
}

function calcCartPriceAndDelivery() {
    const cartItems = document.querySelectorAll('.cart-item')
    let total = 0 
    cartItems.forEach( function(item) {
        const price = parseInt(item.querySelector('.price__currency').innerText)
        const counter = parseInt(item.querySelector('[data-counter]').innerText)
        total += price * counter
    })
    deliveryPrice(total)
    totalEl.innerText = total + deliveryPrice(total)
}

function isCartEmpty() {
    const cartItems = document.querySelectorAll('.cart-item')
    if(cartItems.length == 0){
        alertEmptyCart.classList.remove('none')  
        orderForm.classList.add('none')
    } else {
        alertEmptyCart.classList.add('none')
        orderForm.classList.remove('none')
    }
}

function deliveryPrice(total) {
    const freeShipment = document.querySelector('#freeshipment')
    const paidShipment = document.querySelector('#paidshipment')
    let deliveryCost
    if(total > 0) {
        if(total >= 30 || total < 1) {
            freeShipment.classList.remove('none')
            paidShipment.classList.add('none')
            deliveryCost = 0
        } else {
            freeShipment.classList.add('none')
            paidShipment.classList.remove('none')
            deliveryCost = 5
        }
    } else {
        freeShipment.classList.add('none')
        paidShipment.classList.add('none')
        deliveryCost = 0
    }
    return deliveryCost
}

