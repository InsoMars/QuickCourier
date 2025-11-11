FROM nginx:alpine

# Limpia los archivos por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copia el contenido del folder templates (donde está este Dockerfile)
COPY . /usr/share/nginx/html

# Copia también la carpeta static (que está fuera de templates)
COPY ../static /usr/share/nginx/html/static

EXPOSE 80
    