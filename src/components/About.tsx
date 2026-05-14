import { motion } from 'motion/react';
import { USER_DATA } from '../data';

export default function About() {
  return (
    <section id="about" className="py-20 px-8 md:pl-32 bg-gray-50 overflow-hidden">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-12"
        >
          <div className="w-12 h-[2px] bg-black" />
          <h2 className="text-5xl md:text-7xl font-display">ABOUT ME</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl font-heading mb-4">
                I'm <span className="text-primary">{USER_DATA.name}</span>, {USER_DATA.role}
              </h3>
              <p className="text-black/70 leading-relaxed mb-12 text-lg">
                {USER_DATA.about}
              </p>
            </motion.div>

            <div className="mb-12">
              <motion.h4 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-xl font-heading mb-6 flex items-center gap-2"
              >
                <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm">?</span>
                What I Do?
              </motion.h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {USER_DATA.skills.map((skill, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * i }}
                    whileHover={{ y: -5, borderColor: '#FFC107' }}
                    className="bg-white p-6 border border-black/5 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-4 rounded-lg">
                      <skill.icon className="text-primary" size={24} />
                    </div>
                    <h5 className="font-bold mb-2 text-sm uppercase tracking-wider">{skill.name}</h5>
                    <p className="text-xs text-black/60 leading-relaxed">{skill.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-8 border border-black/5 shadow-sm h-fit"
          >
            <h4 className="text-xl font-heading mb-8 flex items-center gap-2">
              <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm">!</span>
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {USER_DATA.techStack.map((tech, i) => (
                <motion.div 
                  key={i} 
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + (i * 0.05) }}
                  className="bg-gray-100 text-black px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md border border-black/5 hover:bg-primary hover:border-primary transition-colors cursor-default"
                >
                  {tech}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
