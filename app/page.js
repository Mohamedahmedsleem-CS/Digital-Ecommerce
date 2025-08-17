'use client'
import Image from "next/image";
import Hero from "./_components/Hero";
import ProdductSection from "./_components/ProductSection";

export default function Home() {
  return (
    <div>
      <Hero />
      <ProdductSection />
    </div>
  );
}
