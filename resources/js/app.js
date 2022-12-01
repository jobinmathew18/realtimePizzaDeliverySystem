import axios from "axios"; 
import Noty from 'noty';
import {initAdmin} from './admin';

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter')

function updateCart(pizza){
    axios.post("/update-cart", pizza).then(res => {               //this "pizza" in parameter is passed as an object
        console.log(res);
        cartCounter.innerText = res.data.totalQty;

        new Noty({
            type: "success",
            timeout: 1000,
            progressBar: false,
            text: 'Item added to cart',
            layout: "topLeft"
        }).show();
    }).catch(err => {
        new Noty({
            type: "error",
            timeout: 1000,
            progressBar: false,
            text: 'Something went wrong',
            layout: "topLeft"
        }).show();
    })
}
  
addToCart.forEach((btn) =>{
    btn.addEventListener('click', (event)=>{ 
        let pizza = JSON.parse(btn.dataset.pizzadata);
        // console.log(pizza);
        updateCart(pizza);
    })
});


//removing alert message from X seconds
const alertMsg = document.querySelector('#success-alert');              //success-alert is an ID in file orders.ejs
if(alertMsg){
    setTimeout(() => {
        alertMsg.remove();
    }, 2000);
}


initAdmin();                //including all the codes of admin.js file into app.js 