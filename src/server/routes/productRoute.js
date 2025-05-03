import { Elysia, t } from "elysia";
import { productController } from "../controllers/productCon";
export const productsRoute = new Elysia({ prefix: "/products" })
    .get('/', async () => {
        try {
            const products = await productController.getAllProducts(); return {
                message: "Product fetched successfully",
                products,
            }
        } catch (error) {
            return { message: "Error fetching products", error: error.message };
        }

    })
    .get('/:id', async ({ params }) => {
        const { id } = params;
        try {
            const products = await productController.getProductByid(id);
            return {
                message: "Product fetched successfully",
                products,
            }
        } catch (error) {
            return { message: "Error fetching products", error: error.message };
        }
    },)
    .get('search', () => { })
    .post('createProduct', () => { })
    .delete('deleteProduct', () => { })