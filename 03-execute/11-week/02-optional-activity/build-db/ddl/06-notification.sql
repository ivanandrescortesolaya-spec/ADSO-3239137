
/*
 * Creación de la entidad promocion y sus atributos.
 ******************************************************************************
*/

CREATE TABLE promocion(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    titulo VARCHAR(150),
    descripcion VARCHAR(255),
    fecha_inicio DATE,
    fecha_fin DATE,
    canal VARCHAR(50),
    activa BOOLEAN
);

/*
 * Creación de la entidad alerta y sus atributos.
 ******************************************************************************
*/

CREATE TABLE alerta(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    cliente_id INT,
    reserva_habitacion_id INT,
    titulo VARCHAR(150),
    mensaje TEXT,
    canal VARCHAR(50),
    fecha_envio TIMESTAMP
);

/*
 * Creación de la entidad termino_condicion y sus atributos.
 ******************************************************************************
*/

CREATE TABLE termino_condicion(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    titulo VARCHAR(150),
    contenido TEXT,
    version VARCHAR(20),
    fecha_vigencia DATE,
    obligatorio BOOLEAN
);

/*
 * Creación de la entidad fidelizacion_cliente y sus atributos.
 ******************************************************************************
*/

CREATE TABLE fidelizacion_cliente(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    cliente_id INT,
    nivel VARCHAR(50),
    puntos INT,
    fecha_ultima_interaccion DATE,
    observacion VARCHAR(255)
);
