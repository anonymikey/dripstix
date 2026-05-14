import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet-async";
import HeroSection from "@/components/HeroSection";
import MarqueeBanner from "@/components/MarqueeBanner";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategoriesSection from "@/components/CategoriesSection";
import HowItWorks from "@/components/HowItWorks";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";

const Index = () => {
  return (
    <div className="min-h-screen page-bg">
      <Helmet>
        <title>DripStix — Premium Phone & Laptop Stickers in Kenya</title>
        <meta name="description" content="Shop premium phone and laptop stickers at DripStix. Trendy, durable designs with M-PESA checkout and fast delivery across Kenya." />
        <link rel="canonical" href="https://dripstix.lovable.app/" />
        <meta property="og:title" content="DripStix — Premium Phone & Laptop Stickers in Kenya" />
        <meta property="og:description" content="Shop trendy phone and laptop stickers. Pay with M-PESA. Delivery across Kenya." />
        <meta property="og:url" content="https://dripstix.lovable.app/" />
      </Helmet>
      <PageBackground />
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <MarqueeBanner />
        <CategoriesSection />
        <FeaturedProducts />
        <HowItWorks />
        <TestimonialsSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
