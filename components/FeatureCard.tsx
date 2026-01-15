'use client';

import Link from 'next/link';

interface FeatureCardProps {
    image: string;
    title: string;
    description: string;
    href: string;
    linkText: string;
}

export default function FeatureCard({ image, title, description, href, linkText }: FeatureCardProps) {
    return (
        <Link href={href} className="group block h-full">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 h-full flex flex-col">
                <div className="aspect-[4/3] overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10"></div>
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                </div>
                <div className="p-[var(--spacing-lg)] flex-1 flex flex-col justify-between">
                    <div>
                        <h2 className="font-display text-2xl font-bold mb-2 text-[#2C2C2C] group-hover:text-[#B76E79] transition-colors">
                            {title}
                        </h2>
                        <p className="text-[#9E9E9E] mb-6">
                            {description}
                        </p>
                    </div>
                    <span className="inline-block w-fit px-4 py-2 bg-[#F9F9F9] rounded-full text-xs font-semibold tracking-wider uppercase text-[#2C2C2C] group-hover:bg-[#FFE5E5] group-hover:text-[#B76E79] transition-colors">
                        {linkText}
                    </span>
                </div>
            </div>
        </Link>
    );
}
