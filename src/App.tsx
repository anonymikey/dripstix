import { useState, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import SplashScreen from "@/components/SplashScreen";
import ScrollToTop from "@/components/ScrollToTop";
import WomensDayPopup from "@/components/WomensDayPopup";
import AffiliateBubble from "@/components/AffiliateBubble";
import WhatsAppButton from "@/components/WhatsAppButton";
import SocialProofNotification from "@/components/SocialProofNotification";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Affiliate from "./pages/Affiliate";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminContent from "./pages/admin/AdminContent";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminAffiliates from "./pages/admin/AdminAffiliates";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashComplete = useCallback(() => setSplashDone(true), []);

  return (
    <>
      <ScrollToTop />
      {!isAdmin && !splashDone && <SplashScreen onComplete={handleSplashComplete} />}
      {!isAdmin && splashDone && <WomensDayPopup />}
      {splashDone && <AffiliateBubble />}
      {splashDone && <WhatsAppButton />}
      {splashDone && <SocialProofNotification />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/affiliate" element={<Affiliate />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="affiliates" element={<AdminAffiliates />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
