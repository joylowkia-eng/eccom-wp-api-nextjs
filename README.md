# Lumière - Premium Beauty E-Commerce Website

A modern, minimal, and creative beauty product e-commerce website built with Next.js 15, Tailwind CSS 4, and GSAP animations. Designed to integrate seamlessly with WordPress WooCommerce backend.

![Lumière Beauty](https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=400&fit=crop)

## ✨ Features

- **Modern & Minimal Design**: Elegant rose gold color palette with premium aesthetics
- **GSAP Animations**: Smooth, professional animations throughout the site
- **Fully Responsive**: Optimized for all devices (mobile, tablet, desktop)
- **WooCommerce Integration**: Ready to connect with your WordPress WooCommerce backend
- **TypeScript**: Type-safe code for better development experience
- **Tailwind CSS 4**: Latest version with custom design system
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Performance Focused**: Fast loading times and optimized images

## 🎨 Design Features

- **Custom Color Palette**: Rose gold, champagne, and elegant neutrals
- **Premium Typography**: Playfair Display for headings, Inter for body text
- **Glassmorphism Effects**: Modern glass-like UI elements
- **Smooth Transitions**: Carefully crafted hover effects and animations
- **Custom Scrollbar**: Branded scrollbar design
- **Image Zoom Effects**: Interactive product image displays

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- WordPress site with WooCommerce plugin activated
- WooCommerce REST API credentials

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure WooCommerce API**
   
   - Copy `env.example.txt` and create a `.env.local` file
   - Add your WooCommerce credentials:
   
   ```env
   NEXT_PUBLIC_WOOCOMMERCE_URL=https://your-wordpress-site.com
   NEXT_PUBLIC_WOOCOMMERCE_KEY=ck_your_consumer_key
   NEXT_PUBLIC_WOOCOMMERCE_SECRET=cs_your_consumer_secret
   ```

3. **Get WooCommerce API Credentials**
   
   - Log in to your WordPress admin panel
   - Go to **WooCommerce > Settings > Advanced > REST API**
   - Click **Add key**
   - Description: "Next.js Frontend"
   - User: Select your admin user
   - Permissions: **Read/Write**
   - Click **Generate API key**
   - Copy the **Consumer key** and **Consumer secret**

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
e-commerce/
├── app/
│   ├── layout.tsx          # Root layout with Header & Footer
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles & design system
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── Footer.tsx          # Site footer
│   ├── Hero.tsx            # Hero section with GSAP
│   ├── Categories.tsx      # Product categories
│   ├── FeaturedProducts.tsx # Featured products grid
│   ├── ProductCard.tsx     # Product card component
│   └── Newsletter.tsx      # Newsletter signup
├── lib/
│   └── woocommerce.ts      # WooCommerce API integration
└── public/                 # Static assets
```

## 🛠️ Technologies Used

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [GSAP](https://greensock.com/gsap/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Backend**: WordPress + WooCommerce
- **Fonts**: Google Fonts (Playfair Display, Inter)

## 🎯 Key Components

### Hero Section
- GSAP staggered animations
- Floating product showcase
- Call-to-action buttons
- Statistics display

### Product Cards
- Hover effects with image zoom
- Quick actions (wishlist, quick view)
- Rating display
- Sale badges
- Add to cart functionality

### Categories
- Scroll-triggered animations
- Interactive hover effects
- Gradient overlays
- Direct category navigation

### Newsletter
- Email subscription form
- Trust badges
- Gradient background
- Scroll animations

## 🔌 WooCommerce Integration

The site is ready to integrate with your WooCommerce backend. Key functions available in `lib/woocommerce.ts`:

- `getProducts()` - Fetch products with filters
- `getProduct(id)` - Get single product details
- `getCategories()` - Fetch product categories
- `createOrder()` - Create new orders
- `searchProducts()` - Search functionality

### Example Usage

```typescript
import { getProducts } from '@/lib/woocommerce';

// Fetch featured products
const products = await getProducts({ featured: true, per_page: 8 });

// Fetch products on sale
const saleProducts = await getProducts({ on_sale: true });

// Fetch products by category
const skincare = await getProducts({ category: 'skincare' });
```

## 🎨 Customization

### Colors
Edit `app/globals.css` to customize the color palette:

```css
:root {
  --color-rose-gold: #B76E79;
  --color-champagne: #F7E7CE;
  /* Add your custom colors */
}
```

### Fonts
Update Google Fonts import in `app/globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font&display=swap');
```

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The site can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean

## 📝 Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_WOOCOMMERCE_URL=https://your-site.com
NEXT_PUBLIC_WOOCOMMERCE_KEY=ck_xxxxx
NEXT_PUBLIC_WOOCOMMERCE_SECRET=cs_xxxxx
```

## 🤝 Contributing

Feel free to customize and extend this project for your needs!

## 📄 License

This project is open source and available for personal and commercial use.

## 🆘 Support

For issues or questions:
1. Check the WooCommerce API documentation
2. Review Next.js documentation
3. Check GSAP documentation for animation issues

## 🎉 Credits

- Design inspiration from modern beauty brands
- Images from Unsplash
- Icons from Heroicons

---

**Built with ❤️ for the beauty industry**
