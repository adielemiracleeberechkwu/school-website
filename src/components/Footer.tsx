import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-indigo-400" />
              <span className="text-xl font-bold tracking-tight">St. Andrews</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering students to achieve excellence through innovation, 
              creativity, and global citizenship since 1985.
            </p>
            <div className="flex items-center gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                <a key={idx} href="#" className="p-2 bg-gray-800 rounded-full hover:bg-indigo-600 transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#activities" className="hover:text-white transition-colors">School Activities</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Admissions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Curriculum</a></li>
              <li><a href="#" className="hover:text-white transition-colors">News & Events</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Resources</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Student Portal</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Parent Portal</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Digital Library</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-indigo-400 shrink-0" />
                <span>123 Education Lane, Academic City, State 54321</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-indigo-400 shrink-0" />
                <span>+1 (555) 012-3456</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-indigo-400 shrink-0" />
                <span>info@standrews.edu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-xs">
          <p>© {new Date().getFullYear()} St. Andrews International School. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
