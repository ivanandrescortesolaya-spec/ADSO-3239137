CREATE TABLE autores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100)
);

CREATE TABLE libros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100),
    autor_id INT REFERENCES autores(id)
);

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100)
);

CREATE TABLE prestamos (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id),
    libro_id INT REFERENCES libros(id),
    fecha DATE
);

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100)
);

INSERT INTO autores VALUES (1,'Gabriel Garcia Marquez');
INSERT INTO libros VALUES (1,'Cien años de soledad',1);
INSERT INTO usuarios VALUES (1,'Ana');
INSERT INTO prestamos VALUES (1,1,1,'2026-02-01');
INSERT INTO categorias VALUES (1,'Novela');

-- autores
UPDATE autores SET nombre = 'Gabo' WHERE id = 1;
UPDATE autores SET nombre = 'Gabriel García Márquez' WHERE id = 1;

-- libros
UPDATE libros SET titulo = 'Cien Años de Soledad (Edición Especial)' WHERE id = 1;
UPDATE libros SET autor_id = 1 WHERE id = 1;

-- usuarios
UPDATE usuarios SET nombre = 'Ana María' WHERE id = 1;
UPDATE usuarios SET nombre = 'Ana Lopez' WHERE id = 1;

-- prestamos
UPDATE prestamos SET fecha = '2026-03-01' WHERE id = 1;
UPDATE prestamos SET usuario_id = 1 WHERE id = 1;

-- categorias
UPDATE categorias SET nombre = 'Novela Latinoamericana' WHERE id = 1;
UPDATE categorias SET nombre = 'Literatura' WHERE id = 1;

-- autores
SELECT * FROM autores WHERE id = 1;
SELECT nombre FROM autores WHERE nombre LIKE '%Gabriel%';

-- libros
SELECT * FROM libros WHERE autor_id = 1;
SELECT titulo FROM libros WHERE id = 1;

-- usuarios
SELECT * FROM usuarios WHERE nombre LIKE '%Ana%';
SELECT nombre FROM usuarios WHERE id = 1;

-- prestamos
SELECT * FROM prestamos WHERE usuario_id = 1;
SELECT fecha FROM prestamos WHERE fecha >= '2026-01-01';

-- categorias
SELECT * FROM categorias WHERE nombre LIKE '%Novela%';
SELECT nombre FROM categorias WHERE id = 1;

-- primero prestamos
DELETE FROM prestamos WHERE id = 1;
DELETE FROM prestamos WHERE fecha = '2026-03-01';

-- luego libros
DELETE FROM libros WHERE id = 1;
DELETE FROM libros WHERE titulo LIKE '%Soledad%';

-- luego usuarios
DELETE FROM usuarios WHERE id = 1;
DELETE FROM usuarios WHERE nombre LIKE '%Ana%';

-- luego autores
DELETE FROM autores WHERE id = 1;
DELETE FROM autores WHERE nombre LIKE '%Gabriel%';

-- finalmente categorias
DELETE FROM categorias WHERE id = 1;
DELETE FROM categorias WHERE nombre = 'Literatura';