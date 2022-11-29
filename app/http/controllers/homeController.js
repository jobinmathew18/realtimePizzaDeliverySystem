
const Menu = require('../../models/menu');

function homeController(){

    // it will return an abject
    return {
        async index (req,res){
            const pizzas = await Menu.find();
            return res.render('home', {pizzas: pizzas});
        }
    }
}

//exporting the object
module.exports = homeController;