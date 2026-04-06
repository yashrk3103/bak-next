"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import HeroSection from "@/components/home/HeroSection";
import TrustSection from "@/components/home/StatsSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";

import FullTransparencySection from "@/components/home/FullTransparencySection";
import CelebrationSection from "@/components/home/CelebrationSection";
import PackagesSection from "@/components/home/PackagesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import DownloadAppSection from "@/components/home/DownloadAppSection";
import OrderPanel from "@/components/order/OrderPanel";
import AnimalQualitySectionUk from "@/components/AnimalQualitySectionUk";
import Image from "next/image";
import QurbaniFormModal from "@/components/QurbaniFormModal";
import { User } from "@supabase/supabase-js";
import { useRegion } from "@/components/layout/RegionContext";

export default function HomePage() {
  const { region } = useRegion();
  const [showOrder, setShowOrder] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setUser(data.user);
      }
    };

    fetchUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleBookNow = () => {
    if (user) {
      setShowOrder(true);
    } else {
      window.dispatchEvent(new Event("open-login"));
    }
  };

  return (
    <>
      <HeroSection onBookNow={handleBookNow} />
      <TrustSection />
      <HowItWorksSection />
      {/* <AnimalQualitySection /> */}
      <AnimalQualitySectionUk />
      <QurbaniFormModal />
      {region === "uk" && (
        <div className="relative w-full h-48 md:h-64 lg:h-[460px]   shadow-md mx-auto ">
          <Image
          draggable={false}
            src="/images/banner_2.png"
            alt="Banner 2"
            width={3024}
            height={980}
            className="w-full h-full object-cover transition-transform"
            priority
          />
        </div>
      )}
      <FullTransparencySection onBookNow={handleBookNow} />
      <CelebrationSection onBookNow={handleBookNow} />
      <PackagesSection />
      <TestimonialsSection />
      {region !== "uk" && (
      <DownloadAppSection />
      )}
      <OrderPanel isOpen={showOrder} onClose={() => setShowOrder(false)} />
    </>
  );
}
