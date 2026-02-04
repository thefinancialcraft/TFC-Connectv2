import { useState } from 'react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Does Rynxly replace my current phone system?",
      a: "No, Rynxly works WITH your existing Android phones. It installs on your agents' mobile devices and bridges the call data to the cloud. You don't need expensive VoIP hardware."
    },
    {
      q: "Is my customer data secure?",
      a: "Absolutely. We use enterprise-grade encryption. Plus, you can mask customer numbers so agents never see the actual 10-digit phone number, preventing data theft."
    },
    {
      q: "Can I customize the 'Lead Status' options?",
      a: "Yes! You can create custom dispositions like 'Interested', 'Call Back Later', 'Site Visit Scheduled', etc., to match your specific sales workflow."
    },
    {
      q: "Does it record calls?",
      a: "Yes, Rynxly syncs call recordings from the mobile device to the dashboard (permissions required), allowing managers to review quality and coach agents."
    },
    {
      q: "How many agents can I add?",
      a: "There is no limit. Rynxly scales from teams of 5 to call centers with 500+ agents easily."
    }
  ];

  return (
    <div className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
            {faqs.map((faq, idx) => (
                <div key={idx} className="border border-gray-200 rounded-2xl overflow-hidden transition-all hover:border-indigo-200">
                    <button 
                        onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                        className="w-full text-left px-6 py-5 bg-white flex items-center justify-between font-bold text-gray-800 focus:outline-none"
                    >
                        <span>{faq.q}</span>
                        <i className={`fi fi-rr-angle-small-down transform transition-transform text-xl text-gray-400 ${openIndex === idx ? 'rotate-180 text-[#4b33e8]' : ''}`}></i>
                    </button>
                    <div 
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === idx ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                        <div className="px-6 pb-6 pt-0 text-gray-500 leading-relaxed border-t border-gray-50">
                            {faq.a}
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Query / Contact Card */}
        <div className="mt-20 bg-[#4b33e8] rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
            {/* Background Circles */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>

            <h3 className="text-2xl md:text-3xl font-bold mb-4 relative z-10">Still have questions?</h3>
            <p className="text-indigo-100 mb-8 max-w-xl mx-auto relative z-10">
                Our support team is ready to help you set up your perfect calling workflow. Book a free 30-minute demo today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                <button className="px-8 py-3 bg-white text-[#4b33e8] font-bold rounded-full hover:bg-indigo-50 transition-colors shadow-xl">
                    Book a Live Demo
                </button>
                <button className="px-8 py-3 bg-transparent border border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors">
                    Contact Sales
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
