# 🐶 AdoptMe - Entrega Final

Este proyecto es el backend de una plataforma web para la adopción de mascotas. Su objetivo es gestionar el proceso de adopción de animales.

## 🐾 Uso

La API expone endpoints para gestionar usuarios, mascotas y solicitudes de adopción. Puedes probarla con herramientas como Postman o mediante tests automatizados.

## 🚀 Tecnologías utilizadas

Este proyecto utiliza las siguientes tecnologías:

### 📌 Dependencias principales:
- **bcrypt**: Cifrado de contraseñas de usuarios.
- **commander**: Manejo de argumentos en línea de comandos.
- **cookie-parser**: Manejo de cookies en Express.
- **dotenv**: Gestión de variables de entorno.
- **express**: Framework web para construir APIs en Node.js.
- **jsonwebtoken**: Autenticación con JWT.
- **mongoose**: ORM para trabajar con MongoDB en Node.js.
- **multer**: Middleware para carga de archivos (ej. imágenes de mascotas).
- **nodemon**: Recarga automática del servidor en desarrollo.
- **swagger-jsdoc & swagger-ui-express**: Documentación de la API con Swagger.
- **winston**: Registro y gestión de logs en la aplicación.

### 🧪 Dependencias de desarrollo (Testing):
- **@faker-js/faker**: Generación de datos falsos para pruebas.
- **chai**: Librería de aserciones para pruebas unitarias.
- **mocha**: Framework para ejecutar pruebas.
- **supertest**: Pruebas HTTP automatizadas.

## 📦 Instalación

Puedes clonar el repositorio o descargar el archivo del proyecto.

#### Clonar desde GitHub:

``` git clone https://github.com/giginaranjo/Adoptme.git ```
``` cd Adoptme ```

#### Descargar archivo manualmente:
- Descargar archivo manualmente:
- Ve al repositorio en GitHub.
- Haz clic en el botón "Code" y selecciona "Download ZIP".
- Descomprime el archivo en tu equipo.


- Instala las dependencias:

```npm install```


- Crea o configura el archivo .env en la raíz del proyecto y agrega las configuraciones necesarias, como la cadena de conexión a la base de datos y cualquier otra variable sensible.


#### Inicia el servidor:

Después de instalar las dependencias y configurar las variables de entorno, puedes iniciar el servidor con:

```npm start```

O si prefieres el modo desarrollo (con reinicio automático cuando se hagan cambios), usa:

```npm run dev```

Y para realizar los testeos

```npm test```

## 🐳 Uso con Docker

### Construcción de la imagen

```docker build -t adoptme .```

### Correr el contenedor

```docker run -d -p 8080:8080 adoptme```

### Subir la imagen a Docker Hub

```docker tag adoptme giginaranjo/adoptme:1.0.0```
```docker push giginaranjo/adoptme:1.0.0```

## 🐳 Imagen en Docker Hub

Puedes encontrar la imagen en Docker Hub en el siguiente enlace:  
🔗 [Docker Hub - AdoptMe](https://hub.docker.com/r/giginaranjo/adoptme)




    
