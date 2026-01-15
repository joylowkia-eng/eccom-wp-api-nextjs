export default function PaymentIcons() {
    return (
        <div className="flex items-center gap-2">
            {/* Visa */}
            <div className="w-10 h-6 bg-white border border-gray-200 rounded px-1 flex items-center justify-center">
                <svg viewBox="0 0 48 48" className="w-full h-full">
                    <path fill="#00579f" d="M17.4,6.4h7.9l-5,31.4h-7.9L17.4,6.4z M33.8,6.4h-5c-3.1,0-5.4,1.7-6.3,3.9 l-10.7,25h-5.4l8.3-28.9H7.1C3.6,6.4,2,8,2,8l0.4,1.8l0.4,0.1c4.8,1.2,10.2,4.3,13.4,8L10.3,37.8h8.4l1.3-6.6 c1.6,4.3,6.5,6.6,11.8,6.6c11.5,0,16.2-10,16.2-16.1C48,11.7,40.9,6.4,33.8,6.4z" />
                    <path fill="#f2a900" d="M22.6,23.6l1.7-8.3c-2.4-0.9-4.8-1.4-7.3-1.4c-8.1,0-13.8,4.3-13.9,10.4c-0.1,4.5,4,7.1,7.1,8.6 c3.1,1.5,4.2,2.5,4.2,3.9c0,2.1-2.5,3-4.8,3c-3.2,0-6.1-1.3-9-3l-1.9,8.9c3,1.4,8.5,2.6,11.8,2.6c8.7,0,14.4-4.3,14.5-10.9 C24.9,33.8,21.4,31.4,18.1,29.8C15,28.3,14,27.3,14,25.9C14,23.8,16.6,23,18.9,23C21,22.9,22.6,23.6,22.6,23.6z" />
                </svg>
            </div>

            {/* Mastercard */}
            <div className="w-10 h-6 bg-white border border-gray-200 rounded px-1 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                    <circle cx="9" cy="12" r="7" fill="#eb001b" />
                    <circle cx="15" cy="12" r="7" fill="#f79e1b" opacity="0.8" />
                </svg>
            </div>

            {/* PayPal */}
            <div className="w-10 h-6 bg-white border border-gray-200 rounded px-1 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                    <path fill="#003087" d="M9.6,2L8.2,15.1h3.3l0.4-3.5h2.8c3.9,0,6.5-1.9,7.2-5.7c0.2-1.3,0.1-2.4-0.4-3.3C20.8,3.7,19.2,2,16.5,2H9.6z" />
                    <path fill="#009cde" d="M7.8,22l0.4-3.7l0-0.3l0.9-8.7h3.3l-0.8,5.1l-0.3,1.6l-0.5,3h-3V22z" />
                    <path fill="#012169" d="M9.6,2L8.2,15.1h3.3l0.4-3.5h2.8c3.9,0,6.5-1.9,7.2-5.7l0,0c1.2-5.7-2.6-9.9-8.4-9.9H9.6z" />
                </svg>
            </div>

            {/* Amex */}
            <div className="w-10 h-6 bg-[#006fcf] border border-[#006fcf] rounded px-1 flex items-center justify-center overflow-hidden">
                <span className="text-[8px] font-bold text-white tracking-tighter">AMEX</span>
            </div>
        </div>
    );
}
