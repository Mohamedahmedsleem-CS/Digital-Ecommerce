'use client'
import Image from "next/image";
import Hero from "./_components/Hero";
import ProdductSection from "./_components/ProductSection";
import BestSellersSection from "./_components/BestSellersSection";

export default function Home() {
  return (
    <div>
      <Hero />
      <BestSellersSection />
      <ProdductSection />
    </div>
  );
}
