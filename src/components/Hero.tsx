import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Users, Trophy } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest text-indigo-600 uppercase bg-indigo-50 rounded-full">
              Excellence in Education
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
              Shaping the Leaders of <span className="text-indigo-600">Tomorrow</span>
            </h1>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Welcome to St. Andrews International School. We provide a nurturing environment 
              where students are encouraged to excel academically, socially, and creatively.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#activities"
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                Explore Activities <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="#enquiry"
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-full font-semibold hover:bg-gray-50 transition-all"
              >
                Make an Enquiry
              </a>
            </div>
          </motion.div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: BookOpen, title: 'Academic Rigor', desc: 'World-class IB and IGCSE curriculum.' },
            { icon: Users, title: 'Global Community', desc: 'Students from over 40 different nations.' },
            { icon: Trophy, title: 'Holistic Growth', desc: 'Focus on sports, arts, and leadership.' },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
              className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <feature.icon className="h-10 w-10 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
    </section>
  );
}
