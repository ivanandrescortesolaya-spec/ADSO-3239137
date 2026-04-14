CREATE DATABASE carrito_db;
USE carrito_db;

CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(100)
);

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    precio DECIMAL(10,2)
);

CREATE TABLE carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE TABLE carrito_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    carrito_id INT,
    producto_id INT,
    cantidad INT,
    FOREIGN KEY (carrito_id) REFERENCES carrito(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    fecha DATE,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

INSERT INTO clientes VALUES (1,'Juan','juan@mail.com');

INSERT INTO productos VALUES 
(1,'Laptop',2000),
(2,'Mouse',50);

INSERT INTO carrito VALUES (1,1);

INSERT INTO carrito_items VALUES 
(1,1,1,1),
(2,1,2,2);

INSERT INTO pedidos VALUES (1,1,'2026-01-01');

-- clientes
UPDATE clientes SET nombre = 'Juan Pérez' WHERE id = 1;
UPDATE clientes SET email = 'juanperez@mail.com' WHERE id = 1;

-- productos
UPDATE productos SET precio = 1800 WHERE id = 1;
UPDATE productos SET nombre = 'Mouse Gamer' WHERE id = 2;

-- carrito_items
UPDATE carrito_items SET cantidad = 3 WHERE id = 2;
UPDATE carrito_items SET producto_id = 2 WHERE id = 2;

-- pedidos
UPDATE pedidos SET fecha = '2026-02-01' WHERE id = 1;
UPDATE pedidos SET cliente_id = 1 WHERE id = 1;

-- clientes
SELECT * FROM clientes WHERE id = 1;
SELECT nombre, email FROM clientes WHERE email LIKE '%mail.com';

-- productos
SELECT * FROM productos WHERE precio > 100;
SELECT nombre FROM productos WHERE id = 2;

-- carrito
SELECT * FROM carrito WHERE cliente_id = 1;
SELECT id FROM carrito WHERE id = 1;

-- carrito_items
SELECT * FROM carrito_items WHERE carrito_id = 1;
SELECT producto_id, cantidad FROM carrito_items WHERE cantidad >= 2;

-- pedidos
SELECT * FROM pedidos WHERE cliente_id = 1;
SELECT fecha FROM pedidos WHERE fecha >= '2026-01-01';

-- Primero tablas dependientes
DELETE FROM carrito_items WHERE id = 1;
DELETE FROM carrito_items WHERE cantidad > 2;

DELETE FROM carrito WHERE id = 1;
DELETE FROM carrito WHERE cliente_id = 1;

DELETE FROM pedidos WHERE id = 1;
DELETE FROM pedidos WHERE fecha = '2026-02-01';

-- Luego tablas principales
DELETE FROM productos WHERE id = 2;
DELETE FROM productos WHERE precio < 100;

DELETE FROM clientes WHERE id = 1;
DELETE FROM clientes WHERE email = 'juanperez@mail.com';



