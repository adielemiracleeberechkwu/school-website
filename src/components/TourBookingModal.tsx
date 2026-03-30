import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../types';

interface TourBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export default function TourBookingModal({ isOpen, onClose, profile }: TourBookingModalProps) {
  const [date, setDate] = useState('');
  const [hasAdmission, setHasAdmission] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !hasAdmission) return;

    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Check if it's a weekend (school days are usually Mon-Fri)
    const dayNum = selectedDate.getDay();
    if (dayNum === 0 || dayNum === 6) {
      setError('Tours are only available on school days (Monday to Friday).');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await addDoc(collection(db, 'tour_bookings'), {
        userId: profile.email,
        userEmail: profile.email,
        userName: profile.name,
        regNumber: profile.regNumber,
        tourDate: date,
        tourDay: dayOfWeek,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setDate('');
        setHasAdmission(false);
      }, 3000);
    } catch (err) {
      console.error('Error booking tour:', err);
      setError('Failed to book tour. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-600 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5" /> Book a Campus Tour
              </h3>
              <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-8">
              {isSuccess ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Booking Successful!</h4>
                  <p className="text-gray-600">
                    Your tour request has been sent. We'll contact you soon to confirm.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 mb-6">
                    <p className="text-sm text-indigo-900 leading-relaxed">
                      Campus tours are available for students who have received admission. 
                      Please select a school day (Monday - Friday).
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Clock className="h-4 w-4" /> Select Date
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        setError('');
                      }}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <input
                      type="checkbox"
                      id="admission-check"
                      checked={hasAdmission}
                      onChange={(e) => setHasAdmission(e.target.checked)}
                      className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="admission-check" className="text-sm text-gray-700 cursor-pointer">
                      I confirm that I have received admission to this school and wish to see the environment.
                    </label>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || !date || !hasAdmission}
                    className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" /> Processing...
                      </>
                    ) : (
                      <>
                        <Calendar className="h-5 w-5" /> Confirm Booking
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
