FROM postgres:16-alpine

# La imagen oficial ejecuta estos archivos, en orden alfabético, solamente
# cuando crea por primera vez el directorio de datos.
COPY ./ddl/*.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
