import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Enquiry, TourBooking } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Clock, Trash2, Filter, Search, MessageSquare, Calendar, User, Hash, XCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminDashboard() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [tourBookings, setTourBookings] = useState<TourBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'enquiries' | 'tours'>('enquiries');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const qEnquiries = query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'));
    const unsubEnquiries = onSnapshot(qEnquiries, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Enquiry[];
      setEnquiries(data);
    });

    const qTours = query(collection(db, 'tour_bookings'), orderBy('createdAt', 'desc'));
    const unsubTours = onSnapshot(qTours, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TourBooking[];
      setTourBookings(data);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error: ", error);
      setLoading(false);
    });

    return () => {
      unsubEnquiries();
      unsubTours();
    };
  }, []);

  const toggleEnquiryStatus = async (id: string, currentStatus: 'pending' | 'completed') => {
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

  const deleteItem = async (collectionName: string, id: string) => {
    if (window.confirm(`Are you sure you want to delete this ${collectionName.slice(0, -1)}?`)) {
      try {
        await deleteDoc(doc(db, collectionName, id));
      } catch (error) {
        console.error(`Error deleting ${collectionName}:`, error);
      }
    }
  };

  const filteredEnquiries = enquiries.filter(e => {
    const matchesFilter = filter === 'all' || e.status === filter;
    const matchesSearch = e.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         e.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         e.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredTours = tourBookings.filter(t => {
    const matchesFilter = filter === 'all' || t.status === filter;
    const matchesSearch = t.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.regNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Task Bar</h1>
          <p className="text-gray-600">Manage user enquiries and campus tours</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
            />
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => { setActiveTab('enquiries'); setFilter('all'); }}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                activeTab === 'enquiries' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              Enquiries
            </button>
            <button
              onClick={() => { setActiveTab('tours'); setFilter('all'); }}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                activeTab === 'tours' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              Tours
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
        {(['all', 'pending', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full border transition-all whitespace-nowrap",
              filter === f ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-gray-200 text-gray-500 hover:border-indigo-300"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {activeTab === 'enquiries' ? (
            filteredEnquiries.length > 0 ? (
              filteredEnquiries.map((enquiry) => (
                <motion.div
                  key={enquiry.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={cn(
                    "bg-white p-6 rounded-xl border transition-all shadow-sm",
                    enquiry.status === 'completed' ? "border-green-100 bg-green-50/10" : "border-gray-100"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          enquiry.status === 'completed' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        )}>
                          {enquiry.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          {enquiry.createdAt instanceof Timestamp ? enquiry.createdAt.toDate().toLocaleString() : 'Just now'}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-indigo-500" />
                        {enquiry.userName || enquiry.userEmail || 'Anonymous User'}
                        {enquiry.regNumber && (
                          <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {enquiry.regNumber}
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{enquiry.message}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleEnquiryStatus(enquiry.id, enquiry.status)}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          enquiry.status === 'completed' 
                            ? "bg-green-100 text-green-600 hover:bg-green-200" 
                            : "bg-gray-100 text-gray-400 hover:bg-indigo-100 hover:text-indigo-600"
                        )}
                        title={enquiry.status === 'completed' ? "Mark as Pending" : "Mark as Completed"}
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteItem('enquiries', enquiry.id)}
                        className="p-2 rounded-lg bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                        title="Delete Enquiry"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No enquiries found</h3>
                <p className="text-gray-500">When users submit enquiries, they will appear here.</p>
              </div>
            )
          ) : (
            filteredTours.length > 0 ? (
              filteredTours.map((tour) => (
                <motion.div
                  key={tour.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={cn(
                    "bg-white p-6 rounded-xl border transition-all shadow-sm",
                    tour.status === 'completed' ? "border-green-100 bg-green-50/10" : "border-gray-100"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          tour.status === 'completed' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        )}>
                          {tour.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          Booked on: {tour.createdAt instanceof Timestamp ? tour.createdAt.toDate().toLocaleDateString() : 'Just now'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Student Details</h4>
                          <div className="flex items-center gap-2 text-gray-900 font-semibold">
                            <User className="h-4 w-4 text-indigo-500" /> {tour.userName}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Hash className="h-4 w-4 text-gray-400" /> {tour.regNumber}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tour Schedule</h4>
                          <div className="flex items-center gap-2 text-indigo-600 font-bold">
                            <Calendar className="h-4 w-4" /> {new Date(tour.tourDate).toLocaleDateString(undefined, { dateStyle: 'full' })}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4 text-gray-400" /> {tour.tourDay} (School Day)
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleTourStatus(tour.id, tour.status)}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            tour.status === 'completed' 
                              ? "bg-green-100 text-green-600 hover:bg-green-200" 
                              : "bg-gray-100 text-gray-400 hover:bg-indigo-100 hover:text-indigo-600"
                          )}
                          title={tour.status === 'completed' ? "Mark as Pending" : "Mark as Completed"}
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                      </div>
                      <button
                        onClick={() => deleteItem('tour_bookings', tour.id)}
                        className="p-2 rounded-lg bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors flex items-center justify-center"
                        title="Delete Record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No tour bookings found</h3>
                <p className="text-gray-500">When students book tours, they will appear here.</p>
              </div>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
