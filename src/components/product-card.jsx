'use client';
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
const Productcard = ({ product }) => {
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );
  console.log("ส่วนลด : ", discount);
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group h-full overflow-hidden transition-transform hover:scale-[1.02]">
        <div className="relative aspect-square">
          <Image
            src={product.image_url}
            alt={product.name}
            layout="fill"
            className="object-cover transition-transform group-hover:scale-105"
          />
          {discount > 0 && (
            <Badge className="absolute right-2 top-2 bg-red-500 text-white">
              ลด {discount}%
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold line-clamp-2">{product.name}</h3>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xl font-bold text-primary">
              ฿{product.price.toLocaleString()}
            </span>
            {discount > 0 && (
              <span className="text-sm text-gray-500 line-through">
                ฿{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="text-sm">{product.rating}</span>
            <span className="text-sm text-gray-500">
              ({product.reviews} รีวิว)
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
export default Productcard;
