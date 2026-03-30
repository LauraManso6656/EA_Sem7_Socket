# Chat en Tiempo Real con Angular y Node.js

Una aplicación de chat global en tiempo real que permite a los usuarios conectarse, enviar mensajes y ver quién está online. Utiliza Socket.io para la comunicación bidireccional entre el frontend (Angular) y el backend (Node.js con Express y MongoDB).

## Características

- **Registro y Login Rápido**: Crea organizaciones y usuarios de forma sencilla.
- **Chat Global**: Todos los mensajes se comparten en tiempo real entre usuarios conectados.
- **Lista de Usuarios Conectados**: Broadcasting automático de la lista de usuarios online.
- **Indicadores de Escritura**: Muestra cuando alguien está escribiendo.
- **Interfaz Responsiva**: Diseño moderno con Angular Material.
- **Estado Reactivo**: Gestión de estado global con RxJS y BehaviorSubjects.

## Tecnologías Utilizadas

### Frontend
- **Angular 21**: Framework principal.
- **Socket.io-client**: Para conexiones WebSocket.
- **RxJS**: Programación reactiva para manejo de eventos asíncronos.
- **TypeScript**: Tipado fuerte.

### Backend
- **Node.js**: Runtime de JavaScript.
- **Express.js**: Framework web.
- **Socket.io**: Comunicación en tiempo real.
- **MongoDB**: Base de datos NoSQL.
- **Mongoose**: ODM para MongoDB.

## Instalación

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn
- MongoDB (local o en la nube)

### Backend
1. Navega a la carpeta del backend:
   ```bash
   cd Backend_Websockets-
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Configura la base de datos en `.env` (copia de `.env.example`):
   ```
   MONGO_URI=mongodb://localhost:27017/chatdb
   PORT=1337
   ```
4. Inicia el servidor:
   ```bash
   npm start
   ```

### Frontend
1. En otra terminal, navega a la carpeta del frontend:
   ```bash
   cd EA_Sem7_Socket
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación:
   ```bash
   npm start
   ```

La aplicación estará disponible en `http://localhost:4200` y el backend en `http://localhost:1337`.

## Uso

1. **Registro**: Crea una organización y un usuario con nombre, email y contraseña.
2. **Login**: Usa el email para acceder (login simulado).
3. **Chat**: Envía mensajes que se comparten globalmente.
4. **Usuarios Online**: Ve la lista de usuarios conectados en la barra lateral.

## Estructura del Proyecto

```
EA_Sem7_Socket/          # Frontend Angular
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── chat/     # Componente principal del chat
│   │   │   └── login/    # Componente de login
│   │   ├── services/
│   │   │   ├── auth.ts   # Servicio de autenticación
│   │   │   ├── chat.ts   # Servicio de chat (delegado a socket)
│   │   │   └── socket.service.ts  # Servicio de Socket.io
│   │   └── ...
│   └── ...

Backend_Websockets-/     # Backend Node.js
├── src/
│   ├── controllers/      # Controladores de rutas
│   ├── models/           # Modelos de MongoDB
│   ├── routes/           # Definición de rutas
│   ├── services/         # Lógica de negocio (MensajeService, ConnectionManager)
│   ├── middleware/       # Middlewares
│   └── server.ts         # Punto de entrada del servidor
├── package.json
└── ...
```

## Desarrollo

### Notas sobre el Desarrollo (USO DE IA!!)
Se ha utilizado IA (Gemini y Copilot) para guiarme y para intentar arreglar el codigo (no ha funcionado)

### Scripts Disponibles
- `npm start`: Inicia el servidor de desarrollo.
- `npm run build`: Construye la aplicación para producción.
- `npm test`: Ejecuta las pruebas.

## Contribución

1. Fork el proyecto.
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`).
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`).
4. Push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto

Si tienes preguntas o sugerencias, abre un issue en el repositorio.
