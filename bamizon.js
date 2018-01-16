const mysql = require ('mysql');
const inquirer = require ('inquirer');

let connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "honeybees",
  database: "bamizondb"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  welcome();
});

//welcomes and lists items
function welcome() {
	console.log("Welcome to BAMizon! \n")
  console.log("Here are all the items we have today:\n");
  connection.query("SELECT * FROM items", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    for (let i = 0; i <res.length; i ++){
    	console.log("Product ID: " + res[i].id);
    	console.log("Product: " + res[i].product_name);
    	console.log("Price: " + res[i].price);
    	console.log("Quantity: " + res[i].quantity);
    	console.log("======================================");
    }
    askUser();
  });
}

function askUser(){
	inquirer.prompt([
	{
		type:"input",
		message: "What Item ID are you interested in?\n",
		name: "itemid",
		validate: function(input){
			if(isNaN(input)){
				console.log(" Please enter a number.")
			}else{
				return true
			}
		}
	},
	{
		type:"input",
		message: "How many would you like? \n",
		name: "itemquant",
		validate: function(input){
			if(isNaN(input)){
				console.log(" Please enter a number.")
			}else{
				return true
			}
		}
	}
	]).then(function(answers){
		let item = answers.itemid;
		let quant = answers.itemquant;
		console.log(`Item ID: ${item} Quantity: ${quant}`);
		selectProducts(item,quant);
	})
}

//selects items
function selectProducts(id,quant) {
  console.log("Selecting all products...\n");
  connection.query(`SELECT * FROM items WHERE id = ${id}`, function(err, res) {
    if (err) throw err;

    	//determines if there are enough in stock
    if(quant>res[0].quantity){
    	console.log("Insufficient Quantity!");
    	askUser();
    }else{
    	//updates quantity
    	let updatedQuant = (res[0].quantity) - (parseInt(quant));
    	updateQuant(id, updatedQuant);

    	//displays how  much total will be to customer
    	let total = (parseInt(quant)*(res[0].price));
    	console.log(`That will be $ ${total}`);
    	anotherPurch();
    }
  });
}


//function that updates DB quantity
function updateQuant(id,quant) {
  var query = connection.query(
    "UPDATE items SET ? WHERE ?",
    [
      {
        quantity: quant  
      },
      {
        id: id
      }
    ],
    function(err, res) {
    	if (err) throw err;
    });
}

//prompts user if they would like to make another purchase
function anotherPurch(){
	inquirer.prompt([
		{
			type:"checkbox",
			message:`Is there anything else you would like to do?`,
			choices:["Yes.","No thanks."],
			name: "another",
			validate: function(input){
				if(input.length>1){
					console.log(" Please enter one choice.");
				}else{
					return true;
				};
			}
		}
	]).then(function(answers){
		if(answers.another[0] ==="Yes."){
			welcome();
		}else if(answers.another[0] === "No thanks."){
			return false
		};
	});
};
