import { Router } from "express";
import { productModel } from "../models/products.models.js";



const productRouter = Router()




productRouter.get('/', async (req, res) => {
    //Limiti
    const { limit } = req.query;
    const limitProd = limit ?? 10;

    //Page
    const {page} = req.query; // Número de página que deseas obtener
    const pageProd = page ?? 1; 

    //query
    const {query} = req.query
    const {atributeFilter} = req.query

    // Crea un objeto de filtro dinámico
    const filter = {};

    // Verifica si se proporcionó un atributo y un valor de atributo
    if (query && atributeFilter) {
        filter[atributeFilter] = query;
    }
    
    //sort
    const sort = req.query.sort;
    let sortProd = null;
    
    // Intenta convertir sort en un número
    const sortAsNumber = parseInt(sort);
    
    if (!isNaN(sortAsNumber) && (sortAsNumber === 1 || sortAsNumber === -1)) {
        sortProd = sortAsNumber;
    }
  
    

    //const resultado = await productModel.paginate({}, { page, limit: perPage })
    
    try {
        //const prods = await productModel.find().limit(limitProd)
        const resultado = await productModel.paginate(filter, {limit: limitProd, sort: { price: sortProd}, page: pageProd})
        
        const productos = resultado.docs.map(producto => producto.toObject());
        //res.status(200).send({ respuesta: 'OK', mensaje: resultado })
       
        res.status(200).render("productos", {
            productos,
            css: "style.css",
            script: "scriptProducto.js"
        })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en consultar productos', mensaje: error })
    }
})

productRouter.get('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const prodBuscado= await productModel.findById(id)
        const prod = prodBuscado._doc
        if (prod)
            //res.status(200).send({ respuesta: 'OK', mensaje: prod })
            res.status(200).render('producto', {
                prod,
                css: 'bloqueDeProducto.css',
                script: 'scriptProducto.js',
                title: 'Products'
            });
            
        else
            res.status(404).send({ respuesta: 'Error en consultar Producto', mensaje: 'Not Found' })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en consulta producto', mensaje: error })
    }
})

productRouter.post('/', async (req, res) => {
    const { title, description, stock, code, price, category } = req.body
    try {
        const prod = await productModel.create({ title, description, stock, code, price, category })
        res.status(200).send({ respuesta: 'OK', mensaje: prod })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en crear productos', mensaje: error })
    }
})

productRouter.put('/:id', async (req, res) => {
    const { id } = req.params
    const { title, description, stock, status, code, price, category } = req.body

    try {
        const prod = await productModel.findByIdAndUpdate(id, { title, description, stock, status, code, price, category })
        if (prod)
            res.status(200).send({ respuesta: 'OK', mensaje: 'Producto actualizado' })
        else
            res.status(404).send({ respuesta: 'Error en actualizar Producto', mensaje: 'Not Found' })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en actualizar producto', mensaje: error })
    }
})

productRouter.delete('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const prod = await productModel.findByIdAndDelete(id)
        if (prod)
            res.status(200).send({ respuesta: 'OK', mensaje: 'Producto eliminado' })
        else
            res.status(404).send({ respuesta: 'Error en eliminar Producto', mensaje: 'Not Found' })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en eliminar producto', mensaje: error })
    }
})


export default productRouter
