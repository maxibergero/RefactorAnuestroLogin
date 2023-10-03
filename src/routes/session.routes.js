import { Router } from "express";
import { userModel } from "../models/users.models.js";
import passport from "passport";





const sessionRouter = Router()



sessionRouter.post('/login', passport.authenticate('login'), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send({message: "Usuarios o Contraseña no son válidos"})
        }
        
            req.session.user = {
                nombre: req.user.nombre,
                apellido: req.user.apellido,
                edad: req.user.edad,
                email: req.user.email
            }
    
            res.status(200).send({ payload: req.user })
          
        
        
    } catch (error) {
        res.status(500).send({message: `Error al iniciar sesion ${error}` })
    }
})

sessionRouter.get('/logout', (req, res) => {
    if (req.session.user) {
        req.session.destroy()
    }
    //res.status(200).send({ resultado: 'Usuario deslogueado' })
    res.redirect('/api/sessions')
})

sessionRouter.post('/register', passport.authenticate('register'), async (req, res) => {
    try {
        if (!req.user) {
             res.status(400).send({ message: "Usuario ya existente", resultado: false})
        }else{
            res.status(200).send({ message: 'Usuario registrado', resultado: true})
        }

        
    } catch (error) {
        res.status(500).send({ message: `Error al registrar usuario ${error}` })
    }
})

//Registrarme
sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {

})

//Ingresar
sessionRouter.get('/githubCallback', passport.authenticate('github'), async (req, res) => {
    req.session.user = req.user
    res.status(200).send({ mensaje: 'Usuario logueado' })
})

sessionRouter.get('/', (req, res) => {
    res.render("session", {
        css: 'session.css',
        script: 'session.js'
    })
}) 

sessionRouter.get('/formRegistro', (req, res) => {
    res.render("formRegistro", {
        css: 'formRegistro.css',
        script: 'formRegistro.js'
    })
}) 



export default sessionRouter