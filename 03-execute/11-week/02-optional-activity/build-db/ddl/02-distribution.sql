/*
 * Creación de la entidad sede y sus atributos.
 ******************************************************************************
*/

CREATE TABLE sede (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    empresas_id INT,
    nombre VARCHAR(100),
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    telefono VARCHAR(20),
    correo VARCHAR(100),
);
/*
 * Creación de la entidad habitacion y sus atributos.
 ******************************************************************************
*/

CREATE TABLE habitacion(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    sede_id INT,
    tipo_habitacion_id INT,
    estado_habitacion_id INT,
    numero VARCHAR(20),
    piso INT,
    capacidad INT,
    descripcion VARCHAR(255)
);

/*
 * Creación de la entidad tipo_habitacion y sus atributos.
 ******************************************************************************
*/

CREATE TABLE tipo_habitacion(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    nombre VARCHAR(100),
    descripcion VARCHAR(255),
    capacidad_base INT,
    capacidad_maxima INT
);

/*
 * Creación de la entidad estado_habitacion y sus atributos.
 ******************************************************************************
*/

CREATE TABLE estado_habitacion(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    nombre VARCHAR(100),
    descripcion VARCHAR(255),
    permite_reserva BOOLEAN,
    permite_check_in BOOLEAN
);
