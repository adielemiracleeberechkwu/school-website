import { motion } from 'motion/react';
import { Calendar, Tag } from 'lucide-react';
import { ACTIVITIES } from '../constants';

export default function Activities() {
  return (
    <section id="activities" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">School Activities</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover a vibrant world of opportunities beyond the classroom. 
            From competitive sports to creative arts, there's something for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ACTIVITIES.map((activity, idx) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm group hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold text-indigo-600 rounded-full uppercase tracking-wider">
                    {activity.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(activity.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {activity.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {activity.description}
                </p>
                <div className="mt-6 pt-6 border-t border-gray-50">
                  <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                    Learn More <Tag className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
