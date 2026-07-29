/*
 * Creación de la entidad cliente y sus atributos.
 ******************************************************************************
*/

CREATE TABLE cliente(
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_documento VARCHAR(50),
    numero_documento VARCHAR(50),
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    telefono VARCHAR(20),
    correo VARCHAR(100),
    direccion VARCHAR(255)
);
/*
 * Creación de la entidad precio y sus atributos.
 ******************************************************************************
*/

CREATE TABLE precio(
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_habitacion_id INT,
    tipo_dia_id INT,
    valor DECIMAL(10,2),
    fecha_inicio DATE,
    fecha_fin DATE,
    condicion VARCHAR(255)
);
/*
 * Creación de la entidad empresa y sus atributos.
 ******************************************************************************
*/

CREATE TABLE empresa(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    nit VARCHAR(30)  ,
    razon_social VARCHAR(150),
    telefono VARCHAR(20),
    correo VARCHAR(100),
    direccion VARCHAR(255),
    sitio_web VARCHAR(150)
);
/*
 * Creación de la entidad informacion_legal y sus atributos.
 ******************************************************************************
*/

CREATE TABLE informacion_legal(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    empresa_id INT,
    tipo_documento_legal VARCHAR(100),
    numero_documento_legal VARCHAR(100),
    descripcion VARCHAR(255),
    fecha_expedicion DATE,
    fecha_vencimiento DATE
);

/*
 * Creación de la entidad empleado y sus atributos.
 ******************************************************************************
*/

CREATE TABLE empleado(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    persona_id INT,
    cargo VARCHAR(100),
    fecha_ingreso DATE,
    telefono_laboral VARCHAR(20),
    correo_laboral VARCHAR(100)
);
/*
 * Creación de la entidad tipo_dia y sus atributos.
 ******************************************************************************
*/

CREATE TABLE tipo_dia(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    nombre VARCHAR(100),
    descripcion VARCHAR(255),
    fecha DATE,
    aplica_temporada BOOLEAN,
    aplica_feriado BOOLEAN,
    aplica_especial BOOLEAN
);
/*
 * Creación de la entidad metodo_pago y sus atributos.
 ******************************************************************************
*/

CREATE TABLE metodo_pago(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    nombre VARCHAR(100),
    descripcion VARCHAR(255),
    requiere_referencia BOOLEAN,
    permite_pago_parcial BOOLEAN
);
