import { Elysia, t } from "elysia";
import { productController } from "../controllers/productCon";

export const productsRoute = new Elysia({ prefix: "/products" })
    .get('/', async () => {
        try {
            const products = await productController.getAllProducts(); 
            return {
                message: "Product fetched successfully",
                products,
            }
        } catch (error) {
            console.error("Error in GET /products:", error);
            return { 
                message: "Error fetching products", 
                error: error.message,
                stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
            };
        }
    })
    .get('/:id', async ({ params }) => {
        const { id } = params;
        try {
            const product = await productController.getProductByid(id);
            
            if (!product) {
                return {
                    message: "Product not found",
                    status: 404
                };
            }
            
            return {
                message: "Product fetched successfully",
                product,
            }
        } catch (error) {
            console.error(`Error in GET /products/${id}:`, error);
            return { 
                message: "Error fetching product", 
                error: error.message,
                stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
            };
        }
    })
    .get('search', () => { })
    .post('createProduct', () => { })
    .delete('deleteProduct', () => { })