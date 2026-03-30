import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, MessageSquare, Sparkles, Loader2, User, Mail, HelpCircle } from 'lucide-react';
import Markdown from 'react-markdown';
import { getSchoolEnquiryResponse } from '../services/geminiService';

export default function EnquiryForm() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [aiResponse, setAiResponse] = React.useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    alert("Thank you for your enquiry! Our team will get back to you shortly.");
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleAiAsk = async () => {
    if (!formData.message.trim()) return;
    
    setIsAiLoading(true);
    setAiResponse(null);
    
    const response = await getSchoolEnquiryResponse(formData.message);
    setAiResponse(response);
    setIsAiLoading(false);
  };

  return (
    <section id="enquiry" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Make an Enquiry</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Have questions about admissions, curriculum, or school life? 
              Fill out the form below or chat with our AI Assistant for instant answers.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-50 rounded-xl">
                  <Sparkles className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">AI Assistant</h4>
                  <p className="text-sm text-gray-600">Get instant answers to common questions about our school.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-50 rounded-xl">
                  <MessageSquare className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Direct Support</h4>
                  <p className="text-sm text-gray-600">Our administrative team responds to all enquiries within 24 hours.</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-8 bg-indigo-900 rounded-3xl text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Visit Our Campus</h3>
                <p className="text-indigo-100 mb-6">
                  Experience our world-class facilities firsthand. Schedule a campus tour today.
                </p>
                <button className="px-6 py-3 bg-white text-indigo-900 rounded-full font-bold hover:bg-indigo-50 transition-colors">
                  Book a Tour
                </button>
              </div>
              <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-64 h-64 bg-indigo-800 rounded-full blur-3xl opacity-50" />
            </div>
          </div>

          <div className="bg-gray-50 p-8 lg:p-10 rounded-3xl border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" /> Subject
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="Admissions Enquiry"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-gray-700">Your Message</label>
                  <button
                    type="button"
                    onClick={handleAiAsk}
                    disabled={isAiLoading || !formData.message.trim()}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 disabled:opacity-50"
                  >
                    {isAiLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                    Ask AI Assistant
                  </button>
                </div>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <AnimatePresence>
                {aiResponse && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl"
                  >
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs mb-2">
                      <Sparkles className="h-3 w-3" /> AI Assistant Response:
                    </div>
                    <div className="text-sm text-gray-700 prose prose-sm max-w-none">
                      <Markdown>{aiResponse}</Markdown>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" /> Submit Enquiry
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
