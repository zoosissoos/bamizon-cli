DROP DATABASE IF EXISTS bamizondb;

CREATE DATABASE bamizondb;

USE bamizondb;

CREATE TABLE items (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO items (product_name, price, quantity, department_name)
VALUES ("Baseball Bat", 82.99, 100, sports);

INSERT INTO items (product_name, price, quantity, department_name)
VALUES ("Football", 29.99, 10, sports);

INSERT INTO items (product_name, price, quantity, department_name)
VALUES ("TV", 749.99, 10, electronics);

INSERT INTO items (product_name, price, quantity, department_name)
VALUES ("Guitar", 579.99, 10, music);

INSERT INTO items (product_name, price, quantity, department_name)
VALUES ("Sweater", 9.99, 10, clothing);