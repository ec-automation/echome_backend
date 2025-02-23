# Imagen base
FROM node:20

# Directorio de trabajo
WORKDIR /app

# Eliminar cualquier caché existente
RUN npm cache clean --force

# Copiar los archivos de dependencias
COPY package*.json ./

# Instalar todas las dependencias, incluyendo dotenv
RUN npm install

# Instalar nodemon globalmente
RUN npm install -g nodemon
# Instalar cliente de PostgreSQL para pg_isready
RUN apt-get update && apt-get install -y postgresql-client

# Copiar el resto del proyecto
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
