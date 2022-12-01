const Order = require('../../../models/order');


function adminOrderController(){
    return {
        index(req, res){
            //$ne means "not equal to"
             Order.find({status: { $ne: 'completed'}}, null, {sort: {'createdAt': -1}}).populate('customerId', '-password').exec((err, orders)=>{
                if(req.xhr){
                    return res.json(orders)
                }
                return res.render('admin/adminOrders')
            })          
            
        }
    }
}

module.exports = adminOrderController