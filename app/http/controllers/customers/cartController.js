
function cartController(){
    return {
        index(req,res){
            res.render('customers/cart');
        },

        update(req,res){
            // let cart = {                         //cart object template demo (just for understanding)
            //     items: {
            //         pizzaId: {
            //             item: pizzaObj, 
            //             qty: 0
            //         }
            //     },

            //     totalqty: 0,
            //     totalPrice: 0
            // }

            
            //for the first time creating cart inside session and creating basic object structure of cart.
            if(!req.session.cart){                 //if cart is not created then create one.
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }   
            }

            let cart = req.session.cart;
            // console.log(cart);

            //check if item doesnot exist in cart
            if(!cart.items[req.body._id]){
                cart.items[req.body._id] = {       //if item's _id is not present then create a new key with the name of _id and then create its object structure
                    item: req.body,
                    qty: 1
                }
                cart.totalQty = cart.totalQty + 1,
                cart.totalPrice = cart.totalPrice + req.body.price
            }
            //if item's _id is already present.
            else{                               
                cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1              //update the existing value of the key
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            }

            return res.json({totalQty: req.session.cart.totalQty});
        }


    }
}

module.exports = cartController;