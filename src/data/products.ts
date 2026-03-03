export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: string;
  image: string;
}

export interface StyleOption {
  name: string;
  priceModifier: number;
}

export const styleOptions: StyleOption[] = [
  { name: "Matte", priceModifier: 0 },
  { name: "Glossy", priceModifier: 50 },
  { name: "Transparent", priceModifier: 30 },
  { name: "Holographic", priceModifier: 100 },
];

export const categories = [
  { name: "Anime", emoji: "🎌", description: "Your fave characters, dripped out" },
  { name: "Football", emoji: "⚽", description: "Rep your squad everywhere" },
  { name: "Cars", emoji: "🏎️", description: "JDM legends & supercar vibes" },
  { name: "Urban Art", emoji: "🎨", description: "Street culture meets phone art" },
];

export const products: Product[] = [
  { id: "1", name: "Naruto Sage Mode", description: "Naruto in full Sage Mode with epic chakra effects. Ultra-detailed anime artwork that brings your phone to life.", basePrice: 350, category: "Anime", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=400&fit=crop" },
  { id: "2", name: "Goku Ultra Instinct", description: "Goku's legendary Ultra Instinct form with silver aura effects. The ultimate power-up for your phone.", basePrice: 350, category: "Anime", image: "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=400&h=400&fit=crop" },
  { id: "3", name: "Messi GOAT", description: "Lionel Messi celebrating in iconic style. A tribute to the greatest of all time.", basePrice: 300, category: "Football", image: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=400&h=400&fit=crop" },
  { id: "4", name: "Champions League", description: "The iconic Champions League trophy with starry night effects. For the real football heads.", basePrice: 300, category: "Football", image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&h=400&fit=crop" },
  { id: "5", name: "Nissan GTR R34", description: "The legendary Skyline R34 GTR in midnight purple. JDM culture at its finest.", basePrice: 320, category: "Cars", image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=400&fit=crop" },
  { id: "6", name: "Lamborghini Neon", description: "A Lamborghini Aventador with neon underglow effects. Speed and style combined.", basePrice: 320, category: "Cars", image: "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=400&h=400&fit=crop" },
  { id: "7", name: "Graffiti Skull", description: "Bold graffiti-style skull artwork with dripping paint effects. Street art vibes for your phone.", basePrice: 280, category: "Urban Art", image: "https://images.unsplash.com/photo-1569172122301-bc5008bc09c5?w=400&h=400&fit=crop" },
  { id: "8", name: "Neon Tiger", description: "A fierce tiger rendered in neon wireframe style. Where nature meets the digital world.", basePrice: 300, category: "Urban Art", image: "https://images.unsplash.com/photo-1549480017-d76466a4b7e8?w=400&h=400&fit=crop" },
];
