import axios from 'axios'
import Noty from 'noty'
import { initAdmin } from './admin'
import moment from 'moment'
import { initStripe } from './stripe'
import { handleStore } from './seller';
// import { Socket } from 'socket.io'

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')

function updateCart(pizza) {
    axios.post('/update-cart', pizza)
        .then(res => {
            cartCounter.innerText = res.data.totalQty
            new Noty({
                type: 'success',
                timeout: 1000,
                text: 'Item added to cart',
                progressBar: false,
            }).show();
        })
        .catch(err => {
            new Noty({
                type: 'error',
                timeout: 1000,
                text: 'Something went wrong',
                progressBar: false,
            }).show();
        })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza)
    })
})

// Remove alert message after X seconds 
const alertMsg = document.querySelector('#success-alert')
if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}

//==============================Rating Update======================================
//this is for show rating star with product rate
const showIDivList = document.querySelectorAll('#show-i')
const showInpList = document.querySelectorAll('#showI-input')

function ShowRatingFunc(div, rating) {
    // console.log(div);
    // console.log(rating);
    let ratingLen = Math.round(rating);
    // console.log(ratingLen);
    let ratingLenFin = ratingLen.toString()
        // console.log(ratingLenFin);
    for (let ratingFor = 0; ratingFor < ratingLenFin; ratingFor++) {
        div.children[ratingFor].classList.remove("far")
        div.children[ratingFor].classList.add("fas")
    }
}

for (let showIDivListFor = 0; showIDivListFor < showIDivList.length; showIDivListFor++) {

    let div = showIDivList[showIDivListFor]
    let rating = showInpList[showIDivListFor].name

    ShowRatingFunc(div, rating)

}

// =================================================================================================
// =================================================================================================
// =================================================================================================
//this is for submit perticular product rating by customer
const ratingResult = document.querySelector(".rating__result");
const rate_span = document.querySelectorAll('.rate-span');
const rate_now = document.querySelectorAll('.rate-now');
const rate = document.querySelectorAll('#rate');
const rate_form = document.querySelectorAll('#rate-form');

function showHideStar(ratFor) {
    if (rate_now[ratFor].style.display === 'block') {
        rate_now[ratFor].style.display = 'none';
    } else {
        rate_now[ratFor].style.display = 'block';
    }
}

if (rate_span) {

    for (let ratFor = 0; ratFor < rate_span.length; ratFor++) {

        rate_span[ratFor].addEventListener('click', (e) => {
            e.preventDefault()

            showHideStar(ratFor)

            const form_i = document.querySelectorAll("#form-i")
            let subStr = [...form_i[ratFor].children]
                // ==============================================================
            printRatingResult(ratingResult);

            function submitRating(stars, result) {
                const starClassActive = "rating__star fas fa-star";
                const starClassUnactive = "rating__star far fa-star";
                const starsLength = stars.length;
                let i;
                stars.map((star) => {
                    star.onclick = () => {
                        i = stars.indexOf(star);
                        console.log(i);

                        rate[ratFor].setAttribute('value', `${i + 1}`)
                            // console.log(rate[ratFor]);
                        rate_form[ratFor].submit();

                        if (star.className.indexOf(starClassUnactive) !== -1) {
                            printRatingResult(result, i + 1);
                            for (i; i >= 0; --i) stars[i].className = starClassActive;
                        } else {
                            printRatingResult(result, i);
                            for (i; i < starsLength; ++i) stars[i].className = starClassUnactive;
                        }
                    };
                });
            }

            function printRatingResult(result, num = 0) {
                result.textContent = `${num}/5`;
            }

            submitRating(subStr, ratingResult);
        })
    }
}
//==============================Rating Update======================================


//Change order status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order) {
    let stepCompleted = true;

    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })

    statuses.forEach((status) => {
        let dataProp = status.dataset.status
        if (stepCompleted) {
            status.classList.add('step-completed')
        }
        if (dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updateAt).format('hh:mm A')
            status.appendChild(time)
            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add('current')
            }
        }
    })
}

updateStatus(order)


initStripe()

handleStore()

//Socket
let socket = io();

//Join
if (order) {
    //send order id to socket for creating personal room
    socket.emit('join', `order_${order._id}`)
}
let adminAreaPath = window.location.pathname;
// console.log(adminAreaPath);
if (adminAreaPath.includes('admin')) {
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
}

socket.on('orderUpdated', (data) => {
    const updatedOrder = {...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Order updated',
        progressBar: false,
    }).show();
})