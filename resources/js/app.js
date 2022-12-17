import axios from "axios"; 
import Noty from 'noty';
import {initAdmin} from './admin';
import moment from 'moment';


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
 


//change order status
let statuses = document.querySelectorAll('.status_line');
// console.log(statuses);
let hiddenInput = document.querySelector('#hiddenInput');
let order = hiddenInput ? document.querySelector('#hiddenInput').value : null;              //getting "value" from singeOrder.ejs
order = JSON.parse(order)
// console.log(order);
let time = document.createElement('small');            //creating <small> tag



function updateStatus(order){
    statuses.forEach((status)=>{
        status.classList.remove('step-completed');
        status.classList.remove('current');

    })
    let stepCompleted = true;
    statuses.forEach((status)=>{
        let dataProp = status.dataset.orderstatus                  //this "orderstatus" gets value from "data.orderStatus " which is in singleOrder.ejs file
        if(stepCompleted){
            status.classList.add('step-completed')                 //.step-completed is a class in app.scss which is used to add grey color to the line
        }
        if(dataProp === order.status){
            stepCompleted = false; 
            time.innerText = moment(order.updatedAt).format('hh:mm A - DD MM')
            status.appendChild(time)
            if(status.nextElementSibling){                                  //nextElementSibling means add styles to that element which is next to the current element
                status.nextElementSibling.classList.add('current');
            }
        }
    })
}

updateStatus(order);




//SOCKET CLIENT SIDE
let socket = io();

//join
if(order){
    socket.emit('join', `order_${order._id}`)          //it will look like this: order_63sdkahjhe33fhe. It will be the name of the private room for each orders.
}
// console.log(order);

let adminAreaPath = window.location.pathname;        //will fetch the url
// console.log(adminAreaPath); 
if(adminAreaPath.includes('admin')){                 //if "adminAreaPath" have admin in it.
    initAdmin(socket);                               //including all the codes of admin.js file into app.js
    socket.emit('join', 'adminRoom')
}

socket.on('orderUpdated', (data) =>{                        //this "data" is recieved from "eventEmitter.on('orderUpdated', (data)=>{"  which is in server.js
    const updatedOrder = {...order}                         //...order means copy of order.
    updatedOrder.updatedAt = moment().format();
    updatedOrder.status = data.status;
    // console.log(data);
    // console.log(updatedOrder);                           //this is updated order 
    updateStatus(updatedOrder);
    new Noty({
        type: "success",
        timeout: 1000,
        progressBar: false,
        text: 'Order Updated',
        layout: "bottomLeft"
    }).show();
})