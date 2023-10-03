import express from 'express';
import { engine } from 'express-handlebars';;
import path from 'path';
import { __dirname } from './path.js';
import ManagerProducts from './models/ManagerProducts.js';
import productsRoutes from './routes/products.routes.js';
import cartsRoutes from './routes/carts.routes.js';
import {Server} from 'socket.io';
import mongoose from 'mongoose';
import session from 'express-session'
import sessionRouter from './routes/session.routes.js'
import userRouter from './routes/users.routes.js'
import MongoStore from 'connect-mongo'
import 'dotenv/config'
import passport from 'passport'
import initializePassport from './config/passport.js'


mongoose.connect('mongodb+srv://christianjavierbergero:kPX5vgj9ewJ7sN59@cluster0.vb2rx0e.mongodb.net/?retryWrites=true&w=majority')
    .then(async () => {

        console.log('BDD conectada');
      
    } )
    .catch((error) => console.log(`Error de conexión: ${error}`))




const app = express();

//Middleware
app.use(express.json()); // Convertir lo que está en el body que son string JSon , en objetos javascript
app.use(express.urlencoded({extended:true})) //Para manejar URL extensas
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: {
            useNewUrlParser: true, //Establezco que la conexion sea mediante URL
            useUnifiedTopology: true //Manego de clusters de manera dinamica
        },
        ttl: 60 //Duracion de la sesion en la BDD en segundos

    }),
    secret: process.env.SESSION_SECRET,
    resave: false, //Fuerzo a que se intente guardar a pesar de no tener modificacion en los datos. Cuando está en true.
    saveUninitialized: false //Fuerzo a guardar la session a pesar de no tener ningun dato. Cuando está en true
                            
    //Al estar resave y saveUnitialized en false, sólo se guardará la sessión cuando se hagan modificaciones, 
    //en nuestro ejemplo cuando se ingrese mail y contraseña correctos, en ese momemento le agregamos una propiedad sessión que 
    // session.login; provocando un cambio en sessión y por lo tanto guardando la sessión en mongo db
}))

//Routes
app.use('/api/products', productsRoutes)
app.use('/api/carts', cartsRoutes)
app.use('/api/users', userRouter)
app.use('/api/sessions', sessionRouter)




//Configuración carpeta estática
app.use('/', express.static(path.join(__dirname, '/public')))



//configuración handlebars
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))

//Configuración passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())


const PORT = 4000;

const server = app.listen(PORT, () => {console.log(`Server on PORT ${PORT} : http://localhost:4000/`)});

//Usuamos socket.io

const io = new Server(server);

app.get('/', async (req, res) => {
    try {
        const manager = new ManagerProducts();
        //const data = await manager.getProducts();
        const data = await manager.getProducts();
        res.render('home', {
            data,
            css: 'style.css',
            tittle: 'Products'
        }); // Renderiza la página HTML y pasa los datos como contexto
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});



app.get('/realtimehandlebars', async (req, res) => {
    try {
        const manager = new ManagerProducts();
        //const data = await manager.getProducts();
        
        const data = await manager.getProducts(); 
        
        

        res.render('realTimeProducts', {
            data,
            css: 'style.css',
            tittle: 'Products',
            script: 'script.js'
        }); // Renderiza la página HTML y pasa los datos como contexto
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});



io.on('connection', (socket) => {
    console.log("Servidor socket.io conectado!!");
    
    socket.on("agregarProducto", async(prod) => {
        
        const managerProducts = new ManagerProducts();
        
        let mensaje = "Mensaje del servidor"

        if(await managerProducts.isCodeExisting(prod.code)){
            mensaje = `El código "${prod.code}" ya existe. Producto no agregado!!`
        }else if(!managerProducts.validateProduct(prod)){
            mensaje = "Hay campos obligatorios sin completar. Producto no agregado!!";
        }else{
            await managerProducts.addProduct(prod);
            mensaje = "Producto agregado con éxito!!"
        }
        console.log(`Este es un mensaje: ${mensaje}`)
    
        
        socket.emit('mostrarProducto', mensaje)
    });
   
    socket.on("eliminarProducto", async (code)=>{
        const managerProducts = new ManagerProducts();
        let mensaje = "";
        if (code === NaN || !await managerProducts.isCodeExisting(code)){
            mensaje = `El producto no existe para ser Eliminado!!`
        }else{
            
            await managerProducts.deleteProductByCode(code)
            mensaje = `El producto con CODE ${code} fue eliminado con éxito!!`
        }

        socket.emit("mostrarEliminado", mensaje)
    })
   
    
})