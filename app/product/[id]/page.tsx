'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import { useWishlist } from '@/app/context/WishlistContext';
import { useCurrency } from '@/app/context/CurrencyContext';
import { getProduct, getProductVariations, mapWooCommerceProduct } from '@/lib/woocommerce';
import NextImage from 'next/image';

export default function ProductPage() {
    const params = useParams();
    const productId = params.id as string;
    const { formatPrice } = useCurrency();

    const [product, setProduct] = useState<any>(null);
    const [variations, setVariations] = useState<any[]>([]);
    const [groupedProducts, setGroupedProducts] = useState<any[]>([]);
    const [groupedQuantities, setGroupedQuantities] = useState<Record<number, number>>({});
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
    const [selectedVariation, setSelectedVariation] = useState<any>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            try {
                const wcProduct = await getProduct(parseInt(productId));

                if (wcProduct) {
                    const mapped = mapWooCommerceProduct(wcProduct);

                    // Fetch additional data in parallel
                    const promises: Promise<any>[] = [];
                    if (wcProduct.type === 'variable') {
                        promises.push(getProductVariations(wcProduct.id));
                    } else {
                        promises.push(Promise.resolve([]));
                    }

                    if (wcProduct.type === 'grouped') {
                        const childIds = wcProduct.grouped_products || [];
                        promises.push(Promise.all(childIds.map((id: number) => getProduct(id))));
                    } else {
                        promises.push(Promise.resolve([]));
                    }

                    const [wcVariations, children] = await Promise.all(promises);

                    setProduct({
                        ...mapped,
                        description: (wcProduct.description || ''),
                        short_description: (wcProduct.short_description || '').replace(/<[^>]*>/g, ''),
                        images: wcProduct.images?.map((img: any) => img.src) || [],
                        reviews: wcProduct.rating_count || 0,
                        features: wcProduct.meta_data?.find((m: any) => m.key === '_product_features')?.value || [
                            'Premium quality ingredients',
                            'Dermatologically tested',
                            'Suitable for all skin types',
                            'Cruelty-free'
                        ],
                        ingredients: wcProduct.meta_data?.find((m: any) => m.key === '_product_ingredients')?.value || 'Ingredients available on packaging.'
                    });

                    if (wcVariations) setVariations(wcVariations);

                    if (children) {
                        const mappedChildren = children.filter((c: any) => c).map((c: any) => mapWooCommerceProduct(c));
                        setGroupedProducts(mappedChildren);
                        const initQtys: Record<number, number> = {};
                        mappedChildren.forEach((child: any) => {
                            initQtys[child.id] = 0;
                        });
                        setGroupedQuantities(initQtys);
                    }
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, [productId]);

    // Handle attribute selection
    const handleAttributeSelect = (attrName: string, value: string) => {
        const newSelected = { ...selectedAttributes, [attrName]: value };
        setSelectedAttributes(newSelected);

        // Find matching variation
        if (product.type === 'variable') {
            const matching = variations.find(v =>
                v.attributes.every((attr: any) => {
                    // Match if attribute option matches exactly or if the variation attribute is empty (means "Any...")
                    return !attr.option || newSelected[attr.name] === attr.option;
                })
            );
            setSelectedVariation(matching || null);

            if (matching && matching.image && matching.image.src) {
                // If the variation has a specific image, display it (or at least add it to the list if not present)
                const varImgIndex = product.images.indexOf(matching.image.src);
                if (varImgIndex > -1) {
                    setSelectedImage(varImgIndex);
                }
            }
        }
    };

    const handleGroupedQuantityChange = (id: number, change: number) => {
        setGroupedQuantities(prev => ({
            ...prev,
            [id]: Math.max(0, (prev[id] || 0) + change)
        }));
    };

    const isWishlisted = product ? isInWishlist(product.id) : false;

    const currentPrice = selectedVariation ? parseFloat(selectedVariation.price) : product?.price;
    const currentOnSale = selectedVariation ? selectedVariation.on_sale : product?.onSale;
    const currentRegularPrice = selectedVariation ? parseFloat(selectedVariation.regular_price) : product?.price;
    const currentInStock = selectedVariation ? selectedVariation.stock_status === 'instock' : product?.inStock;


    const handleAddToCart = () => {
        if (!product) return;

        if (product.type === 'variable') {
            if (!selectedVariation) {
                alert('Please select all options before adding to cart.');
                return;
            }
            addToCart({
                id: product.id,
                variationId: selectedVariation.id,
                name: `${product.name} - ${selectedVariation.attributes.map((a: any) => a.option).join(', ')}`,
                price: currentPrice,
                image: selectedVariation.image?.src || product.images[0],
                quantity: quantity,
                selectedAttributes: selectedVariation.attributes
            });
        } else if (product.type === 'grouped') {
            const itemsToAdd = Object.entries(groupedQuantities).filter(([_, qty]) => qty > 0);
            if (itemsToAdd.length === 0) {
                alert('Please select at least one item.');
                return;
            }

            itemsToAdd.forEach(([idStr, qty]) => {
                const childId = parseInt(idStr);
                const child = groupedProducts.find(p => p.id === childId);
                if (child) {
                    addToCart({
                        id: child.id,
                        name: child.name,
                        price: child.price,
                        image: child.image,
                        quantity: qty
                    });
                }
            });
            alert('Items added to cart.');
        } else {
            addToCart({
                id: product.id,
                name: product.name,
                price: currentPrice,
                image: product.images[0],
                quantity: quantity
            });
        }
    };

    const toggleWishlist = () => {
        if (!product) return;
        if (isWishlisted) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                category: product.category,
                rating: product.rating,
                inStock: product.inStock,
                isNew: product.isNew,
                onSale: product.onSale,
                salePrice: product.salePrice,
            });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B76E79]"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen pt-32 text-center">
                <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
                <Link href="/shop" className="btn-primary inline-block">Back to Shop</Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen pt-32 pb-[var(--spacing-2xl)]">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="mb-[var(--spacing-lg)] flex items-center gap-2 text-sm text-[#9E9E9E]">
                    <Link href="/" className="hover:text-[#B76E79] transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/shop" className="hover:text-[#B76E79] transition-colors">Shop</Link>
                    <span>/</span>
                    <Link href={`/category/${product.category?.toLowerCase()}`} className="hover:text-[#B76E79] transition-colors">
                        {product.category}
                    </Link>
                    <span>/</span>
                    <span className="text-[#2C2C2C]">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--spacing-md)] mb-[var(--spacing-2xl)] bg-white p-[var(--spacing-lg)] md:p-[var(--spacing-xl)] rounded-3xl shadow-sm">
                    {/* Product Images */}
                    <div>
                        <div className="mb-4 rounded-2xl overflow-hidden bg-[#F5F5F5] aspect-square relative">
                            <NextImage
                                src={product.images[selectedImage]}
                                alt={product.name}
                                fill
                                className="object-cover transition-all duration-500"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                priority
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.map((image: string, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`rounded-xl overflow-hidden aspect-square ${selectedImage === index
                                        ? 'ring-4 ring-[#B76E79]'
                                        : 'ring-2 ring-transparent hover:ring-[#D4A5A5]'
                                        } transition-all duration-300`}
                                >
                                    <div className="w-full h-full relative">
                                        <NextImage
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 25vw, 150px"
                                        />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col justify-center">
                        <div className="mb-6">
                            <span className="inline-block px-4 py-1 bg-[#FFE5E5] text-[#B76E79] text-sm font-semibold rounded-full mb-4">
                                {product.category}
                            </span>
                            <h1 className="font-display text-4xl md:text-5xl font-bold text-[#2C2C2C] mb-4">
                                {product.name}
                            </h1>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-5 h-5 ${i < product.rating ? 'text-[#D4AF37]' : 'text-gray-300'
                                            }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-[#9E9E9E]">({product.reviews} reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-4 mb-8">
                            {product.type === 'variable' && !selectedVariation ? (
                                <span className="text-3xl font-bold text-[#B76E79]">
                                    {formatPrice(product.price_html.replace(/<[^>]*>/g, ''))}
                                </span>
                            ) : currentOnSale ? (
                                <>
                                    <span className="text-4xl font-bold text-[#B76E79]">
                                        {formatPrice(currentPrice)}
                                    </span>
                                    <span className="text-2xl text-gray-400 line-through">
                                        {formatPrice(currentRegularPrice)}
                                    </span>
                                </>
                            ) : (
                                <span className="text-4xl font-bold text-[#B76E79]">
                                    {product.type === 'grouped' ? 'From ' : ''}
                                    {formatPrice(currentPrice)}
                                </span>
                            )}
                        </div>

                        {/* Grouped Products Selection */}
                        {product.type === 'grouped' && (
                            <div className="space-y-4 mb-8 bg-[#F9F9F9] p-4 rounded-2xl border border-[#FFE5E5]">
                                <h3 className="text-sm font-bold text-[#2C2C2C] uppercase tracking-wider mb-2">Included Products</h3>
                                {groupedProducts.map((child) => (
                                    <div key={child.id} className="flex items-center justify-between gap-4 p-2 bg-white rounded-xl shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 relative flex-shrink-0">
                                                <NextImage src={child.image} alt={child.name} fill className="object-cover rounded-md" sizes="48px" />
                                            </div>
                                            <div>
                                                <Link href={`/product/${child.id}`} className="font-semibold text-sm hover:text-[#B76E79]">{child.name}</Link>
                                                <p className="text-xs text-[#B76E79] font-bold">{formatPrice(child.price)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center border border-[#FFE5E5] rounded-lg bg-[#F9F9F9]">
                                            <button
                                                onClick={() => handleGroupedQuantityChange(child.id, -1)}
                                                className="px-2 py-1 hover:bg-[#FFE5E5] transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="px-3 py-1 text-sm font-semibold min-w-[2rem] text-center">
                                                {groupedQuantities[child.id] || 0}
                                            </span>
                                            <button
                                                onClick={() => handleGroupedQuantityChange(child.id, 1)}
                                                className="px-2 py-1 hover:bg-[#FFE5E5] transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Variations Selection */}
                        {product.type === 'variable' && (
                            <div className="space-y-6 mb-8">
                                {product.attributes.filter((attr: any) => attr.variation).map((attr: any) => (
                                    <div key={attr.id} className="space-y-3">
                                        <label className="text-sm font-bold text-[#2C2C2C] uppercase tracking-wider">
                                            {attr.name}
                                        </label>
                                        <div className="flex flex-wrap gap-3">
                                            {attr.options.map((option: string) => (
                                                <button
                                                    key={option}
                                                    onClick={() => handleAttributeSelect(attr.name, option)}
                                                    className={`px-5 py-2.5 rounded-full border-2 transition-all font-medium ${selectedAttributes[attr.name] === option
                                                        ? 'border-[#B76E79] bg-[#B76E79] text-white shadow-md'
                                                        : 'border-[#FFE5E5] text-[#2C2C2C] hover:border-[#B76E79]'
                                                        }`}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Description */}
                        <p className="text-[#2C2C2C]/80 mb-8 leading-relaxed text-lg italic">
                            {product.short_description || product.description.substring(0, 150) + '...'}
                        </p>

                        {/* Stock Status */}
                        <div className="mb-6">
                            {currentInStock ? (
                                <span className="flex items-center gap-2 text-green-600 font-medium">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    In Stock
                                </span>
                            ) : (
                                <span className="flex items-center gap-2 text-red-600 font-medium">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    Out of Stock
                                </span>
                            )}
                        </div>

                        {/* Quantity Selector */}
                        {product.type !== 'grouped' && (
                            <div className="mb-8">
                                <label className="block text-sm font-semibold text-[#2C2C2C] mb-3">
                                    Quantity
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border-2 border-[#FFE5E5] rounded-lg overflow-hidden bg-white">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-4 py-2 hover:bg-[#FFE5E5] transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="px-6 py-2 font-semibold min-w-[3rem] text-center">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="px-4 py-2 hover:bg-[#FFE5E5] transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <button
                                onClick={handleAddToCart}
                                disabled={!currentInStock}
                                className={`flex-1 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-95 transition-all h-14 ${currentInStock ? 'btn-primary' : 'bg-gray-300 text-gray-500 cursor-not-allowed rounded-xl py-3 font-semibold'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                    />
                                </svg>
                                {currentInStock ? 'Add to Cart' : 'Out of Stock'}
                            </button>

                            {/* Wishlist Button */}
                            <button
                                onClick={toggleWishlist}
                                className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all border-2 ${isWishlisted ? 'bg-[#FFE5E5] text-[#B76E79] border-[#B76E79]' : 'border-[#FFE5E5] text-gray-400 hover:text-[#B76E79] hover:bg-[#FFF5F5]'}`}
                                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill={isWishlisted ? "currentColor" : "none"}
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="mb-20">
                    <div className="flex gap-4 mb-8 border-b border-[#FFE5E5] overflow-x-auto">
                        {['description', 'features', 'ingredients'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 font-semibold capitalize transition-all duration-300 whitespace-nowrap ${activeTab === tab
                                    ? 'text-[#B76E79] border-b-2 border-[#B76E79]'
                                    : 'text-[#9E9E9E] hover:text-[#B76E79]'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-sm">
                        {activeTab === 'description' && (
                            <div className="animate-fade-in">
                                <h3 className="font-display text-2xl font-bold mb-4">Product Description</h3>
                                <div className="text-[#2C2C2C]/80 leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{ __html: product.description }}></div>
                            </div>
                        )}
                        {activeTab === 'features' && (
                            <div className="animate-fade-in">
                                <h3 className="font-display text-2xl font-bold mb-4">Key Features</h3>
                                <ul className="space-y-4">
                                    {(Array.isArray(product.features) ? product.features : []).map((feature: string, index: number) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-[#FFE5E5] flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <svg className="w-4 h-4 text-[#B76E79]" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="text-[#2C2C2C]/80">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {activeTab === 'ingredients' && (
                            <div className="animate-fade-in">
                                <h3 className="font-display text-2xl font-bold mb-4">Ingredients</h3>
                                <p className="text-[#2C2C2C]/80 leading-relaxed bg-[#F9F9F9] p-6 rounded-2xl">{product.ingredients}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}