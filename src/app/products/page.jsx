'use client';
import ProductGrid from "@/components/product-grid";
import React from "react";
import { products, categories } from "@/lib/mock-data";
const ProductPage = () => {
  console.log("products", products);
  console.log("categories", categories);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-3 lg:flex-row ">
        <div className="lg">
          <ProductGrid products={products} categories={categories}/>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
