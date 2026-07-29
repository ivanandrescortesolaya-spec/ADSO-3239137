
/*
 * Creación de la entidad reserva_habitacion y sus atributos.
 ******************************************************************************
*/

CREATE TABLE reserva_habitacion(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    cliente_id INT,
    habitacion_id INT,
    fecha_inicio DATE,
    fecha_fin DATE,
    cantidad_persona INT,
    estado_reserva VARCHAR(50),
    valor_estimado DECIMAL(10,2)
);

/*
 * Creación de la entidad cancelacion_habitacion y sus atributos.
 ******************************************************************************
*/

CREATE TABLE cancelacion_habitacion(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    reserva_habitacion_id INT,
    motivo VARCHAR(255),
    fecha_cancelacion DATE,
    aplica_penalidad BOOLEAN,
    valor_penalidad DECIMAL(10,2)
);

/*
 * Creación de la entidad disponibilidad_habitacion y sus atributos.
 ******************************************************************************
*/

CREATE TABLE disponibilidad_habitacion(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    habitacion_id INT,
    fecha_inicio DATE,
    fecha_fin DATE,
    disponible BOOLEAN,
    motivo_no_disponible VARCHAR(255)
);

/*
 * Creación de la entidad catalogo_habitacion y sus atributos.
 ******************************************************************************
*/

CREATE TABLE catalogo_habitacion(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    habitacion_id INT,
    titulo VARCHAR(150),
    descripcion VARCHAR(255),
    precio_base DECIMAL(10,2),
    visible BOOLEAN
);

/*
 * Creación de la entidad check_in y sus atributos.
 ******************************************************************************
*/

CREATE TABLE check_in(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    reserva_habitacion_id INT,
    empleado_id INT,
    fecha_hora_ingreso TIMESTAMP,
    observacion VARCHAR(255)
);

/*
 * Creación de la entidad check_out y sus atributos.
 ******************************************************************************
*/

CREATE TABLE check_out(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    estadia_id INT,
    empleado_id INT,
    fecha_hora_salida TIMESTAMP,
    observacion VARCHAR(255),
    valor_total DECIMAL(10,2)
);

/*
 * Creación de la entidad estadia y sus atributos.
 ******************************************************************************
*/

CREATE TABLE estadia(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    reserva_habitacion_id INT,
    cliente_id INT,
    habitacion_id INT,
    fecha_inicio DATE,
    fecha_fin DATE,
    estado_estadia VARCHAR(50)
);

/*
 * Creación de la entidad venta_producto y sus atributos.
 ******************************************************************************
*/

CREATE TABLE venta_producto(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    estadia_id INT,
    producto_id INT,
    cantidad INT,
    valor_unitario DECIMAL(10,2),
    valor_total DECIMAL(10,2)
);

/*
 * Creación de la entidad venta_servicio y sus atributos.
 ******************************************************************************
*/

CREATE TABLE venta_servicio(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    estadia_id INT,
    servicio_id INT,
    cantidad INT,
    valor_unitario DECIMAL(10,2),
    valor_total DECIMAL(10,2)
);
