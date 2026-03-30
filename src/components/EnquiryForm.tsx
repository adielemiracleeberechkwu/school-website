import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, MessageSquare, Sparkles, Loader2, HelpCircle, CheckCircle2, Clock, CheckCircle, Calendar } from 'lucide-react';
import Markdown from 'react-markdown';
import { getSchoolEnquiryResponse } from '../services/geminiService';
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile, Enquiry, TourBooking } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface EnquiryFormProps {
  profile: UserProfile;
}

import TourBookingModal from './TourBookingModal';

export default function EnquiryForm({ profile }: EnquiryFormProps) {
  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [aiResponse, setAiResponse] = React.useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = React.useState(false);
  const [myEnquiries, setMyEnquiries] = useState<Enquiry[]>([]);
  const [tourBookings, setTourBookings] = useState<TourBooking[]>([]);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);

  const isAdmin = profile.email === 'adielemiracleebere@gmail.com';

  useEffect(() => {
    // If admin, fetch all enquiries. If user, fetch only their own.
    const qEnquiries = isAdmin 
      ? query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'))
      : query(
          collection(db, 'enquiries'),
          where('userId', '==', profile.email),
          orderBy('createdAt', 'desc')
        );

    const unsubEnquiries = onSnapshot(qEnquiries, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Enquiry[];
      setMyEnquiries(data);
    });

    // Fetch tour bookings for admin
    let unsubTours = () => {};
    if (isAdmin) {
      const qTours = query(collection(db, 'tour_bookings'), orderBy('createdAt', 'desc'));
      unsubTours = onSnapshot(qTours, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as TourBooking[];
        setTourBookings(data);
      });
    }

    return () => {
      unsubEnquiries();
      unsubTours();
    };
  }, [profile.email, isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'enquiries'), {
        userId: profile.email,
        userEmail: profile.email,
        userName: profile.name,
        regNumber: profile.regNumber,
        message: message,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      setSubmitted(true);
      setMessage('');
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      alert("Failed to submit enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: 'pending' | 'completed') => {
    try {
      const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
      await updateDoc(doc(db, 'enquiries', id), {
        status: newStatus
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const toggleTourStatus = async (id: string, currentStatus: 'pending' | 'completed') => {
    try {
      const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
      await updateDoc(doc(db, 'tour_bookings', id), {
        status: newStatus
      });
    } catch (error) {
      console.error("Error updating tour status:", error);
    }
  };

  const handleAiAsk = async () => {
    if (!message.trim()) return;
    
    setIsAiLoading(true);
    setAiResponse(null);
    
    const response = await getSchoolEnquiryResponse(message);
    setAiResponse(response);
    setIsAiLoading(false);
  };

  return (
    <section id="enquiry" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Submit an Enquiry</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Logged in as <span className="font-semibold text-indigo-600">{profile.name}</span> ({profile.email}). 
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
                <button 
                  onClick={() => setIsTourModalOpen(true)}
                  className="px-6 py-3 bg-white text-indigo-900 rounded-full font-bold hover:bg-indigo-50 transition-colors"
                >
                  Book a Tour
                </button>
              </div>
              <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-64 h-64 bg-indigo-800 rounded-full blur-3xl opacity-50" />
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-50 p-8 lg:p-10 rounded-3xl border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" /> Your Message
                    </label>
                    <button
                      type="button"
                      onClick={handleAiAsk}
                      disabled={isAiLoading || !message.trim()}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 disabled:opacity-50"
                    >
                      {isAiLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                      Ask AI Assistant
                    </button>
                  </div>
                  <textarea
                    required
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="How can we help you today?"
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

                <AnimatePresence>
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 text-green-700"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="text-sm font-medium">Enquiry submitted successfully! We'll get back to you soon.</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
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

            {/* My Enquiries Section - Only visible to Admin */}
            {isAdmin && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-indigo-600" /> Task Management
                </h3>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  <AnimatePresence mode="popLayout">
                    {myEnquiries.length > 0 ? (
                      myEnquiries.map((enquiry) => (
                        <motion.div
                          key={enquiry.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className={cn(
                            "p-4 rounded-xl border transition-all flex items-center justify-between gap-4",
                            enquiry.status === 'completed' 
                              ? "bg-green-50 border-green-200 text-green-800" 
                              : "bg-white border-gray-100 text-gray-700 shadow-sm"
                          )}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                                {enquiry.userName || 'User'}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {enquiry.regNumber}
                              </span>
                            </div>
                            <p className="text-sm line-clamp-2">{enquiry.message}</p>
                            <span className="text-[10px] opacity-60 mt-1 block">
                              {enquiry.createdAt instanceof Timestamp ? enquiry.createdAt.toDate().toLocaleDateString() : 'Just now'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={cn(
                              "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                              enquiry.status === 'completed' ? "bg-green-200 text-green-700" : "bg-gray-100 text-gray-500"
                            )}>
                              {enquiry.status}
                            </span>
                            <button
                              onClick={() => toggleStatus(enquiry.id, enquiry.status)}
                              className={cn(
                                "p-1.5 rounded-md transition-colors border",
                                enquiry.status === 'completed'
                                  ? "bg-green-600 border-green-600 text-white"
                                  : "bg-white border-gray-200 text-gray-300 hover:border-indigo-500 hover:text-indigo-500"
                              )}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400 text-sm italic">
                        No enquiries found.
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Tour Management Section - Only visible to Admin */}
            {isAdmin && (
              <div className="space-y-4 mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-600" /> Tour Management
                </h3>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  <AnimatePresence mode="popLayout">
                    {tourBookings.length > 0 ? (
                      tourBookings.map((tour) => (
                        <motion.div
                          key={tour.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className={cn(
                            "p-4 rounded-xl border transition-all flex items-center justify-between gap-4",
                            tour.status === 'completed' 
                              ? "bg-green-50 border-green-200 text-green-800" 
                              : "bg-white border-gray-100 text-gray-700 shadow-sm"
                          )}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                                {tour.userName}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {tour.regNumber}
                              </span>
                            </div>
                            <p className="text-sm font-semibold">
                              Tour on: {new Date(tour.tourDate).toLocaleDateString()} ({tour.tourDay})
                            </p>
                            <span className="text-[10px] opacity-60 mt-1 block">
                              Booked: {tour.createdAt instanceof Timestamp ? tour.createdAt.toDate().toLocaleDateString() : 'Just now'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={cn(
                              "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                              tour.status === 'completed' ? "bg-green-200 text-green-700" : "bg-gray-100 text-gray-500"
                            )}>
                              {tour.status}
                            </span>
                            <button
                              onClick={() => toggleTourStatus(tour.id, tour.status)}
                              className={cn(
                                "p-1.5 rounded-md transition-colors border",
                                tour.status === 'completed'
                                  ? "bg-green-600 border-green-600 text-white"
                                  : "bg-white border-gray-200 text-gray-300 hover:border-indigo-500 hover:text-indigo-500"
                              )}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400 text-sm italic">
                        No tour bookings found.
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <TourBookingModal 
        isOpen={isTourModalOpen} 
        onClose={() => setIsTourModalOpen(false)} 
        profile={profile} 
      />
    </section>
  );
}
