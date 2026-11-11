# Constitucion del proyecto — Music School

**Identificador:** music-school  
**Proyecto:** Sistema de prestamo de instrumentos musicales  
**Ficha:** ADSO 3239137    
**Version:** 1.0
**Codigo del aprendiz:** A12

## 1. Proposito

Este documento establece los principios, restricciones y reglas tecnicas fundamentales que deben respetarse durante el diseño, desarrollo, implementacion y mantenimiento del sistema Music School.

Todo componente, funcionalidad y cambio debe cumplir esta constitucion y los requisitos definidos en la especificacion del proyecto.

## 2. Principios fundamentales

### Articulo I. Integridad de las reglas de negocio

Las reglas de negocio deben implementarse en el backend mediante Laravel.

El frontend no sera responsable de garantizar las restricciones del sistema, ya que cualquier operacion debe validarse nuevamente en el servidor.

**Verificacion:** realizar solicitudes directamente a la API para comprobar que las reglas se cumplen incluso cuando no se utiliza la interfaz grafica.

### Articulo II. Separacion de responsabilidades

El sistema debe mantener responsabilidades diferenciadas:

- React: presentacion e interaccion con el usuario.
- Laravel: logica de negocio, validaciones y API REST.
- Base de datos: persistencia, relaciones y restricciones.
- Docker: ejecucion y comunicacion de los servicios.

**Verificacion:** comprobar que el frontend consume la API y que las reglas de negocio no dependen exclusivamente de React.

### Articulo III. Contrato de comunicacion

La comunicacion entre React y Laravel se realizara mediante endpoints HTTP y respuestas JSON.

Las operaciones deben respetar el contrato definido en `api-contract.md`.

**Verificacion:** ejecutar pruebas de los endpoints y comprobar sus solicitudes, respuestas y codigos HTTP.

### Articulo IV. Control de inventario

Las unidades disponibles de cada instrumento deben permanecer siempre entre cero y el total registrado.

Ningun prestamo puede producir cantidades negativas ni superar las unidades existentes.

**Verificacion:** realizar pruebas de prestamo, devolucion y actualizacion de inventario.

### Articulo V. Restricciones de prestamos

Cada estudiante puede tener como maximo un instrumento sin devolver.

El plazo de devolucion sera de 21 dias.

Los estudiantes que tengan prestamos vencidos no podran recibir nuevos instrumentos hasta realizar la devolucion correspondiente.

**Verificacion:** ejecutar pruebas para estudiantes sin prestamos, con prestamos activos y con prestamos vencidos.

### Articulo VI. Proteccion de la informacion historica

Los prestamos y las devoluciones son registros historicos que no podran borrarse.

Los datos congelados en cada operacion deben conservar la informacion original registrada al momento de realizarla y no deben modificarse cuando cambien los datos del catalogo.

El catalogo de instrumentos utilizara baja logica en lugar de eliminacion fisica.

### Articulo VII. Control de concurrencia

Cuando dos operadores intenten entregar simultaneamente la ultima unidad disponible de un instrumento, solamente una operacion podra completarse.

La operacion que pierda la disponibilidad debe recibir una respuesta HTTP `409 Conflict`.

**Verificacion:** ejecutar una prueba automatizada de concurrencia con dos solicitudes simultaneas.

### Articulo VIII. Manejo del tiempo

Las fechas y horas de las operaciones se almacenaran y procesaran en UTC.

El plazo de devolucion se calculara a partir del instante de registro del prestamo.

**Verificacion:** comprobar las fechas almacenadas, las fechas de vencimiento y su representacion en las respuestas de la API.

### Articulo IX. Seguridad y proteccion de secretos

Las credenciales y los secretos de configuracion no deben almacenarse directamente en el repositorio.

Se utilizaran variables de entorno y un archivo `.env.example` sin informacion sensible.

Las contraseñas deben almacenarse mediante mecanismos seguros de hash.

**Verificacion:** revisar los archivos versionados, las respuestas HTTP y los registros de ejecucion para comprobar que no se exponen secretos.

### Articulo X. Responsabilidad de las migraciones

La estructura de la base de datos debe mantenerse mediante migraciones versionadas de Laravel.

Las relaciones, claves, indices y restricciones deben corresponder al modelo definido en `data-model.md`.

**Verificacion:** ejecutar las migraciones desde una base de datos vacia y comprobar que se construye el esquema esperado.

### Articulo XI. Convenciones de idioma

Los identificadores del codigo, variables, clases, metodos, tablas y columnas se escribiran en ingles.

Los mensajes, las notificaciones y los textos visibles para el usuario estaran en espanol, sin tildes en las vocales y conservando la letra `ñ`.

**Verificacion:** revisar el codigo fuente y la interfaz de usuario.

### Articulo XII. Desarrollo guiado por especificacion

Ninguna funcionalidad debe desarrollarse sin estar relacionada con un requisito, historia de usuario o tarea documentada.

No se deben agregar funcionalidades fuera del alcance definido.

Cada tarea se considerara terminada cuando exista evidencia verificable de su implementacion.

**Verificacion:** relacionar las tareas de `tasks.md` con los requisitos, pruebas y resultados correspondientes.

### Articulo XIII. Generacion de reportes

El sistema debe permitir generar un reporte de los
instrumentos mas solicitados, utilizando la informacion
historica de los prestamos registrados.

**Verificacion:** realizar prestamos de diferentes
instrumentos y comprobar que el reporte refleje
correctamente su frecuencia de solicitud.

## 3. Tecnologias obligatorias

| Componente | Tecnologia |
|---|---|
| Frontend | React |
| Backend | PHP con Laravel |
| Comunicacion | API REST |
| Formato de intercambio | JSON |
| Contenedores | Docker |
| Base de datos | MySQL |

## 4. Reglas particulares del dominio

El sistema debe respetar las siguientes condiciones:

1. Maximo un instrumento sin devolver por estudiante.
2. Plazo de prestamo de 21 dias.
3. Bloqueo de nuevos prestamos cuando existan instrumentos vencidos sin devolver.
4. Control permanente de unidades disponibles y unidades totales.
5. Conservacion de los datos historicos de cada operacion.
6. Baja logica de los instrumentos.
7. Almacenamiento de fechas en UTC.
8. Mensajes de usuario en español.
9. Reporte de instrumentos mas solicitados.
10. Control de concurrencia para evitar prestar dos veces la ultima unidad.

## 5. Cumplimiento de la constitucion

Todos los integrantes o responsables del desarrollo deben respetar estos principios.

Cualquier cambio que modifique una regla, una decision tecnica o el alcance del sistema debe quedar documentado y justificado.

Las decisiones arquitectonicas importantes se registraran en documentos ADR.

## 6. Criterio de aceptacion

La constitucion se considerara aplicada cuando:

- Las reglas de negocio esten implementadas en el backend.
- La arquitectura respete la separacion de responsabilidades.
- El modelo de datos mantenga la integridad de la informacion.
- La concurrencia este controlada.
- Los secretos esten protegidos.
- Las pruebas automatizadas demuestren el cumplimiento de los principios.
- Las funcionalidades correspondan a la especificacion aprobada.
