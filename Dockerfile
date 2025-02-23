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

# Copiar el resto del proyecto
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["nodemon", "src/index.js"]
