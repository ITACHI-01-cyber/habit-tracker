import { motion } from 'motion/react';
import { USER_DATA } from '../data';

export default function Resume() {
  return (
    <section id="resume" className="py-20 px-8 md:pl-32 bg-white overflow-hidden">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-16"
        >
          <div className="w-12 h-[2px] bg-black" />
          <h2 className="text-5xl md:text-7xl font-display">RESUME</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-heading mb-10 flex items-center gap-4">
              <span className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-sm">01</span>
              EDUCATION
            </h3>
            <div className="space-y-8 relative before:absolute before:left-[19px] before:top-0 before:bottom-0 before:w-[2px] before:bg-black/5">
              {USER_DATA.resume.education.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="pl-12 relative"
                >
                  <div className="absolute left-0 top-0 w-10 h-10 bg-white border-2 border-primary rounded-full flex items-center justify-center z-10">
                    <div className="w-2 h-2 bg-black rounded-full" />
                  </div>
                  <span className="inline-block bg-primary text-black px-3 py-1 text-[10px] font-bold mb-3">
                    {item.period}
                  </span>
                  <h4 className="text-xl font-bold mb-1 uppercase tracking-tight">{item.title}</h4>
                  <p className="text-primary font-bold text-xs mb-3 uppercase tracking-widest">{item.institution}</p>
                  <p className="text-sm text-black/60 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Journey Roadmap */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-heading mb-10 flex items-center gap-4">
              <span className="w-10 h-10 bg-black text-primary rounded-full flex items-center justify-center text-sm font-bold shadow-[0_0_15px_rgba(255,193,7,0.5)]">02</span>
              DEV JOURNEY
            </h3>
            <div className="space-y-12 relative before:absolute before:left-[19px] before:top-0 before:bottom-0 before:w-[2px] before:bg-gradient-to-b before:from-primary before:via-black before:to-primary before:opacity-30">
              {USER_DATA.resume.experience.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="pl-16 relative group"
                >
                  <div className="absolute left-0 top-0 w-10 h-10 bg-black border-2 border-primary rounded-full flex items-center justify-center z-10 shadow-[0_0_20px_rgba(255,193,7,0.6)] group-hover:scale-110 transition-transform">
                    <div className="w-3 h-3 bg-primary rounded-full" />
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-lg group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(255,193,7,0.15)] transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/20 transition-colors duration-500" />
                    <span className="inline-block bg-black text-primary px-3 py-1 text-[10px] font-bold mb-3 rounded-full uppercase tracking-wider shadow-md relative z-10">
                      {item.period}
                    </span>
                    <h4 className="text-xl font-bold mb-1 uppercase tracking-tight relative z-10">{item.title}</h4>
                    <p className="text-black/40 font-bold text-xs mb-3 uppercase tracking-widest relative z-10">{item.institution}</p>
                    <p className="text-sm text-black/60 leading-relaxed relative z-10">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
