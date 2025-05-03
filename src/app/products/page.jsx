'use client';
import ProductGrid from "@/components/product-grid";
import React from "react";
import { products, categories } from "@/lib/mock-data";
// import { fetcher } from "@/lib/fetchdata";
import useSWR from "swr";
const ProductPage = () => {
  const { data, error, isLoading } = useSWR(`/api/products`, fetcher)
  console.log("data", data);
  console.log("error", error);  
  console.log("isLoading", isLoading);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;
  if (!data) return <div>No products found</div>; 
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-3 lg:flex-row ">
        <div className="lg">
          <ProductGrid products={data.products}/>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
