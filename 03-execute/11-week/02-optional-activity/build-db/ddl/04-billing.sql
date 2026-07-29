
/*
 * Creación de la entidad pre_factura y sus atributos.
 ******************************************************************************
*/

CREATE TABLE pre_factura(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    estadia_id INT,
    reserva_habitacion_id INT,
    cliente_id INT,
    subtotal DECIMAL(10,2),
    impuesto DECIMAL(10,2),
    descuento DECIMAL(10,2),
    total DECIMAL(10,2)
);

/*
 * Creación de la entidad pago_parcial y sus atributos.
 ******************************************************************************
*/

CREATE TABLE pago_parcial(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    reserva_habitacion_id INT,
    factura_id INT,
    metodo_pago_id INT,
    valor DECIMAL(10,2),
    fecha_pago DATE,
    referencia_pago VARCHAR(100)
);

/*
 * Creación de la entidad factura y sus atributos.
 ******************************************************************************
*/

CREATE TABLE factura(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    cliente_id INT,
    estadia_id INT,
    numero_factura VARCHAR(50),
    fecha_emision DATE,
    subtotal DECIMAL(10,2),
    impuesto DECIMAL(10,2),
    descuento DECIMAL(10,2),
    total DECIMAL(10,2),
    estado_factura VARCHAR(50)
);

/*
 * Creación de la entidad detalle_compra y sus atributos.
 ******************************************************************************
*/

CREATE TABLE detalle_compra(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    factura_id INT,
    producto_id INT,
    servicio_id INT,
    descripcion VARCHAR(255),
    cantidad INT,
    valor_unitario DECIMAL(10,2),
    valor_total DECIMAL(10,2)
);
