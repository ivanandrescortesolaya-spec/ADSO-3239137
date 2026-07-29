
/*
 * Creación de la entidad mantenimiento_habitacion y sus atributos.
 ******************************************************************************
*/

CREATE TABLE mantenimiento_habitacion(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    habitacion_id INT,
    empleado_id INT,
    tipo_mantenimiento VARCHAR(100),
    fecha_inicio DATE,
    fecha_fin DATE,
    estado_mantenimiento VARCHAR(50),
    observacion VARCHAR(255)
);

/*
 * Creación de la entidad mantenimiento_uso y sus atributos.
 ******************************************************************************
*/

CREATE TABLE mantenimiento_uso(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    mantenimiento_habitacion_id INT,
    motivo_uso VARCHAR(255),
    detalle_actividad VARCHAR(255)
);

/*
 * Creación de la entidad mantenimiento_remodelacion y sus atributos.
 ******************************************************************************
*/

CREATE TABLE mantenimiento_remodelacion(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    mantenimiento_habitacion_id INT,
    descripcion_remodelacion VARCHAR(255),
    presupuesto_estimado DECIMAL(10,2)
);

/*
 * Creación de la entidad dashboard_mantenimiento y sus atributos.
 ******************************************************************************
*/

CREATE TABLE dashboard_mantenimiento(
    id INT AUTO_INCREMENT PRIMARY KEY,,
    sede_id INT,
    total_habitacion INT,
    habitacion_disponible INT,
    habitacion_ocupada INT,
    habitacion_mantenimiento INT,
    fecha_corte DATE
);

