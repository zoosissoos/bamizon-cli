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


//creates a connection with db
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\r\n");
  welcomeManage();
});


//defines function that welcomes the user
function welcomeManage(){
  inquirer.prompt([
    {
      type: "checkbox",
      message: "What would you like to do?",
      choices:["View inventory", "View low inventory","Stock item","Add item to inventory"],
      name: "manageSelect",
      validate: function(input){
        if(input.length>1){
          console.log("Please enter one choice.");
        }else if(input.length<1){
          console.log("Please enter a choice.");
        }else{
          return true;
        };
      }
    }
  ]).then(function(answer){
    console.log("You chose: " + answer.manageSelect[0])
    if(answer.manageSelect[0] === "View inventory"){
      viewInventory();
    }else if(answer.manageSelect[0] === "View low inventory"){
      viewLow();
    }else if(answer.manageSelect[0] === "Stock item"){
      stockInventoryAsk();
    }else if(answer.manageSelect[0] === "Add item to inventory"){
      addInventory();
    }
  });
}


//defines function that voews inventory
function viewInventory(){
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
    another();
  });
}


//defines function that shows low inventory
function viewLow(){
  connection.query("SELECT * FROM items", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log("Low Items:\r\n")
    for (let j = 0; j <res.length; j ++){
      if(res[j].quantity < 5){
        console.log("Product ID: " + res[j].id);
        console.log("Product: " + res[j].product_name);
        console.log("Quantity: " + res[j].quantity);
        console.log("======================================");
      }
    }
    another();
  });
}


//defines function that aks what item to stock and how many
function stockInventoryAsk(){

  //shows inventory
  connection.query("SELECT * FROM items", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    for (let i = 0; i <res.length; i ++){
      console.log("Product ID: " + res[i].id);
      console.log("Product: " + res[i].product_name);
      console.log("Price: " + res[i].price);
      console.log("Quantity: " + res[i].quantity);
      console.log("======================================");
    };

    //then asks what user would like to do
    inquirer.prompt([
    {
      type:"input",
      message: "Please select by Item ID.\r\n",
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
      message: "How many would you like to add \r\n",
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
      stockInv(item,quant);
    })
  });
}

function stockInv(id,quant) {
  console.log("Selecting all products...\r\n");
  connection.query(`SELECT * FROM items WHERE id = ${id}`, function(err, res) {
    if (err) throw err;
      //updates quantity
    let updatedQuant = (res[0].quantity) + (parseInt(quant));
    updateQuant(id, updatedQuant);
  });
}

//updates the quantity in DB
function updateQuant(id,quant) {
  console.log("Adding items...")
  let query = connection.query("UPDATE items SET ? WHERE ?",
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
  console.log(`Succesfully added items to item ID: ${id}.\r\n`);
  another();
}


//defines function that allows user to add an item to inventory
function addInventory(){
  console.log("Please enter some information:\r\n");
  inquirer.prompt([
    {
      type: "input",
      message: "Name of item: \r\n",
      name: "itemName"
    },
    {
      type:"input",
      message: "Please enter a price: \r\n",
      name: "itemPrice",
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
      message: "Please enter a quantity: \r\n",
      name: "itemQuant",
      validate: function(input){
        if(isNaN(input)){
          console.log(" \nPlease enter a number.\r\n")
        }else{
          return true
        }
      }
    },
    {
      type:"input",
      message: "Please enter the department for this item: \r\n",
      name:"itemDept"
    }
  ]).then(function(answers){
      var query = connection.query(
      "INSERT INTO items SET ?",
    {
      product_name: answers.itemName,
      price: answers.itemPrice,
      quantity: answers.itemQuant,
      department_name: answers.itemDept
    },
    function(err, res) {
      if (err) throw err;
    }
  );
      console.log(answers.itemName + " added sucessfully!\r\n");
      another();
 })
}

//asks user if they would like to perform another action
function another(){
  inquirer.prompt([
    {
      type:"checkbox",
      message:`Is there anything else you would like to do?`,
      choices:["Yes.","No thanks."],
      name: "another",
      validate: function(input){
        if(input.length > 1){
          console.log(" Please enter one choice.\r\n");
        }else if(input.length < 1){
          console.log(" Please enter a choice.\r\n");
        }else{
          return true;
        };
      }
    }
  ]).then(function(answers){
    if(answers.another[0] ==="Yes."){
      welcomeManage();
    }else if(answers.another[0] === "No thanks."){
      connection.end();
      console.log("Good Bye");
      return false
    };
  });
};