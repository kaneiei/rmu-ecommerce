'use client';
import { products } from '@/lib/mock-data';
import React, { useEffect } from 'react';
import { Button } from './ui/button';
import useCartStore from '@/lib/store/cart';
import Image from 'next/image';
import {toast} from 'sonner';
const ProductsDetails = ({id}) => {
    const product = products.find((product) => product.id === parseInt(id));
    const addItem = useCartStore((state) => state.addItem);
    const cartItems = useCartStore((state) => state.item); // เปลี่ยนจาก Items เป็น item ตามที่กำหนดใน store
    
    // ใช้ useEffect เพื่อแก้ปัญหา hydration error
    useEffect(() => {
        // โค้ดที่ต้องการทำงานเฉพาะฝั่งไคลเอนต์ เช่น console.log
        console.log("Cart items:", cartItems);
    }, [cartItems]);

    const HandleAddToCart = () => {
        try {
            if (product) {
                // ใช้ addItem จาก store โดยตรง ไม่ต้องจัดการ localStorage เอง
                // เนื่องจาก persist middleware ใน zustand จะจัดการให้อัตโนมัติ
                addItem({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image_url: product.image_url,
                    quantity: 1
                });
                toast.success('เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว', {
                    description: 'คุณสามารถไปที่ตะกร้าเพื่อดูรายละเอียดเพิ่มเติมได้',
                });
            }
        } catch (error) {
            toast.error('เกิดข้อผิดพลาดในการเพิ่มสินค้าลงตะกร้า', {
                description: 'กรุณาลองใหม่อีกครั้ง',
            });
            console.log(error);
        }
    }
    
    if (!product) {
        return <div>ขออภัย ไม่พบสินค้า</div>;
    }
    
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative w-full h-[300px]">
                    {product.image_url && (
                        <Image 
                            src={product.image_url} 
                            alt={product.name} 
                            width={250}
                            height={250}
                            className="object-contain"
                            priority
                        />
                    )}
                </div>
                <div>
                    <h1 className="text-2xl font-semibold">{product.name}</h1>
                    <p className="text-xl font-bold mt-2">{product.price}฿</p>
                    <p className="mt-4 text-gray-600">{product.description}</p>
                    <Button className="mt-6" onClick={HandleAddToCart}>
                        เพิ่มสินค้าลงตะกร้า
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ProductsDetails;
