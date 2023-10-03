import { privateDecrypt } from 'crypto';
import {promises as fs} from 'fs'


class ManagerProducts{

    constructor(){
        this.path = './src/products.json'
    }

    async getProducts(){

        try {
            const products = await fs.readFile(this.path, 'utf-8')
            return JSON.parse(products)
        } catch (error) {
            throw new Error(`Error en la lectura de productos: ${error}`);
            
        }
    }

    async getProductById(id){
        try {
            const products = await this.getProducts();
            const prod = products.find((prod) => {return prod.id === id})
            return prod;
        } catch (error) {
            throw new Error(`${error}`);
        }
    }

    async getMayId(){
        try {
            const products = await this.getProducts();
            let mayId = 0;
            products.forEach(prod => {
                if(prod.id > mayId){
                    mayId = prod.id
                }
            });
            return mayId;

        } catch (error) {
            throw new Error(`${error}`)
        }
    }

    async isCodeExisting(code) {
        try {
            const products = await this.getProducts();
            const exists = products.some(prod => prod.code === code);
            return exists;
        } catch (error) {
            throw new Error(`${error}`);
        }
    }

    async isIdExisting(id) {
        try {
            const products = await this.getProducts();
            const exists = products.some(prod => prod.id === id);
            return exists;
        } catch (error) {
            throw new Error(`${error}`);
        }
    }

   validateProduct(product) {
        if (!product.title || !product.description || !product.code || !product.price || !product.status || !product.stock || !product.category) {
            return false; // Alguno de los campos obligatorios está ausente o vacío.
        }

        return true; // Todos los campos obligatorios están presentes y no están vacíos.
    }

    async writeFileProducts(products){
        try {
            const stringProducts =  JSON.stringify(products);
             await fs.writeFile(this.path, stringProducts)

        } catch (error) {
            throw new Error(`Error en la escritura de productos: ${error}`);
        }
    }

    async addProduct(prod){
        try {
             //Se busca el id mayor y se agrega a prod
            prod.id = await this.getMayId() + 1;

            //Si no se pasa como parámetro thumbnail se le asigna "sin info"
            if(!prod.thumbnail){
                prod.thumbnail = "sin info"
            }

            const products = await this.getProducts();
            products.push(prod);
            await this.writeFileProducts(products)
        } catch (error) {
            throw new Error(`${error}`)
        }
    }

    async updateProduct(upDateProd, id) {
        try {
            
            let seActualiza = false;
            const products = await this.getProducts();

            const updatedProducts = products.map(product => {
                if (product.id === id) {
                    seActualiza = true;
                    return { ...product, ...upDateProd };
                }
                return product
                
            });
            if(seActualiza){
                await this.writeFileProducts(updatedProducts) // Corrección aquí
            }

        } catch (error) {
            throw new Error(`${error}`);
        }
    }

    async deleteProduct(id){

        try {
            const products = await this.getProducts();
            
            const productsFilter = products.filter(p => p.id != id)

            if(products.length != productsFilter.length){
                
                await this.writeFileProducts(productsFilter);
            }

        } catch (error) {
            throw new Error(`${error}`)
        }

    }


    async deleteProductByCode(code){

        try {
            const products = await this.getProducts();

            const productsFilter = products.filter(p => p.code != code)

            if(products.length != productsFilter.length){
                await this.writeFileProducts(productsFilter);
            }

        } catch (error) {
            throw new Error(`${error}`)
        }

    }
}


export default ManagerProducts;