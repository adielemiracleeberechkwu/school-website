/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Activities from './components/Activities';
import EnquiryForm from './components/EnquiryForm';
import Footer from './components/Footer';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const savedEmail = localStorage.getItem('user_email');
      if (savedEmail) {
        try {
          const userDoc = await getDoc(doc(db, 'users', savedEmail));
          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          } else {
            localStorage.removeItem('user_email');
          }
        } catch (error) {
          console.error("Session check failed:", error);
        }
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const handleLogin = (userProfile: UserProfile) => {
    setProfile(userProfile);
    localStorage.setItem('user_email', userProfile.email);
  };

  const handleLogout = () => {
    setProfile(null);
    localStorage.removeItem('user_email');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar profile={profile} onLogout={handleLogout} />
      <main>
        {!profile ? (
          <Auth onLogin={handleLogin} />
        ) : (
          <>
            {profile.role === 'admin' && <AdminDashboard />}
            <Hero />
            <Activities />
            <EnquiryForm profile={profile} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
