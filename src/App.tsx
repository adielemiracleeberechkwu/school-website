/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Activities from './components/Activities';
import EnquiryForm from './components/EnquiryForm';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      <main>
        <Hero />
        <Activities />
        <EnquiryForm />
      </main>
      <Footer />
    </div>
  );
}
