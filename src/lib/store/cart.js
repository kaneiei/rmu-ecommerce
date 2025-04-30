import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
    persist(
        (set, get) => ({
            item: [],
            addItem: (product) => {
                const item = get().item;
                const existingI = item.find((i) => i.id === product.id);

                if (existingI) {
                    const updatedItem = item.map((i) =>
                        i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
                    );
                    set({ item: updatedItem });
                } else {
                    set({
                        item: [...item, { ...product, quantity: 1 }],
                    });
                }
            },
            removeItem: (productId) => {
                const item = get().item;
                const updatedItem = item.filter(i => i.id !== productId);
                set({ item: updatedItem });
            },
            // เพิ่มฟังก์ชันลดจำนวนสินค้า
            decreaseItem: (productId) => {
                const item = get().item;
                const existingItem = item.find(i => i.id === productId);
                
                if (existingItem && existingItem.quantity > 1) {
                    // ถ้าจำนวนมากกว่า 1 ให้ลดจำนวนลง
                    const updatedItem = item.map(i => 
                        i.id === productId ? { ...i, quantity: i.quantity - 1 } : i
                    );
                    set({ item: updatedItem });
                } else {
                    // ถ้าจำนวนเหลือ 1 ให้ลบรายการออกไปเลย
                    const updatedItem = item.filter(i => i.id !== productId);
                    set({ item: updatedItem });
                }
            },
            // เคลียร์ตะกร้าทั้งหมด
            clearCart: () => {
                set({ item: [] });
            }
        }),
        {
            name: 'cart-storage',
        }
    )
);

export default useCartStore;
