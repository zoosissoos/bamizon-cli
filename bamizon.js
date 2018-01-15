const mysql = require ('mysql');
const inquirer = require ('inquirer');

let connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "honeybees",
  database: "bamizonDB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  welcome();
});


function readProducts() {
  console.log("Here are all the items we have today:\n");
  connection.query("SELECT * FROM items", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(res);
  });
}


function createProduct() {
  console.log("Adding product");
  let query = connection.query(
    "INSERT INTO items SET ?",
    {
      product_name: "Rocky Road",
      department_name: "",
      price: 3.0,
      quantity: 50
    },
    function(err, res) {
      console.log(res.affectedRows + " product inserted!\n");
    }
  );

  // logs the actual query being run
  console.log(query.sql);
}