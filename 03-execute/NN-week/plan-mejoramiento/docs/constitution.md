# Constitución del proyecto — Music School

**Identificador:** music-school  
**Proyecto:** Sistema de préstamo de instrumentos musicales  
**Ficha:** ADSO 3239137  
**Aprendiz:** Ivan Andres Cortes Olaya  
**Versión:** 1.0

## 1. Propósito

Este documento establece los principios, restricciones y reglas técnicas fundamentales que deben respetarse durante el diseño, desarrollo, implementación y mantenimiento del sistema Music School.

Todo componente, funcionalidad y cambio debe cumplir esta constitución y los requisitos definidos en la especificación del proyecto.

## 2. Principios fundamentales

### Artículo I. Integridad de las reglas de negocio

Las reglas de negocio deben implementarse en el backend mediante Laravel.

El frontend no será responsable de garantizar las restricciones del sistema, ya que cualquier operación debe validarse nuevamente en el servidor.

**Verificación:** realizar solicitudes directamente a la API para comprobar que las reglas se cumplen incluso cuando no se utiliza la interfaz gráfica.

### Artículo II. Separación de responsabilidades

El sistema debe mantener responsabilidades diferenciadas:

- React: presentación e interacción con el usuario.
- Laravel: lógica de negocio, validaciones y API REST.
- Base de datos: persistencia, relaciones y restricciones.
- Docker: ejecución y comunicación de los servicios.

**Verificación:** comprobar que el frontend consume la API y que las reglas de negocio no dependen exclusivamente de React.

### Artículo III. Contrato de comunicación

La comunicación entre React y Laravel se realizará mediante endpoints HTTP y respuestas JSON.

Las operaciones deben respetar el contrato definido en `api-contract.md`.

**Verificación:** ejecutar pruebas de los endpoints y comprobar sus solicitudes, respuestas y códigos HTTP.

### Artículo IV. Control de inventario

Las unidades disponibles de cada instrumento deben permanecer siempre entre cero y el total registrado.

Ningún préstamo puede producir cantidades negativas ni superar las unidades existentes.

**Verificación:** realizar pruebas de préstamo, devolución y actualización de inventario.

### Artículo V. Restricciones de préstamos

Cada estudiante puede tener como máximo un instrumento sin devolver.

El plazo de devolución será de 21 días.

Los estudiantes que tengan préstamos vencidos no podrán recibir nuevos instrumentos hasta realizar la devolución correspondiente.

**Verificación:** ejecutar pruebas para estudiantes sin préstamos, con préstamos activos y con préstamos vencidos.

### Artículo VI. Protección de la información histórica

Los préstamos y las devoluciones son registros históricos que no podrán borrarse.

Los datos congelados en cada operación deben conservar la información original registrada al momento de realizarla y no deben modificarse cuando cambien los datos del catálogo.

El catálogo de instrumentos utilizará baja lógica en lugar de eliminación física.

### Artículo VII. Control de concurrencia

Cuando dos operadores intenten entregar simultáneamente la última unidad disponible de un instrumento, solamente una operación podrá completarse.

La operación que pierda la disponibilidad debe recibir una respuesta HTTP `409 Conflict`.

**Verificación:** ejecutar una prueba automatizada de concurrencia con dos solicitudes simultáneas.

### Artículo VIII. Manejo del tiempo

Las fechas y horas de las operaciones se almacenarán y procesarán en UTC.

El plazo de devolución se calculará a partir del instante de registro del préstamo.

**Verificación:** comprobar las fechas almacenadas, las fechas de vencimiento y su representación en las respuestas de la API.

### Artículo IX. Seguridad y protección de secretos

Las credenciales y los secretos de configuración no deben almacenarse directamente en el repositorio.

Se utilizarán variables de entorno y un archivo `.env.example` sin información sensible.

Las contraseñas deben almacenarse mediante mecanismos seguros de hash.

**Verificación:** revisar los archivos versionados, las respuestas HTTP y los registros de ejecución para comprobar que no se exponen secretos.

### Artículo X. Responsabilidad de las migraciones

La estructura de la base de datos debe mantenerse mediante migraciones versionadas de Laravel.

Las relaciones, claves, índices y restricciones deben corresponder al modelo definido en `data-model.md`.

**Verificación:** ejecutar las migraciones desde una base de datos vacía y comprobar que se construye el esquema esperado.

### Artículo XI. Convenciones de idioma

Los identificadores del código, variables, clases, métodos, tablas y columnas se escribirán en inglés.

Los mensajes, notificaciones y textos visibles para el usuario estarán en español.

**Verificación:** revisar el código fuente y la interfaz de usuario.

### Artículo XII. Desarrollo guiado por especificación

Ninguna funcionalidad debe desarrollarse sin estar relacionada con un requisito, historia de usuario o tarea documentada.

No se deben agregar funcionalidades fuera del alcance definido.

Cada tarea se considerará terminada cuando exista evidencia verificable de su implementación.

**Verificación:** relacionar las tareas de `tasks.md` con los requisitos, pruebas y resultados correspondientes.

### Artículo XIII. Generación de reportes

El sistema debe permitir generar un reporte de los
instrumentos más solicitados, utilizando la información
histórica de los préstamos registrados.

**Verificación:** realizar préstamos de diferentes
instrumentos y comprobar que el reporte refleje
correctamente su frecuencia de solicitud.

## 3. Tecnologías obligatorias

| Componente | Tecnología |
|---|---|
| Frontend | React |
| Backend | PHP con Laravel |
| Comunicación | API REST |
| Formato de intercambio | JSON |
| Contenedores | Docker |
| Base de datos | MySQL |

## 4. Reglas particulares del dominio

El sistema debe respetar las siguientes condiciones:

1. Máximo un instrumento sin devolver por estudiante.
2. Plazo de préstamo de 21 días.
3. Bloqueo de nuevos préstamos cuando existan instrumentos vencidos sin devolver.
4. Control permanente de unidades disponibles y unidades totales.
5. Conservación de los datos históricos de cada operación.
6. Baja lógica de los instrumentos.
7. Almacenamiento de fechas en UTC.
8. Mensajes de usuario en español.
9. Reporte de instrumentos más solicitados.
10. Control de concurrencia para evitar prestar dos veces la última unidad.

## 5. Cumplimiento de la constitución

Todos los integrantes o responsables del desarrollo deben respetar estos principios.

Cualquier cambio que modifique una regla, una decisión técnica o el alcance del sistema debe quedar documentado y justificado.

Las decisiones arquitectónicas importantes se registrarán en documentos ADR.

## 6. Criterio de aceptación

La constitución se considerará aplicada cuando:

- Las reglas de negocio estén implementadas en el backend.
- La arquitectura respete la separación de responsabilidades.
- El modelo de datos mantenga la integridad de la información.
- La concurrencia esté controlada.
- Los secretos estén protegidos.
- Las pruebas automatizadas demuestren el cumplimiento de los principios.
- Las funcionalidades correspondan a la especificación aprobada.

