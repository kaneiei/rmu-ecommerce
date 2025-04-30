import React from 'react'
import ProductsDetails from '@/components/products-details'
const DetailsPage =  async ({params}) => {
    const {productid} = await params ;
  return (
    <ProductsDetails id={productid} />
  )
}

export default DetailsPage; 
