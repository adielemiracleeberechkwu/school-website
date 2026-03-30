import { useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'motion/react';
import { Mail, User, Hash, LogIn } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthProps {
  onLogin: (profile: UserProfile) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use email as the document ID for simplicity in this custom auth flow
      const userDocRef = doc(db, 'users', email.toLowerCase());
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const profile = userDoc.data() as UserProfile;
        // Basic check if reg number matches for existing user
        if (profile.regNumber !== regNumber) {
          setError('Registration number does not match our records for this email.');
          setLoading(false);
          return;
        }
        onLogin(profile);
      } else {
        // Create new profile
        const newProfile: UserProfile = {
          email: email.toLowerCase(),
          name,
          regNumber,
          role: email.toLowerCase() === 'adielemiracleebere@gmail.com' ? 'admin' : 'user'
        };
        await setDoc(userDocRef, newProfile);
        onLogin(newProfile);
      }
    } catch (err: any) {
      setError('An error occurred. Please check your connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign In to Continue
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your details to access the portal
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hash className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Registration Number"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-md">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn className="h-5 w-5" />
              </span>
              {loading ? 'Signing in...' : 'Sign In / Sign Up'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
