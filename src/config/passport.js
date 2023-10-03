import local from 'passport-local' //Importo la estrategia
import passport from 'passport'
import { createHash, validatePassword } from '../utils/bcrypt.js'
import { userModel } from '../models/users.models.js'

import GithubStrategy from 'passport-github2'

//Defino la estregia a utilizar
const LocalStrategy = local.Strategy

const initializePassport = () => {

    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            //Registro de usuario

            const { nombre, apellido, email, edad } = req.body

            try {
                const user = await userModel.findOne({ email: email })

                if (user) {
                    //Caso de error: usuario existe
                    return done(null, false)
                }

                //Crear usuario

                const passwordHash = createHash(password)
                const userCreated = await userModel.create({
                    nombre: nombre,
                    apellido: apellido,
                    edad: edad,
                    email: email,
                    password: passwordHash
                })

                return done(null, userCreated)

            } catch (error) {
                return done(error)
            }
        }))

    passport.use('login', new LocalStrategy(
        { usernameField: 'email' }, async (username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username })

                if (!user) {
                    return done(null, false)
                }

                if (validatePassword(password, user.password)) {
                    return done(null, user)
                }

                return done(null, false)

            } catch (error) {
                return done(error)
            }
        }))

        passport.use('github', new GithubStrategy({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.SECRET_CLIENT,
            callbackURL: process.env.CALLBACK_URL
        }, async (accessToken, refreshToken, profile, done) => {
            try {
                console.log(accessToken)
                console.log(refreshToken)
                console.log(profile._json)
                const user = await userModel.findOne({ email: profile._json.email })
                if (user) {
                    done(null, false)
                } else {
                    const userCreated = await userModel.create({
                        nombre: profile._json.name,
                        apellido: ' ',
                        email: profile._json.email,
                        edad: 18, //Edad por defecto
                        password: createHash(profile._json.email + profile._json.name)
                    })
                    done(null, userCreated)
                }
    
    
            } catch (error) {
                done(error)
            }
        }))
        
    //Inicializar la session del user
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    //Eliminar la session del user
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })

}

export default initializePassport

/*
En la secuencia que proporcionaste, la sesión se crea en MongoDB en el momento en que el usuario inicia sesión y se valida correctamente. La creación de la sesión en MongoDB está manejada internamente por express-session junto con connect-mongo. Aquí hay un desglose paso a paso de cómo ocurre esto:

Cuando un usuario envía una solicitud de inicio de sesión al servidor, el enrutador sessionRouter maneja la solicitud POST en la ruta /login.

En la ruta /login, se utiliza passport.authenticate('login') para autenticar al usuario. Si la autenticación es exitosa y las credenciales son válidas, Passport devuelve un objeto user que representa al usuario autenticado. Esto ocurre en el interior de las estrategias de Passport configuradas en initializePassport.

Después de que la autenticación sea exitosa y passport.authenticate('login') retorne un user, la solicitud POST continúa ejecutándose. En este punto, puedes acceder al objeto user en req.user, que representa al usuario autenticado.

Dentro de la ruta /login, no se crea directamente la sesión en MongoDB. En su lugar, express-session se encarga de eso. La configuración de express-session especifica que las sesiones se deben almacenar en MongoDB utilizando connect-mongo.

Cuando se accede a req.user, express-session se da cuenta de que se ha autenticado un usuario válido y crea automáticamente una sesión en MongoDB. Esta sesión contiene información sobre la sesión del usuario, como su identificación, tiempo de inicio de sesión, etc.

En resumen, la creación de la sesión en MongoDB ocurre automáticamente cuando el usuario se autentica correctamente y express-session detecta que se debe crear una nueva sesión. No es necesario crear la sesión manualmente; express-session y connect-mongo manejan todo el proceso de forma transparente una vez que se configuran adecuadamente en tu aplicación.
*/