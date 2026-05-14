import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { USER_DATA } from '../data';
import { Mail, Github, Linkedin, CheckCircle2, AlertCircle } from 'lucide-react';

// Custom minimalist Reddit icon matching the Lucide line-art style
const RedditIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 8c-2.5 0-4.5 1.5-4.5 3.5S9.5 15 12 15s4.5-1.5 4.5-3.5S14.5 8 12 8z"/>
    <path d="M12 8V4l3 1"/>
    <circle cx="16" cy="4" r="1"/>
    <circle cx="9" cy="10" r="1" fill="currentColor"/>
    <circle cx="15" cy="10" r="1" fill="currentColor"/>
    <path d="M10 12.5c.5.5 1.5.5 2 .5s1.5 0 2-.5"/>
    <path d="M7.5 11.5c-1 0-1.5-.5-1.5-1.5s.5-1.5 1.5-1.5"/>
    <path d="M16.5 11.5c1 0 1.5-.5 1.5-1.5s-.5-1.5-1.5-1.5"/>
  </svg>
);

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus('success');
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="py-20 px-8 md:pl-32 bg-gray-50 overflow-hidden">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-16"
        >
          <div className="w-12 h-[2px] bg-black" />
          <h2 className="text-5xl md:text-7xl font-display">CONTACT</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-3xl font-heading mb-6">FEEL FREE TO CONTACT ME!</h3>
            <p className="text-black/60 mb-12 max-w-md">
              I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
            </p>

            <div className="space-y-8">
              <motion.div 
                whileHover={{ x: 10 }}
                className="flex items-center gap-6 group"
              >
                <div className="w-14 h-14 bg-primary flex items-center justify-center rounded-full shadow-lg group-hover:rotate-12 transition-transform">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-1">Email Me</p>
                  <a href={`mailto:${USER_DATA.email}`} className="text-xl font-bold hover:text-primary transition-colors">
                    {USER_DATA.email}
                  </a>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ x: 10 }}
                className="flex items-center gap-6 group"
              >
                <div className="w-14 h-14 bg-primary flex items-center justify-center rounded-full shadow-lg group-hover:rotate-12 transition-transform">
                  <Github size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-1">GitHub Profile</p>
                  <a href={USER_DATA.github} target="_blank" rel="noopener noreferrer" className="text-xl font-bold hover:text-primary transition-colors">
                    github.com/ITACHI-01-cyber
                  </a>
                </div>
              </motion.div>
            </div>

            <div className="mt-16">
              <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-6">Follow Me</p>
              <div className="flex gap-4">
                {[
                  { Icon: Linkedin, href: USER_DATA.linkedin },
                  { Icon: RedditIcon, href: USER_DATA.reddit },
                  { Icon: Github, href: USER_DATA.github },
                ].map(({ Icon, href }, i) => (
                  <motion.a 
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -5, backgroundColor: '#FFC107', borderColor: '#FFC107' }}
                    className="w-12 h-12 border border-black/10 flex items-center justify-center rounded-full transition-all duration-300"
                  >
                    <Icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-8 md:p-12 border border-black/5 shadow-xl relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 bg-white flex flex-col items-center justify-center p-8 text-center z-20"
                >
                  <CheckCircle2 size={64} className="text-green-500 mb-4" />
                  <h4 className="text-2xl font-display mb-2">MESSAGE SENT!</h4>
                  <p className="text-black/60">Thank you for reaching out. I'll get back to you as soon as possible.</p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="mt-8 text-xs font-bold uppercase tracking-widest border-b-2 border-primary hover:text-primary transition-colors"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : status === 'error' ? (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 bg-white flex flex-col items-center justify-center p-8 text-center z-20"
                >
                  <AlertCircle size={64} className="text-red-500 mb-4" />
                  <h4 className="text-2xl font-display mb-2">OOPS!</h4>
                  <p className="text-black/60">Something went wrong. Please check your database connection and try again.</p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="mt-8 text-xs font-bold uppercase tracking-widest border-b-2 border-red-500 hover:text-red-500 transition-colors"
                  >
                    Try again
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">Your Name</label>
                  <input 
                    name="name"
                    type="text" 
                    required
                    placeholder="John Doe"
                    className="w-full bg-gray-50 border-b-2 border-transparent focus:border-primary p-4 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">Your Email</label>
                  <input 
                    name="email"
                    type="email" 
                    required
                    placeholder="john@example.com"
                    className="w-full bg-gray-50 border-b-2 border-transparent focus:border-primary p-4 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">Subject</label>
                <input 
                  name="subject"
                  type="text" 
                  required
                  placeholder="Project Inquiry"
                  className="w-full bg-gray-50 border-b-2 border-transparent focus:border-primary p-4 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">Message</label>
                <textarea 
                  name="message"
                  rows={4}
                  required
                  placeholder="Tell me about your project..."
                  className="w-full bg-gray-50 border-b-2 border-transparent focus:border-primary p-4 outline-none transition-all resize-none"
                />
              </div>
              <motion.button 
                type="submit"
                disabled={status === 'loading'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full bg-black text-white py-5 font-heading font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-lg flex items-center justify-center gap-3 ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary hover:text-black'}`}
              >
                {status === 'loading' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    SENDING...
                  </>
                ) : 'SEND MESSAGE'}
              </motion.button>
            </form>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 pt-12 border-t border-black/5 text-center"
        >
          <p className="text-[10px] font-bold text-black/40 uppercase tracking-[0.3em]">
            THANKS FOR PATIENCE! © 2026 {USER_DATA.name.toUpperCase()}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
