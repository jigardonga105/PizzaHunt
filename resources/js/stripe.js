import { loadStripe } from '@stripe/stripe-js';
import { placeOrder } from './apiService';
import { CardWidget } from './CardWidget';

export async function initStripe() {

    const stripe = await loadStripe('pk_test_51IteSRSFuWv43Ec8xhCAcFtsZGArYeXc16YtEnEToEms3UjQFhTQRCWxz8vDlXfcGBX3SR7Hw3ZGoM1957UjvstO00qftwexGb');

    let card = null;

    // function widget() {

    //     let style = {
    //         base: {
    //             color: '#32325d',
    //             fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    //             fontSmoothing: 'antialiased',
    //             fontSize: '16px',
    //             '::placeholder': {
    //                 color: '#aab7c4'
    //             }
    //         },
    //         invalid: {
    //             color: '#fa755a',
    //             iconColor: '#fa755a'
    //         }
    //     };

    //     const elements = stripe.elements();
    //     card = elements.create('card', { style, hidePostalCode: true })
    //     card.mount('#card-element');
    // }

    const paymentType = document.querySelector('#paymentType');
    if (!paymentType) {
        return;
    }
    paymentType.addEventListener('click', (e) => {
        // console.log(e.target.value);
        if (e.target.value === 'card') {
            // widget()
            card = new CardWidget(stripe)
            card.mount()
        } else {
            card.destroy()
        }
    })

    //Ajax call for Payment form
    const paymentForm = document.querySelector('#payment-form')
    if (paymentForm) {
        paymentForm.addEventListener('submit', async(e) => {
            e.preventDefault();
            let formData = new FormData(paymentForm);
            let formObject = {}

            for (let [key, value] of formData.entries()) {

                formObject[key] = value
            }

            if (!card) {
                placeOrder(formObject)
                return;
            }

            const token = await card.createToken();
            formObject.stripeToken = token.id;
            placeOrder(formObject)

            // //Verify card
            // stripe.createToken(card)
            //     .then((result) => {
            //         // console.log(result);
            //         formObject.stripeToken = result.token.id;
            //         console.log(formObject);
            //         placeOrder(formObject)
            //     })
            //     .catch((error) => {
            //         console.log(error);
            //     })



            // console.log(formObject);
        })
    }
}