const Order = require('../../../models/order');
const moment = require('moment');                           //npm moment is used for formatting the date, etc.

function orderController(){
    return {
        
        store(req,res){
            // console.log(req.body);

            //validate request
            const{phone, address} = req.body
            if(!phone || !address){
                req.flash('error', 'All fields are required!')  
                return res.redirect('/cart')
            }

            const order = new Order({
                customerId: req.user._id,                          //req.user._id is from session which gives the _id of the logged in user.
                customerName: req.user.name,
                items: req.session.cart.items,
                phone: phone,
                address: address
            });
            
            order.save().then(result =>{
                // console.log(result);
                req.flash('success', 'Order placed successfully');
                delete req.session.cart                                 //delete keyword is form javascript. It deletes the whole cart after placing the order.
                return res.redirect('/customer/orders');
            }).catch(err =>{
                req.flash('error', 'Something went wrong')
                return res.redirect('/cart')
            })
        },

        async index(req,res){          
            const orders = await Order.find({customerId: req.user._id}, null, {sort: {'createdAt': -1}});               //only fetching data of the logged in user.
            // console.log(orders);                 //will display array of objects
            res.render('customers/orders', {orders: orders, moment: moment});
        }
    }
}

module.exports = orderController          