import { motion } from 'motion/react';
import { USER_DATA, NAV_ITEMS } from '../data';
import { Mail } from 'lucide-react';

export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-white overflow-hidden relative">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="z-10 text-center lg:text-left order-2 lg:order-1"
        >
          <span className="text-primary font-display text-4xl md:text-6xl block mb-2">HI THERE!</span>
          <h1 className="text-6xl md:text-8xl font-display leading-none mb-6">
            I'M <span className="text-primary outline-text">{USER_DATA.name.split(' ')[0]}</span>
            <br />
            {USER_DATA.name.split(' ')[1]}
          </h1>
          <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8">
            {USER_DATA.role.split(' / ').map((tag, i) => (
              <span key={i} className="bg-primary text-black px-4 py-1 font-heading text-sm font-bold uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>
          <p className="text-black/60 max-w-md mx-auto lg:mx-0 mb-8 font-medium leading-relaxed">
            {USER_DATA.about}
          </p>
          <button 
            onClick={() => scrollToSection('about')}
            className="bg-black text-white px-8 py-4 font-heading font-bold uppercase tracking-widest hover:bg-primary hover:text-black transition-all duration-300"
          >
            MORE ABOUT ME
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, type: 'spring' }}
          className="relative flex justify-center order-1 lg:order-2"
        >
          <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px]">
            {/* Circular Arc Decoration - More precise arc */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#FFC107"
                strokeWidth="0.3"
                strokeDasharray="60 100"
                strokeLinecap="round"
                className="opacity-40"
              />
              {/* Decorative dots at ends of arc */}
              <circle cx="50" cy="5" r="1" fill="#FFC107" />
              <circle cx="50" cy="95" r="1" fill="#FFC107" />
            </svg>
            
            {/* Main Image Container - Styled like the white circle in reference */}
            <div className="absolute inset-[12%] rounded-full bg-white shadow-[0_0_50px_rgba(0,0,0,0.1)] z-10 flex items-center justify-center overflow-hidden">
              <img 
                src={USER_DATA.profileImage} 
                alt={USER_DATA.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onLoad={(e) => {
                  (e.target as HTMLImageElement).style.opacity = "1";
                }}
                onError={(e) => {
                  console.error("Image failed to load:", USER_DATA.profileImage);
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800";
                }}
              />
            </div>

            {/* Circular Navigation Icons - Precisely placed on the right side */}
            <div className="absolute inset-0 z-20">
              {NAV_ITEMS.map((item, index) => {
                // Spread icons along the right side arc
                const startAngle = -65;
                const endAngle = 65;
                const angle = startAngle + (index * (endAngle - startAngle) / (NAV_ITEMS.length - 1));
                const radius = 45; // Percentage radius matching the SVG circle
                const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
                const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

                return (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.15 }}
                    className="absolute w-10 h-10 md:w-14 md:h-14 bg-black rounded-full flex items-center justify-center border-2 border-primary shadow-[0_4px_15px_rgba(0,0,0,0.3)] group"
                    style={{ 
                      left: `${x}%`, 
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <item.icon className="text-primary group-hover:text-white transition-colors" size={20} />
                    <div className="absolute left-full ml-4 px-3 py-1 bg-black text-primary text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 whitespace-nowrap pointer-events-none shadow-lg">
                      {item.label}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Background Decorative Element */}
      <div className="absolute right-0 top-0 w-1/4 h-full bg-primary/5 -z-10 hidden lg:block" />
    </section>
  );
}
