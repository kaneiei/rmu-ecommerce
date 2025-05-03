"use client";
import SigninButton from "@/components/signin-button";
import { Button } from "@/components/ui/button";
import React, { use, useEffect, useState } from "react";
import { products,categories } from "@/lib/mock-data";
import ProductPage from "./products/page";

const HomePage = () => {
  //สิ่งที่เขียนในนี้จะถูก render ออกมาบนหน้าเว็บ
    
  
  const [count, setCount] = useState(0);
  const [name, setName] = useState("Kriangsak");

  useEffect(() => {
   setName(`Kriangsak Sochai ${count}` );
    },[count]);
   




  
  const handleClick = () => {
    setCount(count + 1);
  };
  const handleSetname = () => {
    setName("Kriangsak Sochai");
  };
  return (
    <div className="text-center pt-8 text-3xl font-bold">
      {/* <h1> จำนวนนับ : {count} </h1>
      <Button onClick={() => handleClick()}>เพิ่มจำนวนนับ</Button>
      <Button onClick={() => handleSetname()}>update name</Button>
      <h2> ชื่อ : {name} </h2> */}
      ยินดีต้อนรับสู่ Gundan Shop
      {/* <br /> */}
      <SigninButton />
    </div>
  );
};

export default HomePage;
