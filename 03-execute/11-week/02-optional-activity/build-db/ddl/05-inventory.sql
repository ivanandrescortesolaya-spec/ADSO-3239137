
/*
 * Creación de la entidad producto y sus atributos.
 ******************************************************************************
*/

CREATE TABLE producto(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    proveedor_id INT,
    nombre VARCHAR(100),
    descripcion VARCHAR(255),
    valor_venta DECIMAL(10,2),
    stock_actual INT,
    stock_minimo INT
);

/*
 * Creación de la entidad servicio y sus atributos.
 ******************************************************************************
*/

CREATE TABLE servicio(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    nombre VARCHAR(100),
    descripcion VARCHAR(255),
    valor_venta DECIMAL(10,2),
    disponible BOOLEAN
);

/*
 * Creación de la entidad proveedor y sus atributos.
 ******************************************************************************
*/

CREATE TABLE proveedor(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    nombre VARCHAR(100),
    nit VARCHAR(30),
    telefono VARCHAR(20),
    correo VARCHAR(100),
    direccion VARCHAR(255)
);

/*
 * Creación de la entidad seguimiento_producto y sus atributos.
 ******************************************************************************
*/

CREATE TABLE seguimiento_producto(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    producto_id INT,
    tipo_movimiento VARCHAR(50),
    cantidad INT,
    fecha_movimiento TIMESTAMP,
    observacion VARCHAR(255)
);

/*
 * Creación de la entidad disponibilidad_inventario y sus atributos.
 ******************************************************************************
*/

CREATE TABLE disponibilidad_inventario(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    producto_id INT,
    servicio_id INT,
    cantidad_disponible INT,
    disponible BOOLEAN,
    observacion VARCHAR(255)
);
