Este proyecto es la solución del plan de mejoramiento del aprendiz A12, ficha 3239137, dominio music-school

# Music School

**Sistema de préstamo de instrumentos musicales**

| Información | Descripción |
|---|---|
| Proyecto | Music School |
| Ficha | ADSO 3239137 |
| Identificador del aprendiz | A12 |
| Tipo de proyecto | Sistema de gestión de préstamos |
| Estado | En desarrollo |
| Versión de documentación | 1.1 |

---

## 1. Descripción del proyecto

Music School es un sistema de gestión de préstamos de instrumentos musicales, diseñado para administrar el catálogo de instrumentos, controlar las unidades disponibles, registrar estudiantes, gestionar préstamos y devoluciones, y consultar el historial de operaciones.

El sistema busca mantener la integridad de la información, controlar los plazos de devolución y evitar inconsistencias cuando varios operadores realizan préstamos simultáneamente.

## 2. Objetivo

Desarrollar una solución de software que permita gestionar de manera organizada y segura el préstamo de instrumentos musicales, aplicando las reglas de negocio y los requisitos establecidos en la especificación del proyecto.

## 3. Alcance funcional

El sistema contempla las siguientes funcionalidades:

- Registro y consulta de modelos de instrumentos.
- Organización de instrumentos en cinco categorías.
- Registro y consulta de estudiantes.
- Registro de préstamos.
- Registro de devoluciones.
- Control de fechas de vencimiento.
- Identificación de préstamos vencidos.
- Control de unidades totales y disponibles.
- Conservación del historial de préstamos y devoluciones.
- Baja lógica de instrumentos retirados del catálogo.
- Reporte de instrumentos más solicitados.
- Control de operaciones simultáneas sobre la última unidad disponible.

## 4. Categorías de instrumentos

El catálogo inicial contempla cinco categorías:

| Código | Categoría |
|---|---|
| CAT-01 | Cuerdas |
| CAT-02 | Vientos |
| CAT-03 | Percusión |
| CAT-04 | Teclados |
| CAT-05 | Electrónicos |

## 5. Reglas de negocio

El funcionamiento de Music School debe respetar las siguientes reglas:

1. **Límite de préstamos:** cada estudiante puede tener como máximo un instrumento sin devolver.
2. **Plazo de devolución:** cada préstamo tiene un plazo de 21 días.
3. **Préstamos vencidos:** un estudiante con un préstamo vencido y pendiente de devolución no puede recibir otro instrumento hasta realizar la devolución.
4. **Integridad del inventario:** las unidades disponibles deben permanecer entre cero y las unidades totales.
5. **Conservación del historial:** los préstamos y las devoluciones no se eliminan físicamente. Los datos históricos deben conservar la información original de las operaciones.
6. **Concurrencia:** cuando dos operadores intenten entregar simultáneamente la última unidad disponible, solamente una operación podrá completarse. La otra recibirá HTTP 409 Conflict.
7. **Fechas y comunicación:** las fechas y horas se almacenan y procesan en UTC. Los mensajes visibles para el usuario deben estar en español.

## 6. Tecnologías

| Componente | Tecnología |
|---|---|
| Frontend | React |
| Backend | PHP con Laravel |
| Base de datos | MySQL |
| Comunicación | API REST |
| Intercambio de datos | JSON |
| Infraestructura | Docker |

## 7. Estructura del proyecto

La organización del repositorio contempla la siguiente estructura:

```text
plan-mejoramiento/
│
├── README.md
│
├── docs/
│   ├── constitution.md
│   ├── spec.md
│   ├── plan.md
│   ├── architecture.md
│   ├── data-model.md
│   ├── api-contract.md
│   ├── tasks.md
│   └── adr/
│       ├── ADR-001-backend-framework.md
│       ├── ADR-002-database.md
│       └── ADR-003-architecture.md
│
├── api/
│   └── Backend Laravel
│
├── app/
│   └── Aplicación React
│
├── page/
│   └── Sitio público de presentación del producto
│
├── infra/
│   └── Configuración de infraestructura y Docker
│
└── tool/
    └── Herramientas y sembrador de datos por API
```

La estructura representa la organización prevista del proyecto. Los archivos y directorios se incorporarán conforme avance la implementación.

## 8. Arquitectura general

La solución estará organizada en componentes con responsabilidades separadas:

- **Frontend:** interfaz de usuario desarrollada con React.
- **Backend:** lógica de negocio y servicios API implementados con Laravel.
- **Base de datos:** almacenamiento persistente mediante MySQL.
- **Infraestructura:** ejecución de los servicios mediante contenedores Docker.
- **Sitio público:** presentación del producto Music School.
- **Herramientas:** utilidades para facilitar la configuración y el sembrado de datos mediante la API.

La comunicación entre el frontend y el backend se realizará mediante una API REST utilizando JSON.

## 9. Ejecución del proyecto

El proyecto debe poder ejecutarse mediante contenedores Docker utilizando un solo comando.

Cuando la configuración de infraestructura esté implementada, el procedimiento previsto será:

```bash
docker compose up --build
```

Antes de ejecutar el proyecto:

1. Instalar Docker Desktop.
2. Verificar que Docker esté iniciado.
3. Configurar las variables de entorno necesarias a partir de los archivos de ejemplo.
4. Ejecutar el comando de Docker Compose desde la ubicación correspondiente.

**Nota:** los servicios, puertos, variables de entorno y comandos específicos se documentarán cuando la infraestructura esté implementada y verificada.

## 10. Pruebas automatizadas

El proyecto debe contar con al menos 15 archivos de pruebas automatizadas.

Las pruebas deberán verificar:

- Las diez historias de usuario.
- Las seis reglas de negocio.
- Las validaciones de datos.
- El registro de préstamos y devoluciones.
- La integridad del inventario.
- El control de préstamos vencidos.
- La conservación del historial.
- El comportamiento ante operaciones simultáneas.
- Las respuestas de error de la API.

La ejecución y los resultados de las pruebas se documentarán durante la implementación.

## 11. Documentación técnica

La documentación del proyecto se encuentra organizada en `docs/`:

| Documento | Descripción |
|---|---|
| constitution.md | Principios y restricciones del proyecto. |
| spec.md | Especificación de requisitos. |
| plan.md | Planificación de actividades. |
| architecture.md | Diseño de arquitectura. |
| data-model.md | Modelo de datos. |
| api-contract.md | Contrato de la API REST. |
| tasks.md | Descomposición del trabajo en 23 tareas. |
| adr/ | Registro de decisiones arquitectónicas. |

## 12. Convenciones de desarrollo

Para mantener la organización y calidad del código se establecen las siguientes convenciones:

- Los identificadores de clases, métodos, variables y demás elementos del código estarán en inglés.
- Los mensajes visibles para el usuario estarán en español.
- Las fechas y horas se manejarán en UTC.
- Se mantendrá la separación de responsabilidades entre frontend, backend y persistencia.
- Los cambios se registrarán mediante commits pequeños y descriptivos.
- Se utilizará una convención de mensajes basada en Conventional Commits.
- No se incorporarán funcionalidades fuera del alcance establecido en la especificación.

## 13. Control de versiones

El desarrollo se gestionará mediante Git y GitHub.

Los mensajes de commit seguirán una estructura descriptiva:

```text
tipo(área): descripción breve del cambio
```

Ejemplos:

```text
docs(spec): complete requirements specification
feat(api): implement instrument registration
feat(app): create instrument catalog interface
test(api): add loan validation tests
fix(inventory): prevent negative available units
```

Se conservará el historial de cambios para evidenciar la evolución del proyecto.

## 14. Seguridad de la información

- Los archivos que contengan credenciales o secretos no deben publicarse en el repositorio.
- El archivo `.env` debe mantenerse fuera del control de versiones.
- No se deben subir directorios de dependencias como `node_modules`.
- Las contraseñas, cuando existan, deben almacenarse mediante mecanismos seguros de hash.
- Las validaciones de las operaciones deben ejecutarse en el backend.

## 15. Estado del proyecto

Music School se encuentra en proceso de desarrollo conforme al plan de mejoramiento.

La implementación, las pruebas automatizadas, la infraestructura y la documentación técnica se completarán progresivamente, verificando su correspondencia con los requisitos establecidos.

---

**Proyecto:** Music School  
**Ficha:** ADSO 3239137  
**Identificador:** A12  
**Dominio:** music-school