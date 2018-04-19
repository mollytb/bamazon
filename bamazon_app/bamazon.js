var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    post: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});
connection.connect(function (err) {
    if (err) {
        throw err;
    }
    //console.log("connected as id " + connection.threadId + "\n");
    queryProductsList();

});
function queryProductsList() {
    connection.query("SELECT id, product_name, price FROM products", function (err, res, fields) {
        if (err) {
            throw err;
        }
        console.log("           Welcome to Bamazon!\n       Checkout our fabulous products.\n") 
        for (var i = 0; i < res.length; i++) {
            console.log("ID#: " + res[i].id + " | " + "Item: " + res[i].product_name + " | " + "Price: " + res[i].price + "$");
        }
        purchase();
    });
};

function purchase() {
    inquirer.prompt([
        {
            name: "item",
            type: "input",
            message: "What would you like to buy? (Please enter the item ID#)",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        },
        {
            name: "quantity",
            type: "input",
            message: "How many would you like to get?",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        }
    ])
    .then(function(answer) {
        console.log("Updating remaining quantity of sold items.\n")
        //var query = "Update products SET ? WHERE ?"
        connection.query("select stock_quantity FROM products Where id = " + answer.item, function(err, res, fields){
            connection.query("Update products SET stock_quantity = ? WHERE id = ?",
            [res[0]['stock_quantity'] - answer.quantity, answer.item], function(err, res, fields) {
                if (err) console.log(err)
            });
        });

         
    });
}
