'use client';
import useCartStore from '@/lib/store/cart';
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Trash, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

const CartPage = () => {
  const items = useCartStore((state) => state.item);
  const removeItem = useCartStore((state) => state.removeItem);
  const addItem = useCartStore((state) => state.addItem);
  const decreaseItem = useCartStore((state) => state.decreaseItem);
  const clearCart = useCartStore((state) => state.clearCart);
  
  // คำนวณราคารวม
  const totalPrice = items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  
  // ลบสินค้าออกจากตะกร้า
  const handleRemoveItem = (id) => {
    removeItem(id);
    toast.success('ลบสินค้าออกจากตะกร้าเรียบร้อยแล้ว');
  };
  
  // เพิ่มจำนวนสินค้า
  const handleIncreaseQuantity = (item) => {
    addItem(item);
  };
  
  // ลดจำนวนสินค้า
  const handleDecreaseQuantity = (id) => {
    decreaseItem(id);
  };
  
  // เคลียร์ตะกร้าทั้งหมด
  const handleClearCart = () => {
    clearCart();
    toast.success('ล้างตะกร้าเรียบร้อยแล้ว');
  };
  
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-semibold mb-4">ตะกร้าสินค้าของคุณ</h1>
        <p className="text-gray-500 mb-6">ไม่มีสินค้าในตะกร้า</p>
        <Link href="/products">
          <Button>เลือกซื้อสินค้า</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">ตะกร้าสินค้าของคุณ</h1>
      
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สินค้า</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ราคา</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวน</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รวม</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0 mr-4 relative">
                        {item.image_url && (
                          <Image 
                            src={item.image_url}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.price}฿
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleDecreaseQuantity(item.id)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-sm">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleIncreaseQuantity(item)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.price * item.quantity}฿
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button 
                      variant="ghost" 
                      onClick={() => handleRemoveItem(item.id)} 
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={handleClearCart}>
              ล้างตะกร้า
            </Button>
            <div className="text-right">
              <div className="text-lg font-semibold">ยอดรวมทั้งสิ้น: {totalPrice}฿</div>
              <p className="text-xs text-gray-500 mt-1">ราคารวมภาษีและค่าจัดส่ง</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-right">
        <Button>ดำเนินการสั่งซื้อ</Button>
      </div>
    </div>
  );
};

export default CartPage;