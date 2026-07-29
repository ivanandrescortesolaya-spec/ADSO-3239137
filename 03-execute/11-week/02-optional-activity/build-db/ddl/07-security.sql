
/*
 * Creación de la entidad persona y sus atributos.
 ******************************************************************************
*/

CREATE TABLE persona(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    tipo_documento VARCHAR(50),
    numero_documento VARCHAR(50)  ,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    telefono VARCHAR(20),
    correo VARCHAR(100)
);

/*
 * Creación de la entidad usuario y sus atributos.
 ******************************************************************************
*/

CREATE TABLE usuario(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    persona_id INT,
    username VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255),
    ultimo_acceso TIMESTAMP,
    bloqueado BOOLEAN
);

/*
 * Creación de la entidad rol y sus atributos.
 ******************************************************************************
*/

CREATE TABLE rol(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    nombre VARCHAR(100),
    descripcion VARCHAR(255)
);

/*
 * Creación de la entidad permiso y sus atributos.
 ******************************************************************************
*/

CREATE TABLE permiso(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    nombre VARCHAR(100),
    descripcion VARCHAR(255),
    accion VARCHAR(100)
);

/*
 * Creación de la entidad modulo y sus atributos.
 ******************************************************************************
*/

CREATE TABLE modulo(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    nombre VARCHAR(100),
    descripcion VARCHAR(255),
    ruta_base VARCHAR(150)
);

/*
 * Creación de la entidad vista y sus atributos.
 ******************************************************************************
*/

CREATE TABLE vista(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    modulo_id INT,
    nombre VARCHAR(100),
    descripcion VARCHAR(255),
    ruta VARCHAR(150)
);

/*
 * Creación de la entidad usuario_rol y sus atributos.
 ******************************************************************************
*/

CREATE TABLE usuario_rol(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    usuario_id INT,
    rol_id INT
);

/*
 * Creación de la entidad rol_permiso y sus atributos.
 ******************************************************************************
*/

CREATE TABLE rol_permiso(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    rol_id INT,
    permiso_id INT
);

/*
 * Creación de la entidad modulo_vista y sus atributos.
 ******************************************************************************
*/

CREATE TABLE modulo_vista(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    modulo_id INT,
    vista_id INT
);
