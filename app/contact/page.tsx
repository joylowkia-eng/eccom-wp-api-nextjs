'use client';

import PageHeader from '@/components/PageHeader';

export default function ContactPage() {
    return (
        <main className="min-h-screen pt-32 pb-[var(--spacing-2xl)] bg-[#FFF8F0]">
            <div className="container">
                <PageHeader
                    title="Get in Touch"
                    subtitle="We'd love to hear from you. Have a question about our products?"
                />

                <div className="max-w-5xl mx-auto bg-white rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row">
                    {/* Contact Info Sidebar */}
                    <div className="bg-[#2C2C2C] text-white p-[var(--spacing-xl)] md:w-1/3 flex flex-col justify-between">
                        <div>
                            <h3 className="font-display text-2xl font-bold mb-6 text-white">Contact Info</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <svg className="w-6 h-6 text-[#B76E79] mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                        <p className="font-semibold text-gray-200">Email Us</p>
                                        <p className="text-gray-400">hello@lumiere.com</p>
                                        <p className="text-gray-400">support@lumiere.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <svg className="w-6 h-6 text-[#B76E79] mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <div>
                                        <p className="font-semibold text-gray-200">Call Us</p>
                                        <p className="text-gray-400">+1 (555) 123-4567</p>
                                        <p className="text-gray-400">Mon-Fri, 9am - 6pm EST</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <svg className="w-6 h-6 text-[#B76E79] mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <div>
                                        <p className="font-semibold text-gray-200">Visit Us</p>
                                        <p className="text-gray-400">123 Luxury Lane</p>
                                        <p className="text-gray-400">New York, NY 10001</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h4 className="font-display font-bold text-xl mb-4 text-white">Follow Us</h4>
                            <div className="flex space-x-4">
                                {['Twitter', 'Instagram', 'Facebook'].map((social) => (
                                    <a href="#" key={social} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#B76E79] transition-colors">
                                        <span className="sr-only">{social}</span>
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10z" />
                                        </svg>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="p-[var(--spacing-xl)] md:w-2/3">
                        <h3 className="font-display text-2xl font-bold mb-6 text-[#2C2C2C]">Send us a Message</h3>
                        <form className="space-y-[var(--spacing-md)]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-md)]">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[#2C2C2C]">First Name</label>
                                    <input type="text" className="w-full px-4 py-3 bg-[#F9F9F9] border border-transparent rounded-lg focus:bg-white focus:border-[#B76E79] focus:ring-4 focus:ring-[#FFE5E5] transition-all outline-none" placeholder="Jane" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[#2C2C2C]">Last Name</label>
                                    <input type="text" className="w-full px-4 py-3 bg-[#F9F9F9] border border-transparent rounded-lg focus:bg-white focus:border-[#B76E79] focus:ring-4 focus:ring-[#FFE5E5] transition-all outline-none" placeholder="Doe" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#2C2C2C]">Email Address</label>
                                <input type="email" className="w-full px-4 py-3 bg-[#F9F9F9] border border-transparent rounded-lg focus:bg-white focus:border-[#B76E79] focus:ring-4 focus:ring-[#FFE5E5] transition-all outline-none" placeholder="jane@example.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#2C2C2C]">Subject</label>
                                <select className="w-full px-4 py-3 bg-[#F9F9F9] border border-transparent rounded-lg focus:bg-white focus:border-[#B76E79] focus:ring-4 focus:ring-[#FFE5E5] transition-all outline-none text-[#2C2C2C]">
                                    <option>General Inquiry</option>
                                    <option>Order Support</option>
                                    <option>Product Question</option>
                                    <option>Partnership</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#2C2C2C]">Message</label>
                                <textarea rows={5} className="w-full px-4 py-3 bg-[#F9F9F9] border border-transparent rounded-lg focus:bg-white focus:border-[#B76E79] focus:ring-4 focus:ring-[#FFE5E5] transition-all outline-none resize-none" placeholder="How can we help you?"></textarea>
                            </div>
                            <button type="submit" className="btn-primary w-full md:w-auto">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
