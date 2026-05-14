import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { USER_DATA } from '../data';

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [projects, setProjects] = useState(USER_DATA.projects || []);
  const [categories, setCategories] = useState(['ALL']);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setProjects(data);
            // Dynamically create categories from project data
            const projectCategories = Array.from(new Set(data.map((p: any) => p.category.toUpperCase())));
            setCategories(['ALL', ...projectCategories]);
          }
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = activeCategory === 'ALL' 
    ? projects 
    : projects.filter(p => p.category.toUpperCase() === activeCategory);

  return (
    <section id="portfolio" className="py-20 px-8 md:pl-32 bg-gray-50 overflow-hidden">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[2px] bg-black" />
            <h2 className="text-5xl md:text-7xl font-display">PROJECTS</h2>
          </div>
          <p className="text-black/60 max-w-2xl md:pl-16 leading-relaxed">
            Here are a few of my recent projects. I enjoy building web applications that solve real problems, ranging from interactive interfaces to robust full-stack platforms. Each project reflects my focus on clean code and great user experiences.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-4 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 font-heading text-sm font-bold tracking-widest transition-all duration-300 ${
                activeCategory === cat 
                  ? 'bg-primary text-black' 
                  : 'bg-white text-black/40 hover:text-black border border-black/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group relative aspect-video overflow-hidden bg-black"
              >
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-all duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  <span className="bg-primary text-black px-3 py-1 text-[10px] font-bold mb-4 uppercase tracking-widest">
                    {project.category}
                  </span>
                  <h4 className="text-white text-3xl font-display text-center mb-2">{project.title}</h4>
                  {project.description && (
                    <p className="text-white/80 text-center text-sm mb-6 max-w-[80%] line-clamp-3">{project.description}</p>
                  )}
                  {project.link ? (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform"
                    >
                      +
                    </a>
                  ) : (
                    <button className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform">
                      +
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
