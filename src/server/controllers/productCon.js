import { db } from "../db.config.";

export const productController = {
  getAllProducts: async () => {
    try {
      // เปลี่ยนจาก db.manyOrNone เป็น db.query
      const result = await db.query("SELECT * FROM products");
      return result.rows; // @vercel/postgres คืนค่า result.rows แทน
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  getProductByid: async (id) => {
    try {
      // เปลี่ยนจาก db.oneOrNone เป็น db.query
      const result = await db.query("SELECT * FROM products WHERE id = $1", [id]);
      return result.rows[0]; // คืนค่าแถวแรก (หรือ undefined ถ้าไม่พบ)
    } catch (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      throw error;
    }
  }
};