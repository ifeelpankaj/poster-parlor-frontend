import PosterBannerCarousel from "@/components/home/banner";
import Category from "@/components/home/category";
import { PremiumCollection } from "@/components/home/premium-collection";
import OurServices from "@/components/home/services";
import TestimonialQueue from "@/components/home/testimonial-queue";
import Footer from "@/components/layout/footer/footer";

import { Header } from "@/components/layout/header/header";

export default function Home() {
  return (
    <>
      <Header />
      <PosterBannerCarousel />
      <Category />
      <PremiumCollection />
      <TestimonialQueue />
      <OurServices />
      <Footer />
    </>
  );
}
