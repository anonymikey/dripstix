import Navbar from "@/components/Navbar";
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
