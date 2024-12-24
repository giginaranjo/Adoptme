
# Adoptme - Primera pre-entrega

Este proyecto es el backend de una plataforma web para la adopción de mascotas. Su objetivo es gestionar el proceso de adopción de animales.


## Tecnologías utilizadas

Este proyecto utiliza las siguientes tecnologías:

- Node.js: Entorno de ejecución para JavaScript en el lado del servidor.
- Express: Framework web minimalista para Node.js que facilita la construcción de APIs.
- MongoDB (a través de Mongoose): Base de datos NoSQL para almacenar la información de las mascotas y las adopciones.
- JWT (JSON Web Tokens): Para la autenticación de usuarios y la gestión de sesiones.
- bcrypt: Biblioteca para el cifrado de contraseñas de usuarios.
- multer: Middleware para la carga de archivos (por ejemplo, imágenes de mascotas).
- dotenv: Para la gestión de variables de entorno (configuraciones sensibles como credenciales de base de datos).
- Winston: Librería para el registro de logs y seguimiento de eventos en la aplicación.
- supertest: Herramienta para realizar pruebas HTTP.
- Mocha: Framework para pruebas unitarias.
- Chai: Librería de aserciones para las pruebas.
- Nodemon: Herramienta para reiniciar automáticamente el servidor en desarrollo cuando se detectan cambios en el código.

  
## Instalación

- Clona el repositorio o descarga el archivo del repositorio:

Opción 1. Clonar:
``` git clone https://github.com/tuusuario/adopcion-mascotas-backend.git ```

Opción 2. Descargar archivo:
1. Ve al repositorio en GitHub (o donde esté hospedado el proyecto).
2. Haz clic en el botón "Code" y luego selecciona "Download ZIP".
3. Descomprime el archivo descargado en tu máquina.


- Instala las dependencias:

```npm install```


- Crea o configura el archivo .env en la raíz del proyecto y agrega las configuraciones necesarias, como la cadena de conexión a la base de datos y cualquier otra variable sensible.


- Inicia el servidor:

Después de instalar las dependencias y configurar las variables de entorno, puedes iniciar el servidor con:

```npm start```

O si prefieres el modo desarrollo (con reinicio automático cuando se hagan cambios), usa:

```npm run dev```


    
