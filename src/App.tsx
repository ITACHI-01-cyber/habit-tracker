/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import Hero from './components/Hero';
import About from './components/About';
import Resume from './components/Resume';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import AdminPanel from './components/AdminPanel';
import { NAV_ITEMS } from './data';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (showAdmin) return;
      const sections = NAV_ITEMS.map(item => item.id);
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAdmin]);

  if (showAdmin) {
    return <AdminPanel onBack={() => setShowAdmin(false)} />;
  }

  return (
    <div className="relative min-h-screen bg-white selection:bg-primary selection:text-black">
      <main className="w-full">
        <Hero />
        <div className="md:px-12 lg:px-24">
          <About />
          <Resume />
          <Portfolio />
          <Contact />
        </div>
      </main>

      {/* Admin Toggle (Subtle) */}
      <button 
        onClick={() => setShowAdmin(true)}
        className="fixed top-4 right-4 text-gray-200 hover:text-gray-400 transition-colors z-50 text-[10px]"
      >
        Admin
      </button>

      {/* Floating Download Resume Button */}
      <a
        href="/resume.pdf"
        download="Vivek_Bhardwaj_Resume.pdf"
        className={`fixed top-1/2 right-4 md:right-0 -translate-y-1/2 z-50 bg-primary text-black p-3 md:px-4 md:py-3 rounded-full md:rounded-r-none md:rounded-l-xl shadow-xl flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-300 border border-black/10 md:border-r-0 ${
          activeSection === 'resume' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
        }`}
        title="Download Resume"
      >
        <Download size={20} />
        <span className="hidden md:block text-[10px] font-bold uppercase tracking-widest">Resume</span>
      </a>

      {/* Floating Navigation (Responsive) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md px-6 py-3 rounded-full flex gap-6 z-50 border border-white/10 shadow-2xl">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeSection === item.id ? 'bg-primary scale-150' : 'bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
