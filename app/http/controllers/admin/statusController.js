const Order = require('../../../models/order')

function statusController(){
    return{
        update(req, res){

            //here "orderId" is "name" of the input (whose type="hidden") in admin.js file.
            //"status" is the "name" of the <select> tag
            //updating the value of the "status" key in the "order" database collection for a particular order.
            Order.updateOne({_id: req.body.orderId}, {status: req.body.status}, (err, data)=>{
                if(err){
                    return res.redirect('/admin/orders');
                }
                
                //Emit event
                const eventEmitter = req.app.get('eventEmitter')            //req.app.get('eventEmitter'): getting eventEmitter from server.js
                eventEmitter.emit('orderUpdated', {id: req.body.orderId, status: req.body.status})           //sending id and updated status to the server.js

                return res.redirect('/admin/orders'); 
            })            
        }
    }
}

module.exports = statusController;        