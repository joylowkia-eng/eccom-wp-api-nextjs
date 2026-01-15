export default function PageHeader({
    title,
    subtitle,
    className = ""
}: {
    title: string;
    subtitle?: string;
    className?: string;
}) {
    return (
        <div className={`text-center mb-[var(--spacing-2xl)] ${className}`}>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 gradient-text">
                {title}
            </h1>
            {subtitle && (
                <p className="text-lg text-[#9E9E9E] max-w-2xl mx-auto">
                    {subtitle}
                </p>
            )}
        </div>
    );
}
