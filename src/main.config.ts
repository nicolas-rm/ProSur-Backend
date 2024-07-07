import * as passport from 'passport'; // Importa el módulo passport: Su funcion es autenticar las solicitudes
import * as session from 'express-session'; // Importa el módulo express-session: Su función es manejar las sesiones de usuario
import { AuthService } from './modules/auth/auth.service';

export function MainConfigurations(app) {
    // Configuraciones Middleware
    configurationMiddleware(app);

    // Configurar la autenticación con Passport
    configurationPassport(app);
}

function configurationMiddleware(app) {
    // Configurar el uso del cors
    app.enableCors({
        origin: 'http://localhost:4200', // El origen de tu frontend
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });

    // Configurar la sesión del usuario
    app.use(
        session({
            secret: 'your-secret-key', // Cambia esto por una clave secreta segura
            resave: false, // No guardar la sesión si no se ha modificado
            saveUninitialized: false, // No guardar una sesión vacía
            // cookie: { maxAge: 3600000 }, // Opcional: Configurar tiempo de vida de la cookie
        }),
    );
}

function configurationPassport(app) {
    // Configurar la serialización del usuario en la sesión
    passport.serializeUser((user: any, done) => {
        done(null, user.id);
    });

    // Configurar la deserialización del usuario desde la sesión
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await app.get(AuthService).findAuth(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });

    app.use(passport.initialize());
    app.use(passport.session());
}
