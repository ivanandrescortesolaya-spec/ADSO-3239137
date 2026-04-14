CREATE DATABASE vuelos_db;
GO
USE vuelos_db;
GO

CREATE TABLE aerolineas (
    id INT IDENTITY PRIMARY KEY,
    nombre VARCHAR(100)
);

CREATE TABLE aviones (
    id INT IDENTITY PRIMARY KEY,
    modelo VARCHAR(100),
    aerolinea_id INT FOREIGN KEY REFERENCES aerolineas(id)
);

CREATE TABLE aeropuertos (
    id INT IDENTITY PRIMARY KEY,
    nombre VARCHAR(100),
    ciudad VARCHAR(100)
);

CREATE TABLE vuelos (
    id INT IDENTITY PRIMARY KEY,
    origen_id INT,
    destino_id INT,
    fecha DATE,
    FOREIGN KEY (origen_id) REFERENCES aeropuertos(id),
    FOREIGN KEY (destino_id) REFERENCES aeropuertos(id)
);

CREATE TABLE pasajeros (
    id INT IDENTITY PRIMARY KEY,
    nombre VARCHAR(100)
);

INSERT INTO aerolineas VALUES ('Avianca');

INSERT INTO aviones VALUES ('Boeing 737',1);

INSERT INTO aeropuertos VALUES 
('El Dorado','Bogotá'),
('Benito Salas','Neiva');

INSERT INTO vuelos VALUES (1,2,'2026-03-01');

INSERT INTO pasajeros VALUES ('Carlos');

-- aerolineas
UPDATE aerolineas SET nombre = 'Avianca S.A.' WHERE id = 1;
UPDATE aerolineas SET nombre = 'Avianca Airlines' WHERE id = 1;

-- aviones
UPDATE aviones SET modelo = 'Boeing 737-800' WHERE id = 1;
UPDATE aviones SET aerolinea_id = 1 WHERE id = 1;

-- aeropuertos
UPDATE aeropuertos SET ciudad = 'Bogotá D.C.' WHERE id = 1;
UPDATE aeropuertos SET nombre = 'Benito Salas Airport' WHERE id = 2;

-- vuelos
UPDATE vuelos SET fecha = '2026-04-01' WHERE id = 1;
UPDATE vuelos SET destino_id = 2 WHERE id = 1;

-- pasajeros
UPDATE pasajeros SET nombre = 'Carlos Pérez' WHERE id = 1;
UPDATE pasajeros SET nombre = 'Carlos Lopez' WHERE id = 1;

-- aerolineas
SELECT * FROM aerolineas WHERE id = 1;
SELECT nombre FROM aerolineas WHERE nombre LIKE '%Avianca%';

-- aviones
SELECT * FROM aviones WHERE aerolinea_id = 1;
SELECT modelo FROM aviones WHERE id = 1;

-- aeropuertos
SELECT * FROM aeropuertos WHERE ciudad LIKE '%Bogotá%';
SELECT nombre FROM aeropuertos WHERE id = 2;

-- vuelos
SELECT * FROM vuelos WHERE origen_id = 1;
SELECT fecha FROM vuelos WHERE fecha >= '2026-01-01';

-- pasajeros
SELECT * FROM pasajeros WHERE nombre LIKE '%Carlos%';
SELECT nombre FROM pasajeros WHERE id = 1;

-- primero vuelos (depende de aeropuertos)
DELETE FROM vuelos WHERE id = 1;
DELETE FROM vuelos WHERE fecha = '2026-04-01';

-- luego aviones (depende de aerolineas)
DELETE FROM aviones WHERE id = 1;
DELETE FROM aviones WHERE modelo LIKE '%Boeing%';

-- luego aeropuertos
DELETE FROM aeropuertos WHERE id = 2;
DELETE FROM aeropuertos WHERE ciudad LIKE '%Bogotá%';

-- luego pasajeros
DELETE FROM pasajeros WHERE id = 1;
DELETE FROM pasajeros WHERE nombre LIKE '%Carlos%';

-- finalmente aerolineas
DELETE FROM aerolineas WHERE id = 1;
DELETE FROM aerolineas WHERE nombre LIKE '%Avianca%';