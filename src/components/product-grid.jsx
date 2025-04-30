'use client'
import React, { use, useState } from "react";
import Productcard from "./product-card";

const ProductGrid = ({ children, products = [] }) => {
  const [setategory, setCategory] = useState([{
    id: 1,
    name: "All",
    slug: "all"
  },
  {
    id: 2,
    name: "Shirt",
    slug: "shirt"
  },
  {
    id: 3,
    name: "Pants",
    slug: "pants"
  },
  {
    id: 4,
    name: "Shoes",
    slug: "shoes"
  }
    
  ]);
  return (
    <div className="grid grid-cols-2 gap-4  md:grid-cols-3 lg:grid-cols-4">
   
      {products && products.map((item, index) => {
        return <Productcard product={item} key={item.id}/>
      })}
    </div>
  )
}

export default ProductGrid;
