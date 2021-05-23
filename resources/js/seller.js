import axios from 'axios'

const add_store = document.querySelector('#add-store')
const show_store = document.querySelector('#show-store')
const store = document.querySelector('#store')

export function handleStore() {
    // This Script for Sliders

    var myIndex = 0;
    carousel();

    function carousel() {
        var i;
        var x = document.getElementsByClassName("mySlides");
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
        myIndex++;
        if (myIndex > x.length) {
            myIndex = 1
        }
        x[myIndex - 1].style.display = "block";
        setTimeout(carousel, 2000); // Change image every 2 seconds
    }
}