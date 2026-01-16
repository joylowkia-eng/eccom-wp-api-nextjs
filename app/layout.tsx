import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Lumière - Premium Beauty & Cosmetics",
  description: "Discover the art of beauty with our curated collection of premium skincare and cosmetics. Shop luxury beauty products online.",
  keywords: "beauty, cosmetics, skincare, makeup, fragrance, premium beauty products",
};

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider } from "./context/AuthContext";
import { CurrencyProvider } from "./context/CurrencyContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CurrencyProvider>
          <CartProvider>
            <WishlistProvider>
              <AuthProvider>
                <Header />
                {children}
                <Footer />
              </AuthProvider>
            </WishlistProvider>
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
