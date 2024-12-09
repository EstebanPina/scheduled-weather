# Usa una imagen base oficial de Node.js
FROM node:18

# Copia los archivos de dependencias a la imagen
COPY package*.json prisma/schema.prisma ./

# Instala las dependencias de la aplicación
RUN npm install

# Genera el cliente de Prisma
RUN npx prisma generate

# Copia el resto del código al contenedor
COPY . .

# Compila la aplicación (asumiendo que usas TypeScript)
RUN npm run build

# Expone el puerto que usa tu aplicación (por defecto 3000 en NestJS)
EXPOSE 3000

# Define el comando para ejecutar la aplicación
CMD ["npm", "run", "start:prod"]
