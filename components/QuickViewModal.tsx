'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import { useWishlist } from '@/app/context/WishlistContext';
import { useCurrency } from '@/app/context/CurrencyContext';
import { getProduct, getProductVariations, mapWooCommerceProduct } from '@/lib/woocommerce';
import NextImage from 'next/image';

interface QuickViewModalProps {
    productId: number;
    isOpen: boolean;
    onClose: () => void;
}

export default function QuickViewModal({ productId, isOpen, onClose }: QuickViewModalProps) {
    const { formatPrice } = useCurrency();
    const [product, setProduct] = useState<any>(null);
    const [variations, setVariations] = useState<any[]>([]);
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
    const [selectedVariation, setSelectedVariation] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    useEffect(() => {
        if (!isOpen || !productId) return;

        async function loadProductData() {
            setIsLoading(true);
            try {
                const wcProduct = await getProduct(productId);

                if (wcProduct) {
                    const mapped = mapWooCommerceProduct(wcProduct);
                    setProduct({
                        ...mapped,
                        description: (wcProduct.description || '').replace(/<[^>]*>/g, ''),
                        short_description: (wcProduct.short_description || '').replace(/<[^>]*>/g, ''),
                        images: wcProduct.images?.map((img: any) => img.src) || []
                    });

                    if (wcProduct.type === 'variable') {
                        const wcVariations = await getProductVariations(wcProduct.id);
                        setVariations(wcVariations);
                    }
                }
            } catch (error) {
                console.error('Error in QuickView:', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadProductData();
    }, [productId, isOpen]);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    const handleAttributeSelect = (attrName: string, value: string) => {
        const newSelected = { ...selectedAttributes, [attrName]: value };
        setSelectedAttributes(newSelected);

        if (product.type === 'variable') {
            const matching = variations.find(v =>
                v.attributes.every((attr: any) => !attr.option || newSelected[attr.name] === attr.option)
            );
            setSelectedVariation(matching || null);
            if (matching?.image?.src) {
                const idx = product.images.indexOf(matching.image.src);
                if (idx > -1) setSelectedImage(idx);
            }
        }
    };

    const handleAddToCart = () => {
        if (!product) return;

        if (product.type === 'variable') {
            if (!selectedVariation) {
                alert('Please select options');
                return;
            }
            addToCart({
                id: product.id,
                variationId: selectedVariation.id,
                name: `${product.name} - ${selectedVariation.attributes.map((a: any) => a.option).join(', ')}`,
                price: parseFloat(selectedVariation.price),
                image: selectedVariation.image?.src || product.images[0],
                quantity,
                selectedAttributes: selectedVariation.attributes
            });
        } else {
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                quantity
            });
        }
        onClose();
    };


    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-scale-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {isLoading ? (
                    <div className="w-full h-96 flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-[#B76E79] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : product ? (
                    <>
                        {/* Image Slider */}
                        <div className="w-full md:w-1/2 h-full min-h-[400px] bg-[#F9F9F9] relative flex-shrink-0">
                            <NextImage
                                src={product.images[selectedImage]}
                                alt={product.name}
                                fill
                                className="object-cover animate-fade-in"
                                sizes="(max-width: 768px) 100vw, 500px"
                                priority
                            />
                            {product.images.length > 1 && (
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                                    {product.images.map((_: any, i: number) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedImage(i)}
                                            className={`w-2 h-2 rounded-full transition-all ${selectedImage === i ? 'bg-[#B76E79] w-4' : 'bg-gray-300'}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="w-full md:w-1/2 p-8 overflow-y-auto">
                            <span className="text-[#B76E79] text-sm font-semibold uppercase tracking-wider">{product.category}</span>
                            <h2 className="font-display text-3xl font-bold text-[#2C2C2C] mt-2 mb-4 leading-tight">{product.name}</h2>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="text-2xl font-bold text-[#B76E79]">
                                    {selectedVariation ? formatPrice(parseFloat(selectedVariation.price)) : formatPrice(product.price)}
                                </div>
                                {product.onSale && !selectedVariation && (
                                    <div className="bg-[#FFE5E5] text-[#B76E79] px-3 py-1 rounded-full text-xs font-bold">SALE</div>
                                )}
                            </div>

                            <p className="text-gray-600 text-sm leading-relaxed mb-8 line-clamp-3">
                                {product.short_description || product.description}
                            </p>

                            {/* Options */}
                            {product.type === 'variable' && (
                                <div className="space-y-6 mb-8">
                                    {product.attributes.map((attr: any) => (
                                        <div key={attr.id}>
                                            <h4 className="text-sm font-bold text-[#2C2C2C] mb-3">{attr.name}</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {attr.options.map((option: string) => (
                                                    <button
                                                        key={option}
                                                        onClick={() => handleAttributeSelect(attr.name, option)}
                                                        className={`px-4 py-2 text-sm rounded-full border transition-all ${selectedAttributes[attr.name] === option
                                                            ? 'bg-[#2C2C2C] text-white border-[#2C2C2C]'
                                                            : 'border-[#EEE] text-[#2C2C2C] hover:border-[#B76E79]'
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

                            {/* Add to Cart Area */}
                            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center border border-gray-200 rounded-full">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center hover:text-[#B76E79]"
                                    > - </button>
                                    <span className="w-8 text-center font-bold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 flex items-center justify-center hover:text-[#B76E79]"
                                    > + </button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 btn-primary py-3 rounded-full shadow-lg shadow-[#B76E79]/20"
                                >
                                    Add to Bag
                                </button>
                            </div>

                            <Link
                                href={`/product/${product.id}`}
                                className="block text-center mt-6 text-sm text-[#9E9E9E] hover:text-[#B76E79] transition-colors font-medium underline underline-offset-4"
                            >
                                View Full Details
                            </Link>
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
}
