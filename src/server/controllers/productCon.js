import { db } from "../db.config."


export const productController = {
    getAllProducts: async () => {

        const result = await db.manyOrNone("SELECT * FROM public.products ORDER BY id DESC");
        return result;
    },
    getProductByid: async (id) => {
        const result = await db.oneOrNone("SELECT * FROM public.products WHERE id = $1", [id]);
        return result;
    },
}