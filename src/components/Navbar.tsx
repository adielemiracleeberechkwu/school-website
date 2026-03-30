import React from 'react';
import { GraduationCap, Menu, X, LogOut, User as UserIcon, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { User } from 'firebase/auth';
import { UserProfile } from '../types';
import { auth } from '../firebase';

interface NavbarProps {
  profile: UserProfile | null;
  onLogout: () => void;
}

export default function Navbar({ profile, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Activities', href: '#activities' },
    { name: 'Enquiry', href: '#enquiry' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900 tracking-tight">St. Andrews</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {profile && profile.role !== 'admin' && navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                {link.name}
              </a>
            ))}
            
            {profile ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                    {profile.role === 'admin' ? (
                      <ShieldCheck className="h-4 w-4 text-indigo-600" />
                    ) : (
                      <UserIcon className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-xs font-medium text-gray-600">{profile.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 mr-2">{profile.regNumber}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="text-sm font-medium text-gray-400 italic">
                Please sign in to continue
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={cn(
          "md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-100 transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "max-h-64" : "max-h-0"
        )}
      >
        <div className="px-4 pt-2 pb-6 space-y-1">
          {profile && profile.role !== 'admin' && navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
            >
              {link.name}
            </a>
          ))}
          {profile && (
            <button 
              onClick={onLogout}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-red-100"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
