DROP DATABASE IF EXISTS db_hoteleria;
CREATE DATABASE db_hoteleria;
USE db_hoteleria;

-- =====================================
-- CONFIG
-- =====================================
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================
-- SEGURIDAD
-- =====================================
CREATE TABLE persona (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo_documento VARCHAR(20),
  numero_documento VARCHAR(50) UNIQUE,
  nombre VARCHAR(100),
  apellido VARCHAR(100),
  telefono VARCHAR(20),
  correo VARCHAR(100)
);

CREATE TABLE usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  persona_id INT,
  username VARCHAR(50) UNIQUE,
  password_hash VARCHAR(255),
  ultimo_acceso DATETIME,
  bloqueado BOOLEAN,
  FOREIGN KEY (persona_id) REFERENCES persona(id)
);

CREATE TABLE rol (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50),
  descripcion VARCHAR(255)
);

CREATE TABLE permiso (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50),
  descripcion VARCHAR(255),
  accion VARCHAR(50)
);

CREATE TABLE modulo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50),
  descripcion VARCHAR(255),
  ruta_base VARCHAR(100)
);

CREATE TABLE vista (
  id INT AUTO_INCREMENT PRIMARY KEY,
  modulo_id INT,
  nombre VARCHAR(50),
  descripcion VARCHAR(255),
  ruta VARCHAR(100),
  FOREIGN KEY (modulo_id) REFERENCES modulo(id)
);

CREATE TABLE usuario_rol (
  usuario_id INT,
  rol_id INT,
  PRIMARY KEY (usuario_id, rol_id),
  FOREIGN KEY (usuario_id) REFERENCES usuario(id),
  FOREIGN KEY (rol_id) REFERENCES rol(id)
);

CREATE TABLE rol_permiso (
  rol_id INT,
  permiso_id INT,
  PRIMARY KEY (rol_id, permiso_id),
  FOREIGN KEY (rol_id) REFERENCES rol(id),
  FOREIGN KEY (permiso_id) REFERENCES permiso(id)
);

CREATE TABLE modulo_vista (
  modulo_id INT,
  vista_id INT,
  PRIMARY KEY (modulo_id, vista_id),
  FOREIGN KEY (modulo_id) REFERENCES modulo(id),
  FOREIGN KEY (vista_id) REFERENCES vista(id)
);

-- =====================================
-- EMPRESA / PARAMETRIZACIÓN
-- =====================================
CREATE TABLE empresa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150),
  nit VARCHAR(50) UNIQUE,
  razon_social VARCHAR(150),
  telefono VARCHAR(20),
  correo VARCHAR(100),
  direccion VARCHAR(255),
  sitio_web VARCHAR(150)
);

CREATE TABLE informacion_legal (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT,
  tipo_documento_legal VARCHAR(50),
  numero_documento_legal VARCHAR(50),
  descripcion TEXT,
  fecha_expedicion DATE,
  fecha_vencimiento DATE,
  FOREIGN KEY (empresa_id) REFERENCES empresa(id)
);

CREATE TABLE cliente (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo_documento VARCHAR(20),
  numero_documento VARCHAR(50),
  nombre VARCHAR(100),
  apellido VARCHAR(100),
  telefono VARCHAR(20),
  correo VARCHAR(100),
  direccion VARCHAR(255),
  UNIQUE (tipo_documento, numero_documento)
);

CREATE TABLE empleado (
  id INT AUTO_INCREMENT PRIMARY KEY,
  persona_id INT,
  cargo VARCHAR(100),
  fecha_ingreso DATE,
  telefono_laboral VARCHAR(20),
  correo_laboral VARCHAR(100),
  FOREIGN KEY (persona_id) REFERENCES persona(id)
);

CREATE TABLE tipo_dia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50),
  descripcion VARCHAR(255),
  fecha DATE,
  aplica_temporada BOOLEAN,
  aplica_feriado BOOLEAN,
  aplica_especial BOOLEAN
);

CREATE TABLE metodo_pago (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50),
  descripcion VARCHAR(255),
  requiere_referencia BOOLEAN,
  permite_pago_parcial BOOLEAN
);

-- =====================================
-- DISTRIBUCIÓN
-- =====================================
CREATE TABLE sede (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT,
  nombre VARCHAR(100),
  direccion VARCHAR(255),
  ciudad VARCHAR(100),
  telefono VARCHAR(20),
  correo VARCHAR(100),
  FOREIGN KEY (empresa_id) REFERENCES empresa(id)
);

CREATE TABLE tipo_habitacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50),
  descripcion VARCHAR(255),
  capacidad_base INT,
  capacidad_maxima INT,
  CHECK (capacidad_maxima >= capacidad_base)
);

CREATE TABLE estado_habitacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50),
  descripcion VARCHAR(255),
  permite_reserva BOOLEAN,
  permite_check_in BOOLEAN
);

CREATE TABLE habitacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sede_id INT,
  tipo_habitacion_id INT,
  estado_habitacion_id INT,
  numero VARCHAR(10),
  piso INT,
  capacidad INT,
  descripcion VARCHAR(255),
  UNIQUE (sede_id, numero),
  FOREIGN KEY (sede_id) REFERENCES sede(id),
  FOREIGN KEY (tipo_habitacion_id) REFERENCES tipo_habitacion(id),
  FOREIGN KEY (estado_habitacion_id) REFERENCES estado_habitacion(id)
);

-- =====================================
-- PRECIOS
-- =====================================
CREATE TABLE precio (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo_habitacion_id INT,
  tipo_dia_id INT,
  valor DECIMAL(10,2),
  fecha_inicio DATE,
  fecha_fin DATE,
  condicion VARCHAR(255),
  FOREIGN KEY (tipo_habitacion_id) REFERENCES tipo_habitacion(id),
  FOREIGN KEY (tipo_dia_id) REFERENCES tipo_dia(id)
);

-- =====================================
-- PRESTACIÓN DE SERVICIO
-- =====================================
CREATE TABLE reserva_habitacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT,
  habitacion_id INT,
  fecha_inicio DATE,
  fecha_fin DATE,
  cantidad_persona INT,
  estado_reserva VARCHAR(50),
  valor_estimado DECIMAL(10,2),
  CHECK (fecha_fin > fecha_inicio),
  FOREIGN KEY (cliente_id) REFERENCES cliente(id),
  FOREIGN KEY (habitacion_id) REFERENCES habitacion(id)
);

CREATE INDEX idx_reserva_fechas ON reserva_habitacion(fecha_inicio, fecha_fin);

CREATE TABLE cancelacion_habitacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reserva_habitacion_id INT,
  motivo VARCHAR(255),
  fecha_cancelacion DATE,
  aplica_penalidad BOOLEAN,
  valor_penalidad DECIMAL(10,2),
  FOREIGN KEY (reserva_habitacion_id) REFERENCES reserva_habitacion(id)
);

CREATE TABLE disponibilidad_habitacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  habitacion_id INT,
  fecha_inicio DATE,
  fecha_fin DATE,
  disponible BOOLEAN,
  motivo_no_disponible VARCHAR(255),
  FOREIGN KEY (habitacion_id) REFERENCES habitacion(id)
);

CREATE TABLE catalogo_habitacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  habitacion_id INT,
  titulo VARCHAR(150),
  descripcion TEXT,
  precio_base DECIMAL(10,2),
  visible BOOLEAN,
  FOREIGN KEY (habitacion_id) REFERENCES habitacion(id)
);

CREATE TABLE estadia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reserva_habitacion_id INT,
  cliente_id INT,
  habitacion_id INT,
  fecha_inicio DATE,
  fecha_fin DATE,
  estado_estadia VARCHAR(50),
  FOREIGN KEY (reserva_habitacion_id) REFERENCES reserva_habitacion(id),
  FOREIGN KEY (cliente_id) REFERENCES cliente(id),
  FOREIGN KEY (habitacion_id) REFERENCES habitacion(id)
);

CREATE TABLE check_in (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reserva_habitacion_id INT,
  empleado_id INT,
  fecha_hora_ingreso DATETIME,
  observacion VARCHAR(255),
  FOREIGN KEY (reserva_habitacion_id) REFERENCES reserva_habitacion(id),
  FOREIGN KEY (empleado_id) REFERENCES empleado(id)
);

CREATE TABLE check_out (
  id INT AUTO_INCREMENT PRIMARY KEY,
  estadia_id INT,
  empleado_id INT,
  fecha_hora_salida DATETIME,
  observacion VARCHAR(255),
  valor_total DECIMAL(10,2),
  FOREIGN KEY (estadia_id) REFERENCES estadia(id),
  FOREIGN KEY (empleado_id) REFERENCES empleado(id)
);

-- =====================================
-- INVENTARIO
-- =====================================
CREATE TABLE proveedor (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150),
  nit VARCHAR(50),
  telefono VARCHAR(20),
  correo VARCHAR(100),
  direccion VARCHAR(255)
);

CREATE TABLE producto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  proveedor_id INT,
  nombre VARCHAR(150),
  descripcion VARCHAR(255),
  valor_venta DECIMAL(10,2),
  stock_actual INT,
  stock_minimo INT,
  FOREIGN KEY (proveedor_id) REFERENCES proveedor(id)
);

CREATE TABLE servicio (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150),
  descripcion VARCHAR(255),
  valor_venta DECIMAL(10,2),
  disponible BOOLEAN
);

CREATE TABLE seguimiento_producto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto_id INT,
  tipo_movimiento VARCHAR(50),
  cantidad INT,
  fecha_movimiento DATE,
  observacion VARCHAR(255),
  FOREIGN KEY (producto_id) REFERENCES producto(id)
);

CREATE TABLE disponibilidad_inventario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto_id INT,
  servicio_id INT,
  cantidad_disponible INT,
  disponible BOOLEAN,
  observacion VARCHAR(255),
  FOREIGN KEY (producto_id) REFERENCES producto(id),
  FOREIGN KEY (servicio_id) REFERENCES servicio(id)
);

-- =====================================
-- FACTURACIÓN
-- =====================================
CREATE TABLE factura (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT,
  estadia_id INT,
  numero_factura VARCHAR(50) UNIQUE,
  fecha_emision DATE,
  subtotal DECIMAL(10,2),
  impuesto DECIMAL(10,2),
  descuento DECIMAL(10,2),
  total DECIMAL(10,2),
  estado_factura VARCHAR(50),
  FOREIGN KEY (cliente_id) REFERENCES cliente(id),
  FOREIGN KEY (estadia_id) REFERENCES estadia(id)
);

CREATE TABLE pre_factura (
  id INT AUTO_INCREMENT PRIMARY KEY,
  estadia_id INT,
  reserva_habitacion_id INT,
  cliente_id INT,
  subtotal DECIMAL(10,2),
  impuesto DECIMAL(10,2),
  descuento DECIMAL(10,2),
  total DECIMAL(10,2),
  FOREIGN KEY (estadia_id) REFERENCES estadia(id),
  FOREIGN KEY (reserva_habitacion_id) REFERENCES reserva_habitacion(id),
  FOREIGN KEY (cliente_id) REFERENCES cliente(id)
);

CREATE TABLE detalle_compra (
  id INT AUTO_INCREMENT PRIMARY KEY,
  factura_id INT,
  producto_id INT,
  servicio_id INT,
  descripcion VARCHAR(255),
  cantidad INT,
  valor_unitario DECIMAL(10,2),
  valor_total DECIMAL(10,2),
  FOREIGN KEY (factura_id) REFERENCES factura(id),
  FOREIGN KEY (producto_id) REFERENCES producto(id),
  FOREIGN KEY (servicio_id) REFERENCES servicio(id)
);

CREATE TABLE pago_parcial (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reserva_habitacion_id INT,
  factura_id INT,
  metodo_pago_id INT,
  valor DECIMAL(10,2),
  fecha_pago DATE,
  referencia_pago VARCHAR(100),
  FOREIGN KEY (reserva_habitacion_id) REFERENCES reserva_habitacion(id),
  FOREIGN KEY (factura_id) REFERENCES factura(id),
  FOREIGN KEY (metodo_pago_id) REFERENCES metodo_pago(id)
);

-- =====================================
-- NOTIFICACIÓN
-- =====================================
CREATE TABLE promocion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150),
  descripcion TEXT,
  fecha_inicio DATE,
  fecha_fin DATE,
  canal VARCHAR(50),
  activa BOOLEAN
);

CREATE TABLE alerta (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT,
  reserva_habitacion_id INT,
  titulo VARCHAR(150),
  mensaje TEXT,
  canal VARCHAR(50),
  fecha_envio DATETIME,
  FOREIGN KEY (cliente_id) REFERENCES cliente(id),
  FOREIGN KEY (reserva_habitacion_id) REFERENCES reserva_habitacion(id)
);

CREATE TABLE termino_condicion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150),
  contenido TEXT,
  version VARCHAR(20),
  fecha_vigencia DATE,
  obligatorio BOOLEAN
);

CREATE TABLE fidelizacion_cliente (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT,
  nivel VARCHAR(50),
  puntos INT,
  fecha_ultima_interaccion DATE,
  observacion VARCHAR(255),
  FOREIGN KEY (cliente_id) REFERENCES cliente(id)
);

-- =====================================
-- MANTENIMIENTO
-- =====================================
CREATE TABLE mantenimiento_habitacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  habitacion_id INT,
  empleado_id INT,
  tipo_mantenimiento VARCHAR(50),
  fecha_inicio DATE,
  fecha_fin DATE,
  estado_mantenimiento VARCHAR(50),
  observacion VARCHAR(255),
  FOREIGN KEY (habitacion_id) REFERENCES habitacion(id),
  FOREIGN KEY (empleado_id) REFERENCES empleado(id)
);

CREATE TABLE mantenimiento_uso (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mantenimiento_habitacion_id INT,
  motivo_uso VARCHAR(255),
  detalle_actividad TEXT,
  FOREIGN KEY (mantenimiento_habitacion_id) REFERENCES mantenimiento_habitacion(id)
);

CREATE TABLE mantenimiento_remodelacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mantenimiento_habitacion_id INT,
  descripcion_remodelacion TEXT,
  presupuesto_estimado DECIMAL(10,2),
  FOREIGN KEY (mantenimiento_habitacion_id) REFERENCES mantenimiento_habitacion(id)
);

CREATE TABLE dashboard_mantenimiento (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sede_id INT,
  total_habitacion INT,
  habitacion_disponible INT,
  habitacion_ocupada INT,
  habitacion_mantenimiento INT,
  fecha_corte DATE,
  FOREIGN KEY (sede_id) REFERENCES sede(id)
);

SET FOREIGN_KEY_CHECKS = 1;
-- =====================================
-- DATOS BÁSICOS
-- =====================================

INSERT INTO persona (tipo_documento, numero_documento, nombre, apellido, telefono, correo) VALUES
('CC','1001','Juan','Perez','3001111111','juan@mail.com'),
('CC','1002','Ana','Gomez','3002222222','ana@mail.com'),
('CC','1003','Luis','Martinez','3003333333','luis@mail.com');

INSERT INTO usuario (persona_id, username, password_hash, ultimo_acceso, bloqueado) VALUES
(1,'juanp','hash1',NOW(),0),
(2,'anag','hash2',NOW(),0),
(3,'luism','hash3',NOW(),1);

INSERT INTO rol (nombre, descripcion) VALUES
('Admin','Administrador'),
('Recepcion','Recepción'),
('Cliente','Cliente');

INSERT INTO permiso (nombre, descripcion, accion) VALUES
('Crear','Permite crear','CREATE'),
('Leer','Permite leer','READ'),
('Eliminar','Permite eliminar','DELETE');

INSERT INTO modulo (nombre, descripcion, ruta_base) VALUES
('Reservas','Modulo reservas','/reservas'),
('Facturacion','Modulo facturacion','/facturas'),
('Inventario','Modulo inventario','/inventario');

INSERT INTO vista (modulo_id, nombre, descripcion, ruta) VALUES
(1,'Lista','Listado','/lista'),
(2,'Factura','Vista factura','/factura'),
(3,'Productos','Vista productos','/productos');

INSERT INTO usuario_rol VALUES (1,1),(2,2),(3,3);
INSERT INTO rol_permiso VALUES (1,1),(1,2),(2,2);
INSERT INTO modulo_vista VALUES (1,1),(2,2),(3,3);

-- =====================================
-- EMPRESA
-- =====================================

INSERT INTO empresa (nombre,nit,razon_social,telefono,correo,direccion,sitio_web) VALUES
('Hotel A','9001','Hotel A SAS','111','a@mail.com','Dir1','web1.com'),
('Hotel B','9002','Hotel B SAS','222','b@mail.com','Dir2','web2.com'),
('Hotel C','9003','Hotel C SAS','333','c@mail.com','Dir3','web3.com');

INSERT INTO informacion_legal (empresa_id,tipo_documento_legal,numero_documento_legal,descripcion,fecha_expedicion,fecha_vencimiento) VALUES
(1,'Licencia','L1','Desc',NOW(),NOW()),
(2,'Licencia','L2','Desc',NOW(),NOW()),
(3,'Licencia','L3','Desc',NOW(),NOW());

INSERT INTO cliente (tipo_documento,numero_documento,nombre,apellido,telefono,correo,direccion) VALUES
('CC','2001','Carlos','Lopez','3001','c@mail.com','dir1'),
('CC','2002','Maria','Diaz','3002','m@mail.com','dir2'),
('CC','2003','Pedro','Ruiz','3003','p@mail.com','dir3');

INSERT INTO empleado (persona_id,cargo,fecha_ingreso,telefono_laboral,correo_laboral) VALUES
(1,'Recepcionista',NOW(),'111','emp1@mail.com'),
(2,'Gerente',NOW(),'222','emp2@mail.com'),
(3,'Aseo',NOW(),'333','emp3@mail.com');

INSERT INTO tipo_dia (nombre,descripcion,fecha,aplica_temporada,aplica_feriado,aplica_especial) VALUES
('Normal','Dia normal',NOW(),1,0,0),
('Festivo','Dia festivo',NOW(),0,1,0),
('Especial','Especial',NOW(),0,0,1);

INSERT INTO metodo_pago (nombre,descripcion,requiere_referencia,permite_pago_parcial) VALUES
('Efectivo','Pago cash',0,1),
('Tarjeta','Pago tarjeta',1,1),
('Transferencia','Pago transferencia',1,0);

-- =====================================
-- DISTRIBUCIÓN
-- =====================================

INSERT INTO sede (empresa_id,nombre,direccion,ciudad,telefono,correo) VALUES
(1,'Sede 1','Dir1','Bogota','111','s1@mail.com'),
(2,'Sede 2','Dir2','Medellin','222','s2@mail.com'),
(3,'Sede 3','Dir3','Cali','333','s3@mail.com');

INSERT INTO tipo_habitacion (nombre,descripcion,capacidad_base,capacidad_maxima) VALUES
('Simple','1 cama',1,2),
('Doble','2 camas',2,4),
('Suite','Lujo',2,6);

INSERT INTO estado_habitacion (nombre,descripcion,permite_reserva,permite_check_in) VALUES
('Disponible','Ok',1,1),
('Ocupada','No',0,0),
('Mantenimiento','No',0,0);

INSERT INTO habitacion (sede_id,tipo_habitacion_id,estado_habitacion_id,numero,piso,capacidad,descripcion) VALUES
(1,1,1,'101',1,2,'Basica'),
(2,2,1,'201',2,4,'Media'),
(3,3,1,'301',3,6,'Alta');

-- =====================================
-- PRECIOS
-- =====================================

INSERT INTO precio (tipo_habitacion_id,tipo_dia_id,valor,fecha_inicio,fecha_fin,condicion) VALUES
(1,1,100, NOW(), NOW(),'Normal'),
(2,2,200, NOW(), NOW(),'Festivo'),
(3,3,300, NOW(), NOW(),'Especial');

-- =====================================
-- RESERVAS
-- =====================================

INSERT INTO reserva_habitacion (cliente_id,habitacion_id,fecha_inicio,fecha_fin,cantidad_persona,estado_reserva,valor_estimado) VALUES
(1,1,'2026-01-01','2026-01-05',2,'Activa',500),
(2,2,'2026-02-01','2026-02-03',3,'Activa',600),
(3,3,'2026-03-01','2026-03-04',4,'Cancelada',700);

INSERT INTO cancelacion_habitacion (reserva_habitacion_id,motivo,fecha_cancelacion,aplica_penalidad,valor_penalidad) VALUES
(3,'Cambio',NOW(),1,50),
(2,'Otro',NOW(),0,0),
(1,'Error',NOW(),0,0);

INSERT INTO disponibilidad_habitacion (habitacion_id,fecha_inicio,fecha_fin,disponible,motivo_no_disponible) VALUES
(1,NOW(),NOW(),1,''),
(2,NOW(),NOW(),0,'Mantenimiento'),
(3,NOW(),NOW(),1,'');

INSERT INTO catalogo_habitacion (habitacion_id,titulo,descripcion,precio_base,visible) VALUES
(1,'Basica','Desc',100,1),
(2,'Media','Desc',200,1),
(3,'Alta','Desc',300,1);

INSERT INTO estadia (reserva_habitacion_id,cliente_id,habitacion_id,fecha_inicio,fecha_fin,estado_estadia) VALUES
(1,1,1,NOW(),NOW(),'Activa'),
(2,2,2,NOW(),NOW(),'Finalizada'),
(3,3,3,NOW(),NOW(),'Cancelada');

INSERT INTO check_in (reserva_habitacion_id,empleado_id,fecha_hora_ingreso,observacion) VALUES
(1,1,NOW(),'OK'),
(2,2,NOW(),'OK'),
(3,3,NOW(),'OK');

INSERT INTO check_out (estadia_id,empleado_id,fecha_hora_salida,observacion,valor_total) VALUES
(1,1,NOW(),'OK',500),
(2,2,NOW(),'OK',600),
(3,3,NOW(),'OK',700);

-- =====================================
-- INVENTARIO
-- =====================================

INSERT INTO proveedor (nombre,nit,telefono,correo,direccion) VALUES
('Prov1','N1','111','p1@mail.com','dir'),
('Prov2','N2','222','p2@mail.com','dir'),
('Prov3','N3','333','p3@mail.com','dir');

INSERT INTO producto (proveedor_id,nombre,descripcion,valor_venta,stock_actual,stock_minimo) VALUES
(1,'Agua','Botella',5,100,10),
(2,'Snack','Comida',10,50,5),
(3,'Jabon','Aseo',3,80,10);

INSERT INTO servicio (nombre,descripcion,valor_venta,disponible) VALUES
('Spa','Relax',50,1),
('Gym','Ejercicio',20,1),
('Lavado','Ropa',15,1);

INSERT INTO seguimiento_producto (producto_id,tipo_movimiento,cantidad,fecha_movimiento,observacion) VALUES
(1,'Entrada',10,NOW(),'OK'),
(2,'Salida',5,NOW(),'OK'),
(3,'Entrada',20,NOW(),'OK');

INSERT INTO disponibilidad_inventario (producto_id,servicio_id,cantidad_disponible,disponible,observacion) VALUES
(1,1,10,1,''),
(2,2,5,1,''),
(3,3,8,1,'');

-- =====================================
-- FACTURACIÓN
-- =====================================

INSERT INTO factura (cliente_id,estadia_id,numero_factura,fecha_emision,subtotal,impuesto,descuento,total,estado_factura) VALUES
(1,1,'F1',NOW(),100,19,0,119,'Pagada'),
(2,2,'F2',NOW(),200,38,0,238,'Pendiente'),
(3,3,'F3',NOW(),300,57,0,357,'Pagada');

INSERT INTO pre_factura (estadia_id,reserva_habitacion_id,cliente_id,subtotal,impuesto,descuento,total) VALUES
(1,1,1,100,19,0,119),
(2,2,2,200,38,0,238),
(3,3,3,300,57,0,357);

INSERT INTO detalle_compra (factura_id,producto_id,servicio_id,descripcion,cantidad,valor_unitario,valor_total) VALUES
(1,1,1,'Consumo',2,10,20),
(2,2,2,'Consumo',1,20,20),
(3,3,3,'Consumo',3,15,45);

INSERT INTO pago_parcial (reserva_habitacion_id,factura_id,metodo_pago_id,valor,fecha_pago,referencia_pago) VALUES
(1,1,1,50,NOW(),'REF1'),
(2,2,2,100,NOW(),'REF2'),
(3,3,3,150,NOW(),'REF3');

-- =====================================
-- NOTIFICACIONES
-- =====================================

INSERT INTO promocion (titulo,descripcion,fecha_inicio,fecha_fin,canal,activa) VALUES
('Promo1','Desc',NOW(),NOW(),'Email',1),
('Promo2','Desc',NOW(),NOW(),'SMS',1),
('Promo3','Desc',NOW(),NOW(),'App',1);

INSERT INTO alerta (cliente_id,reserva_habitacion_id,titulo,mensaje,canal,fecha_envio) VALUES
(1,1,'Alerta','Msg','Email',NOW()),
(2,2,'Alerta','Msg','SMS',NOW()),
(3,3,'Alerta','Msg','App',NOW());

INSERT INTO termino_condicion (titulo,contenido,version,fecha_vigencia,obligatorio) VALUES
('Term1','Texto','1.0',NOW(),1),
('Term2','Texto','1.1',NOW(),1),
('Term3','Texto','1.2',NOW(),0);

INSERT INTO fidelizacion_cliente (cliente_id,nivel,puntos,fecha_ultima_interaccion,observacion) VALUES
(1,'Gold',100,NOW(),''),
(2,'Silver',50,NOW(),''),
(3,'Bronze',20,NOW(),'');

-- =====================================
-- MANTENIMIENTO
-- =====================================

INSERT INTO mantenimiento_habitacion (habitacion_id,empleado_id,tipo_mantenimiento,fecha_inicio,fecha_fin,estado_mantenimiento,observacion) VALUES
(1,1,'Preventivo',NOW(),NOW(),'Finalizado',''),
(2,2,'Correctivo',NOW(),NOW(),'Proceso',''),
(3,3,'Preventivo',NOW(),NOW(),'Pendiente','');

INSERT INTO mantenimiento_uso (mantenimiento_habitacion_id,motivo_uso,detalle_actividad) VALUES
(1,'Uso','Detalle'),
(2,'Uso','Detalle'),
(3,'Uso','Detalle');

INSERT INTO mantenimiento_remodelacion (mantenimiento_habitacion_id,descripcion_remodelacion,presupuesto_estimado) VALUES
(1,'Remodelacion',1000),
(2,'Remodelacion',2000),
(3,'Remodelacion',3000);

INSERT INTO dashboard_mantenimiento (sede_id,total_habitacion,habitacion_disponible,habitacion_ocupada,habitacion_mantenimiento,fecha_corte) VALUES
(1,10,5,3,2,NOW()),
(2,20,10,5,5,NOW()),
(3,30,15,10,5,NOW());